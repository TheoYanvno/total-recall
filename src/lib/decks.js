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
  {
    id: 'reactbasics',
    title: 'React basics',
    lesson: 'reactbasics',
    blurb: 'Components, props, state and effects: how a React app is put together.',
    cards: [
      { id: 'react-component', term: 'Component', back: 'A function that returns what part of the page should look like. Names start with a capital letter.', example: 'function Hello({ name }) {\n  return <p>Hello, {name}</p>;\n}' },
      { id: 'react-jsx', term: 'JSX', back: 'HTML-like syntax inside JavaScript that React turns into page elements. Use className instead of class.', example: '<button className="primary">Save</button>' },
      { id: 'react-props', term: 'Props', back: 'Values a parent passes into a component. They are read-only inside it.', example: '<Card title="Pantry" count={3} />' },
      { id: 'react-state', term: 'State (useState)', back: 'A value a component remembers between renders. Changing it with its setter redraws the component.', example: 'const [count, setCount] = useState(0);' },
      { id: 'react-effect', term: 'useEffect', back: 'Runs code after a render, such as fetching data or adding a listener, and can return a cleanup.', example: 'useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);' },
      { id: 'react-key', term: 'key', back: 'A stable id on each item in a list so React can tell items apart when the list changes.', example: 'items.map(i => <li key={i.id}>{i.name}</li>)' },
      { id: 'react-immutable', term: 'Immutable update', back: 'Make a new array or object instead of changing the old one, so React notices the change.', example: 'setTodos(old => [...old, newTodo]);' },
      { id: 'react-lifting', term: 'Lifting state up', back: 'Moving state to the closest shared parent so two components can use the same value.' },
    ],
  },
  {
    id: 'python',
    title: 'Python',
    lesson: 'python',
    blurb: 'The Python behind the Bonfire Notes and Phone Number Lookup lessons.',
    cards: [
      { id: 'py-list', term: 'List', back: 'An ordered, changeable collection.', example: 'fruits = ["apple", "pear"]\nfruits.append("fig")' },
      { id: 'py-dict', term: 'Dictionary', back: 'Key-value pairs for looking things up by name.', example: 'ages = {"ada": 36}\nages["ada"]  # 36' },
      { id: 'py-comprehension', term: 'List comprehension', back: 'A short way to build a list from another one.', example: 'squares = [n * n for n in range(5)]' },
      { id: 'py-function', term: 'def', back: 'Defines a function. Indentation marks the body.', example: 'def greet(name):\n    return f"Hi, {name}"' },
      { id: 'py-fstring', term: 'f-string', back: 'A string with values filled in from {braces}.', example: 'f"{count} new posts"' },
      { id: 'py-try', term: 'try / except', back: 'Runs code and handles a specific error instead of crashing.', example: 'try:\n    n = int(text)\nexcept ValueError:\n    n = 0' },
      { id: 'py-with', term: 'with', back: 'Opens something (like a file) and closes it automatically when the block ends.', example: 'with open("notes.md") as f:\n    text = f.read()' },
      { id: 'py-unittest', term: 'unittest', back: 'Python\'s built-in testing library: test methods use asserts to check results.', example: 'self.assertEqual(add(2, 2), 4)' },
    ],
  },
  {
    id: 'sql',
    title: 'SQL',
    lesson: 'sql',
    blurb: 'Tables, queries and joins from the Marvel and Gotham lessons.',
    cards: [
      { id: 'sql-table', term: 'Table', back: 'Rows of records with the same named columns, like a spreadsheet with rules.' },
      { id: 'sql-pk', term: 'Primary key', back: 'A column (or columns) that uniquely identifies each row.', example: 'id INTEGER PRIMARY KEY' },
      { id: 'sql-fk', term: 'Foreign key', back: 'A column that points to a row in another table, linking them.', example: 'patient_id INTEGER REFERENCES patients(id)' },
      { id: 'sql-select', term: 'SELECT … WHERE', back: 'Reads rows, keeping only those that match a condition.', example: 'SELECT name FROM heroes WHERE team = \'Avengers\';' },
      { id: 'sql-join', term: 'JOIN', back: 'Combines rows from two tables where their linked columns match.', example: 'SELECT h.name, t.title\nFROM heroes h JOIN appearances a ON a.hero_id = h.id\nJOIN titles t ON t.id = a.title_id;' },
      { id: 'sql-groupby', term: 'GROUP BY', back: 'Groups rows that share a value so you can count or total each group.', example: 'SELECT team, COUNT(*) FROM heroes GROUP BY team;' },
      { id: 'sql-having', term: 'HAVING', back: 'Filters groups after GROUP BY (WHERE filters rows before it).', example: '... GROUP BY hero_id HAVING COUNT(*) > 5;' },
      { id: 'sql-params', term: 'Parameterized query', back: 'Placeholders for user input so it is never treated as SQL, which prevents SQL injection.', example: 'db.execute("SELECT * FROM users WHERE email = ?", (email,))' },
    ],
  },
  {
    id: 'web',
    title: 'Servers and data',
    lesson: 'nodeserver',
    blurb: 'Requests, JSON and saving data, from the Node server and storage lessons.',
    cards: [
      { id: 'web-http', term: 'HTTP request', back: 'A message a browser sends a server: a method (GET, POST…), a path, headers and sometimes a body.' },
      { id: 'web-status', term: 'Status code', back: 'A number in the response: 200 OK, 404 not found, 401 not signed in, 403 not allowed, 500 server error.' },
      { id: 'web-json', term: 'JSON', back: 'Text format for data that looks like JavaScript objects and arrays.', example: '{ "name": "Ada", "tags": ["math"] }' },
      { id: 'web-fetch', term: 'fetch', back: 'The browser function for making requests. It returns a promise; check res.ok before using the data.', example: 'const res = await fetch(url);\nif (!res.ok) throw new Error(res.status);\nconst data = await res.json();' },
      { id: 'web-async', term: 'async / await', back: 'Lets you write code that waits for promises (like fetch) as if it ran top to bottom.' },
      { id: 'web-localstorage', term: 'localStorage', back: 'Small key-value storage in the browser that survives reloads. Store strings, so use JSON.stringify and JSON.parse.' },
      { id: 'web-cookie', term: 'Session cookie', back: 'A small value the server sets after sign-in so later requests are recognized. HttpOnly keeps page scripts from reading it.' },
      { id: 'web-hash', term: 'Password hashing', back: 'Storing a slow, salted one-way hash (like scrypt or PBKDF2) instead of the password itself.' },
    ],
  }
];

// Every card in every deck, in one list.
export function allCards(decks = DECKS) {
  return decks.flatMap(deck => deck.cards.map(card => ({ ...card, deckId: deck.id })));
}

export function findDeck(id, decks = DECKS) {
  return decks.find(deck => deck.id === id) || null;
}
