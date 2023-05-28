import { CellContent } from "./enum";

export interface Cell {
content: CellContent;
visited: boolean;
}
  
export interface Player {
x: number;
y: number;
direction: string;
hasGold: boolean;
}