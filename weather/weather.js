'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const defaults = {name:'Greenwich, Connecticut', latitude:41.0262, longitude:-73.6282};
  const read = (key, fallback) => {try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch {return fallback;}};
  const save = (key, value) => {try {localStorage.setItem(key, JSON.stringify(value));} catch { /* Storage is optional. */ }};
  const validLocation = p => p && typeof p.name === 'string' && p.name.length < 180 && Number.isFinite(p.latitude) && Math.abs(p.latitude) <= 90 && Number.isFinite(p.longitude) && Math.abs(p.longitude) <= 180;
  let place = read('ds-weather-place', defaults);
  if (!validLocation(place)) place = defaults;
  let unit = read('ds-weather-unit', 'F') === 'C' ? 'C' : 'F';
  let data, selected, metric = 'overview', forecastRequest = 0, searchRequest = 0, controller, loadedAt, stale = false;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = (v, suffix = '', digits = 0) => Number.isFinite(v) ? v.toFixed(digits) + suffix : '—';
  const temp = v => num(Number.isFinite(v) ? unit === 'F' ? v : (v - 32) * 5 / 9 : null, '°');
  const wind = v => num(unit === 'C' && Number.isFinite(v) ? v * 1.609344 : v);
  const windUnit = () => unit === 'F' ? 'mph' : 'km/h';
  const amount = v => num(Number.isFinite(v) ? unit === 'F' ? v : v * 25.4 : null, unit === 'F' ? ' in' : ' mm', 2);
  const format = (t, options) => new Intl.DateTimeFormat('en-US', {timeZone:data?.timezone || 'America/New_York', ...options}).format(new Date(t * 1000));
  const dateKey = t => format(t, {year:'numeric',month:'2-digit',day:'2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
  const labelDay = t => dateKey(t) === dateKey(Date.now()/1000) ? 'Today' : dateKey(t) === dateKey(Date.now()/1000 + 86400) ? 'Tomorrow' : format(t, {weekday:'short'});
  const directions = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  const direction = v => Number.isFinite(v) ? directions[Math.round(v / 22.5) % 16] : '—';
  function condition(code, day = 1) {
    if (code === 0) return [day ? '☀️' : '🌙', day ? 'Clear' : 'Clear night'];
    if (code === 1) return [day ? '🌤️' : '🌙','Mostly clear'];
    if (code === 2) return ['⛅','Partly cloudy'];
    if (code === 3) return ['☁️','Overcast'];
    if ([45,48].includes(code)) return ['🌫️','Fog'];
    if ([51,53,55].includes(code)) return ['🌦️','Drizzle'];
    if ([56,57,66,67].includes(code)) return ['🌧️','Freezing rain'];
    if ([61,63,65,80,81,82].includes(code)) return ['🌧️', [65,82].includes(code) ? 'Heavy rain' : 'Rain'];
    if ([71,73,75,77,85,86].includes(code)) return ['🌨️','Snow'];
    if ([95,96,99].includes(code)) return ['⛈️','Thunderstorms'];
    return ['◌','Unavailable'];
  }
  const icon = (code, day) => `<span class="weather-icon" aria-hidden="true">${condition(code,day)[0]}</span>`;
  function notice(message) { $('#notice').hidden = !message; $('#notice').textContent = message; }
  function updateUnits() { document.querySelectorAll('[data-unit]').forEach(b => b.setAttribute('aria-pressed', b.dataset.unit === unit)); }
  async function fetchJSON(url, signal) {
    const r = await fetch(url, {signal});
    if (!r.ok) throw new Error(`Weather service returned ${r.status}`);
    return r.json();
  }
  function validate(d) {
    if (!d?.hourly?.time?.length || !d?.daily?.time?.length || !d?.current || !d?.timezone) throw new Error('Incomplete forecast');
    for (const t of d.hourly.time) if (!Number.isFinite(t)) throw new Error('Invalid forecast time');
    return d;
  }
  function cacheKey(p) {return `ds-weather-cache:${p.latitude.toFixed(3)},${p.longitude.toFixed(3)}`;}
  async function load(nextPlace = place) {
    const request = ++forecastRequest;
    controller?.abort(); controller = new AbortController();
    const activeController = controller;
    const timer = setTimeout(() => activeController.abort(), 20000);
    const oldPlace = place;
    document.body.setAttribute('aria-busy','true'); $('#refresh').disabled = true;
    notice('');
    const params = new URLSearchParams({latitude:nextPlace.latitude,longitude:nextPlace.longitude,
      hourly:'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day',
      current:'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
      daily:'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
      temperature_unit:'fahrenheit',wind_speed_unit:'mph',precipitation_unit:'inch',timezone:'auto',forecast_days:'16',timeformat:'unixtime'});
    try {
      const result = validate(await fetchJSON(`https://api.open-meteo.com/v1/forecast?${params}`,activeController.signal));
      if (request !== forecastRequest) return;
      data = result; place = nextPlace; loadedAt = Date.now(); stale = false;
      save('ds-weather-place',place); save(cacheKey(place),{data,loadedAt});
      render();
    } catch {
      if (request !== forecastRequest) return;
      const cache = read(cacheKey(nextPlace), null);
      if (cache && Number.isFinite(cache.loadedAt) && Date.now()-cache.loadedAt < 86400000) {
        try {data = validate(cache.data); place = nextPlace; loadedAt = cache.loadedAt; stale = true; render(); notice('Live weather is unavailable. Showing a saved forecast — check the update time and try Refresh.');}
        catch {notice('Could not load the weather. Check your connection and try Refresh.');}
      } else {
        place = oldPlace;
        notice(data ? 'Could not refresh. The forecast below has not been updated. Try Refresh again.' : 'Could not load live weather. Check your connection and try Refresh.');
        if (!data) $('#current').innerHTML = '<p class="loading">Forecast unavailable. Use Refresh to try again.</p>';
      }
    } finally {
      clearTimeout(timer);
      if (request === forecastRequest) {document.body.removeAttribute('aria-busy'); $('#refresh').disabled = false;}
    }
  }
  function render() {
    updateUnits();
    $('#place').textContent = place.name;
    $('#updated').textContent = `${stale ? 'Saved forecast' : 'Live forecast'} · ${new Intl.DateTimeFormat('en-US',{timeZone:data.timezone,month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(loadedAt))}`;
    const c = data.current, d = data.daily, today = d.time.findIndex(t => dateKey(t) === dateKey(Date.now()/1000));
    const i = today >= 0 ? today : 0;
    $('#current').innerHTML = `<div class="now-main">${icon(c.weather_code,c.is_day)}<div><div class="now-temp">${temp(c.temperature_2m)}</div><div class="now-condition">${esc(condition(c.weather_code,c.is_day)[1])} · now</div></div></div><div class="stat"><span class="stat-label">Feels like</span><span class="stat-value">${temp(c.apparent_temperature)}</span><span class="stat-note">Current conditions</span></div><div class="stat"><span class="stat-label">Today's high / low</span><span class="stat-value">${temp(d.temperature_2m_max[i])} / ${temp(d.temperature_2m_min[i])}</span><span class="stat-note">${num(d.precipitation_probability_max[i],'%')} precip. chance</span></div><div class="stat"><span class="stat-label">Wind</span><span class="stat-value">${wind(c.wind_speed_10m)} <small>${windUnit()}</small></span><span class="stat-note">Humidity ${num(c.relative_humidity_2m,'%')}</span></div><div class="stat"><span class="stat-label">Sunset</span><span class="stat-value">${Number.isFinite(d.sunset[i]) ? format(d.sunset[i],{hour:'numeric',minute:'2-digit'}) : '—'}</span><span class="stat-note">${esc(data.timezone.replaceAll('_',' '))}</span></div>`;
    const requested = selected || new URLSearchParams(location.search).get('day');
    selected = d.time.some(t => dateKey(t) === requested) ? requested : dateKey(d.time[i]);
    $('#days').innerHTML = d.time.map((t,i) => `<button class="day" data-day="${dateKey(t)}" aria-pressed="${dateKey(t) === selected}" aria-label="${esc(format(t,{weekday:'long',month:'long',day:'numeric'}))}"><span class="day-name">${labelDay(t)}</span><span class="day-date">${format(t,{month:'short',day:'numeric'})}</span><span class="day-icon" aria-hidden="true">${condition(d.weather_code[i])[0]}</span><span class="day-range"><span>${temp(d.temperature_2m_max[i])}</span><span>${temp(d.temperature_2m_min[i])}</span></span><span class="day-rain">${num(d.precipitation_probability_max[i],'%')} precip.</span></button>`).join('');
    $('#forecast-content').hidden = false;
    renderDay();
  }
  function dayRows() {return data.hourly.time.map((t,i)=>({t,i})).filter(r => dateKey(r.t) === selected);}
  function renderDay() {
    const rows = dayRows(), d = data.daily, i = d.time.findIndex(t=>dateKey(t) === selected), h = data.hourly;
    document.querySelectorAll('[data-day]').forEach(b=>b.setAttribute('aria-pressed', b.dataset.day === selected));
    $('#selected-label').textContent = `${labelDay(d.time[i]).toUpperCase()} / HOURLY DETAIL`;
    $('#day-title').textContent = format(d.time[i],{weekday:'long',month:'long',day:'numeric'});
    $('#day-summary').textContent = `${condition(d.weather_code[i])[1]} · High ${temp(d.temperature_2m_max[i])} / Low ${temp(d.temperature_2m_min[i])} · ${num(d.precipitation_probability_max[i],'%')} chance of precipitation`;
    $('#hours-badge').textContent = `${rows.length} hours · all visible`;
    $('#timezone').textContent = data.timezone.replaceAll('_',' ');
    $('#table-caption').textContent = `${$('#day-title').textContent} hourly forecast, ${place.name}, ${data.timezone}`;
    const now = Date.now()/1000;
    const hourLabels = rows.map(r=>format(r.t,{hour:'numeric'}));
    $('#hours').innerHTML = rows.map(({t,i},k) => {
      const isNow = t <= now && now < t + 3600;
      const repeated = hourLabels.indexOf(hourLabels[k]) !== hourLabels.lastIndexOf(hourLabels[k]);
      const time = format(t,{hour:'numeric',...(repeated ? {timeZoneName:'short'} : {})});
      return `<tr${isNow ? ' class="now-row"' : ''}><td>${time}${isNow ? '<span class="now-tag">THIS HOUR</span>' : ''}</td><td><span class="conditions">${icon(h.weather_code[i],h.is_day[i])}<span>${esc(condition(h.weather_code[i],h.is_day[i])[1])}</span></span></td><td class="temp">${temp(h.temperature_2m[i])}</td><td>${temp(h.apparent_temperature[i])}</td><td class="rain-cell"><span class="rain-meter" aria-hidden="true"><span style="width:${Number.isFinite(h.precipitation_probability[i]) ? Math.max(0,Math.min(100,h.precipitation_probability[i])) : 0}%"></span></span>${num(h.precipitation_probability[i],'%')}</td><td>${amount(h.precipitation[i])}</td><td>${num(h.relative_humidity_2m[i],'%')}</td><td><span class="wind-arrow" aria-hidden="true" style="transform:rotate(${Number.isFinite(h.wind_direction_10m[i]) ? h.wind_direction_10m[i]+180 : 0}deg)">↑</span>${direction(h.wind_direction_10m[i])} ${wind(h.wind_speed_10m[i])} ${windUnit()}</td><td>${wind(h.wind_gusts_10m[i])} ${windUnit()}</td><td>${num(h.cloud_cover[i],'%')}</td><td>${num(h.uv_index[i],'',1)}</td></tr>`;
    }).join('');
    drawChart(rows);
  }
  function drawChart(rows) {
    const h = data.hourly;
    const choices = {
      overview:['Temperature & rain chance','temperature_2m',unit === 'F' ? '°F' : '°C'],
      temperature:['Temperature & feels like','temperature_2m',unit === 'F' ? '°F' : '°C'],
      rain:['Chance of precipitation','precipitation_probability','%'],
      wind:['Wind & gusts','wind_speed_10m',windUnit()],
      humidity:['Relative humidity','relative_humidity_2m','%'],
      cloud:['Cloud cover','cloud_cover','%'],
      uv:['UV index','uv_index','']
    };
    const [title,key,suffix] = choices[metric];
    const convert = v => !Number.isFinite(v) ? null : key === 'temperature_2m' && unit === 'C' ? (v-32)*5/9 : key === 'wind_speed_10m' && unit === 'C' ? v*1.609344 : v;
    const values = rows.map(r=>convert(h[key][r.i]));
    const extraKey = metric === 'temperature' ? 'apparent_temperature' : metric === 'wind' ? 'wind_gusts_10m' : null;
    const extras = extraKey ? rows.map(r=>convert(h[extraKey][r.i])) : [];
    const available = [...values,...extras].filter(Number.isFinite);
    $('#chart-label').textContent = title;
    $('#chart-legend').innerHTML = `<span class="legend-line">${esc(suffix || 'UV')}</span>${metric === 'overview' ? '<span class="legend-rain">Rain %</span>' : extraKey ? `<span>··· ${metric === 'wind' ? 'Gusts' : 'Feels like'}</span>` : ''}`;
    if (!available.length) {$('#chart').textContent = 'Chart data unavailable. See the hourly table below.'; return;}
    const W=1100, H=180, L=40, R=metric === 'overview' ? 40 : 16, T=26, B=30, plotH=H-T-B;
    const min = suffix === '%' || metric === 'uv' || metric === 'wind' ? 0 : Math.floor(Math.min(...available)/5)*5-2;
    const max = suffix === '%' ? 100 : Math.max(min+5,Math.ceil(Math.max(...available)/5)*5+2);
    const x = k => L+k*(W-L-R)/Math.max(1,rows.length-1), y = v => H-B-(v-min)/(max-min)*plotH;
    const path = vals => vals.map((v,k)=>Number.isFinite(v) ? `${k && Number.isFinite(vals[k-1]) ? 'L' : 'M'}${x(k).toFixed(1)},${y(v).toFixed(1)}` : '').join(' ');
    let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(title)} for ${esc($('#day-title').textContent)}. Exact values are in the hourly table below."><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#17636a" stop-opacity=".12"/><stop offset="1" stop-color="#17636a" stop-opacity="0"/></linearGradient></defs>`;
    for(let k=0;k<3;k++) {const v=min+(max-min)*k/2; svg+=`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#e7ebe5" stroke-dasharray="3 4"/><text x="${L-8}" y="${y(v)+3}" text-anchor="end">${Math.round(v)}${suffix.startsWith('°') ? '°' : suffix === '%' ? '%' : ''}</text>`;}
    if (metric === 'overview') {
      rows.forEach((r,k)=> {const v=h.precipitation_probability[r.i];if(Number.isFinite(v)) svg+=`<rect x="${x(k)-6}" y="${H-B-v/100*plotH}" width="12" height="${v/100*plotH}" rx="2" fill="#c1ddf0"><title>${esc(format(r.t,{hour:'numeric'}))}: ${v}% rain chance</title></rect>`;});
      [0,50,100].forEach(v=>svg+=`<text x="${W-R+8}" y="${H-B-v/100*plotH+3}">${v}%</text>`);
    }
    if (values.every(Number.isFinite)) svg+=`<path d="${path(values)} L${x(rows.length-1)},${H-B} L${L},${H-B} Z" fill="url(#fill)"/>`;
    svg+=`<path d="${path(values)}" stroke="#17636a" fill="none" stroke-width="2.5" stroke-linejoin="round"/>`;
    if(extraKey) svg+=`<path d="${path(extras)}" stroke="#748c84" fill="none" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    rows.forEach((r,k)=>{
      if(Number.isFinite(values[k])) svg+=`<circle cx="${x(k)}" cy="${y(values[k])}" r="3" fill="#17636a"><title>${esc(format(r.t,{hour:'numeric'}))}: ${values[k].toFixed(1)} ${esc(suffix)}</title></circle>`;
      if(k%3===0 || k===rows.length-1) svg+=`<text x="${x(k)}" y="${H-9}" text-anchor="middle">${esc(format(r.t,{hour:'numeric'}).replace(' ','').toLowerCase())}</text>`;
    });
    $('#chart').innerHTML = svg+'</svg>';
  }
  $('#days').addEventListener('click',e=>{const b=e.target.closest('[data-day]');if(!b)return;selected=b.dataset.day;renderDay();const url=new URL(location.href);url.searchParams.set('day',selected);history.replaceState(null,'',url);});
  document.querySelectorAll('[data-unit]').forEach(b=>b.addEventListener('click',()=>{unit=b.dataset.unit;save('ds-weather-unit',unit);updateUnits();if(data)render();}));
  document.querySelectorAll('[data-metric]').forEach(b=>b.addEventListener('click',()=>{metric=b.dataset.metric;document.querySelectorAll('[data-metric]').forEach(x=>x.setAttribute('aria-pressed',x===b));if(data)drawChart(dayRows());}));
  $('#refresh').addEventListener('click',()=>load());
  $('#search-form').addEventListener('submit',async e=>{
    e.preventDefault();const query=$('#city').value.trim();if(!query)return;
    const id=++searchRequest;$('#search-results').textContent='Searching…';
    try {
      const result=await fetchJSON(`https://geocoding-api.open-meteo.com/v1/search?${new URLSearchParams({name:query,count:7,language:'en',format:'json'})}`,AbortSignal.timeout(15000));
      if(id!==searchRequest)return;
      const found=(result.results||[]).map(p=>({name:[p.name,p.admin1,p.country].filter(Boolean).join(', '),latitude:p.latitude,longitude:p.longitude})).filter(validLocation);
      $('#search-results').innerHTML='';
      if(!found.length){$('#search-results').innerHTML='<p>No places found. Try a nearby city name.</p>';return;}
      found.forEach(p=>{const b=document.createElement('button');b.type='button';b.textContent=p.name;b.addEventListener('click',()=>{++searchRequest;$('#search-results').innerHTML='';$('#city').value='';selected=null;load(p);});$('#search-results').append(b);});
    } catch {if(id===searchRequest)$('#search-results').innerHTML='<p>Search is unavailable. Please try again.</p>';}
  });
  $('#city').addEventListener('input',()=>{++searchRequest;$('#search-results').innerHTML='';});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){++searchRequest;$('#search-results').innerHTML='';}});
  document.addEventListener('click',e=>{if(!e.target.closest('.location-box')){++searchRequest;$('#search-results').innerHTML='';}});
  $('#locate').addEventListener('click',()=>{
    if(!navigator.geolocation){notice('Location is unavailable in this browser. Search for your city instead.');return;}
    const b=$('#locate');b.disabled=true;b.textContent='Finding your location…';
    navigator.geolocation.getCurrentPosition(p=>{b.disabled=false;b.textContent='◎ Use my location';selected=null;load({name:'Your location',latitude:p.coords.latitude,longitude:p.coords.longitude});},()=>{b.disabled=false;b.textContent='◎ Use my location';notice('Could not access your location. Search for your city or ZIP code instead.');},{enableHighAccuracy:false,timeout:12000,maximumAge:300000});
  });
  updateUnits();load();
  setInterval(()=>{if(!document.hidden && !document.body.hasAttribute('aria-busy'))load();},900000);
})();
