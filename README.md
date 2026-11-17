# CIS 1600 Midterm 2 Studio

A Next.js study app for CIS 1600 Midterm 2 (Thursday, November 19).

## Run it

    npm install
    npm run dev        # then open http://localhost:3000

For Quick proof, copy `.env.local.example` to `.env.local` and set `OPENROUTER_API_KEY`. The key is used only by the server route `app/api/proof-check`, so it never reaches the browser.

## What's inside

- **Home** (`/`): a study path. Pick a topic on the left, then work its 51 core problems easiest first, with hints, solutions, and "Got it, next".
- **Problem bank** (`/practice`): browse and filter the 51 core problems, with keyboard shortcuts.
- **Quick exam** (`/quick`): one problem at a time from the hidden bank plus generated variants. It tracks what you've seen and lets you retry misses.
- **Quick proof** (`/proof`): sketch the idea of a proof, and Gemini Flash (via OpenRouter) says how close it is to a working proof.
- **Mock exam** (`/mock`): 8 problems in 90 minutes, drawn from the hidden bank and generators.
- **Flashcards** (`/flashcards`): Leitner-box review of definitions and theorems.

## Content

- `lib/questions.js`: the 51 core problems shown on the home page and in the problem bank.
- `lib/bank/*.js`: the hidden bank. Original problems used only by the quick exam, quick proof, and mock.
- `lib/generators.js`: parametric templates (Bayes, inclusion–exclusion, indicators, Chebyshev, degree sequences, Hall violators, and more). Answers are computed, so every variant is correct, and there is no limit to how many you can generate.
- `docs/exam-context.md`: scope, key results, and exam style.

Progress is saved in your browser's localStorage. All problems are original and written in the course's style. Check solutions against your lecture notes.
