import { GRAPH_NODE_TYPES } from '../constants';

class GraphNode {
  constructor(x, y, type) {
    this.data = {};
    this.x = x;
    this.y = y;
    this.pos = { x, y };
    this.type = type;
  }

  toString() {
    return `[${this.x} ${this.y}]`;
  }

  isWall() {
    return this.type === GRAPH_NODE_TYPES.WALL;
  }
}

export default GraphNode;
