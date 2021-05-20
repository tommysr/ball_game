interface TimerInterface {
  show(): void;
  start(): void;
  getTime(): string;
}

class Timer implements TimerInterface {
  private time: number;
  private timer: number;

  constructor() {
    this.timer = null;
    this.time = 0;
  }

  public show(): void {
    document.getElementById("timer").innerText = this.getTime();
  }

  public start(): void {
    this.timer = setInterval(() => {
      this.time += 1;
      this.show();
    }, 1000);
  }

  public getTime(): string {
    let date: Date = new Date(0);
    date.setSeconds(this.time);

    let timeString: string = date.toISOString().substr(11, 8);

    return timeString;
  }
}

export default Timer;
