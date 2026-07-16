# AESC Website

Static site for [www.aesc.co.in](https://www.aesc.co.in), built with Eleventy + Sanity.

## Local development

1. `nvm use` (Node 22)
2. `npm install`
3. `cp .env.example .env` and fill in Sanity credentials from https://sanity.io/manage
4. `npm run dev` — serves at http://localhost:8080

## Sanity Studio

Content editing UI. From project root: `cd studio && npm install && npm run dev` — opens at http://localhost:3333. Content schemas live in `studio/schemaTypes/`.

## Build + test

- `npm run build` — output to `dist/`
- `npm test` — runs Vitest suite (requires real `.env`)

## Phase status

Phase 1 (Foundations) — see `docs/superpowers/plans/2026-07-03-cms-phase-1-foundations.md`.
