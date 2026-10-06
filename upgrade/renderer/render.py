#!/usr/bin/env python3
"""Deterministic, offline films for /upgrade. Python -> OpenGL frames -> ffmpeg.

Requirements: numpy, scipy, Pillow, moderngl, ffmpeg. EGL works without a display.
python render.py --stills                 # contact sheets, no video encoding
python render.py --film constructive      # 1920 x 1080, 24 fps, H.264 + AAC
python render.py --all                    # the ten films, posters and manifest
"""
from __future__ import annotations
import argparse, json, math, subprocess, time, wave
from pathlib import Path
import numpy as np
import moderngl
from PIL import Image, ImageDraw, ImageFont
from scipy.spatial import Delaunay, Voronoi

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'films'
TAU = 2 * math.pi
FPS, DURATION = 24, 16
TITLES = dict(focus='Focus your energy.', time='Guard your time.',
    mind='Train your mind.', body='Train your body.', think='Think for yourself.',
    friends='Curate your friends.', environment='Curate your environment.',
    promises='Keep your promises.', constructive='Stay cheerful and constructive.',
    upgrade='Upgrade the world.')
IVORY = (.73,.75,.69)
GOLD = (.85,.43,.14)
BLACK = (.026,.034,.039)
TEAL = (.08,.16,.17)

def smooth(t, a=0, b=1):
    q=np.clip((t-a)/(b-a),0,1); return q*q*(3-2*q)
def unit(v):
    v=np.asarray(v,dtype='f4'); return v/(np.linalg.norm(v,axis=-1,keepdims=True)+1e-12)
def transform(pos=(0,0,0), scale=(1,1,1), rot=(0,0,0)):
    x,y,z=rot;cx,sx,cy,sy,cz,sz=np.cos(x),np.sin(x),np.cos(y),np.sin(y),np.cos(z),np.sin(z)
    rx=np.array([[1,0,0],[0,cx,-sx],[0,sx,cx]])
    ry=np.array([[cy,0,sy],[0,1,0],[-sy,0,cy]])
    rz=np.array([[cz,-sz,0],[sz,cz,0],[0,0,1]])
    m=np.eye(4,dtype='f4');m[:3,:3]=(rz@ry@rx)@np.diag(scale);m[:3,3]=pos
    return m
def perspective(aspect,fov=38,near=.05,far=100):
    f=1/math.tan(math.radians(fov)/2);m=np.zeros((4,4),'f4')
    m[0,0]=f/aspect;m[1,1]=f;m[2,2]=(far+near)/(near-far);m[2,3]=2*far*near/(near-far);m[3,2]=-1
    return m
def look_at(eye,target):
    f=unit(np.array(target)-eye);s=unit(np.cross(f,[0,1,0]));u=np.cross(s,f)
    m=np.eye(4,dtype='f4');m[0,:3]=s;m[1,:3]=u;m[2,:3]=-f;m[:3,3]=-m[:3,:3]@eye
    return m
def triangles(positions, normals=None):
    p=np.asarray(positions,'f4').reshape(-1,3,3)
    if normals is None:
        n=unit(np.cross(p[:,1]-p[:,0],p[:,2]-p[:,0]));n=np.repeat(n[:,None],3,axis=1)
    else:n=np.asarray(normals,'f4').reshape(-1,3,3)
    return np.concatenate([p,n],axis=2).reshape(-1,6).astype('f4')
def sphere_geometry(n=48,m=24):
    a=np.linspace(0,TAU,n+1);b=np.linspace(0,np.pi,m+1)
    x,y=np.meshgrid(a,b);p=np.stack([np.sin(y)*np.cos(x),np.cos(y),np.sin(y)*np.sin(x)],-1)
    q=np.stack([p[:-1,:-1],p[1:,:-1],p[1:,1:],p[:-1,:-1],p[1:,1:],p[:-1,1:]],2).reshape(-1,3)
    return triangles(q,q)
def torus_geometry(r=1,tube=.06,n=160,m=12):
    a,b=np.meshgrid(np.linspace(0,TAU,n+1),np.linspace(0,TAU,m+1),indexing='ij')
    N=np.stack([np.cos(a)*np.cos(b),np.sin(b),np.sin(a)*np.cos(b)],-1)
    p=np.stack([(r+tube*np.cos(b))*np.cos(a),tube*np.sin(b),(r+tube*np.cos(b))*np.sin(a)],-1)
    q=lambda p:np.stack([p[:-1,:-1],p[1:,:-1],p[1:,1:],p[:-1,:-1],p[1:,1:],p[:-1,1:]],2).reshape(-1,3)
    return triangles(q(p),q(N))
def box_geometry():
    p=[]
    for ax in range(3):
        for s in [-1,1]:
            rest=[i for i in range(3) if i!=ax];v=np.zeros((4,3));v[:,ax]=s/2
            v[:,rest]=np.array([[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]])
            if s<0:v=v[::-1]
            p.extend(v[[0,1,2,0,2,3]])
    return triangles(p)
def disc_geometry(r=1,h=.08,n=100):
    p=[]
    for i in range(n):
        a=i/n*TAU;b=(i+1)/n*TAU;u=np.array([r*np.cos(a),h/2,r*np.sin(a)]);v=np.array([r*np.cos(b),h/2,r*np.sin(b)])
        p.extend([[0,h/2,0],v,u]);lo=u-[0,h,0];lv=v-[0,h,0]
        p.extend([u,v,lv,u,lv,lo])
    return triangles(p)
