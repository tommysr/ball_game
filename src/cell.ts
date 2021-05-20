import { PointXY } from "./Point";

export default interface Cell extends PointXY {
  value: number;
  color?: string;
  el?: HTMLDivElement;
}
