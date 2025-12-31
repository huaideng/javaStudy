document.addEventListener('DOMContentLoaded', () => {
    const BOARD_SIZE = 15;
    const board = [];
    let currentPlayer = 'black';
    let gameOver = false;
    let gameBoardElement = document.getElementById('game-board');
    let currentPlayerElement = document.getElementById('current-player');
    let gameStatusElement = document.getElementById('game-status');
    let restartBtn = document.getElementById('restart-btn');

    // 初始化棋盘
    function initBoard() {
        // 清空现有棋盘
        gameBoardElement.innerHTML = '';
        gameBoardElement.className = 'game-board';
        
        // 创建二维数组表示棋盘
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = new Array(BOARD_SIZE).fill(null);
        }
        
        // 创建棋盘网格
        const grid = document.createElement('div');
        grid.className = 'board-grid';
        
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => handleCellClick(row, col));
                
                grid.appendChild(cell);
            }
        }
        
        gameBoardElement.appendChild(grid);
        currentPlayer = 'black';
        gameOver = false;
        updateCurrentPlayerDisplay();
        gameStatusElement.textContent = '';
    }

    // 处理点击事件
    function handleCellClick(row, col) {
        if (gameOver || board[row][col] !== null) {
            return; // 游戏结束或该位置已有棋子，不执行操作
        }
        
        // 放置棋子
        board[row][col] = currentPlayer;
        renderStone(row, col, currentPlayer);
        
        // 检查是否获胜
        if (checkWin(row, col, currentPlayer)) {
            gameOver = true;
            gameStatusElement.textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！`;
            gameStatusElement.className = 'game-status winner-message';
            return;
        }
        
        // 检查是否平局
        if (checkDraw()) {
            gameOver = true;
            gameStatusElement.textContent = '平局！';
            gameStatusElement.className = 'game-status draw-message';
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        updateCurrentPlayerDisplay();
    }

    // 渲染棋子
    function renderStone(row, col, player) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const stone = document.createElement('div');
        stone.className = `stone ${player}-stone`;
        cell.appendChild(stone);
    }

    // 检查是否获胜
    function checkWin(row, col, player) {
        // 检查四个方向：水平、垂直、左上到右下、右上到左下
        const directions = [
            [[0, 1], [0, -1]],  // 水平
            [[1, 0], [-1, 0]],  // 垂直
            [[1, 1], [-1, -1]], // 左上到右下
            [[1, -1], [-1, 1]]  // 右上到左下
        ];
        
        for (let direction of directions) {
            let count = 1; // 当前棋子算一个
            
            // 检查两个方向
            for (let [dx, dy] of direction) {
                let newRow = row + dx;
                let newCol = col + dy;
                
                // 沿着方向检查连续的同色棋子
                while (
                    newRow >= 0 && 
                    newRow < BOARD_SIZE && 
                    newCol >= 0 && 
                    newCol < BOARD_SIZE && 
                    board[newRow][newCol] === player
                ) {
                    count++;
                    newRow += dx;
                    newCol += dy;
                }
            }
            
            // 如果连续棋子数量达到5个，获胜
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }

    // 检查是否平局
    function checkDraw() {
        for (let row = 0; row < BOARD_SIZE; row++) {
            for (let col = 0; col < BOARD_SIZE; col++) {
                if (board[row][col] === null) {
                    return false; // 还有空位，未平局
                }
            }
        }
        return true; // 所有位置都满了
    }

    // 更新当前玩家显示
    function updateCurrentPlayerDisplay() {
        currentPlayerElement.textContent = currentPlayer === 'black' ? '黑棋' : '白棋';
    }

    // 重新开始游戏
    restartBtn.addEventListener('click', initBoard);

    // 初始化游戏
    initBoard();
});