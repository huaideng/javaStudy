document.addEventListener('DOMContentLoaded', () => {
    const BOARD_SIZE = 15;
    const board = [];
    let currentPlayer = 'black'; // 黑棋先手
    let gameOver = false;
    let gameBoardElement = document.getElementById('game-board');
    let currentPlayerElement = document.getElementById('current-player');
    let gameStatusElement = document.getElementById('game-status');
    let restartBtn = document.getElementById('restart-btn');

    // 初始化棋盘
    function initBoard() {
        // 清空棋盘
        gameBoardElement.innerHTML = '';
        gameBoardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 30px)`;
        
        // 创建二维数组表示棋盘
        for (let i = 0; i < BOARD_SIZE; i++) {
            board[i] = [];
            const row = document.createElement('div');
            row.className = 'board-row';
            
            for (let j = 0; j < BOARD_SIZE; j++) {
                board[i][j] = null;
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('click', () => handleCellClick(i, j));
                
                row.appendChild(cell);
            }
            gameBoardElement.appendChild(row);
        }
    }

    // 处理点击事件
    function handleCellClick(row, col) {
        if (gameOver || board[row][col] !== null) {
            return; // 游戏结束或该位置已有棋子，不执行操作
        }
        
        // 在棋盘上放置棋子
        board[row][col] = currentPlayer;
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add(currentPlayer);
        
        // 检查是否获胜
        if (checkWin(row, col)) {
            gameOver = true;
            gameStatusElement.textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！`;
            return;
        }
        
        // 检查是否平局（棋盘满了）
        if (isBoardFull()) {
            gameOver = true;
            gameStatusElement.textContent = '平局！';
            return;
        }
        
        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        currentPlayerElement.textContent = currentPlayer === 'black' ? '黑棋' : '白棋';
    }

    // 检查是否获胜
    function checkWin(row, col) {
        const player = board[row][col];
        
        // 四个方向：水平、垂直、左上到右下、右上到左下
        const directions = [
            [[0, 1], [0, -1]],   // 水平
            [[1, 0], [-1, 0]],   // 垂直
            [[1, 1], [-1, -1]],  // 对角线1
            [[1, -1], [-1, 1]]   // 对角线2
        ];
        
        for (let dir of directions) {
            let count = 1; // 当前位置的棋子
            
            // 检查两个方向
            for (let d of dir) {
                let r = row + d[0];
                let c = col + d[1];
                
                // 沿着方向检查
                while (
                    r >= 0 && r < BOARD_SIZE &&
                    c >= 0 && c < BOARD_SIZE &&
                    board[r][c] === player
                ) {
                    count++;
                    r += d[0];
                    c += d[1];
                }
            }
            
            // 如果连成5个或以上，则获胜
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }

    // 检查棋盘是否已满
    function isBoardFull() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    // 重新开始游戏
    function restartGame() {
        gameOver = false;
        currentPlayer = 'black';
        currentPlayerElement.textContent = '黑棋';
        gameStatusElement.textContent = '';
        initBoard();
    }

    // 绑定重新开始按钮事件
    restartBtn.addEventListener('click', restartGame);

    // 初始化游戏
    initBoard();
});