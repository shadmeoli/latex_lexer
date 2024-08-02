import { TokenType } from "./tokens";
import type { Token } from "./interfaces";

export class Lexer {
  private input: string;
  private tokens: Token[];
  private buffer: string;
  private inInlineMath: boolean;
  private inBlockMath: boolean;

  constructor(input: string) {
    this.input = input;
    this.tokens = [];
    this.buffer = "";
    this.inInlineMath = false;
    this.inBlockMath = false;
  }

  public lex(): Token[] {
    for (const char of this.input) {
      this.processChar(char);
    }

    // Handle remaining text
    this.finalizeToken();

    return this.tokens;
  }

  private processChar(char: string): void {
    if (char === "$") {
      this.handleMathDelimiter();
    } else if (char === "\n") {
      this.handleLineBreak();
    } else {
      this.buffer += char;
    }
  }

  private handleMathDelimiter(): void {
    if (this.inInlineMath) {
      this.tokens.push({ type: TokenType.INLINE_MATH, value: this.buffer });
      this.buffer = "";
      this.inInlineMath = false;
    } else if (this.inBlockMath) {
      this.tokens.push({ type: TokenType.BLOCK_MATH, value: this.buffer });
      this.buffer = "";
      this.inBlockMath = false;
    } else {
      if (this.buffer.trim().length > 0) {
        this.tokens.push({ type: TokenType.PARAGRAPH, value: this.buffer });
        this.buffer = "";
      }
      this.inInlineMath = !this.inInlineMath;
    }
  }

  private handleLineBreak(): void {
    if (this.buffer.endsWith("$$")) {
      if (this.inBlockMath) {
        this.tokens.push({
          type: TokenType.BLOCK_MATH,
          value: this.buffer.slice(0, -2),
        });
        this.buffer = "";
        this.inBlockMath = false;
      } else {
        this.inBlockMath = true;
      }
    } else {
      if (this.buffer.trim().length > 0) {
        this.tokens.push({ type: TokenType.PARAGRAPH, value: this.buffer });
        this.buffer = "";
      }
      this.tokens.push({ type: TokenType.LINE_BREAK, value: "\n" });
    }
  }

  private finalizeToken(): void {
    if (this.buffer) {
      if (this.inInlineMath) {
        this.tokens.push({ type: TokenType.INLINE_MATH, value: this.buffer });
      } else if (this.inBlockMath) {
        this.tokens.push({ type: TokenType.BLOCK_MATH, value: this.buffer });
      } else {
        this.tokens.push({ type: TokenType.PARAGRAPH, value: this.buffer });
      }
    }
  }
}
