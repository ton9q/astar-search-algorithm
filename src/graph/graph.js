// Creates a Graph class used in the astar search algorithm.
/*
  MIT License

  Creates a Graph class used in the astar search algorithm.
  Includes Binary Heap (with modifications) from Marijn Haverbeke
      URL: http://eloquentjavascript.net/appendix2.html
*/

import GraphNode from './graphNode';

class Graph {
  constructor(grid) {
    const nodes = [];

    grid.forEach((row, rowIndex) => {
      nodes.push([]);
      row.forEach(((nodeType, nodeIndex) => {
        nodes[rowIndex].push(new GraphNode(rowIndex, nodeIndex, nodeType));
      }));
    });

    this.nodes = nodes;
  }

  toString() {
    const { nodes } = this;
    const graphString = '';

    nodes.forEach(row => {
      row.forEach(node => {
        graphString.concat(`${node.type} `);
      });
      graphString.concat('\n');
    });

    return `\n${graphString}`;
  }
}

export default Graph;
