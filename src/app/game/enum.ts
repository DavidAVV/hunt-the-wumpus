export  enum CellContent {
  Empty,
  Wumpus,
  Pit,
  Gold,
  Start,
  Entrance
}
  
export enum Perception {
  Stench,
  Breeze,
  Glitter,
  Bump,
  Scream
}

export enum Action {
  MoveForward,
  TurnLeft,
  TurnRight,
  ShootArrow,
  Exit
}