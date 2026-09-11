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

Copy `.env.example` to `.env.local` and provide the provider credentials needed by the pages you use. Vite embeds `VITE_*` values into the browser build, so use provider keys restricted to the app’s allowed origins and rotate any credentials that were previously committed.

### Commands

```sh
bun install
bun run dev       # start the development server
bun run test      # run the test suite once
bun run build     # create the production bundle in build/
bun run preview   # preview the production bundle
```
