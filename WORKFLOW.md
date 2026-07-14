# Team Code Workflow

## Repository
- **GitHub**: RISHAOFFICIAL/LexisSapphireStudio
- The site code lives at `/home/team/shared/site`

## Branch Strategy
- `main` — production-ready code, deployed to live site
- Feature branches for new work (e.g., `feat/contact-form`, `fix/typo`)
- Always create a new branch from `main` before starting work

## Process
1. Pull latest from `main` before starting
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Make changes and test locally (server on port 3000)
4. Commit with clear messages
5. Push the branch and create a PR
6. The lead reviews and merges the PR

## Publishing
- After merging, run `bun run publish` from `/home/team/shared/site` to update the live preview
- For production deployment to the custom domain, use `bun run go-live` (requires VERCEL_TOKEN)