def prism(poly,thickness=.18,bevel=.035):
    poly=np.array(poly);center=poly.mean(0);top=center+(poly-center)*(1-bevel)
    p=[];N=len(poly)
    for i in range(1,N-1):p.extend([[top[0,0],thickness/2,top[0,1]],[top[i,0],thickness/2,top[i,1]],[top[i+1,0],thickness/2,top[i+1,1]]])
    for i in range(N):
        j=(i+1)%N;a=[top[i,0],thickness/2,top[i,1]];b=[top[j,0],thickness/2,top[j,1]]
        c=[poly[j,0],thickness*.25,poly[j,1]];d=[poly[i,0],thickness*.25,poly[i,1]]
        e=[poly[j,0],-thickness/2,poly[j,1]];f=[poly[i,0],-thickness/2,poly[i,1]]
        p.extend([a,b,c,a,c,d,d,c,e,d,e,f])
    return triangles(p)
def curve_geometry(points,r=.03,n=8):
    p=np.asarray(points,'f4');tangent=unit(np.gradient(p,axis=0));N=unit(np.cross(tangent,[0,0,1]));B=np.cross(tangent,N)
    a=np.linspace(0,TAU,n+1);norm=N[:,None,:]*np.cos(a)[None,:,None]+B[:,None,:]*np.sin(a)[None,:,None]
    q=p[:,None,:]+norm*r
    pack=lambda p:np.stack([p[:-1,:-1],p[1:,:-1],p[1:,1:],p[:-1,:-1],p[1:,1:],p[:-1,1:]],2).reshape(-1,3)
    return triangles(pack(q),pack(norm))
def dish_geometry(radius=2.1):
    a,u=np.meshgrid(np.linspace(0,TAU,150),np.linspace(0,radius,24),indexing='ij')
    x=u*np.cos(a);z=u*np.sin(a);p=np.stack([x,.045*u*u,z],-1);N=unit(np.stack([-.09*x,np.ones_like(x),-.09*z],-1))
    pack=lambda p:np.stack([p[:-1,:-1],p[1:,:-1],p[1:,1:],p[:-1,:-1],p[1:,1:],p[:-1,1:]],2).reshape(-1,3)
    return triangles(pack(p),pack(N))

MESH_VERTEX='''#version 330
in vec3 in_pos; in vec3 in_normal;
uniform mat4 model; uniform mat4 vp;
out vec3 pos; out vec3 normal;
void main(){vec4 p=model*vec4(in_pos,1);pos=p.xyz;normal=transpose(inverse(mat3(model)))*in_normal;gl_Position=vp*p;}
'''
MESH_FRAGMENT='''#version 330
in vec3 pos; in vec3 normal; out vec4 out_color;
uniform vec3 base; uniform vec3 eye; uniform float metal; uniform float rough; uniform float emission; uniform int floor_mode;
uniform sampler2D shadow_map;uniform mat4 light_vp;
float hash(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,34.345)))*43758.5453);}
float shadow(vec3 p,vec3 N){vec4 q=light_vp*vec4(p+N*.012,1);vec3 s=q.xyz/q.w*.5+.5;
 if(floor_mode==2 && (s.x<0.002||s.x>.998||s.y<0.002||s.y>.998||s.z<0.||s.z>1.))return 1.;float result=0.;
 for(int x=-2;x<=2;x++)for(int y=-2;y<=2;y++){float d=texture(shadow_map,s.xy+vec2(x,y)*3.5/1536.).r;result+=s.z-.002>d?0.:1.;}return result/25.;}
void main(){
 vec3 N=normalize(normal); if(!gl_FrontFacing)N=-N;
 vec3 V=normalize(eye-pos),L=normalize(vec3(-2,5,4)),L2=normalize(vec3(3,2,-4));
 float visibility=shadow(pos,N);float nl=max(dot(N,L),0)*visibility,nl2=max(dot(N,L2),0),power=mix(130.,12.,rough);
 float spec=pow(max(dot(N,normalize(L+V)),0),power)*mix(1.3,.3,rough);
 float spec2=pow(max(dot(N,normalize(L2+V)),0),power)*.65;
 vec3 R=reflect(-V,N);
 float strip=pow(max(dot(R,normalize(vec3(-.4,.75,.5))),0),18.);
 float strip2=pow(max(dot(R,normalize(vec3(.65,.35,-.65))),0),36.);
 vec3 env=vec3(.04,.085,.11)+vec3(.75,.87,.90)*strip*2.3+vec3(.96,.53,.19)*strip2*2.2;
 float micro=hash(floor(pos*450.))-.5;
 vec3 diff=base*(.065+nl*.95+nl2*.14)*(1.+micro*.05);
 vec3 col=mix(diff,base*env,metal)+mix(vec3(1),base,metal)*(spec*2.6*visibility+spec2*1.2);
 col+=base*emission;
 if(floor_mode==1){col=base*(.08+.27*exp(-dot(pos.xz,pos.xz)*.016))*(.25+.75*visibility)+vec3(.022,.033,.038)*strip*visibility;}
 float fog=clamp((length(eye-pos)-13.)*.026,0.,.60);col=mix(col,vec3(.007,.013,.019),fog);
 out_color=vec4(col,1);
}
'''
SHADOW_VERTEX='''#version 330
in vec3 in_pos;uniform mat4 model;uniform mat4 light_vp;void main(){gl_Position=light_vp*model*vec4(in_pos,1);}
'''
SHADOW_FRAGMENT='''#version 330
void main(){}
'''
POINT_VERTEX='''#version 330
in vec3 in_pos; in float in_size; in vec3 in_color; in float in_glow;
uniform mat4 vp; uniform mat4 view; uniform float pixel_scale;
out vec3 col;out float glow;
void main(){vec4 p=view*vec4(in_pos,1);gl_Position=vp*vec4(in_pos,1);gl_PointSize=clamp(in_size*pixel_scale/max(.1,-p.z),1.,70.);col=in_color;glow=in_glow;}
'''
POINT_FRAGMENT='''#version 330
in vec3 col;in float glow;out vec4 out_color;
void main(){vec2 p=gl_PointCoord*2.-1.;float r=dot(p,p);if(r>1.)discard;
 vec3 N=vec3(p.x,-p.y,sqrt(1.-r));float light=.26+.74*max(dot(N,normalize(vec3(-.35,.65,.8))),0.);
 float spec=pow(max(dot(N,normalize(vec3(-.2,.32,1))),0.),22.);
 float alpha=smoothstep(1.,.64,r);out_color=vec4(col*(light+glow)+vec3(.8,.87,.92)*spec*.6,alpha);
}
'''
QUAD_VERTEX='''#version 330
in vec2 p;out vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0,1);}
'''
BLUR_FRAGMENT='''#version 330
in vec2 uv;out vec4 color;uniform sampler2D src;uniform vec2 step_size;uniform int bright;
vec3 tap(vec2 q){vec3 c=texture(src,q).rgb;return bright==1?max(c-.72,0.):c;}
void main(){vec3 c=tap(uv)*.227027;c+=(tap(uv+step_size*1.384615)+tap(uv-step_size*1.384615))*.316216;c+=(tap(uv+step_size*3.230769)+tap(uv-step_size*3.230769))*.07027;color=vec4(c,1);}
'''
POST_FRAGMENT='''#version 330
in vec2 uv;out vec4 color;uniform sampler2D scene;uniform sampler2D bloom;uniform sampler2D type;uniform sampler2D depth_map;
uniform float tick;uniform float opacity;uniform float focus_distance;uniform vec2 pixel;
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){float dep=texture(depth_map,uv).r;float z=5./(100.-dep*99.95);float coc=min(6.,abs(z-focus_distance)/max(z,.1)*14.);
 vec2 blur=pixel*coc;vec3 c=texture(scene,uv).rgb*.4;
 c+=(texture(scene,uv+blur*vec2(.8,.3)).rgb+texture(scene,uv+blur*vec2(-.6,.8)).rgb+texture(scene,uv+blur*vec2(-.8,-.4)).rgb+texture(scene,uv+blur*vec2(.4,-.8)).rgb)*.15;
 c+=texture(bloom,uv).rgb*.27;c=aces(c*1.23);c=pow(c,vec3(1./2.2));
 float vign=1.-.26*pow(length((uv-.5)*vec2(1,.8)),1.4);c*=vign;
 c+=(hash(uv*vec2(1920,1080)+floor(tick*12.))-.5)*.005;
 vec4 text=texture(type,uv);c=mix(c,text.rgb,text.a*opacity);color=vec4(max(c,0.),1.);}
'''

