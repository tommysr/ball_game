interface searchInt {
  getPath(): number[][];
  search(start: number[], end: number[], graph: number[][]): void;
}

interface searchFunc {
  (start: number[], end: number[], graph: number[][]): void;
}

class BFS implements searchInt {
  private graph: number[][];
  private length: number;
  private queue: number[][][];
  private path: number[][];

  constructor(length: number) {
    this.length = length;
  }

  public getPath(): number[][] {
    return this.path;
  }

  protected isValid(x: number): boolean {
    if (x >= 0 && x < this.length) return true;
    else return false;
  }

  public search: searchFunc = (
    start: number[],
    end: number[],
    graph: number[][]
  ) => {
    this.graph = graph.map(function (arr) {
      return arr.slice();
    });

    this.queue = [];
    this.graph[start[0]][start[1]] = 1;
    this.queue.push([start]);

    let found: boolean = false;

    while (this.queue.length > 0) {
      this.path = this.queue.shift();
      let position: number[] = this.path[this.path.length - 1];

      for (let i of [
        [position[0] + 1, position[1]],
        [position[0], position[1] + 1],
        [position[0] - 1, position[1]],
        [position[0], position[1] - 1],
      ]) {
        if (i[0] == end[0] && i[1] == end[1]) {
          this.path.push(end);
          found = true;
          return;
        }

        if (
          this.isValid(i[0]) &&
          this.isValid(i[1]) &&
          this.graph[i[0]][i[1]] == 0
        ) {
          this.graph[i[0]][i[1]] = 1;
          let arr = this.path.concat([i]);
          this.queue.push(arr);
        }
      }
    }
    if (!found) this.path.push([null, null]);
  };
}

export default BFS;
