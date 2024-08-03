/*
   This will house most of the interfaces to be used
   by the lexer
*/

// interface Token {
//   type: string;
//   value: string;
// }

// interface ASTNode {
//   type: string;
//   content?: string;
//   children?: ASTNode[];
// }

// interface Content {
//   [key: string]: string;
// }

// interface ParseNode {
//   content: Content | string;
//   type: string;
// }
// export type { Token, ASTNode, ParseNode };

export interface ASTNode {
  type: string;
  content?: string | { [key: string]: any };
  children?: ASTNode[];
}

export interface ASTNodeWithContent extends ASTNode {
  content: string;
}

export interface ASTNodeWithLinkContent extends ASTNode {
  content: {
    text: string;
    url: string;
  };
}

export interface ASTNodeWithImageContent extends ASTNode {
  content: {
    alt: string;
    src: string;
  };
}

export interface ASTNodeWithChildren extends ASTNode {
  children: ASTNode[];
}

export interface HeaderNode extends ASTNodeWithContent {
  type: "Header";
}

export interface ParagraphNode extends ASTNodeWithContent {
  type: "Paragraph";
}

export interface OrderedListNode extends ASTNodeWithChildren {
  type: "OrderedList";
}

export interface UnorderedListNode extends ASTNodeWithChildren {
  type: "UnorderedList";
}

export interface BlockquoteNode extends ASTNodeWithContent {
  type: "Blockquote";
}

export interface TableNode extends ASTNodeWithContent {
  type: "Table";
}

export interface InlineMathNode extends ASTNodeWithContent {
  type: "InlineMath";
}

export interface BlockMathNode extends ASTNodeWithContent {
  type: "BlockMath";
}

export interface LinkNode extends ASTNodeWithLinkContent {
  type: "Link";
}

export interface ImageNode extends ASTNodeWithImageContent {
  type: "Image";
}

export interface Token {
  type: string;
  value: string;
}
