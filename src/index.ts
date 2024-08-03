import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { TokenType } from "./tokens";
import { Generator } from "./generator";
import type { ASTNode } from "./interfaces";
import type { Token } from "./interfaces";

export function convertMarkdownToLaTeX(markdown: string): string {
  const lexer = new Lexer(markdown);
  const tokens = lexer.lex();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const generator = new Generator(ast);
  return generator.generate();
}

const markdown = `
# Title
- [ ] A todo
Inline math: $a^2 + b^2 = c^2$
`;

const lexer = new Lexer(markdown);
const tokens = lexer.lex();
const parser = new Parser(tokens);
const ast = parser.parse(); // Parse the tokens into an AST
const generator = new Generator(ast);
const latex = generator.generate(); // Generate LaTeX from the AST

console.log("Tokens:", tokens);
console.log("AST:", ast);
console.log("LaTeX Output:\n", latex);
