import Cell from "./Cell";
import BFS from "./Bfs";
import { PointXY } from "./Point";

interface pointCheck {
  (point: PointXY, color: string): PointXY[];
}

interface gridInt {
  placeBall(point: PointXY, color: string): void;
  getCellValue(point: PointXY): number;
  getCellBall(point: PointXY): HTMLDivElement;
  isEmpty(point: PointXY): boolean;
  hasNeighbours(point: PointXY): boolean;
  checkCell(point: PointXY): PointXY[];
  switchContent(current: PointXY, destination: PointXY): void;
  setCellValue(point: PointXY, value: number): void;
  findPath(start: PointXY, end: PointXY): void;
}

class Grid extends BFS implements gridInt {
  private width: number;
  private board: Cell[][];

  constructor(width: number) {
    super(width);
    this.width = width;
    this.createArray(width);
  }

  protected isValid(x: number): boolean {
    if (x >= 0 && x < this.width) return true;
    else return false;
  }

  private createArray(size: number): void {
    let arr: Cell[][] = new Array();

    for (let i = 0; i < size; i++) {
      arr[i] = new Array();
      for (let j = 0; j < size; j++) {
        arr[i][j] = { x: i, y: j, value: 0 };
      }
    }

    this.board = arr;
  }

  public placeBall(point: PointXY, color: string): void {
    let ball: HTMLDivElement = document.createElement("div");

    ball.classList.add("kulka");
    ball.style.backgroundColor = color;

    this.board[point.x][point.y] = {
      x: point.x,
      y: point.y,
      color: color,
      value: 1,
      el: ball,
    };
  }

  public getCellValue(point: PointXY): number {
    return this.board[point.x][point.y].value;
  }

  public getCellBall(point: PointXY): HTMLDivElement {
    return this.board[point.x][point.y].el;
  }

  public isEmpty(point: PointXY): boolean {
    if (this.board[point.x][point.y].el) return false;
    else return true;
  }

  public hasNeighbours(point: PointXY): boolean {
    let validCount: number = 0;
    let neighbourCount: number = 0;
    for (let i of [
      [point.x + 1, point.y],
      [point.x, point.y + 1],
      [point.x - 1, point.y],
      [point.x, point.y - 1],
    ]) {
      if (this.isValid(i[0]) && this.isValid(i[1])) {
        validCount++;
        if (this.board[i[0]][i[1]].value === 1) neighbourCount++;
      }
    }

    if (validCount === neighbourCount) return true;
    else return false;
  }

  private deleteBall(point: PointXY): void {
    this.board[point.x][point.y] = {
      x: point.x,
      y: point.y,
      color: null,
      value: 0,
      el: null,
    };
  }

  private checkRow: pointCheck = (point: PointXY, color: string): PointXY[] => {
    let toStrikeArray: PointXY[] = [];
    let x: number = point.x;

    for (let i = 0; i < this.width; i++) {
      if (this.board[x][i].color === color) toStrikeArray.push({ x: x, y: i });
      else if (toStrikeArray.length < 5) toStrikeArray = [];
    }

    if (!(toStrikeArray.length < 5)) {
      return toStrikeArray;
    }
    return [];
  };

  private checkColumn: pointCheck = (
    point: PointXY,
    color: string
  ): PointXY[] => {
    let toStrikeArray: PointXY[] = [];
    let y: number = point.y;

    for (let i = 0; i < this.width; i++) {
      if (this.board[i][y].color === color) toStrikeArray.push({ x: i, y: y });
      else if (toStrikeArray.length < 5) toStrikeArray = [];
    }

    if (!(toStrikeArray.length < 5)) {
      return toStrikeArray;
    }
    return [];
  };

  private checkSecondDiagonal: pointCheck = (
    point: PointXY,
    color: string
  ): PointXY[] => {
    let toStrikeArray: PointXY[] = [];

    let x1: number = point.x;
    let y1: number = point.y;

    while (x1 < this.width - 1 && y1 > 0) {
      x1++;
      y1--;
    }

    for (let i = 0; i < this.width; i++) {
      if (this.isValid(x1 - i) && this.isValid(y1 + i)) {
        if (this.board[x1 - i][y1 + i].color === color)
          toStrikeArray.push({ x: x1 - i, y: y1 + i });
        else if (toStrikeArray.length < 5) toStrikeArray = [];
      }
    }

    if (!(toStrikeArray.length < 5)) {
      return toStrikeArray;
    }
    return [];
  };

  private checkFirstDiagonal: pointCheck = (
    point: PointXY,
    color: string
  ): PointXY[] => {
    let toStrikeArray: PointXY[] = [];

    let x1: number = point.x;
    let y1: number = point.y;

    while (x1 > 0 && y1 > 0) {
      x1--;
      y1--;
    }

    for (let i = 0; i < this.width; i++) {
      if (this.isValid(x1 + i) && this.isValid(y1 + i))
        if (this.board[x1 + i][y1 + i].color === color)
          toStrikeArray.push({ x: x1 + i, y: y1 + i });
        else if (toStrikeArray.length < 5) toStrikeArray = [];
    }

    if (!(toStrikeArray.length < 5)) {
      return toStrikeArray;
    }
    return [];
  };

  public checkCell(point: PointXY): PointXY[] {
    let color = this.board[point.x][point.y].color;

    let row = this.checkRow(point, color);
    let column = this.checkColumn(point, color);
    let diagonal = this.checkFirstDiagonal(point, color);
    let secondDiagonal = this.checkSecondDiagonal(point, color);

    let toDelete: PointXY[] = [
      ...row,
      ...column,
      ...diagonal,
      ...secondDiagonal,
    ];

    for (let el of toDelete) this.deleteBall(el);

    toDelete = toDelete.filter((value, index, self) => {
      return (
        self.findIndex((t) => t.x === value.x && t.y === value.y) === index
      );
    });

    return toDelete;
  }

  public switchContent(current: PointXY, destination: PointXY): void {
    let divElement: HTMLDivElement = this.board[current.x][current.y].el;
    let color: string = this.board[current.x][current.y].color;

    this.board[current.x][current.y] = {
      x: current.x,
      y: current.y,
      color: null,
      value: 0,
      el: null,
    };

    this.board[destination.x][destination.y] = {
      x: destination.x,
      y: destination.y,
      value: 1,
      color: color,
      el: divElement,
    };
  }

  public setCellValue(point: PointXY, value: number): void {
    this.board[point.x][point.y].value = value;
  }

  public findPath(start: PointXY, end: PointXY): void {
    let arr: number[][] = this.board.map((el) => el.map((el) => el.value));
    this.search([start.x, start.y], [end.x, end.y], arr);
  }
}

export default Grid;
