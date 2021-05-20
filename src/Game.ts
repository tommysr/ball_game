import Grid from "./Grid";
import Colors from "./Colors";
import Arrays from "./Arrays";
import Timer from "./Timer";
import { PointXY } from "./Point";
import { approve, dissapprove } from "./Messages";

class Game {
  readonly BALLS: number = 3;

  private isStartMarked: boolean;
  private searching: boolean;
  private started: boolean;
  private moving: boolean;

  private lastCell: HTMLTableCellElement;
  private timer: Timer;
  private board: Grid;
  private colors: Colors;

  private points: number;
  private numberOfFree: number;
  private size: number;

  private start: PointXY;
  private marked: number[][];
  private drawedBalls: PointXY[];

  constructor(size: number) {
    this.size = size;
    this.numberOfFree = size * size;
    this.points = 0;
    this.marked = [];
    this.drawedBalls = [];

    this.timer = new Timer();
    this.timer.show();
    this.board = new Grid(9);
    this.colors = new Colors(this.BALLS);

    this.started = false;
    this.isStartMarked = false;
    this.searching = false;
    this.moving = false;

    this.colors.drawColors();
    this.createHTMLBoard();
    this.placeBalls(this.BALLS);
    this.placeColors();
  }

  placeColors(): void {
    document.getElementById("info").innerHTML = "";
    this.colors.drawColors();

    let colors: string[] = this.colors.getColors();
    let table: HTMLTableElement = document.createElement("table");
    let row: HTMLTableRowElement = document.createElement("tr");

    for (let i = 0; i < colors.length; i++) {
      let cell: HTMLTableCellElement = document.createElement("td");
      let ball: HTMLDivElement = document.createElement("div");

      ball.classList.add("kulka");
      ball.style.backgroundColor = colors[i];

      cell.appendChild(ball);
      row.appendChild(cell);
    }

    table.appendChild(row);
    document.getElementById("info").appendChild(table);
  }

  checkPlacedBalls() {
    let toStrike: PointXY[] = [];
    for (let el of this.drawedBalls)
      toStrike = [...toStrike, ...this.board.checkCell(el)];

    this.numberOfFree += toStrike.length;
    for (let i of toStrike) this.updateHTMLboard(i);

    this.points += toStrike.length;
    this.updatePoints();
  }

  placeBalls(count: number): void {
    this.drawedBalls = [];
    let balls: number = count;
    let colors: string[] = this.colors.getColors();

    if (this.numberOfFree < 3) {
      balls = this.numberOfFree;
    }

    while (balls > 0) {
      let x: number = Math.floor(Math.random() * this.size + 1) - 1;
      let y: number = Math.floor(Math.random() * this.size + 1) - 1;
      let point: PointXY = { x: x, y: y };

      if (this.board.getCellValue(point) === 0) {
        this.board.placeBall(point, colors[balls - 1]);
        this.updateHTMLboard(point);
        this.drawedBalls.push(point);

        balls--;
        this.numberOfFree--;
      }
    }

    this.checkPlacedBalls();

    if (this.numberOfFree == 0) {
      this.endTheGame();
    }
  }

  endTheGame(): void {
    window.alert(
      `uzyskałeś ${this.points} punktów, twój czas to ${this.timer.getTime()}`
    );
    window.location.reload();
  }

  showMove(): void {
    for (let el of this.board.getPath()) {
      if (el.indexOf(null) === -1) {
        document.getElementById(el[0] + "_" + el[1]).classList.add("path");
      }
    }
  }

  clear(className: string): void {
    for (let el of this.marked) {
      document.getElementById(el[0] + "_" + el[1]).classList.remove(className);
    }
  }

  mark(): void {
    for (let el of this.board.getPath()) {
      if (el.indexOf(null) === -1) {
        document.getElementById(el[0] + "_" + el[1]).classList.add("temp-path");

        this.marked.push(el);
      }
    }
  }

  getCellId(el: EventTarget): PointXY {
    let id: number[] = (<HTMLTableCellElement>el).id
      .split("_")
      .map((el) => parseInt(el));
    let point: PointXY = { x: id[0], y: id[1] };
    return point;
  }

