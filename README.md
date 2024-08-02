# latex_lexer
## Markdown to LaTeX Converter

This project is a TypeScript-based lexer that converts Markdown input into LaTeX output. The lexer tokenizes the Markdown text, parses it into an Abstract Syntax Tree (AST), and then generates the corresponding LaTeX code.
To install dependencies:



## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation



To get started, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/shadmeoli/latex_lexer.git
cd latex_lexer
```

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Project Structure

```
latex_lexer/
├── src/
│   ├── lexer.ts
│   ├── parser.ts
│   ├── generator.ts
│   └── index.ts
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

- **src/lexer.ts**: Contains the lexer logic to tokenize Markdown input.
- **src/parser.ts**: Contains the parser logic to convert tokens into an AST.
- **src/generator.ts**: Contains the generator logic to convert the AST into LaTeX code.
- **src/index.ts**: Main entry point tying everything together.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow the coding style and include tests for any new features or bug fixes.

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a pull request
