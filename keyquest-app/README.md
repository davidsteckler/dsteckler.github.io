# KeyQuest: GitHub Pages + Supabase

This is the portable version of KeyQuest. The 50 lessons, 42-minute routine, typing engine, accessibility supports, charts, CSV exports, and small Python interpreter run in the browser. Supabase provides Auth, PostgreSQL records, row-level authorization, and one teacher-only function for provisioning students.

## Current status

- Static build: ready under `../keyquest/`.
- Supabase project: **not yet connected**. No accounts or tables have been provisioned remotely.
- When configuration is empty, the site offers practice mode and clearly states that it does not save online.
- The existing website homepage and other activities are unchanged.
- Existing ChatGPT-hosted records are not migrated automatically.

## Connect Supabase

1. Create/select a dedicated Supabase project.
2. Apply `supabase/migrations/202609090001_keyquest.sql` using its SQL editor or migration tooling.
3. Deploy `supabase/functions/keyquest-admin/index.ts` as `keyquest-admin`. Disable legacy gateway JWT verification for this function (`verify_jwt = false`). The function explicitly verifies the bearer token with Auth `getUser` and checks the teacher table before using admin APIs.
4. In Supabase Auth, disable public sign-ups. Create a teacher email/password account through the dashboard/admin API and confirm its email. Never commit the password. Add the teacher's Auth UUID and a unique six-character lowercase class code:

   ```sql
   insert into public.kq_teachers(user_id,name,class_code)
   values ('REPLACE_WITH_AUTH_USER_UUID','Mr. Steckler','REPLACE_WITH_6_CHAR_CODE');
   ```

5. Set `supabaseUrl` and `supabasePublishableKey` in `public/config.js`, then rebuild. Only a public publishable/legacy anon key belongs there. The service-role key remains in the Edge Function environment; it is never added to browser files.
6. Set the Auth Site URL to `https://dsteckler.com/keyquest/`. Email recovery for teachers is managed through Supabase; student codes are reset from the teacher interface.
7. Sign in as the teacher. Use Add profile to create a nickname. Record the returned student code before closing the sign-in card.
8. Test two students and a teacher in separate browser sessions. Verify the checks below before classroom launch.

## Student sign-in

The class code is remembered on that browser. Students enter an eight-digit code. The browser derives a synthetic non-deliverable email identifier from a SHA-256 digest of class code plus student code, and signs in using Supabase password Auth. Students do not need email accounts. Codes are shown only when created/reset and are not stored in the public learner table. A reset changes future sign-in credentials; already issued access tokens follow Supabase token expiry behavior.

Authentication tokens use browser session storage so closing the tab ends persistence; progress remains in PostgreSQL. Use Sign out between students on a shared computer. A copied or disclosed student code lets its holder access that student's account. Teacher-created accounts and Supabase Auth rate limits are required. This is a classroom credential flow, not identity verification.

## What each role can do

- Student: read their profile and their results; insert their own results.
- Teacher: read their class's profiles/results; create or reset student accounts through the verified Edge Function; insert results for a supervised learner.
- Anonymous: no data-table access.
- Neither client role can update/delete results, create teacher roles, or directly modify student profiles.

RLS and SQL grants enforce access even if someone changes browser code. The function accepts no client-supplied teacher identity. Measurement values remain student-generated practice data, not tamper-proof assessments.

## Verify with a connected project

- A student cannot select another student's profile or results, or insert a result under another learner ID.
- A student receives 403 from `keyquest-admin`.
- An unauthenticated request cannot read the three tables.
- Public self-signup is disabled and a self-created Auth user cannot grant itself teacher access.
- The teacher can create a student, sign in using its codes, save a session, sign out, and retrieve it on another browser.
- Creating/resetting a code produces a working new login; the old code no longer starts a new session.
- Expired access tokens refresh; failed refresh returns a sign-in message while preserving an unsaved result on screen.
- Re-saving the same session ID does not duplicate its record.
- History beyond 500/1000 records loads fully.

## Build and publish

From this directory:

```sh
npm ci
npm run check
npm run build
```

Vite writes static files to `../keyquest/` with relative asset paths, so it works in a GitHub Pages subfolder or custom domain. Commit both source and the generated folder. This repository already serves a static site; no workflow replaces its existing publishing arrangement. Once merged into the site's published branch, the folder's page is `/keyquest/`.

To change configuration without rebuilding, edit the generated `../keyquest/config.js` too; keep it aligned with `public/config.js` so future builds preserve it.

## References

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/reference/javascript/auth-admin-createuser
