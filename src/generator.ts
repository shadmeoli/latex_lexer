import { TokenType } from "./tokens";
import type { ASTNode } from "./interfaces";

export class Generator {
  private astNodes: ASTNode[];

  constructor(astNodes: ASTNode[]) {
    this.astNodes = astNodes;
  }

  public generate(): string {
    return this.astNodes.map((node) => this.nodeToLaTeX(node)).join("\n");
  }

  private nodeToLaTeX(node: ASTNode): string {
    switch (node.type) {
      case "Header":
        return this.handleHeader(node.content as string);
      case "Paragraph":
        return this.handleParagraph(node.content as string);
      case "Bold":
        return this.handleBold(node.content as string);
      case "Italic":
        return this.handleItalic(node.content as string);
      case "Code":
        return this.handleCode(node.content as string);
      case "CodeBlock":
        return this.handleCodeBlock(node.content as string);
      case "Link":
        return this.handleLink(node.content as { text: string; url: string });
      case "Image":
        return this.handleImage(node.content as { alt: string; src: string });
      case "Blockquote":
        return this.handleBlockquote(node.content as string);
      case "UnorderedList":
        return this.handleUnorderedList(node.children || []);
      case "OrderedList":
        return this.handleOrderedList(node.children || []);
      case "Table":
        return this.handleTable(node.content as string);
      case "InlineMath":
        return this.handleInlineMath(node.content as string);
      case "BlockMath":
        return this.handleBlockMath(node.content as string);
      case "LineBreak":
        return "\\\\";
      case "TaskList":
        return this.handleTaskList(node.content as string);
      default:
        return "";
    }
  }

  private handleHeader(value: string): string {
    const [level, content] = value.split(":");
    const headerCommand =
      [
        "\\section",
        "\\subsection",
        "\\subsubsection",
        "\\paragraph",
        "\\subparagraph",
      ][parseInt(level) - 1] || "\\section";
    return `${headerCommand}{${this.escapeLatex(content)}}`;
  }

  private handleParagraph(value: string): string {
    return `${this.escapeLatex(value)}\n\n`;
  }

  private handleBold(value: string): string {
    return `\\textbf{${this.escapeLatex(value)}}`;
  }

  private handleItalic(value: string): string {
    return `\\textit{${this.escapeLatex(value)}}`;
  }

  private handleCode(value: string): string {
    return `\\texttt{${this.escapeLatex(value)}}`;
  }

  private handleCodeBlock(value: string): string {
    const [language, code] = value.split(":");
    return `\\begin{lstlisting}[language=${language}]\n${code}\n\\end{lstlisting}`;
  }

  private handleLink(content: { text: string; url: string }): string {
    return `\\href{${content.url}}{${this.escapeLatex(content.text)}}`;
  }

  private handleImage(content: { alt: string; src: string }): string {
    return `\\begin{figure}[h]\n\\centering\n\\includegraphics[width=0.8\\textwidth]{${content.src}}\n\\caption{${this.escapeLatex(content.alt)}}\n\\end{figure}`;
  }

  private handleBlockquote(value: string): string {
    return `\\begin{quote}\n${this.escapeLatex(value)}\n\\end{quote}`;
  }

  private handleUnorderedList(children: ASTNode[]): string {
    const itemsLatex = children
      .map((child) => `\\item ${this.escapeLatex(child.content as string)}`)
      .join("\n");
    return `\\begin{itemize}\n${itemsLatex}\n\\end{itemize}`;
  }

  private handleOrderedList(children: ASTNode[]): string {
    const itemsLatex = children
      .map((child) => `\\item ${this.escapeLatex(child.content as string)}`)
      .join("\n");
    return `\\begin{enumerate}\n${itemsLatex}\n\\end{enumerate}`;
  }

  private handleTable(value: string): string {
    const rows = value.split("\n");
    const columnCount = rows[0].split("|").length - 2; // -2 for leading and trailing |
    const alignment = "c".repeat(columnCount);

    let latexTable = `\\begin{tabular}{${alignment}}\n\\hline\n`;
    rows.forEach((row, index) => {
      const cells = row.split("|").filter((cell) => cell.trim() !== "");
      latexTable +=
        cells.map((cell) => this.escapeLatex(cell.trim())).join(" & ") +
        " \\\\\n";
      if (index === 0 || index === rows.length - 1) {
        latexTable += "\\hline\n";
      }
    });
    latexTable += "\\end{tabular}";
    return latexTable;
  }

  private handleInlineMath(value: string): string {
    return `$${value}$`;
  }

  private handleBlockMath(value: string): string {
    return `\\[\n${value}\n\\]`;
  }

  private handleTaskList(value: string): string {
    const items = value.split("|");
    const itemsLatex = items
      .map((item) => {
        if (item.startsWith("- [ ]")) {
          return `\\item \\checkmark{} ${this.escapeLatex(item.slice(3).trim())}`;
        } else if (item.startsWith("- [x]")) {
          return `\\item \\checkmark[full] ${this.escapeLatex(item.slice(3).trim())}`;
        } else {
          return `\\item ${this.escapeLatex(item.trim())}`;
        }
      })
      .join("\n");
    return `\\begin{itemize}\n${itemsLatex}\n\\end{itemize}`;
  }

  private escapeLatex(text: string): string {
    const escapeChars = ["&", "%", "$", "#", "_", "{", "}", "~", "^"];
    return text
      .split("")
      .map((char) => {
        if (escapeChars.includes(char)) {
          return "\\" + char;
        }
        return char;
      })
      .join("");
  }
}
