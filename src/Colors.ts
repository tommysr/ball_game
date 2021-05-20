import GrayScale from "./GrayScale";

//@GrayScale
class Colors {
  private colors: string[];
  private drawed: string[];
  private size: number;

  constructor(count: number) {
    this.colors = [
      "red",
      "orange",
      "blue",
      "yellow",
      "purple",
      "pink",
      "green",
    ];

    this.drawed = [];
    this.size = count;
  }

  drawColors(count: number = this.size) {
    this.drawed = [];
    let cnt = count;
    while (cnt > 0) {
      let color = this.colors[Math.floor(Math.random() * (7 - 1) + 1) - 1];
      this.drawed.push(color);
      cnt--;
    }
  }

  getColors() {
    return this.drawed;
  }
}

export default Colors;
