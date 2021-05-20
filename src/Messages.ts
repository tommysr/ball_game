let approved: string[] = [
  "Cool",
  "Keep it up",
  "You're awesome",
];

let dissapproved: string[] = [
  "what takes you so long",
  "lack of good moves?",
  "you're weak?",
  "time is running...",
];

export function approve(target: any, name: string, descriptor: any) {
  let oryg = descriptor.value;
  descriptor.value = function (...args: any[]) {
    let result = oryg.apply(this, args);

    if (this.points != 0)
      document.getElementById("box").innerHTML = `<h3>${
        approved[Math.floor(Math.random() * approved.length)]
      }</h3>`;

    return result;
  };
}

export function dissapprove(target: any, name: string, descriptor: any) {
  let oryg = descriptor.value;
  descriptor.value = function (...args: any[]) {
    let result = oryg.apply(this, args);

    document.getElementById("box").innerHTML = `<h3>${
      dissapproved[Math.floor(Math.random() * dissapproved.length)]
    }<h3`;

    return result;
  };
}
