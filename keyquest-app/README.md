# KeyQuest: GitHub Pages + Supabase

This is the portable version of KeyQuest. The 50 topics, 42-minute routine, typing engine, accessibility supports, charts, and CSV exports run in the browser. Supabase provides Auth, PostgreSQL records, row-level authorization, and one teacher-only function for provisioning students.

## Classroom setup

The static site is configured for `https://dsteckler.com/keyquest/` and the dedicated KeyQuest Supabase project `jcitwqiqtahgntbsxgvx` in the davidsteckler organization. The project was created at a quoted $0/month. The source and static build are included in this repository.

1. Open the private one-time teacher setup link supplied to the owner. Choose an email and a password of at least 12 characters, then sign in.
2. Open Teacher and choose Add profile. Enter a student nickname.
3. Copy the class code and the eight-digit student code from the sign-in card before closing it. Each student gets their own code.
4. Students visit the same site and enter their codes. Use Sign out between learners on shared computers.
5. View class progress in Teacher, or export CSV. Use New code for a lost student code.

The one-time invitation expires after 14 days. Only its SHA-256 hash is stored remotely. The setup fragment is removed from the address bar before the form is used. The invitation is consumed atomically; it cannot be reused. No invitation secret or teacher password belongs in git. A project administrator can issue a replacement invitation through the protected table if needed.

## Backend configuration

Both migrations are applied, and `keyquest-admin` and `keyquest-setup` are deployed. Their gateway setting is `verify_jwt = false`: the admin function validates the Auth bearer token and verifies the teacher row; the setup function requires a valid unconsumed 256-bit invitation. Admin keys stay in the Supabase function environment. Only the public publishable key and project URL are in `public/config.js`.

There is no public sign-up interface. An Auth account without a teacher or learner record has no classroom data access and cannot assign itself a role. Public Auth sign-up configuration has not been changed globally. Teacher password recovery is an administrator operation in this release; students recover access through teacher code resets.

Existing ChatGPT-hosted records are not migrated automatically. Results save on finishing a session. Keep an unsuccessful save open and retry; refreshing or closing an unfinished session discards unsaved work.

## Student sign-in

The class code is remembered on that browser. Students enter an eight-digit code. The browser derives a synthetic non-deliverable email identifier from a SHA-256 digest of class code plus student code, and signs in using Supabase password Auth. Students do not need email accounts. Codes are shown only when created/reset and are not stored in the public learner table. A reset changes future sign-in credentials; already issued access tokens follow Supabase token expiry behavior.

Authentication tokens use browser session storage so closing the tab ends persistence; progress remains in PostgreSQL. Use Sign out between students on a shared computer. A copied or disclosed student code lets its holder access that student's account. Teacher-created accounts and Supabase Auth rate limits are required. This is a classroom credential flow, not identity verification.

## What each role can do

- Student: read their profile and their results; insert their own results.
- Teacher: read their class's profiles/results; create or reset student accounts through the verified Edge Function; insert results for a supervised learner.
- Anonymous: no data-table access.
- Neither client role can update/delete results, create teacher roles, or directly modify student profiles.

RLS and SQL grants enforce access even if someone changes browser code. The function accepts no client-supplied teacher identity. Measurement values remain student-generated practice data, not tamper-proof assessments.

## Verification completed — September 9, 2026

TypeScript, production build, and local tests pass. Live API tests used two temporary teachers and three temporary students: setup token rejection/reuse protection, provisioning, student sign-in, per-student and per-class reads, anonymous access denial, role escalation denial, student admin-function denial, duplicate-safe saves, cross-student write denial, retained results after new sign-in, token refresh, and code reset with old-code rejection all passed. The 1,001-record history case is covered by a mocked client test. No browser or school-network test was performed.

The security advisor reports an intentional informational notice for the service-only invitation table (RLS enabled with no client policies), plus the default warning that breached-password protection is disabled. No client grants exist for invitations. Global Auth settings, including breached-password protection, were not changed.

## Verification checklist

- A student cannot select another student's profile or results, or insert a result under another learner ID.
- A student receives 403 from `keyquest-admin`.
- An unauthenticated request cannot read the three tables.
- An account cannot insert its own teacher role or access bootstrap invitation data.
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

## Copy-first quest update — September 10, 2026

All student activities now provide exact text to copy. Unconstrained writing, reflection questions, and programming tasks have been removed from the student journey. Six playful themes rotate through short lowercase sentences and 50 simple computing facts. Word mode keeps the full sentence visible and includes the following space in each word chunk. Letter and full-sentence modes remain available.

Five completed prompts earn a level and a theme badge. Level numbers continue indefinitely across repeated sessions; the finite sentence combinations repeat. No speed threshold, losing lives, or automatic difficulty increase is used. The existing same-passage two-minute check and 42-minute routine with two breaks remain. Finished prompt counts are stored as questRounds in the existing session payload, exported to CSV, and summed per learner; older records count as zero quest prompts. No account or database policy change is needed.

The fact-copying activities provide exposure, not evidence of independent standards mastery. Student typing is assessed as supported copying.

## Stable-passage races and teacher onboarding — September 10, 2026

Practice now shows one stable full sentence. Support modes only change the highlight. Ordinary blank spaces replace the old visible-space glyph; the active gap is explicitly labeled SPACE. A solo race marker advances from correct character progress. Live WPM appears after three seconds; the race timer starts on the first character attempt and excludes pauses and score-screen time. Score screens show WPM, accuracy, time, and points and wait for Next race. Sub-second races omit WPM. Points are 10 per correct key, 50 for a finish, and up to 50 for accuracy, with no speed bonus. The routine timer continues during score review. Benchmark behavior is preserved.

Up to the last 100 race detail records per session are saved in the existing payload along with the total points. My progress shows the last ten recorded races and practice bests (races of at least three seconds); these are not substituted for the comparable benchmark chart. Partial-race correct-key points are included when finishing early.

Teachers land on their workspace, which shows Add student, Create student login, and printable/downloadable login cards. A class-specific public URL prefills the class code for Schoology. Cards can be reopened during the current visit; raw codes are not persisted in browser storage or committed. Existing codes cannot be recovered from the database: the clearly labeled replacement flow explains that the old login will stop working and preserves the learner identity and records. No backend permissions or existing accounts were changed.

Design references: the user-provided TypeRacer race and results screenshots; https://monkeytype.com/about for speed/accuracy reporting; https://www.typing.com/teachers for separate educator/student access and teacher-managed student onboarding.

## Connected missions and clean spaces

The car sprite is flipped to face the finish. Space labels and the next-key caption are removed; plain gaps keep the normal caret highlight and the optional keyboard guide. The score strip is more compact.

Twelve authored five-scene stories replace unrelated generated practice sentences. Each completed story sentence reveals a short outcome, with a mission ending after scene five. All 60 targets are exact-copy lowercase text of at most 30 characters. Warm-ups and computer-fact rounds remain separate and do not consume story steps. The storySteps counter saves in the existing session payload, resumes across days, and repeats the story collection after 60 scenes. Existing records without it start at the first story. This changes the narrative progression without assuming it will hold every learner's attention.
