# Repository Guidance

## Architecture

- This repository is a static, single-page portfolio built with HTML, CSS, and vanilla JavaScript.
- Do not introduce React, Tailwind, Node.js, npm, bundlers, TypeScript, or other frameworks or tools unless explicitly requested.
- Preserve the existing structure and relative file paths.

## Files and Structure

- `index.html` is the main entry point.
- `P-P.css` contains the site's styling.
- `script/P-P.js` contains JavaScript behavior.
- `logo/` contains image assets.
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
- Since this project has no build system or test suite, use appropriate static checks and run a local static server when visual verification is needed.
- Report any checks that could not be performed.

## Communication

- Before significant changes, briefly explain the plan.
- When finished, summarize files changed, what was changed, and how it was verified.
- If requirements are ambiguous or a change could have significant architectural consequences, ask before proceeding.

## Design

- Preserve the existing visual language unless explicitly requested to redesign it.
- Favor clean, accessible, responsive, production-quality implementation.
- Avoid unnecessary complexity.
