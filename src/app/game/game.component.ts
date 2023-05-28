import { Component, OnInit } from '@angular/core';
import { Action, CellContent, Perception } from './enum';
import { Player, Cell } from './interfaces';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  public CellContent = CellContent;
  public Action = Action;
  public Perception = Perception;
  
  private boardSize!: number;
  private numPits!: number;
  public numArrows!: number;
  public player!: Player;
  public board!: Cell[][];
  private gameOver!: boolean;
  public gameStart!: boolean;
  public message!: string;
  public perceptionMessage!: string;

  constructor() {}

  public ngOnInit(): void {
    this.message = 'Selecciona dificultad:';
    this.perceptionMessage = '';
    this.gameStart = false;
  }

  public initializeGame(size:number = 5, pits:number = 3, arrows:number = 1): void {
    this.gameStart = true;
    this.boardSize = size; // Tamaño del tablero (5x5 en este ejemplo)
    this.numPits = pits; // Número de pozos
    this.numArrows = arrows; // Número de flechas
    this.player = { x: 0, y: 0, direction: 'Debajo', hasGold: false }; // Posición inicial del jugador
    this.board = [];

    // Inicializar el tablero vacío
    for (let i = 0; i < this.boardSize; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < this.boardSize; j++) {
        row.push({ content: CellContent.Empty, visited: false });
      }
      this.board.push(row);
    }

    // Establecer posiciones de inicio que siempre estarán vacías.
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        this.board[i][j].content = CellContent.Start;
      }
    }
    this.board[0][0].content = CellContent.Entrance;
    // Colocar aleatoriamente el Wumpus, los pozos y el oro en el tablero
    this.placeContent(CellContent.Wumpus);
    this.placeContent(CellContent.Pit, this.numPits);
    this.placeContent(CellContent.Gold);
    this.getPerceptions()

    this.gameOver = false;
    this.message = '¡Buena suerte!';
  }

  public revealMap(): void{
    this.board.map((cell)=>cell.map((c)=>c.visited=true))
  }

  private placeContent(content: CellContent, count = 1): void {
    let placed = 0;
    while (placed < count) {
      const x = Math.floor(Math.random() * this.boardSize);
      const y = Math.floor(Math.random() * this.boardSize);
      if (this.board[x][y].content === CellContent.Empty) {
        this.board[x][y].content = content;
        placed++;
      }
    }
  }

  private getPerceptions(): {perception:Perception, direction:string}[] {
    const perceptions: {perception:Perception, direction:string}[] = [];

    // Obtener las coordenadas de las celdas adyacentes
    const adjacentCells = this.getAdjacentCells(this.player.x, this.player.y);

    // Verificar las percepciones en las celdas adyacentes
    adjacentCells.forEach((cell) => {
      const { x, y } = cell;
      const content = this.board[x][y].content;

      if (content === CellContent.Wumpus) {
        perceptions.push({perception: Perception.Stench, direction:cell.view});
      } else if (content === CellContent.Pit) {
        perceptions.push({perception: Perception.Breeze, direction:cell.view});
      } else if (content === CellContent.Gold) {
        perceptions.push({perception: Perception.Glitter, direction:cell.view});
      }
    });

    return perceptions;
  }

  private getAdjacentCells(x: number, y: number): { x: number; y: number; view: string; }[] {
    const adjacentCells: { x: number; y: number; view: string; }[] = [];

    if (x > 0) {
      adjacentCells.push({ x: x - 1, y, view:'Encima' });
    }
    if (x < this.boardSize - 1) {
      adjacentCells.push({ x: x + 1, y, view:'Debajo' });
    }
    if (y > 0) {
      adjacentCells.push({ x, y: y - 1, view:'Izquierda' });
    }
    if (y < this.boardSize - 1) {
      adjacentCells.push({ x, y: y + 1, view:'Derecha' });
    }

    return adjacentCells;
  }

  public performAction(action: Action): void {
    if (this.gameOver) {
      return;
    }

    switch (action) {
      case Action.MoveForward:
        this.moveForward();
        break;
      case Action.TurnLeft:
        this.turnLeft();
        break;
      case Action.TurnRight:
        this.turnRight();
        break;
      case Action.ShootArrow:
        this.shootArrow();
        break;
    }

    if (!this.gameOver) {
      this.updateGameState();
    }
  }

  private moveForward(): void {
    let { x, y } = this.player;
    let gold = this.player.hasGold;

    // Obtener la siguiente posición según la dirección del jugador
    switch (this.player.direction) {
      case 'Encima':
        x--;
        break;
      case 'Derecha':
        y++;
        break;
      case 'Debajo':
        x++;
        break;
      case 'Izquierda':
        y--;
        break;
    }

    if (x < 0 || x >= this.boardSize || y < 0 || y >= this.boardSize) {
      this.message = '¡Choque! Has chocado contra la pared.';
      return;
    } else if (this.board[this.player.x][this.player.y].content === CellContent.Gold) {
      this.message = '¡Has encontrado el oro! Lo pones en tu bolsa.';
      gold = true;
      this.board[this.player.x][this.player.y].content = CellContent.Empty;
    }else {
      this.message = '';
    }

    let direction = this.player.direction;


    this.player = { x, y, direction, hasGold: gold };
  }

  private turnLeft(): void {
    
    switch (this.player.direction){
      case 'Debajo':
        this.player.direction = 'Izquierda';
        break;
      case 'Izquierda':
        this.player.direction = 'Encima';
        break;
      case 'Encima':
        this.player.direction = 'Derecha';
        break;
      case 'Derecha':
        this.player.direction = 'Debajo';
        break;
    }
    
  }

  private turnRight(): void {

    switch (this.player.direction){
      case 'Debajo':
        this.player.direction = 'Derecha';
        break;
      case 'Izquierda':
        this.player.direction = 'Debajo';
        break;
      case 'Encima':
        this.player.direction = 'Izquierda';
        break;
      case 'Derecha':
        this.player.direction = 'Encima';
        break;
    }
  }

  private shootArrow(): void {
    if (this.numArrows === 0) {
      this.message = '¡Ya no te quedan flechas!';
      return;
    }

    this.numArrows--;

    // Obtener las coordenadas de las celdas adyacentes
    const adjacentCells = this.getAdjacentCells(this.player.x, this.player.y);

    // Verificar si el Wumpus está en alguna de las celdas adyacentes
    const wumpusCell = adjacentCells.find((cell) => {
      const { x, y } = cell;
      return this.board[x][y].content === CellContent.Wumpus;
    });


    if (wumpusCell && wumpusCell.view === this.player.direction) {
      const { x, y } = wumpusCell;
      this.board[x][y].content = CellContent.Empty;
      this.message = 'Escuchas un grito ¡Has matado al Wumpus!.';
    } else {
      this.message = 'No has acertado al Wumpus.';
    }
  }

  public exit(): void {
    if (this.board[this.player.x][this.player.y].content === CellContent.Entrance && this.player.hasGold) {
      this.message = '¡Has salido con el oro! ¡Has ganado!';
      this.gameOver = true;
    } else {
      this.message = 'No puedes salir sin el oro.';
    }

  }

  private updateGameState(): void {
    const perceptions = this.getPerceptions();
    this.perceptionMessage = this.getPerceptionMessage(perceptions);
    this.board[this.player.x][this.player.y].visited = true;

    if (
      this.board[this.player.x][this.player.y].content === CellContent.Wumpus
    ) {
      this.message = 'El Wumpus te ha comido ¡Has perdido!';
      this.gameOver = true;
    } else if (
      this.board[this.player.x][this.player.y].content === CellContent.Pit
    ) {
      this.message = 'Te has caído en un foso ¡Has perdido!';
      this.gameOver = true;
    } 
  }

  private getPerceptionMessage(perceptions: {perception:Perception, direction:string}[]): string {
    let pMessage = '';

    perceptions.forEach((perception)=>{
      if(perception.perception === Perception.Stench){
        pMessage += perception.direction + ': Sientes un hedor. '
      } else if(perception.perception === Perception.Breeze){
        pMessage += perception.direction + ': Sientes una brisa. '
      } else if(perception.perception === Perception.Glitter){
        pMessage += perception.direction + ': Ves un brillo dorado. '
      } else if(perception.perception === Perception.Bump){
        pMessage += perception.direction + ': Hay una pared, no puedes avanzar. '
      } else if(perception.perception === Perception.Scream){
        pMessage += perception.direction + ': Escuchas un grito.'
      }
    })
    
    if (pMessage === '') {
      pMessage = 'No sientes nada inusual.';
    }

    return pMessage;
  }
}
