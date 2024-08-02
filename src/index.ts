import { Lexer } from "./lexer";
import { TokenType } from "./tokens";

const markdown = `
# Title
This is a paragraph.

$$
E = mc^2
$$

Inline math: $a^2 + b^2 = c^2$
`;

const lexer = new Lexer(markdown);
const tokens = lexer.lex();

console.log(tokens);
