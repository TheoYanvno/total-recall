// The built-in decks. Each deck follows one CodeForge lesson, so the terms match what that lesson teaches.
// A card has a term on the front and a short definition plus an optional code example on the back.

export const DECKS = [
  {
    id: 'setup',
    title: 'Setup and GitHub',
    lesson: 'setup',
    blurb: 'The tools and words you meet before writing your first line of code.',
    cards: [
      { id: 'setup-terminal', term: 'Terminal', back: 'A text window where you type commands for the computer to run, like starting a project or installing a package.', example: 'npm install' },
      { id: 'setup-editor', term: 'Code editor', back: 'An app for writing code with colors, autocomplete and error hints. VS Code is a common one.' },
      { id: 'setup-repo', term: 'Repository (repo)', back: 'A project folder tracked by Git, with the full history of every change.' },
      { id: 'setup-commit', term: 'Commit', back: 'A saved snapshot of your changes with a message that says what changed and why.', example: 'git commit -m "Add the login form"' },
      { id: 'setup-push', term: 'Push', back: 'Sending your local commits up to a remote copy of the repo, such as GitHub.', example: 'git push origin main' },
      { id: 'setup-branch', term: 'Branch', back: 'A separate line of work in a repo, so you can try something without touching the main version.', example: 'git switch -c new-feature' },
      { id: 'setup-readme', term: 'README', back: 'The front page of a repo: what the project is, how to run it and how it was built.' },
      { id: 'setup-pages', term: 'GitHub Pages', back: 'Free hosting from GitHub that serves the files in a repo as a website.' },
    ],
  },
  {
    id: 'htmlcss',
    title: 'HTML and CSS',
    lesson: 'htmlcss',
    blurb: 'How a page is built (HTML) and how it looks (CSS).',
    cards: [
      { id: 'html-element', term: 'Element', back: 'One piece of a page, written as an opening tag, content and a closing tag.', example: '<p>Hello</p>' },
      { id: 'html-attribute', term: 'Attribute', back: 'Extra information on an opening tag, written as name="value".', example: '<img src="cat.png" alt="A sleeping cat">' },
      { id: 'html-semantic', term: 'Semantic HTML', back: 'Tags that say what content is (header, nav, main, button) so browsers and screen readers understand the page.' },
      { id: 'html-alt', term: 'alt text', back: 'A short description of an image for people who can\'t see it, read aloud by screen readers.' },
      { id: 'css-selector', term: 'Selector', back: 'The part of a CSS rule that picks which elements the styles apply to.', example: '.card h2 { color: purple; }' },
      { id: 'css-boxmodel', term: 'Box model', back: 'Every element is a box made of content, padding, border and margin, from the inside out.' },
      { id: 'css-flexbox', term: 'Flexbox', back: 'A CSS layout that lines items up in a row or column and spreads out the space between them.', example: '.row { display: flex; gap: 12px; }' },
      { id: 'css-grid', term: 'CSS Grid', back: 'A CSS layout for rows and columns at the same time.', example: '.cards { display: grid; grid-template-columns: repeat(3, 1fr); }' },
      { id: 'css-media', term: 'Media query', back: 'A CSS rule that only applies at certain screen sizes, used to make pages work on phones.', example: '@media (max-width: 600px) { .menu { display: none; } }' },
      { id: 'css-variable', term: 'CSS variable', back: 'A named value you set once and reuse, handy for colors and themes.', example: ':root { --accent: #a78bfa; }\nbutton { background: var(--accent); }' },
    ],
  },
  {
    id: 'jsbasics',
    title: 'JavaScript basics',
    lesson: 'jsbasics',
    blurb: 'Values, functions and the DOM: the core of every interactive page.',
    cards: [
      { id: 'js-variable', term: 'Variable', back: 'A name that holds a value. Use const when it never changes and let when it does.', example: 'const name = "Ada";\nlet score = 0;' },
      { id: 'js-function', term: 'Function', back: 'A reusable block of code that can take inputs (parameters) and give back a result.', example: 'function add(a, b) {\n  return a + b;\n}' },
      { id: 'js-arrow', term: 'Arrow function', back: 'A shorter way to write a function.', example: 'const double = n => n * 2;' },
      { id: 'js-array', term: 'Array', back: 'An ordered list of values, counted from 0.', example: 'const colors = ["red", "green"];\ncolors[0]; // "red"' },
      { id: 'js-object', term: 'Object', back: 'A group of named values (properties).', example: 'const user = { name: "Ada", age: 36 };\nuser.name; // "Ada"' },
      { id: 'js-map', term: 'Array map', back: 'Makes a new array by running a function on every item.', example: '[1, 2, 3].map(n => n * 10); // [10, 20, 30]' },
      { id: 'js-filter', term: 'Array filter', back: 'Makes a new array with only the items that pass a test.', example: '[1, 2, 3, 4].filter(n => n % 2 === 0); // [2, 4]' },
      { id: 'js-dom', term: 'DOM', back: 'The page as objects JavaScript can read and change.', example: 'document.querySelector("h1").textContent = "Hi";' },
      { id: 'js-event', term: 'Event listener', back: 'Code that runs when something happens, like a click or a key press.', example: 'button.addEventListener("click", save);' },
      { id: 'js-strict', term: 'Strict equality (===)', back: 'Compares value and type without converting, so "1" === 1 is false. Prefer it over ==.' },
    ],
  },
];

// Every card in every deck, in one list.
export function allCards(decks = DECKS) {
  return decks.flatMap(deck => deck.cards.map(card => ({ ...card, deckId: deck.id })));
}

export function findDeck(id, decks = DECKS) {
  return decks.find(deck => deck.id === id) || null;
}
