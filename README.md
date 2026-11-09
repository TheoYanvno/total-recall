# 🧠 TotalRecall

React flashcards for studying programming. Decks cover the terms you meet when learning web development, and spaced repetition brings each card back right before you'd forget it.

**Try it:** https://theoyanvno.github.io/total-recall/

## Features

- **7 built-in decks, 60 cards:** setup and GitHub, HTML and CSS, JavaScript basics, React basics, Python, SQL, and servers and data. Many cards have a short code example on the back.
- **Spaced repetition:** rate each card Again, Hard, Good or Easy. SM-2 style intervals and ease decide when it comes back. The study queue shows due cards first, then new ones.
- **Keyboard-friendly study:** Space flips a card and keys 1–4 rate it. Tapping works too.
- **Progress saved in the browser:** day streak, cards reviewed today, and how many cards are new, learning or known well. Bad saved data starts fresh instead of breaking the app.
- **Share decks as JSON:** export any deck, import a deck file, and remove imported decks. Imports are checked field by field, trimmed to sensible sizes and given ids that can't clash with built-in cards.

## Run it

```bash
npm install
npm start      # build and serve locally
npm test       # Node's test runner
npm run build  # build into docs/ for GitHub Pages
```

## Deck file format

```json
{
  "title": "Git",
  "cards": [
    { "term": "rebase", "back": "Replay commits on top of a new base.", "example": "git rebase main" }
  ]
}
```

Files exported from the app use the same cards inside `{ "format": "total-recall-deck", "version": 1, "deck": { ... } }`. Both shapes import.

## Built with

React, JavaScript, esbuild, Node's test runner, GitHub Pages

## Credits

Built with help from AI coding tools; every feature is reviewed and tested before it ships.

## License

MIT. See [LICENSE](LICENSE).
