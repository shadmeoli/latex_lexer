import { TokenType } from "./tokens";
import type { Token } from "./interfaces/index";

export class Generator {
  private tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public generate(): string {
    return this.tokens.map((token) => this.tokenToLaTeX(token)).join("\n");
  }

  private tokenToLaTeX(token: Token): string {
    switch (token.type) {
      case TokenType.HEADER:
        return this.handleHeader(token.value);
      case TokenType.PARAGRAPH:
        return this.handleParagraph(token.value);
      case TokenType.BOLD:
        return this.handleBold(token.value);
      case TokenType.ITALIC:
        return this.handleItalic(token.value);
      case TokenType.STRIKETHROUGH:
        return this.handleStrikethrough(token.value);
      case TokenType.CODE:
        return this.handleCode(token.value);
      case TokenType.CODE_BLOCK:
        return this.handleCodeBlock(token.value);
      case TokenType.BLOCKQUOTE:
        return this.handleBlockquote(token.value);
      case TokenType.ORDERED_LIST:
        return this.handleOrderedList(token.value);
      case TokenType.UNORDERED_LIST:
        return this.handleUnorderedList(token.value);
      case TokenType.LINK:
        return this.handleLink(token.value);
      case TokenType.IMAGE:
        return this.handleImage(token.value);
      case TokenType.HORIZONTAL_RULE:
        return this.handleHorizontalRule(token.value);
      case TokenType.INLINE_MATH:
        return this.handleInlineMath(token.value);
      case TokenType.BLOCK_MATH:
        return this.handleBlockMath(token.value);
      case TokenType.TABLE:
        return this.handleTable(token.value);
      case TokenType.LINE_BREAK:
        return "\\newline"; // LaTeX command for a line break
      case TokenType.HTML:
        return this.handleHTML(token.value);
      case TokenType.FOOTNOTE:
        return this.handleFootnote(token.value);
      case TokenType.TASK_LIST:
        return this.handleTaskList(token.value);
      case TokenType.DEFINITION_LIST:
        return this.handleDefinitionList(token.value);
      case TokenType.DEFINITION_TERM:
        return this.handleDefinitionTerm(token.value);
      case TokenType.DEFINITION_DESCRIPTION:
        return this.handleDefinitionDescription(token.value);
      default:
        return ""; // Default case for unknown token types
    }
  }

  private handleHeader(value: string): string {
    const level = value.match(/^#+/)?.[0].length || 1;
    const content = value.replace(/^#+\s*/, "");
    return `\\section{${content}}`; // Adjust to \\section*{...} for unnumbered sections if needed
  }

  private handleParagraph(value: string): string {
    return `${value}\n\n`; // Paragraphs are separated by a blank line in LaTeX
  }

  private handleBold(value: string): string {
    return `\\textbf{${value}}`;
  }

  private handleItalic(value: string): string {
    return `\\textit{${value}}`;
  }

  private handleStrikethrough(value: string): string {
    return `\\sout{${value}}`;
  }

  private handleCode(value: string): string {
    return `\\texttt{${value}}`;
  }

  private handleCodeBlock(value: string): string {
    return `\\begin{verbatim}${value}\\end{verbatim}`;
  }

  private handleBlockquote(value: string): string {
    return `\\begin{quote}${value}\\end{quote}`;
  }

  private handleOrderedList(value: string): string {
    return `\\begin{enumerate}\n${this.handleListItems(value)}\\end{enumerate}`;
  }

  private handleUnorderedList(value: string): string {
    return `\\begin{itemize}\n${this.handleListItems(value)}\\end{itemize}`;
  }

  private handleListItems(value: string): string {
    return value
      .split("\n")
      .map((item) => `\\item ${item}`)
      .join("\n");
  }

  private handleLink(value: string): string {
    const match = value.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (match) {
      return `\\href{${match[2]}}{${match[1]}}`;
    }
    return "";
  }

  private handleImage(value: string): string {
    const match = value.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (match) {
      return `\\includegraphics[width=\\textwidth]{${match[2]}}`;
    }
    return "";
  }

  private handleHorizontalRule(value: string): string {
    return "\\hrulefill";
  }

  private handleInlineMath(value: string): string {
    return `$${value}$`;
  }

  private handleBlockMath(value: string): string {
    return `\\[\n${value}\n\\]`;
  }

  private handleTable(value: string): string {
    // Implement LaTeX table generation
    return `\\begin{tabular}{|l|l|}\n${value}\\end{tabular}`;
  }

  private handleHTML(value: string): string {
    // Basic HTML handling (may need further implementation)
    return value;
  }

  private handleFootnote(value: string): string {
    // Handle footnotes if needed
    return value;
  }

  private handleTaskList(value: string): string {
    // Handle task lists if needed
    return value;
  }

  private handleDefinitionList(value: string): string {
    // Handle definition lists if needed
    return value;
  }

  private handleDefinitionTerm(value: string): string {
    // Handle definition terms if needed
    return value;
  }

  private handleDefinitionDescription(value: string): string {
    // Handle definition descriptions if needed
    return value;
  }
}
