export interface NodeListItem {
  id: string;
  name: string;
}

export enum IconType {
  STRAIGHT,
  LEFT,
  RIGHT,
  DOOR,
}
interface Instruction {
  title: string;
  description: string;
  icon: IconType;
}

export enum ArrowType {
  STRAIGHT,
  LEFT,
  RIGHT,
}

export interface Arrow {
  x: number;
  y: number;
  type: ArrowType;
}

// interface OverlayItems {
//   arrow: Arrow;
// }

type OverlayItems = Arrow;

export interface Node extends NodeListItem {
  instruction: Instruction;
  imageURL: string;
  overlayItems: OverlayItems;
}

export interface NavigationResponse {
  nodes: Node[];
  arrivalTime: string;
}

export interface Avoidances {
  [key: string]: string;
}
