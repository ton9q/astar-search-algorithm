import $ from 'jquery';

import {
  GRAPH_NODE_TYPES,
  CSS_CLASSES,
} from '../constants';

import Graph from './graph';
import AStar from '../astar';

class GraphSearch {
  constructor($graph, options) {
    this.$graph = $graph;
    this.options = $.extend({ wallFrequency: 0.1, debug: true, gridSize: 10 }, options);
    this.grid = [];
    this.graph = null;
    this.initialize();
  }

  initialize() {
    const { $graph } = this;
    const self = this;

    this.grid = [];
    const nodes = [];

    $graph.empty();

    const cellWidth = ($graph.width() / this.options.gridSize) - 2; // -2 for border
    const cellHeight = ($graph.height() / this.options.gridSize) - 2;

    const $cellTemplate = $('<span />').addClass('gridItem').width(cellWidth).height(cellHeight);
    let startSet = false;

    for (let x = 0; x < this.options.gridSize; x += 1) {
      const $row = $("<div class='clear' />");

      const nodeRow = [];
      const gridRow = [];

      for (let y = 0; y < this.options.gridSize; y += 1) {
        const id = `cell_${x}_${y}`;
        const $cell = $cellTemplate.clone();
        $cell.attr('id', id).attr('x', x).attr('y', y);
        $row.append($cell);
        gridRow.push($cell);

        const isWall = Math.floor(Math.random() * (1 / self.options.wallFrequency));
        if (isWall === 0) {
          nodeRow.push(GRAPH_NODE_TYPES.WALL);
          $cell.addClass(CSS_CLASSES.WALL);
        } else {
          const cellWeight = ($('#generateWeights').prop('checked') ? (Math.floor(Math.random() * 3)) * 2 + 1 : 1);
          nodeRow.push(cellWeight);
          $cell.addClass(`weight${cellWeight}`);
          if ($('#displayWeights').prop('checked')) { $cell.html(cellWeight); }
          if (!startSet) {
            $cell.addClass(CSS_CLASSES.START);
            startSet = true;
          }
        }
      }
      $graph.append($row);

      this.grid.push(gridRow);
      nodes.push(nodeRow);
    }

    this.graph = new Graph(nodes);

    // bind cell event, set start/wall positions
    this.$cells = $graph.find('.gridItem');
    this.$cells.click(function onCellClick() {
      self.cellClicked($(this));
    });
  }

  cellClicked($end) {
    const end = this.nodeFromElement($end);

    if ($end.hasClass(CSS_CLASSES.WALL) || $end.hasClass(CSS_CLASSES.START)) {
      $('#message').text('Couldn\'t find a path, because you \'clicked on wall or start!');
      return;
    }

    this.$cells.removeClass(CSS_CLASSES.FINISH);
    $end.addClass('finish');
    const $start = this.$cells.filter(`.${CSS_CLASSES.START}`);
    const start = this.nodeFromElement($start);

    const sTime = new Date();
    const path = AStar.search(this.graph.nodes, start, end, this.options.diagonal);
    const fTime = new Date();

    if (!path || path.length === 0) {
      $('#message').text(`Couldn't find a path (${fTime - sTime}ms)`);
      this.animateNoPath();
    } else {
      $('#message').text(`Search took ${fTime - sTime}ms.`);
      if (this.options.debug) {
        this.drawDebugInfo(this.options.debug);
      }
      this.animatePath(path);
    }
  }

  setOption(opt) {
    this.options = $.extend(this.options, opt);
    if (opt.debug || opt.debug === false) {
      this.drawDebugInfo(opt.debug);
    }
  }

  drawDebugInfo(show) {
    this.$cells.html(' ');
    const that = this;
    if (show) {
      that.$cells.each(function changeCell() {
        const node = that.nodeFromElement($(this));
        let debug = false;
        if (node.visited) {
          debug = `F: ${node.f}<br />G: ${node.g}<br />H: ${node.h}`;
        }

        if (debug) {
          $(this).html(debug);
        }
      });
    }
  }

  nodeFromElement($cell) {
    return this.graph.nodes[parseInt($cell.attr('x'), 10)][parseInt($cell.attr('y'), 10)];
  }

  animateNoPath() {
    const { $graph } = this;

    const jiggle = (lim, i = 0) => {
      if (i >= lim) {
        $graph.css('top', 0).css('left', 0); return;
      }

      $graph.css('top', Math.random() * 6).css('left', Math.random() * 6);

      setTimeout(() => {
        jiggle(lim, i + 1);
      }, 5);
    };

    jiggle(15);
  }

  animatePath(path) {
    const { grid } = this;
    const timeout = 1000 / grid.length;
    const elementFromNode = node => grid[node.x][node.y];

    const removeClass = (currentPath, i) => {
      if (i >= currentPath.length) return;
      elementFromNode(currentPath[i]).removeClass(CSS_CLASSES.ACTIVE);
      setTimeout(() => { removeClass(currentPath, i + 1); }, timeout * currentPath[i].cost);
    };

    const addClass = (currentPath, i) => {
      if (i >= currentPath.length) { // Finished showing path, now remove
        removeClass(currentPath, 0);
      } else {
        elementFromNode(currentPath[i]).addClass(CSS_CLASSES.ACTIVE);
        setTimeout(() => { addClass(currentPath, i + 1); }, timeout * currentPath[i].cost);
      }
    };

    addClass(path, 0);
    this.$graph.find(`.${CSS_CLASSES.START}`).removeClass(CSS_CLASSES.START);
    this.$graph.find(`.${CSS_CLASSES.FINISH}`).removeClass(CSS_CLASSES.FINISH).addClass(CSS_CLASSES.START);
  }
}

export default GraphSearch;
