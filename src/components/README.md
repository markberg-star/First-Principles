# Atlas of Why

Atlas of Why is a free, installable daily learning app. It rebuilds one useful idea from foundational facts, shows the reasoning step by step, applies it to a worked example, names the model's limits, and finishes with an interactive retrieval challenge.

The app includes 18 lessons across 18 fields. Its core library, progress, bookmarks, streaks, practice queue, installation, offline support, and calendar reminder work without an account or paid API.

## Run it locally

```bash
npm install
npm run dev
```

Run the checks with:

```bash
npm test
npm run build
```

## Free architecture

- React and Vite provide the installable mobile interface.
- GitHub Pages hosts the static production build from the public repository.
- Browser storage keeps progress private and available offline by default.
- Supabase is optional and syncs progress across devices using its free plan.
- Lessons are curated and bundled with the app, so there are no AI API charges.
- A downloadable repeating calendar event provides a free daily phone reminder.

## Optional Supabase sync

Create a Supabase project, then link this folder and apply the included migration:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Copy `.env.example` to `.env.local` and add the project URL and publishable key from the Supabase Connect dialog:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

The migration enables row-level security on every exposed table. Each signed-in user can access only their own progress and activity dates. Never place a secret or service-role key in this app.

For GitHub Pages, add these repository variables under Settings, Secrets and variables, Actions:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

The app remains fully usable if both variables are left empty.

## Deploy through GitHub Pages

The workflow in `.github/workflows/pages.yml` tests and builds the app whenever `main` changes. In the GitHub repository, open Settings, Pages, and select GitHub Actions as the source.

The production URL will have this form:

```text
https://markberg-star.github.io/First-Principles/
```

On iPhone, open that URL in Safari, tap Share, and choose Add to Home Screen. On Android, open the browser menu and choose Install app.

## Content model

Every lesson must contain:

1. A concrete question or method
2. Foundational facts or assumptions
3. A step-by-step reconstruction
4. A worked real-world example
5. A conventional-thinking failure
6. Clearly labeled uncertainty where appropriate
7. One action for the day
8. One retrieval challenge with explanatory feedback

New topics belong in `src/data/lessons.ts`. The tests reject duplicate IDs, incomplete lesson structure, invalid quiz answers, and repeats inside a full rotation.

## Privacy

Local progress never leaves the device. If cloud sync is enabled, Supabase Auth and row-level security protect each user's records. The app has no analytics, advertising, trackers, or paid model calls.