  unMarkStart(): void {
    this.isStartMarked = false;
    this.searching = false;
    this.lastCell.children[0].classList.remove("marked-start");
    this.clear("temp-path");
  }

  markStart(element: EventTarget): void {
    let id: PointXY = this.getCellId(element);

    if (!this.started) {
      this.timer.start();
      this.started = true;
    }

    if (!this.board.hasNeighbours(id)) {
      this.searching = true;
      this.isStartMarked = true;
      this.start = { x: id.x, y: id.y };
      this.lastCell = <HTMLTableCellElement>element;

      this.lastCell.children[0].classList.add("marked-start");
    }
  }

  changeStartCell(element: EventTarget): void {
    this.unMarkStart();
    this.markStart(element);
  }

  @dissapprove
  changeMove(element: EventTarget): void {
    if (this.lastCell === element) {
      this.unMarkStart();
    } else {
      this.changeStartCell(element);
    }
  }

  tryMoveIfIsBall(element: EventTarget): void {
    if (!this.isStartMarked) {
      this.markStart(element);
    } else {
      this.changeMove(element);
    }
  }

  @approve
  updatePoints(): void {
    document.getElementById(
      "points"
    ).innerHTML = `<h2>Points: ${this.points}</h2>`;
  }

  checkStrikeCells(toStrike: PointXY[]): void {
    for (let i of toStrike) this.updateHTMLboard(i);

    if (toStrike.length === 0) {
      this.placeBalls(this.BALLS);
      this.placeColors();
    } else {
      this.numberOfFree += toStrike.length;
      this.points += toStrike.length;
      this.updatePoints();
    }
  }

  makeMove(element: EventTarget): void {
    this.moving = true;

    let end: PointXY = this.getCellId(element);
    let path: number[][] = this.board.getPath();

    if (Arrays.isEqual([end.x, end.y], path[path.length - 1])) {
      this.lastCell.children[0].classList.remove("marked-start");

      this.board.switchContent(this.start, end);
      this.updateHTMLboard(this.start);
      this.updateHTMLboard(end);

      this.checkStrikeCells(this.board.checkCell(end));

      this.searching = false;
      this.isStartMarked = false;

      this.showMove();

      setTimeout(() => this.clear("path"), 500);
      this.clear("temp-path");
    }

    this.moving = false;
  }

  onCellClick = (event: Event): void => {
    let id: PointXY = this.getCellId(event.target);

    if (!this.moving)
      if (!this.board.isEmpty(id)) {
        this.tryMoveIfIsBall(event.target);
      } else if (this.isStartMarked) {
        this.makeMove(event.target);
      }
  };

  showPath = (event: Event): void => {
    let id: PointXY = this.getCellId(event.target);

    if (this.searching && this.board.getCellValue(id) === 0) {
      this.board.findPath(this.start, id);

      this.clear("temp-path");
      this.mark();

      let path: number[][] = this.board.getPath();

      if (!Arrays.isEqual(path[path.length - 1], [id.x, id.y]))
        this.clear("temp-path");
    } else {
      this.clear("temp-path");
    }
  };

  createHTMLBoard() {
    let board: HTMLTableElement = document.createElement("table");

    for (let i = 0; i < this.size; i++) {
      let row: HTMLTableRowElement = document.createElement("tr");
      for (let j = 0; j < this.size; j++) {
        let cell: HTMLTableCellElement = document.createElement("td");
        cell.id = i + "_" + j;
        cell.onclick = this.onCellClick;
        cell.onmouseenter = this.showPath;
        row.appendChild(cell);
      }
      board.appendChild(row);
    }

    document.getElementById("board").appendChild(board);
    document.getElementById("points").innerHTML = `<h2>Points: 0</h2>`;
  }

  updateHTMLboard(point: PointXY) {
    let element: HTMLElement = document.getElementById(point.x + "_" + point.y);

    if (this.board.getCellValue(point) === 1) {
      element.appendChild(this.board.getCellBall(point));
    } else {
      element.innerHTML = "";
    }
  }
}

export default Game;
