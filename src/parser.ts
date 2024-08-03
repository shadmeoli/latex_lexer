import type {
  Token,
  ASTNode,
  ASTNodeWithLinkContent,
  ASTNodeWithImageContent,
} from "./interfaces";
import { TokenType } from "./tokens";

export class Parser {
  private tokens: Token[];
  private currentIndex: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.currentIndex = 0;
  }

  public parse(): ASTNode[] {
    const ast: ASTNode[] = [];
    while (this.currentIndex < this.tokens.length) {
      ast.push(this.parseNode());
    }
    return ast;
  }

  private parseNode(): ASTNode {
    const token = this.tokens[this.currentIndex];

    switch (token.type) {
      case TokenType.HEADER:
        return this.parseHeader();
      case TokenType.PARAGRAPH:
        return this.parseParagraph();
      case TokenType.ORDERED_LIST:
        return this.parseOrderedList();
      case TokenType.UNORDERED_LIST:
        return this.parseUnorderedList();
      case TokenType.BLOCKQUOTE:
        return this.parseBlockquote();
      case TokenType.TABLE:
        return this.parseTable();
      case TokenType.INLINE_MATH:
        return this.parseInlineMath();
      case TokenType.BLOCK_MATH:
        return this.parseBlockMath();
      case TokenType.LINK:
        return this.parseLink();
      case TokenType.IMAGE:
        return this.parseImage();
      case TokenType.LINE_BREAK:
        return this.parseLineBreak(); // Ensure you have this method implemented
      case TokenType.LIST_ITEM:
        return this.parseListItem(); // Handle LIST_ITEM token type
      case TokenType.TODO_ITEM:
        return this.parseTodoItem(); // Handle TODO_ITEM token type
      default:
        throw new Error(`Unknown token type: ${token.type}`);
    }
  }

  private parseHeader(): ASTNode {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;
    return {
      type: "Header",
      content: token.value,
    };
  }

  private parseParagraph(): ASTNode {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;
    return {
      type: "Paragraph",
      content: token.value,
    };
  }

  private parseOrderedList(): ASTNode {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;
    return {
      type: "OrderedList",
      children: this.parseListItems(),
    };
  }

  private parseUnorderedList(): ASTNode {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;

    const children: ASTNode[] = [];

    if (token.type === TokenType.TODO_ITEM) {
      children.push(this.parseTodoItem());
    }

    children.push(...this.parseListItems());
    return {
      type: "UnorderedList",
      children: children,
    };
  }

  private parseListItems(): ASTNode[] {
    const items: ASTNode[] = [];

    while (
      this.currentIndex < this.tokens.length &&
      (this.tokens[this.currentIndex].type === TokenType.LIST_ITEM ||
        this.tokens[this.currentIndex].type === TokenType.TODO_ITEM)
    ) {
      if (this.tokens[this.currentIndex].type === TokenType.TODO_ITEM) {
        items.push(this.parseTodoItem());
      } else {
        items.push({
          type: "ListItem",
          content: this.tokens[this.currentIndex].value,
        });
      }
      this.currentIndex++;
    }

    return items;
  }

  private parseListItem(): ASTNode {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;
    return {
      type: "ListItem",
      content: token.value,
    };
  }

  private parseTodoItem(): ASTNode {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;
    return {
      type: "TodoItem",
      content: token.value,
    };
  }

  private parseBlockquote(): ASTNode {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;
    return {
      type: "Blockquote",
      content: token.value,
    };
  }

  private parseTable(): ASTNode {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;
    return {
      type: "Table",
      content: token.value,
    };
  }

  private parseInlineMath(): ASTNode {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;
    return {
      type: "InlineMath",
      content: token.value,
    };
  }

  private parseBlockMath(): ASTNode {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;
    return {
      type: "BlockMath",
      content: token.value,
    };
  }

  private parseLink(): ASTNodeWithLinkContent {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;
    const match = token.value.match(/\[([^\]]+)\]\(([^)]+)\)/);
    return {
      type: "Link",
      content: {
        text: match ? match[1] : "",
        url: match ? match[2] : "",
      },
    };
  }

  private parseImage(): ASTNodeWithImageContent {
    const token = this.tokens[this.currentIndex];
    this.currentIndex++;
    const match = token.value.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    return {
      type: "Image",
      content: {
        alt: match ? match[1] : "",
        src: match ? match[2] : "",
      },
    };
  }

  private parseLineBreak(): ASTNode {
    this.currentIndex++;
    return {
      type: "LineBreak",
    };
  }
}
