[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=21824133)
# Tic-Tac-Toe

This is a minimal Tic-Tac-Toe implementation using React 18 functional components and hooks. It follows the requirements: Player vs Player and Player vs Bot modes, simple bot logic, win/draw detection, and a small, readable component structure.

## How to run

This project is ready to run immediately with Parcel as the bundler.

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm start
```

The app will open at `http://localhost:1234`.

## Project structure

- `src/App.js` — Main app with all components and game logic
- `src/index.js` — React 18 entry point
- `src/index.css` — Minimal styling
- `public/index.html` — HTML template

## Notes

- The main implementation is in `src/App.js`.
- `calculateWinner` and `getBotMove` are implemented as pure functions and exported for testing or reuse.
- The code is purposely simple and commented for teaching.
- Uses Parcel for zero-config bundling.