class Renderer:
    def __init__(self,w=1920,h=1080):
        self.w,self.h=w,h;self.ctx=moderngl.create_standalone_context(backend='egl')
        c=self.ctx;c.enable(moderngl.PROGRAM_POINT_SIZE)
        self.mesh_program=c.program(vertex_shader=MESH_VERTEX,fragment_shader=MESH_FRAGMENT)
        self.shadow_program=c.program(vertex_shader=SHADOW_VERTEX,fragment_shader=SHADOW_FRAGMENT)
        self.shadow_texture=c.depth_texture((1536,1536));self.shadow_texture.compare_func='';self.shadow_texture.repeat_x=False;self.shadow_texture.repeat_y=False
        self.shadow_frame=c.framebuffer(depth_attachment=self.shadow_texture)
        light_view=look_at(np.array([-4.,10.,7.]),np.array([0.,0.,0.]))
        orth=np.eye(4,dtype='f4');orth[0,0]=orth[1,1]=1/7.;orth[2,2]=-2/28.;orth[2,3]=-1
        self.light_vp=orth@light_view
        self.shadow_program['light_vp'].write(self.light_vp.T.tobytes());self.mesh_program['light_vp'].write(self.light_vp.T.tobytes())
        self.point_program=c.program(vertex_shader=POINT_VERTEX,fragment_shader=POINT_FRAGMENT)
        self.blur_program=c.program(vertex_shader=QUAD_VERTEX,fragment_shader=BLUR_FRAGMENT)
        self.post_program=c.program(vertex_shader=QUAD_VERTEX,fragment_shader=POST_FRAGMENT)
        self.q=c.buffer(np.array([[-1,-1],[1,-1],[-1,1],[1,1]],'f4').tobytes())
        self.blur_vao=c.vertex_array(self.blur_program,[(self.q,'2f','p')]);self.post_vao=c.vertex_array(self.post_program,[(self.q,'2f','p')])
        self.hdr=c.texture((w,h),4,dtype='f2');self.hdr.filter=(moderngl.LINEAR,moderngl.LINEAR)
        self.depth=c.depth_texture((w,h));self.depth.compare_func='';self.depth.repeat_x=False;self.depth.repeat_y=False
        self.frame=c.framebuffer([self.hdr],self.depth)
        self.bloom=[c.texture((w//4,h//4),4,dtype='f2') for _ in range(2)]
        for b in self.bloom:b.filter=(moderngl.LINEAR,moderngl.LINEAR)
        self.blur_frames=[c.framebuffer([b]) for b in self.bloom]
        self.output=c.texture((w,h),3);self.output_frame=c.framebuffer([self.output])
        self.type_texture=c.texture((w,h),4);self.type_texture.filter=(moderngl.LINEAR,moderngl.LINEAR)
        self.cache={};self.point_buffer=c.buffer(reserve=8*4*180000)
        self.points_vao=c.vertex_array(self.point_program,[(self.point_buffer,'3f 1f 3f 1f','in_pos','in_size','in_color','in_glow')])
        self.sphere=sphere_geometry();self.torus=torus_geometry();self.box=box_geometry();self.disc=disc_geometry()
        self.type_id=None
    def camera(self,eye,target=(0,0,0),fov=38):
        self.eye=np.asarray(eye,'f4');self.view=look_at(self.eye,np.asarray(target,'f4'));self.vp=perspective(self.w/self.h,fov)@self.view
        self.focus_distance=float(np.linalg.norm(self.eye-np.asarray(target)))
        for p in [self.mesh_program,self.point_program]:p['vp'].write(self.vp.T.tobytes())
        self.mesh_program['eye'].value=tuple(self.eye)
        self.point_program['view'].write(self.view.T.tobytes());self.point_program['pixel_scale'].value=self.h/math.tan(math.radians(fov)/2)
    def begin(self,eye,target=(0,0,0),fov=38,ground=-2.05):
        self.commands=[];self.clouds=[];self.camera(eye,target,fov)
        self.mesh('floor',self.box,transform((0,ground,0),(120,.08,120)),(.038,.048,.056),0,.8,floor_mode=1)
    def mesh(self,key,vertices,model=None,color=IVORY,metal=.1,rough=.35,emission=0,floor_mode=0,dynamic=False):
        c=self.ctx;p=self.mesh_program
        if key not in self.cache:
            b=c.buffer(vertices.astype('f4').tobytes());v=c.vertex_array(p,[(b,'3f 3f','in_pos','in_normal')]);s=c.vertex_array(self.shadow_program,[(b,'3f 12x','in_pos')]);self.cache[key]=(b,v,len(vertices),s)
        b,v,n,s=self.cache[key]
        if dynamic:b.write(vertices.astype('f4').tobytes())
        self.commands.append((v,s,n,np.eye(4,dtype='f4') if model is None else model,color,metal,rough,emission,floor_mode))
    def orb(self,pos,r=.5,color=IVORY,metal=.2,rough=.3,emission=0):
        self.mesh('sphere',self.sphere,transform(pos,(r,r,r)),color,metal,rough,emission)
    def ring(self,pos,r=1,color=GOLD,rot=(0,0,0),thin=1):
        # Torus cross-section scaled at construction for fine metalwork.
        key='torus-'+str(thin)
        geom=self.torus if thin==1 else torus_geometry(tube=.06*thin)
        self.mesh(key,geom,transform(pos,(r,r,r),rot),color,.86,.2)
    def cloud(self,positions,sizes=.016,colors=GOLD,glow=0):
        a=np.empty((len(positions),8),'f4');a[:,:3]=positions;a[:,3]=sizes;a[:,4:7]=colors;a[:,7]=glow
        self.clouds.append(a)
    def title(self,film):
        if film==self.type_id:return
        self.type_id=film;im=Image.new('RGBA',(self.w,self.h));d=ImageDraw.Draw(im)
        f=ImageFont.truetype('/usr/share/fonts/opentype/urw-base35/P052-Roman.otf',int(self.w*.025))
        title=TITLES[film];max_width=self.w*.78
        while d.textlength(title,font=f)>max_width:f=ImageFont.truetype('/usr/share/fonts/opentype/urw-base35/P052-Roman.otf',f.size-1)
        d.text((self.w*.057,self.h*.82),title,font=f,fill=(238,228,207,255))
        self.type_texture.write(np.array(im.transpose(Image.Transpose.FLIP_TOP_BOTTOM)).tobytes())
    def end(self,film,t):
        c=self.ctx;c.enable(moderngl.DEPTH_TEST);c.disable(moderngl.BLEND)
        self.shadow_frame.use();c.viewport=(0,0,1536,1536);self.shadow_frame.clear(depth=1)
        for v,s,n,m,col,metal,rough,em,floor in self.commands:
            if floor:continue
            self.shadow_program['model'].write(m.T.tobytes());s.render(moderngl.TRIANGLES,vertices=n)
        self.frame.use();c.viewport=(0,0,self.w,self.h);self.frame.clear(.005,.009,.014,1,depth=1)
        self.shadow_texture.use(4);self.mesh_program['shadow_map'].value=4;p=self.mesh_program
        for v,s,n,m,col,metal,rough,em,floor in self.commands:
            p['model'].write(m.T.tobytes());p['base'].value=col;p['metal'].value=metal;p['rough'].value=rough;p['emission'].value=em;p['floor_mode'].value=floor
            v.render(moderngl.TRIANGLES,vertices=n)
        c.enable(moderngl.BLEND);c.blend_func=moderngl.SRC_ALPHA,moderngl.ONE_MINUS_SRC_ALPHA
        for a in self.clouds:
            self.point_buffer.write(a.tobytes());self.points_vao.render(moderngl.POINTS,vertices=len(a))
        c.disable(moderngl.DEPTH_TEST);c.disable(moderngl.BLEND)
        p=self.blur_program;c.viewport=(0,0,self.w//4,self.h//4)
        for i in range(4):
            self.blur_frames[i%2].use();(self.hdr if i==0 else self.bloom[(i-1)%2]).use(0)
            p['src'].value=0;p['bright'].value=1 if i==0 else 0
            p['step_size'].value=(4/self.w,0) if i%2==0 else (0,4/self.h)
            self.blur_vao.render(moderngl.TRIANGLE_STRIP)
        self.output_frame.use();c.viewport=(0,0,self.w,self.h);p=self.post_program
        self.hdr.use(0);self.bloom[1].use(1);self.title(film);self.type_texture.use(2);self.depth.use(3)
        p['scene'].value=0;p['bloom'].value=1;p['type'].value=2;p['tick'].value=t;p['opacity'].value=float(smooth(t,12.2,13.6))
        p['depth_map'].value=3;p['focus_distance'].value=self.focus_distance;p['pixel'].value=(1/self.w,1/self.h)
        self.post_vao.render(moderngl.TRIANGLE_STRIP)
        return self.output_frame.read(components=3,alignment=1)

# All randomness is seeded. Each film has a setup, a physical change, then a hold.
class Films:
    def __init__(self,R):
        self.R=R;self.rng=np.random.default_rng(924);self.rand=self.rng.random((40000,5)).astype('f4')
        rnd=np.random.default_rng(43);a=np.linspace(0,TAU,96,endpoint=False);border=np.stack([np.cos(a),np.sin(a)],1)*2.1
        inside=rnd.normal(0,.98,(34,2));inside=inside[np.linalg.norm(inside,axis=1)<2.1]
        far=np.stack([np.cos(a[::8]),np.sin(a[::8])],1)*6;vor=Voronoi(np.concatenate([inside,far]))
        self.shards=[]
        for i in range(len(inside)):
            region=vor.regions[vor.point_region[i]]
            if -1 in region:continue
            poly=vor.vertices[region]
            for j,A in enumerate(border):
                B=border[(j+1)%len(border)];edge=B-A;output=[]
                side=lambda p:edge[0]*(p[1]-A[1])-edge[1]*(p[0]-A[0])
                for k,P in enumerate(poly):
                    Q=poly[(k+1)%len(poly)];sp,sq=side(P),side(Q)
                    if sp>=0:output.append(P)
                    if (sp>=0)!=(sq>=0):output.append(P+(Q-P)*(sp/(sp-sq)))
                poly=np.array(output)
                if len(poly)<3:break
            if len(poly)<3:continue
            cen=poly.mean(0);geom=prism((poly-cen)*.971,bevel=.045)
            pos=geom[:,:3].copy();pos[:,1]+=.045*((pos[:,0]+cen[0])**2+(pos[:,2]+cen[1])**2)
            self.shards.append((triangles(pos),cen,float(rnd.random()),i))
        self.water_coords=np.concatenate([[-100.],np.linspace(-22,22,320),[100.]])
        self.water_x,self.water_z=np.meshgrid(self.water_coords,self.water_coords)
        self.water_radius=np.hypot(self.water_x,self.water_z)
        self.leaf_cache={}
        self.dish=dish_geometry()
    def focus(self,t):
        r=self.R;g=float(smooth(t,2,10));r.begin((6.1-.5*g,3.2,9.3-.8*g),(0,0,0),38)
        for j in range(6):r.ring((-.22+j*.084,0,0),1.32-j*.026,GOLD if j%2 else BLACK,(0,0,math.pi/2),thin=.4)
        a=self.rand[:18500];x=((a[:,0]*9+t*.79)%9)-4.5
        upstream=np.maximum(-x,0)/4.5;downstream=smooth(x,0,1.2)
        width=(1-downstream*g)*(.18+upstream*1.25)
        y=(a[:,1]-.5)*width*2+np.sin(x*2.2+a[:,3]*TAU+t*.6)*width*.37
        z=(a[:,2]-.5)*width*2+np.cos(x*1.7+a[:,4]*TAU-t*.4)*width*.24
        p=np.stack([x,y,z],1);col=np.tile(IVORY,(len(a),1));col[a[:,3]>.83]=GOLD
        r.cloud(p,.012+a[:,4]*.018,col,.1+downstream*g*.9)
        r.orb((3.7,0,0),.035+.035*g,GOLD,.65,.14,2*g)
        r.mesh('focus-catch',r.disc,transform((3.7,-.20,0),(.36,.2,.36)),BLACK,.65,.18)
    def time(self,t):
        r=self.R;progress=float(smooth(t,0,16));r.begin((5.9-.7*progress,2.8,8.6-.8*progress),(0,0,0),36)
        for y in [-1.88,1.88]:
            r.ring((0,y,0),1.01,GOLD,thin=.55)
            r.mesh('hourglass-base',r.disc,transform((0,y+(1 if y>0 else -1)*.12,0),(1.12,1.9,1.12)),BLACK,.68,.24)
        for a in [0,TAU/3,TAU*2/3]:r.mesh('hourglass-rod',r.sphere,transform((np.cos(a)*.99,0,np.sin(a)*.99),(.019,1.8,.019)),GOLD,.8,.21)
        a=self.rand[:21500];theta=a[:,0]*TAU;left=1-float(smooth(t,.8,11.6))
        yy=.09+a[:,1]*1.64*left**.36;rr=np.sqrt(a[:,2])*(.02+.68*(yy/1.74)**.65)
        top=np.stack([rr*np.cos(theta),yy,rr*np.sin(theta)],1)
        rr2=np.sqrt(a[:,2])*.81*(1-left)**.25;bottom=np.stack([rr2*np.cos(theta),-1.72+(1-rr2/.87)*.72*a[:,1]*(1-left)**.27,rr2*np.sin(theta)],1)
        schedule=.8+a[:,4]*10.7;q=(t-schedule)/1.05;k=smooth(q,0,.34)
        neck=np.stack([np.cos(theta)*.028,np.zeros(len(a)),np.sin(theta)*.028],1)
        p=top*(1-k[:,None])+neck*k[:,None];fall=smooth(q,.34,1)
        p=p*(1-fall[:,None])+bottom*fall[:,None]
        colors=np.tile(GOLD,(len(a),1))*(.74+a[:,3,None]*.46)
        r.cloud(p,.018+a[:,3]*.012,colors,.15)
        # The glass is traced with extremely fine reflected highlights.
        h=np.linspace(-1.7,1.7,170);angle=np.linspace(0,TAU,88);H,A=np.meshgrid(h,angle)
        radius=.038+.85*(np.abs(H)/1.7)**.62;glass=np.stack([radius*np.cos(A),H,radius*np.sin(A)],-1).reshape(-1,3)
        selected=(np.sin(A.ravel()*3+.8)>.975)
        r.cloud(glass[selected],.006,(.38,.48,.51),.02)
    def mind(self,t):
        r=self.R;opened=float(smooth(t,2,11));r.begin((6.6-.9*opened,4.6,8.6-1.6*opened),(0,.15,0),36)
        for j in range(43):
            angle=(j/42-.5)*(.05+opened*2.85)
            u,v=np.meshgrid(np.linspace(0,1,31),np.linspace(-1,1,10),indexing='ij')
            bend=angle+u*.13*np.sin(t*.2+j*.07)*opened
            x=np.sin(bend)*u*3.05;y=-1.48+np.cos(bend)*u*3.05
            z=v*.82+np.sin(u*np.pi)*.08*np.sin(j*.6+v*2)*opened
            pos=np.stack([x,y,z],-1)
            q=np.stack([pos[:-1,:-1],pos[1:,:-1],pos[1:,1:],pos[:-1,:-1],pos[1:,1:],pos[:-1,1:]],2).reshape(-1,3)
            r.mesh('page-'+str(j),triangles(q),np.eye(4,dtype='f4'),IVORY if j not in [0,42] else BLACK,.05,.6,dynamic=True)
        r.mesh('book-spine',r.box,transform((0,-1.48,0),(.26,.17,1.77)),BLACK,.45,.32)
        # Marks accumulate on the opened pages, without explanatory copy.
        a=self.rand[:3500];angle=(a[:,0]-.5)*(.05+opened*2.85);u=.15+a[:,1]*.77
        p=np.stack([np.sin(angle)*u*3.06,-1.48+np.cos(angle)*u*3.06,(a[:,2]-.5)*1.45],1)
        r.cloud(p,.007,GOLD,.35*opened)
    def body(self,t):
        r=self.R;breath=(1-np.cos(t*TAU/5.6))*.5;strength=float(smooth(t,2,12));r.begin((3.7,2.8,8.2-.8*strength),(0,0,0),36)
        u,v=np.meshgrid(np.linspace(0,TAU,600),np.linspace(0,TAU,110),indexing='ij');u=u.ravel();v=(v+u.reshape(600,110)*5).ravel()
        # Continuous braided fibers, rather than a random shell of dots.
        R=1.26+.22*breath;ribbon=.20+strength*.11
        rr=R+np.cos(v)*ribbon
        x=rr*np.cos(u);y=rr*np.sin(u);z=np.sin(v)*ribbon+np.sin(u*3+v*2)*.04
        # Inextensible strands slide past each other as the shape breathes.
        braid=np.sin(u*35+v*16+t*.17);p=np.stack([x,y,z],1)
        col=np.tile(IVORY,(len(u),1))*(.38+(braid*.5+.5)[:,None]*.52)
        col[(np.sin(v*5+u)>.955)]=GOLD
        r.cloud(p,.010,col,.03)
        r.ring((0,0,0),R,GOLD,(math.pi/2,0,0),thin=.09)
        r.orb((0,0,0),.043,GOLD,.5,.22,.7+breath*.7)
    def think(self,t):
        r=self.R;choose=float(smooth(t,4,10));r.begin((5.6-choose*1.7,7.7-choose*2.6,9.3-choose*3.4),(0,-1,0),36)
        needle=np.array([[0,.075,-.37],[-.07,.075,0],[0,.12,0],[.07,.075,0],[0,.075,.31]])
        geo=triangles(needle[[0,1,2,0,2,3,1,4,2,4,3,2]])
        for row in range(3):
            for col in range(5):
                x=(col-2)*1.32;z=(row-1)*1.43;central=row==1 and col==2
                r.mesh('compass-disc',r.disc,transform((x,-1.62,z),(.51,1.9,.51)),BLACK,.55,.22)
                r.ring((x,-1.50,z),.45,GOLD if central else (.26,.29,.28),thin=.25)
                jitter=np.sin(t*.8+row+col)*.14*(1-smooth(t,0,4));angle=jitter+(choose*1.16 if central else 0)
                r.mesh('needle',geo,transform((x,-1.49,z),rot=(0,angle,0)),GOLD if central else IVORY,.7,.23,emission=.12 if central else 0)
                r.orb((x,-1.37,z),.025,GOLD,.8,.19)
                marks=np.arange(28)*TAU/28;pos=np.stack([x+np.cos(marks)*.39,np.full(28,-1.38),z+np.sin(marks)*.39],1)
                r.cloud(pos,.009,(.39,.44,.43),0)
    def friends(self,t):
        r=self.R;near=float(smooth(t,2,10));r.begin((6.2-.6*near,3.1,8.3-.8*near),(0,0,0),37)
        positions=[]
        for j in range(5):
            angle=j*TAU/5+.42;radius=3.2-near*1.36 if j<4 else 2.3+near*3.4
            positions.append(np.array([np.cos(angle)*radius,np.sin(angle*2)*.4,np.sin(angle)*radius]))
        r.orb((0,0,0),.53,tuple(np.array(IVORY)*(.34+.5*near)),.35,.24,near*.05)
        for j,p in enumerate(positions):
            r.orb(p,.39,IVORY if j<4 else BLACK,.3,.24)
            release=1-float(smooth(t,3,7)) if j==4 else 1
            u=np.linspace(0,1,120);curve=u[:,None]*p[None,:]*release;curve[:,1]-=np.sin(u*np.pi)*(.26+.14*(1-near))*release
            if release>.005:r.mesh('friend-thread-'+str(j),curve_geometry(curve,(.016+.015*near)*release),np.eye(4,dtype='f4'),GOLD,.75,.22,emission=.05,dynamic=True)
            if near>.05 and j<4:
                q=(t*.16+j*.13)%1;tip=q*p;tip[1]-=np.sin(q*np.pi)*(.26+.14*(1-near))
                r.orb(tip,.038,GOLD,.4,.2,.8*near)
        # A second, returning pulse travels from the center to each neighbor.
        u=self.rand[:900];a=u[:,0]*TAU;rr=.61+u[:,1]*.035
        p=np.stack([rr*np.cos(a)*np.sin(u[:,2]*np.pi),rr*np.cos(u[:,2]*np.pi),rr*np.sin(a)*np.sin(u[:,2]*np.pi)],1)
        r.cloud(p,.007,GOLD,near*.35)
    def environment(self,t):
        r=self.R;room=float(smooth(t,3,11));r.begin((6.1-1.6*room,5.7-1.2*room,8.0-1.1*room),(0,-.5,0),37)
        for j in range(42):
            angle=j*2.399;rad=1.1+(j%5)*.17+room*2.25;h=1.5+(j%7)*.18
            p=(np.cos(angle)*rad,-1.97+h/2,np.sin(angle)*rad)
            r.mesh('environment-rod',r.box,transform(p,(.11,h,.11),(.10*room*np.sin(angle),angle,.10*room*np.cos(angle))),BLACK,.5,.32)
            r.orb((p[0],p[1]+h/2,p[2]),.064,GOLD,.8,.25)
        # Two curved leaves open in the space that has been made.
        for side in [-1,1]:
            u,v=np.meshgrid(np.linspace(0,1,48),np.linspace(-1,1,14),indexing='ij');height=.46+room*1.38
            x=side*(.07+u*height*.51);y=-1.9+np.sin(u*np.pi*.66)*height;z=v*np.sin(u*np.pi)*(.16+room*.34)
            pos=np.stack([x,y+v*v*.09,z],-1);q=np.stack([pos[:-1,:-1],pos[1:,:-1],pos[1:,1:],pos[:-1,:-1],pos[1:,1:],pos[:-1,1:]],2).reshape(-1,3)
            r.mesh('leaf-'+str(side),triangles(q),np.eye(4,dtype='f4'),IVORY,.24,.34,dynamic=True)
            curve=np.stack([side*(.07+np.linspace(0,1,110)*height*.51),-1.9+np.sin(np.linspace(0,1,110)*np.pi*.66)*height+.012,np.zeros(110)],1)
            r.mesh('leaf-vein-'+str(side),curve_geometry(curve,.007),np.eye(4,dtype='f4'),GOLD,.8,.2,emission=.2,dynamic=True)
        r.orb((0,-1.85,0),.16,GOLD,.65,.28,.15)
    def promises(self,t):
        r=self.R;fall=float(smooth(t,2,7));settle=np.sin(max(0,t-7)*3.8)*np.exp(-max(0,t-7)*.7)*.10*fall
        sag=.18+fall*.88+settle;r.begin((5.3,2.3,8.3-.9*smooth(t,0,16)),(0,-.4,0),36)
        for x in [-3,3]:
            r.orb((x,.6,0),.23,IVORY,.36,.25)
            r.mesh('promise-post',r.box,transform((x,-.8,0),(.38,2.6,.5)),BLACK,.4,.32)
        a=self.rand[:26000];u=a[:,0];phi=a[:,1]*TAU+u*TAU*14
        y=.6-np.sin(u*np.pi)*sag;radius=.071
        p=np.stack([-3+u*6,y+np.cos(phi)*radius,np.sin(phi)*radius],1)
        col=np.tile(IVORY,(len(a),1))*(.46+a[:,2,None]*.48);col[a[:,2]>.90]=GOLD
        r.cloud(p,.011+a[:,3]*.006,col,.02)
        yorb=1.8*(1-fall)+(.6-sag-.57)*fall
        r.orb((0,yorb,0),.54,IVORY,.32,.25)
        if fall>.6:r.ring((0,.6-sag-.03,0),.12,GOLD,(math.pi/2,0,0),thin=.17)
    def upgrade(self,t):
        r=self.R;after=max(0,t-2.3);dolly=float(smooth(t,4,15));r.begin((5.1+dolly*2.0,5.3+dolly*2.2,8.3+dolly*3.7),(0,-.6,0),37,ground=-1.82)
        rr=self.water_radius;x=self.water_x;z=self.water_z
        wave=np.exp(-((rr-after*1.08)/.57)**2)*np.sin(rr*6.8-after*5.4)*.17*np.exp(-after*.09)
        wave+=np.exp(-((rr-after*.84)/.66)**2)*np.sin(rr*5.4-after*5.9)*.085*np.exp(-after*.09)
        y=-1.1+wave
        pos=np.stack([x,y,z],-1);dy,dz=np.gradient(y,self.water_coords,self.water_coords);normal=unit(np.stack([-dz,np.ones_like(y),-dy],-1))
        pack=lambda p:np.stack([p[:-1,:-1],p[1:,:-1],p[1:,1:],p[:-1,:-1],p[1:,1:],p[:-1,1:]],2).reshape(-1,3)
        r.mesh('water',triangles(pack(pos),pack(normal)),np.eye(4,dtype='f4'),(.042,.091,.11),.82,.14,floor_mode=2,dynamic=True)
        if t<2.3:
            ydrop=2.5-(t/2.3)**2*3.48;r.orb((0,ydrop,0),.14,GOLD,.7,.13,.7)
        a=self.rand[:7300];theta=a[:,0]*TAU;rad=np.sqrt(a[:,1])*9.5;activated=smooth(after-rad/1.05,0,2)
        h=activated*(.12+a[:,3]*.8);angle=theta+activated*a[:,4]*.04
        p=np.stack([rad*np.cos(angle),-1.06+h,rad*np.sin(angle)],1)
        mask=activated>.002;col=np.tile(IVORY,(mask.sum(),1));col[a[mask,2]>.71]=GOLD
        if mask.any():r.cloud(p[mask],.008+a[mask,2]*.012,col,activated[mask]*.45)
        if after>0:
            a=np.linspace(0,TAU,3600);rad=after*1.08;w=.01*np.sin(a*41+t*2)
            p=np.stack([np.cos(a)*(rad+w),np.full(len(a),-1.06),np.sin(a)*(rad+w)],1)
            r.cloud(p,.012,GOLD,.35*np.exp(-after*.08))
    def constructive(self,t):
        r=self.R;close=float(smooth(t,3.0,11.6));spread=1-close
        camera=float(smooth(t,0,14));r.begin((6.2-3.1*camera,6.8-3.4*camera,8.5-4.2*camera),(0,-.1,0),35,ground=-.32)
        gold=smooth(t,4,11);col=tuple(np.array(BLACK)*(1-gold)+np.array(GOLD)*gold)
        r.mesh('gold-plate',self.dish,transform((0,.043,0)),col,.8,.22,emission=.45*gold)
        for geom,cen,seed,i in self.shards:
            radial=unit([cen[0],0,cen[1]])
            drift=np.array([cen[0],-.01,cen[1]])+radial*spread*(.45+seed*1.5)
            drift[1]+=spread*(seed*.8+.1)
            rot=(spread*(seed-.5)*.6,spread*(seed-.5)*.6,spread*(seed-.5)*.65)
            r.mesh('shard-'+str(i),geom,transform(drift,rot=rot),(.033+seed*.012,.045+seed*.012,.05+seed*.012),.6,.23)
        # The seams remain after the pieces settle.
        p=self.rand[:700,:3].copy();a=p[:,0]*TAU;rr=p[:,1]*2.2
        pos=np.stack([np.cos(a)*rr, .04+p[:,2]*.02, np.sin(a)*rr],1)
        visible=(np.sin(a*17+rr*13)>.92)&(close>.8)
        if visible.any():r.cloud(pos[visible],.012,GOLD,.7*close)
    def render(self,film,t):
        getattr(self,film)(t);return self.R.end(film,t)

def audio(path,film):
    sr=48000;t=np.arange(int(sr*DURATION))/sr;v=np.zeros_like(t)
    # A quiet, original four-note felt/bell motif. No narration.
    roots=[146.832,220.,261.626,293.665]
    for start,freq in zip([.9,4.1,8.2,11.7],roots):
        q=np.maximum(t-start,0);env=(1-np.exp(-q*23))*np.exp(-q*.62)*(t>=start)
        note=np.sin(TAU*freq*q)*.65+np.sin(TAU*freq*2.001*q)*.2+np.sin(TAU*freq*3.002*q)*.08
        v+=note*env*.055
    v+=np.sin(TAU*73.416*t)*.012*smooth(t,1,6)*(1-smooth(t,13,16))
    v*=smooth(t,0,1)*(1-smooth(t,14.6,16))
    stereo=np.stack([v,np.roll(v,int(sr*.017))*.92],1)
    with wave.open(str(path),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((stereo*32767).astype('<i2').tobytes())

def render_film(film,w=1920,h=1080):
    OUT.mkdir(exist_ok=True);r=Renderer(w,h);f=Films(r);wav=OUT/(film+'.wav');audio(wav,film)
    target=OUT/(film+'.mp4');temporary=OUT/(film+'.rendering.mp4');frames=int(FPS*DURATION)
    encoding=['-crf','23','-maxrate','5M','-bufsize','10M'] if film in ['focus','upgrade'] else ['-crf','20']
    cmd=['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{w}x{h}','-r',str(FPS),'-i','pipe:0','-i',str(wav),'-vf','vflip','-c:v','libx264','-preset','medium',*encoding,'-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart','-shortest',str(temporary)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE);start=time.monotonic()
    for i in range(frames):
        proc.stdin.write(f.render(film,i/FPS))
        if i%96==0:print(f'{film}: {i}/{frames} ({time.monotonic()-start:.1f}s)',flush=True)
    proc.stdin.close()
    if proc.wait()!=0:raise RuntimeError('ffmpeg encoding failed')
    temporary.replace(target)
    poster=np.frombuffer(f.render(film,9.5),'u1').reshape(h,w,3)[::-1]
    Image.fromarray(poster).save(OUT/(film+'.webp'),quality=88)
    wav.unlink();print(f'{film}: complete, {target.stat().st_size/1e6:.2f} MB, {time.monotonic()-start:.1f}s',flush=True)
    r.ctx.release()

def stills(films,w=960,h=540):
    OUT.mkdir(exist_ok=True);r=Renderer(w,h);f=Films(r)
    for film in films:
        ims=[]
        for t in [1.,6.,11.,14.]:
            frame=f.render(film,t);im=Image.fromarray(np.frombuffer(frame,'u1').reshape(h,w,3)[::-1]);ims.append(im)
        sheet=Image.new('RGB',(w*2,h*2));[sheet.paste(im,((i%2)*w,(i//2)*h)) for i,im in enumerate(ims)]
        sheet.save(OUT/(film+'-test.jpg'),quality=93)
        print(f'{film}: stills',flush=True)

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--film',choices=list(TITLES));p.add_argument('--all',action='store_true');p.add_argument('--stills',action='store_true');p.add_argument('--force',action='store_true');p.add_argument('--width',type=int,default=1920);p.add_argument('--height',type=int,default=1080)
    a=p.parse_args();films=list(TITLES) if a.all else [a.film or 'constructive']
    if a.stills:stills(films)
    else:
        for film in films:
            if not a.force and (OUT/(film+'.mp4')).exists() and (OUT/(film+'.webp')).exists():continue
            render_film(film,a.width,a.height)
        manifest=[]
        for film in films:
            target=OUT/(film+'.mp4')
            probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(target)]))
            video=next(s for s in probe['streams'] if s['codec_type']=='video')
            assert video['width']==a.width and video['height']==a.height
            assert video['codec_name']=='h264' and video['pix_fmt']=='yuv420p'
            assert abs(float(probe['format']['duration'])-DURATION)<.05
            manifest.append(dict(id=film,title=TITLES[film],width=video['width'],height=video['height'],fps=FPS,duration=DURATION,videoCodec=video['codec_name'],audioCodec=next(s['codec_name'] for s in probe['streams'] if s['codec_type']=='audio'),bytes=target.stat().st_size))
        (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
