# Packing Boxes 2026

Track what goes in every box for the big move. GitHub-backed SPA with local-first editing and batch save.

## Features

- Create and manage packing boxes with room labels
- Add items with categories, quantities, and fragile flags
- Search across all boxes to find any item
- QR codes per box - scan to open
- Printable labels with QR codes and contents summary
- Local-first editing with a single "Save" commit to GitHub
- Dark theme, mobile-friendly

## Tech Stack

- React 19 + TypeScript + Vite 7
- Tailwind CSS v4
- GitHub API (Octokit) for persistence
- Deployed to GitHub Pages

## Setup

1. Clone the repo
2. Create `.env.local`:
   ```
   GH_PAT=your_github_personal_access_token
   AUTH_USERS=Nick:password123
   ```
3. `npm install && npm run dev`

## Deployment

Push to `main` triggers GitHub Actions deploy. Set `GH_PAT` and `AUTH_USERS` as repository secrets.
