/*
   This will house most of the interfaces to be used
   by the lexer
*/

interface Token {
  type: string;
  value: string;
}

export type { Token };
