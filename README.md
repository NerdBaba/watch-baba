# Watch Baba - Entertainment Hub

A comprehensive entertainment platform built with React that provides access to movies, TV shows, anime, manga, books, comics, and sports content.

## Features

- Movies and TV shows browsing
- Anime streaming and manga reading
- Books and comics reader
- Sports content
- Multiple themes and responsive layouts

## Tech Stack

- React 18 and React Router v6
- Vite and Vitest
- Styled Components
- HLS.js and custom media readers
- Swiper for carousels
- Framer Motion for animations

## Getting Started

This project uses [Vite](https://vite.dev/) for development and production builds, with Bun as the package manager.

### Environment variables

Copy `.env.example` to `.env.local` and provide the public TMDB key needed by the pages you use. `VITE_*` values are embedded into the browser build. Configure `IGDB_ACCESS_TOKEN` and `IGDB_CLIENT_ID` as Cloudflare Pages secrets (or local Wrangler secrets) because they are consumed only by the `/api/igdb` Pages Function.

### Commands

```sh
bun install
bun run dev       # start the development server
bun run test      # run the test suite once
bun run build     # create the production bundle in build/
bun run preview   # preview the production bundle
```

For Cloudflare Pages, use Bun 1.3.6 with `bun run build` as the build command and
`build` as the output directory. The build script installs from `bun.lock` with a
frozen lockfile, so it also works when Pages has no separate install command. The
repository intentionally keeps `bun.lock` as its only dependency lockfile.
