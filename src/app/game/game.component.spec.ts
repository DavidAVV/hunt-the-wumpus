import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { Cell, Player } from './interfaces';
import { Action, CellContent } from './enum';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameComponent]
    });
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar todas las celdas como visitadas', () => {
   
    component.board = [
      [{ visited: false }, { visited: false }],
      [{ visited: false }, { visited: false }]
    ] as Cell[][];

    // Llamar a la función revealMap()
    component.revealMap();

    // Verificar que todas las celdas estén marcadas como visitadas
    for (const row of component.board) {
      for (const cell of row) {
        expect(cell.visited).toBeTrue();
      }
    }
  });

 it('debería mover al jugador hacia adelante', () => {
    const initialPlayerPosition = { x: 0, y: 0, direction: 'Debajo', hasGold: false };
    const expectedPlayerPosition = { x: 1, y: 0, direction: 'Debajo', hasGold: false };

    component.board=[
      [{ visited: false }, { visited: false }],
      [{ visited: false }, { visited: false }]
    ] as Cell[][];
    component.player = initialPlayerPosition;
    component.performAction(Action.MoveForward);

    expect(component.player).toEqual(expectedPlayerPosition);
  });

  it('debería girar al jugador a la izquierda', () => {
    const initialPlayerDirection = { x: 0, y: 0, direction: 'Encima', hasGold: false };
    const expectedPlayerDirection = { x: 0, y: 0, direction: 'Derecha', hasGold: false };

    component.board=[
      [{ visited: false }, { visited: false }],
      [{ visited: false }, { visited: false }]
    ] as Cell[][];
    component.player = initialPlayerDirection;
    component.performAction(Action.TurnLeft);

    expect(component.player).toEqual(expectedPlayerDirection);
  });

  it('debería girar al jugador a la derecha', () => {
    const initialPlayerDirection = { x: 0, y: 0, direction: 'Encima', hasGold: false };
    const expectedPlayerDirection = { x: 0, y: 0, direction: 'Izquierda', hasGold: false };

    component.board=[
      [{ visited: false }, { visited: false }],
      [{ visited: false }, { visited: false }]
    ] as Cell[][];
    component.player = initialPlayerDirection;
    component.performAction(Action.TurnRight);

    expect(component.player).toEqual(expectedPlayerDirection);
  });

  it('debería fallar al Wumpus', () => {
    const wumpusPosition = { x: 1, y: 0 };
    const initialPlayerPosition = { x: 0, y: 0 };
    const initialPlayerDirection = 'Izquierda';

    component.board=[
      [{ visited: false }, { visited: false }],
      [{ visited: false }, { visited: false }]
    ] as Cell[][];
    component.board[wumpusPosition.x][wumpusPosition.y].content = CellContent.Wumpus;
    component.player = {
      ...initialPlayerPosition,
      direction: initialPlayerDirection,
    } as Player;
    component.numArrows = 1;

    component.performAction(Action.ShootArrow);

    expect(component.board[wumpusPosition.x][wumpusPosition.y].content).toBe(CellContent.Wumpus);
    expect(component.message).toBe('No has acertado al Wumpus.');
  });
  
});
