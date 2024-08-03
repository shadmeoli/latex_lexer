import { TokenType } from "./tokens";
import type { Token } from "./interfaces";

export class Lexer {
  private input: string;
  private position: number = 0;
  private tokens: Token[] = [];

  constructor(input: string) {
    this.input = input;
  }

  public lex(): Token[] {
    while (this.position < this.input.length) {
      const char = this.input[this.position];

      if (char === "#") {
        this.lexHeader();
      } else if (char === "*" || char === "_") {
        this.lexEmphasis();
      } else if (char === "`") {
        this.lexCode();
      } else if (char === "[") {
        this.lexLink();
      } else if (char === "!") {
        this.lexImage();
      } else if (char === ">") {
        this.lexBlockquote();
      } else if (char === "-" || char === "+" || char === "*") {
        this.lexList();
      } else if (char === "|") {
        this.lexTable();
      } else if (char === "$") {
        this.lexMath();
      } else if (char === "\n") {
        this.tokens.push({ type: TokenType.LINE_BREAK, value: "\n" });
        this.position++;
      } else {
        this.lexParagraph();
      }
    }

    return this.tokens;
  }

  private lexHeader(): void {
    let level = 0;
    while (this.input[this.position] === "#") {
      level++;
      this.position++;
    }
    const content = this.readUntil("\n").trim();
    this.tokens.push({ type: TokenType.HEADER, value: `${level}:${content}` });
  }

  private lexEmphasis(): void {
    const marker = this.input[this.position];
    const isDouble = this.input[this.position + 1] === marker;
    this.position += isDouble ? 2 : 1;
    const content = this.readUntil(isDouble ? marker + marker : marker);
    this.tokens.push({
      type: isDouble ? TokenType.BOLD : TokenType.ITALIC,
      value: content,
    });
  }

  private lexCode(): void {
    if (this.input.startsWith("```", this.position)) {
      this.lexCodeBlock();
    } else {
      this.position++; // Skip opening backtick
      const content = this.readUntil("`");
      this.tokens.push({ type: TokenType.CODE, value: content });
    }
  }

  private lexCodeBlock(): void {
    this.position += 3; // Skip opening ```
    const language = this.readUntil("\n").trim();
    const content = this.readUntil("```");
    this.position += 3; // Skip closing ```
    this.tokens.push({
      type: TokenType.CODE_BLOCK,
      value: `${language}:${content}`,
    });
  }

  private lexLink(): void {
    this.position++; // Skip opening bracket
    const text = this.readUntil("]");
    this.position += 2; // Skip "]("
    const url = this.readUntil(")");
    this.position++; // Skip closing parenthesis
    this.tokens.push({ type: TokenType.LINK, value: `${text}|${url}` });
  }

  private lexImage(): void {
    this.position += 2; // Skip "!["
    const alt = this.readUntil("]");
    this.position += 2; // Skip "]("
    const src = this.readUntil(")");
    this.position++; // Skip closing parenthesis
    this.tokens.push({ type: TokenType.IMAGE, value: `${alt}|${src}` });
  }

  private lexBlockquote(): void {
    let content = "";
    while (
      this.position < this.input.length &&
      this.input[this.position] === ">"
    ) {
      this.position++; // Skip '>'
      content += this.readUntil("\n").trim() + "\n";
      this.position++; // Skip newline
    }
    this.tokens.push({ type: TokenType.BLOCKQUOTE, value: content.trim() });
  }

  private lexList(): void {
    const char = this.input[this.position];
    let type: string;
    if (char === "-") {
      type = TokenType.UNORDERED_LIST;
    } else {
      type = TokenType.ORDERED_LIST;
    }
    this.position++;
    if (this.input[this.position] === " ") {
      if (
        this.input[this.position + 1] === "[" &&
        this.input[this.position + 2] === "]"
      ) {
        this.position += 3; // Skip "[ ]"
        const content = this.readUntil("\n").trim();
        this.tokens.push({ type: TokenType.TODO_ITEM, value: content });
      } else {
        const content = this.readUntil("\n").trim();
        this.tokens.push({ type: TokenType.LIST_ITEM, value: content });
      }
    }

    if (type === TokenType.UNORDERED_LIST || type === TokenType.ORDERED_LIST) {
      this.tokens.push({ type, value: "" });
    }
  }

  private lexTable(): void {
    let rows = [];
    while (
      this.position < this.input.length &&
      this.input[this.position] === "|"
    ) {
      const row = this.readUntil("\n").trim();
      rows.push(row);
      this.position++; // Skip newline
      if (this.input[this.position] !== "|") break;
    }
    this.tokens.push({ type: TokenType.TABLE, value: rows.join("\n") });
  }

  private lexMath(): void {
    if (this.input[this.position + 1] === "$") {
      this.position += 2; // Skip opening $$
      const content = this.readUntil("$$");
      this.position += 2; // Skip closing $$
      this.tokens.push({ type: TokenType.BLOCK_MATH, value: content });
    } else {
      this.position++; // Skip opening $
      const content = this.readUntil("$");
      this.position++; // Skip closing $
      this.tokens.push({ type: TokenType.INLINE_MATH, value: content });
    }
  }

  private lexParagraph(): void {
    const content = this.readUntil("\n");
    this.tokens.push({ type: TokenType.PARAGRAPH, value: content });
  }

  private readUntil(delimiter: string): string {
    const start = this.position;
    while (
      this.position < this.input.length &&
      !this.input.startsWith(delimiter, this.position)
    ) {
      this.position++;
    }
    const content = this.input.slice(start, this.position);
    this.position += delimiter.length;
    return content;
  }
}
