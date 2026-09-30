# German Helper

German Helper is a local vocabulary-learning web app for practicing German words with Hungarian translations. Add and edit nouns, verbs, and other words; record noun plurals and verb forms; organize vocabulary by lesson date; and practice with shuffled German-to-Hungarian or Hungarian-to-German flashcards. Practice sessions let you mark words as learned or still to learn.

The app has a React and TypeScript frontend and a small local Express API. Vocabulary is stored as JSON in `data/vocabulary.json`, so no database or external service is required. The API listens on your computer only by default.

## Requirements

- Windows 10 or Windows 11
- Node.js 22 LTS (includes npm). Install it from [nodejs.org](https://nodejs.org/), then reopen your terminal.
- Git for Windows, if you want to clone the project using Git. Alternatively, download and extract the repository as a ZIP.

No separate database, global React/Vite installation, or environment file is needed. Project dependencies are listed in `package.json` and installed locally in the next steps.

## Set up and run on Windows

1. Install Node.js 22 LTS from [nodejs.org](https://nodejs.org/). To check the installation, open PowerShell and run:

   ```powershell
   node --version
   npm --version
   ```

   If PowerShell says running scripts is disabled when you use `npm`, use `npm.cmd` in place of `npm` for the commands below. This avoids changing your PowerShell execution policy.

2. Get the project files. To use Git, open PowerShell in the folder where you want the project and run:

   ```powershell
   git clone <repository-url>
   cd german-helper
   ```

   Replace `<repository-url>` with the clone URL for this repository. Or download the repository ZIP from GitHub and extract it, then open PowerShell in the extracted `german-helper` folder.

3. Install the project dependencies:

   ```powershell
   npm install
   ```

   If needed, use `npm.cmd install`.

4. Start the app and its local API together:

   ```powershell
   npm run dev
   ```

   If needed, use `npm.cmd run dev`. Keep this terminal open while using the app.

5. Open the local address printed by Vite in the terminal, usually [http://localhost:5173](http://localhost:5173). The API runs at `http://127.0.0.1:3001`. Use **Ctrl+C** in the terminal to stop both development servers.

## Useful commands

Run these from the project folder:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the frontend and local vocabulary API for development |
| `npm run build` | Type-check and create a production frontend build in `dist/` |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production frontend build |

On Windows PowerShell, prefix a command with `npm.cmd` if calling `npm` is blocked by the script execution policy. For example, `npm.cmd run build`.

## Vocabulary data

The API reads and writes `data/vocabulary.json`. Changes made in the app are saved there and remain available after restarting the development servers. Back up this file regularly if you want to protect your vocabulary. Do not edit it while the app is actively saving changes.
