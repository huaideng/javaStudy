// 五子棋游戏逻辑
document.addEventListener('DOMContentLoaded', () => {
  const BOARD_SIZE = 15;
  const board = [];
  let currentPlayer = 'black'; // 黑棋先手
  let gameOver = false;
  let gameBoardElement = document.getElementById('game-board');
  let currentPlayerElement = document.getElementById('current-player');
  let gameResultElement = document.getElementById('game-result');
  let resetBtn = document.getElementById('reset-btn');

  // 初始化棋盘数据和界面
  function initBoard() {
    // 初始化二维数组
    for (let i = 0; i < BOARD_SIZE; i++) {
      board[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        board[i][j] = null;
      }
    }

    // 创建棋盘界面
    gameBoardElement.innerHTML = '';
    gameBoardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 30px)`;
    gameBoardElement.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 30px)`;

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener('click', handleCellClick);
        gameBoardElement.appendChild(cell);
      }
    }
  }

  // 处理点击事件
  function handleCellClick(event) {
    if (gameOver) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    // 检查该位置是否已有棋子
    if (board[row][col] !== null) {
      return;
    }

    // 放置棋子
    board[row][col] = currentPlayer;
    const stone = document.createElement('div');
    stone.classList.add('stone', currentPlayer);
    event.target.appendChild(stone);

    // 检查是否获胜
    if (checkWin(row, col, currentPlayer)) {
      gameOver = true;
      gameResultElement.textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！`;
      gameResultElement.classList.remove('hidden');
    } else {
      // 切换玩家
      currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
      currentPlayerElement.textContent = currentPlayer === 'black' ? '黑棋' : '白棋';
    }
  }

  // 检查是否获胜
  function checkWin(row, col, player) {
    // 检查四个方向：水平、垂直、两个对角线
    const directions = [
      [0, 1],   // 水平
      [1, 0],   // 垂直
      [1, 1],   // 对角线1 (左上到右下)
      [1, -1]   // 对角线2 (右上到左下)
    ];

    for (const [dx, dy] of directions) {
      let count = 1; // 当前位置的棋子

      // 正方向计数
      for (let i = 1; i < 5; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        if (
          newRow >= 0 && newRow < BOARD_SIZE &&
          newCol >= 0 && newCol < BOARD_SIZE &&
          board[newRow][newCol] === player
        ) {
          count++;
        } else {
          break;
        }
      }

      // 反方向计数
      for (let i = 1; i < 5; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        if (
          newRow >= 0 && newRow < BOARD_SIZE &&
          newCol >= 0 && newCol < BOARD_SIZE &&
          board[newRow][newCol] === player
        ) {
          count++;
        } else {
          break;
        }
      }

      // 如果连成5个，则获胜
      if (count >= 5) {
        return true;
      }
    }

    return false;
  }

  // 重置游戏
  function resetGame() {
    currentPlayer = 'black';
    gameOver = false;
    currentPlayerElement.textContent = '黑棋';
    gameResultElement.classList.add('hidden');
    initBoard();
  }

  // 绑定重置按钮事件
  resetBtn.addEventListener('click', resetGame);

  // 初始化游戏
  initBoard();
});