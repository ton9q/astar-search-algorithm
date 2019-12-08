/*
  MIT License

  Implements the astar search algorithm in javascript using a binary heap.

  Implements the astar search algorithm in javascript
  Based off the original blog post http://www.briangrinstead.com/blog/astar-search-algorithm-in-javascript
  It has since been replaced with astar.js which uses a Binary Heap and is quite faster, but I am leaving
  it here since it is more strictly following pseudocode for the Astar search
  **Requires graph.js**
*/

import BinaryHeap from './binaryHeap';

class AStar {
  static initGrid(grid) {
    return grid.map(row => row.map(item => {
      const node = item;

      node.f = 0;
      node.g = 0;
      node.h = 0;
      node.cost = node.type;
      node.visited = false;
      node.closed = false;
      node.parent = null;

      return node;
    }));
  }

  static heap() {
    return new BinaryHeap((node => node.f));
  }

  static manhattan(pos0, pos1) {
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);

    return d1 + d2;
  }

  static neighbors(grid, node, diagonals) {
    const { x, y } = node;
    const ret = [];

    // West
    if (grid[x - 1] && grid[x - 1][y]) {
      ret.push(grid[x - 1][y]);
    }

    // East
    if (grid[x + 1] && grid[x + 1][y]) {
      ret.push(grid[x + 1][y]);
    }

    // South
    if (grid[x] && grid[x][y - 1]) {
      ret.push(grid[x][y - 1]);
    }

    // North
    if (grid[x] && grid[x][y + 1]) {
      ret.push(grid[x][y + 1]);
    }

    if (diagonals) {
      // Southwest
      if (grid[x - 1] && grid[x - 1][y - 1]) {
        ret.push(grid[x - 1][y - 1]);
      }

      // Southeast
      if (grid[x + 1] && grid[x + 1][y - 1]) {
        ret.push(grid[x + 1][y - 1]);
      }

      // Northwest
      if (grid[x - 1] && grid[x - 1][y + 1]) {
        ret.push(grid[x - 1][y + 1]);
      }

      // Northeast
      if (grid[x + 1] && grid[x + 1][y + 1]) {
        ret.push(grid[x + 1][y + 1]);
      }
    }

    return ret;
  }

  static search(gridCells, start, end, diagonal, heuristic) {
    const grid = AStar.initGrid(gridCells);

    heuristic = heuristic || AStar.manhattan;
    diagonal = !!diagonal;

    const openHeap = AStar.heap();
    openHeap.push(start);

    while (openHeap.size() > 0) {
      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      const currentNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if (currentNode === end) {
        let curr = currentNode;
        const ret = [];
        while (curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        return ret.reverse();
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true;

      // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
      const neighbors = AStar.neighbors(grid, currentNode, diagonal);

      neighbors.forEach(neighbor => {
        if (neighbor.closed || neighbor.isWall()) {
          // Not a valid node to process, skip to next neighbor.
          return;
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        const gScore = currentNode.g + neighbor.cost;
        const beenVisited = neighbor.visited;

        if (!beenVisited || gScore < neighbor.g) {
          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;

          if (!beenVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            openHeap.push(neighbor);
          } else {
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            openHeap.rescoreElement(neighbor);
          }
        }
      });
    }

    // No result was found -- empty array signifies failure to find path
    return [];
  }
}

export default AStar;
