# CLAUDE.md — Project Conventions

## Branch Naming

Format: `<type>/<short-description>`

| Type | When to use |
|------|-------------|
| `feat` | new feature or capability |
| `fix` | bug fix |
| `chore` | maintenance, dependencies, config |
| `docs` | documentation only |
| `refactor` | code restructuring, no behavior change |

Examples:
- `feat/typespec-api-contract`
- `fix/booking-conflict-validation`
- `chore/update-typespec-deps`

Rules:
- lowercase, hyphen-separated words
- no slashes beyond the type prefix
- keep it under ~40 characters

## Commit Messages

Format: `<type>(<scope>): <short imperative description>`

Scope is optional but recommended when touching a specific area (e.g. `api`, `bookings`, `slots`).

Examples:
- `feat(api): add TypeSpec contract for calendar booking`
- `fix(bookings): reject overlapping time windows`
- `chore: add .gitignore and package.json`
- `docs: update README with setup instructions`

Rules:
- present tense, imperative mood ("add" not "added")
- no period at the end
- body (optional): blank line after subject, then explain *why* not *what*

## What to commit

- Source files: `api.tsp`, `tspconfig.yaml`, `package.json`, `package-lock.json`
- Generated output: `tsp-output/` (commit the generated OpenAPI spec alongside the source)
- Never commit: `node_modules/`

## Pull Requests

### Title

Same format as commit messages: `<type>(<scope>): <short imperative description>`

Examples:
- `feat(api): add TypeSpec contract for calendar booking`
- `fix(bookings): reject overlapping time windows`

Rules:
- under 72 characters
- present tense, imperative mood
- no period at the end

### Body structure

```
## Summary
- <bullet: what changed and why>

## Changes
- <bullet per logical change>

## Test plan
- [ ] <manual or automated verification step>
```

Rules:
- **Summary** — 1–3 bullets explaining *why* the change exists, not just *what* it does
- **Changes** — enumerate the significant files / areas touched
- **Test plan** — at minimum one checkbox; use `[x]` for already-verified steps
- Keep the body focused; avoid repeating the commit history verbatim
