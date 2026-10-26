# Repository Guidance

## Architecture

- This repository is a single-page portfolio built with React 18 and Vite, deployed to GitHub Pages by `.github/workflows/deploy.yml`.
- Styling is plain CSS in `P-P.css`, imported from `src/main.jsx`. Three.js is used for the optional 3D background.
- Do not introduce Tailwind, TypeScript, CSS-in-JS, UI/component libraries, or other frameworks or tools unless explicitly requested.
- Do not add new dependencies without asking.
- Preserve the existing structure and relative file paths (`base: "./"` in `vite.config.js`).

## Files and Structure

- `index.html` is the Vite entry; it mounts `#root` and loads `src/main.jsx`. Page metadata and fonts live here.
- `src/App.jsx` composes the page sections; `src/components/` holds components (`Header`, `ProjectCard`, `Scene3D`).
- `src/data/portfolio.js` holds profile, experience, skills, and project content. Edit content here rather than in JSX.
- `P-P.css` contains the site's styling.
- `assets/` and `logo/` contain image assets.
- `script/P-P.js` is legacy from the static version and is no longer loaded by `index.html`.
- `dist/` is build output; do not edit it by hand.
- Keep these paths working unless a task explicitly requires restructuring.

## Development Approach

- Inspect existing code before modifying it.
- Prefer small, focused changes over unnecessary rewrites.
- Reuse existing styles, classes, and JavaScript patterns where practical.
- Do not modify unrelated sections or files.
- Do not remove existing functionality unless explicitly requested.

## Accessibility

- Preserve semantic HTML.
- Preserve keyboard navigation and visible focus states.
- Preserve the skip-navigation mechanism.
- Preserve appropriate ARIA attributes on interactive elements.
- Preserve reduced-motion support.
- Ensure new interactive elements are keyboard accessible.

## Responsive Design

- Maintain the existing responsive/mobile-first approach.
- Test changes at both mobile and desktop viewport sizes.
- Do not introduce horizontal scrolling or break existing layouts.

## External Links and Security

- Preserve `target="_blank"` with `rel="noopener"` for external links where appropriate.
- Never add credentials, API keys, passwords, tokens, or other secrets to the repository.

## Git Discipline

- Before making changes, inspect `git status`.
- Keep changes focused on the requested task.
- Never reset, delete, overwrite, or discard existing user work without explicit permission.
- Before finishing, inspect the diff and report what changed.
- Do not commit changes unless explicitly requested.

## Verification

- After changes, inspect the affected files.
- There is no test suite. Run `npm run build` to verify the app compiles, and `npm run dev` or `npm run preview` when visual verification is needed.
- Report any checks that could not be performed.

## Communication

- Before significant changes, briefly explain the plan.
- When finished, summarize files changed, what was changed, and how it was verified.
- If requirements are ambiguous or a change could have significant architectural consequences, ask before proceeding.

## Design

- Preserve the existing visual language unless explicitly requested to redesign it.
- Favor clean, accessible, responsive, production-quality implementation.
- Avoid unnecessary complexity.
