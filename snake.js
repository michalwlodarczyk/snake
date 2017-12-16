const astar = require('./astar.js');
const Graph = require('./graph.js').Graph;

class Snake {
  constructor(game) {
    this.game = game;
  }

  findPath(board, from, to) {
    const graph = new Graph(board);
    return astar.search(graph.nodes, graph.nodes[from.y][from.x], graph.nodes[to.y][to.x]);
  }

  getSnakeHead(board) {
    let head = {};
    board.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (cell && cell.player && cell.player === this.game.you && cell.head) {
          head = { y: rowIdx, x: colIdx };
        }
      })
    });

    return head;
  }

  getSnakeDirection(board) {
    let direction = '';
    board.forEach(row => {
      row.forEach(cell => {
        if (cell && cell.player && cell.player === this.game.you && cell.head) {
          direction = cell.head;
        }
      })
    });

    return direction;
  }

  getApple(board) {
    let apple = {};
    board.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        if (cell === '🍎') {
          apple = { y: rowIdx, x: colIdx };
        }
      })
    });

    return apple;
  }

  getBoardArray(board) {
    return board.map(row => {
      return row.map(cell => {
        // empty for apple
        if (cell === '🍎') {
          return 0;
        }
        // empty for snake head
        if (cell && cell.player && cell.player === this.game.you && cell.head) {
          return 0;
        }
        // empty/wall
        return cell ? 1 : 0;
      })
    });
  }

  checkAvailable(pos) {
    return this.getBoardArray(this.state.board)[pos.y][pos.x] === 0;
  }

  moveTo(from, to, snakeDirection) {
    const [direction] = [
      {
        direction: 'W',
        value: Math.max(0, from.x - to.x)
      },
      {
        direction: 'E',
        value: Math.max(0, to.x - from.x)
      },
      {
        direction: 'N',
        value: Math.max(0, from.y - to.y)
      },
      {
        direction: 'S',
        value: Math.max(0, to.y - from.y)
      },
    ].filter(pos => pos.value)
      .sort((alpha, bravo) => bravo.value - alpha.value)
      .map(x => x.direction);

    switch (`${snakeDirection}, ${direction}`) {
      case 'N, E': return 'R';
      case 'E, S': return 'R';
      case 'S, W': return 'R';
      case 'W, N': return 'R';
      case 'N, W': return 'L';
      case 'W, S': return 'L';
      case 'S, E': return 'L';
      case 'E, N': return 'L';

      // case 'N, S':
      //   return ["L", "R"][Math.floor(Math.random() * 2)];
      // case 'E, W':
      //   return ["L", "R"][Math.floor(Math.random() * 2)];
      // case 'S, N':
      //   return ["L", "R"][Math.floor(Math.random() * 2)];
      // case 'W, E':
      //   return ["L", "R"][Math.floor(Math.random() * 2)];

      case 'N, S':
        if (this.checkAvailable({y: from.y - 1, x: from.x})) {
          return 'L';
        }
        if (this.checkAvailable({y: from.y + 1, x: from.x})) {
          return 'R';
        }
        return undefined;
      case 'E, W':
        if (this.checkAvailable({y: from.y, x: from.x - 1})) {
          return 'L';
        }
        if (this.checkAvailable({y: from.y, x: from.x + 1})) {
          return 'R';
        }
        return undefined;
      case 'S, N':
        if (this.checkAvailable({y: from.y + 1, x: from.x})) {
          return 'L';
        }
        if (this.checkAvailable({y: from.y - 1, x: from.x})) {
          return 'R';
        }
        return undefined;
      case 'W, E':
        if (this.checkAvailable({y: from.y, x: from.x + 1})) {
          return 'L';
        }
        if (this.checkAvailable({y: from.y, x: from.x - 1})) {
          return 'R';
        }
        return undefined;
    }
  }

  getMove(state) {
    this.state = state;
    const boardArray = this.getBoardArray(state.board);
    const headPos = this.getSnakeHead(state.board);
    const snakeDir = this.getSnakeDirection(state.board);
    const applePos = this.getApple(state.board);

    const path = this.findPath(boardArray, headPos, applePos);
    const nextStep = { y: path[0].x, x: path[0].y };

    return this.moveTo(headPos, nextStep, snakeDir);
  }
}

module.exports = Snake;
