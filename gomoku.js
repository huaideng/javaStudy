// 游戏状态变量
let board = [];
const BOARD_SIZE = 15;
let currentPlayer = 'black'; // 黑棋先行
let gameOver = false;
let gameBoardElement;

// 初始化游戏
function initGame() {
    gameBoardElement = document.getElementById('game-board');
    createBoard();
    setupEventListeners();
}

// 创建棋盘
function createBoard() {
    // 初始化二维数组
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
    
    // 创建棋盘网格
    gameBoardElement.innerHTML = '';
    gameBoardElement.className = 'game-board';
    
    const boardGrid = document.createElement('div');
    boardGrid.className = 'board-grid';
    
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            boardGrid.appendChild(cell);
        }
    }
    
    gameBoardElement.appendChild(boardGrid);
}

// 设置事件监听器
function setupEventListeners() {
    gameBoardElement.addEventListener('click', handleCellClick);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
}

// 处理点击事件
function handleCellClick(event) {
    if (gameOver) return;
    
    const cell = event.target.closest('.cell');
    if (!cell) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    // 检查该位置是否已有棋子
    if (board[row][col] !== null) return;
    
    // 放置棋子
    placeStone(row, col, currentPlayer);
    
    // 检查胜利条件
    if (checkWin(row, col, currentPlayer)) {
        gameOver = true;
        document.getElementById('game-status').textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！`;
        document.getElementById('game-status').className = 'game-status winner';
        return;
    }
    
    // 检查是否平局（棋盘满了）
    if (checkDraw()) {
        gameOver = true;
        document.getElementById('game-status').textContent = '平局！';
        document.getElementById('game-status').className = 'game-status draw';
        return;
    }
    
    // 切换玩家
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
    document.getElementById('current-player').textContent = currentPlayer === 'black' ? '黑棋' : '白棋';
}

// 放置棋子
function placeStone(row, col, player) {
    board[row][col] = player;
    
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const stone = document.createElement('div');
    stone.className = `stone ${player}`;
    cell.appendChild(stone);
}

// 检查胜利条件
function checkWin(row, col, player) {
    // 检查四个方向：水平、垂直、对角线（左上到右下、右上到左下）
    const directions = [
        [0, 1],   // 水平
        [1, 0],   // 垂直
        [1, 1],   // 对角线1（左上到右下）
        [1, -1]   // 对角线2（右上到左下）
    ];
    
    for (const [dx, dy] of directions) {
        let count = 1; // 当前棋子
        
        // 正向计数
        count += countDirection(row, col, dx, dy, player);
        // 反向计数
        count += countDirection(row, col, -dx, -dy, player);
        
        if (count >= 5) {
            return true;
        }
    }
    
    return false;
}

// 沿着一个方向计数
function countDirection(row, col, dx, dy, player) {
    let count = 0;
    let r = row + dx;
    let c = col + dy;
    
    while (
        r >= 0 && r < BOARD_SIZE &&
        c >= 0 && c < BOARD_SIZE &&
        board[r][c] === player
    ) {
        count++;
        r += dx;
        c += dy;
    }
    
    return count;
}

// 检查是否平局
function checkDraw() {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            if (board[row][col] === null) {
                return false;
            }
        }
    }
    return true;
}

// 重置游戏
function resetGame() {
    currentPlayer = 'black';
    gameOver = false;
    document.getElementById('current-player').textContent = '黑棋';
    document.getElementById('game-status').textContent = '';
    document.getElementById('game-status').className = 'game-status';
    createBoard();
}

// 页面加载完成后初始化游戏
window.onload = initGame;