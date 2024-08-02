/*
   This will house most of the interfaces to be used
   by the lexer
*/

interface Token {
  type: string;
  value: string;
}

interface ASTNode {
  type: string;
  content?: string;
  children?: ASTNode[];
}

interface Content {
  [key: string]: string;
}

interface ParseNode {
  content: Content | string;
  type: string;
}
export type { Token, ASTNode, ParseNode };
