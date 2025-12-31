// 五子棋游戏逻辑
document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 15;
    const board = [];
    let currentPlayer = 'black'; // 黑棋先行
    let gameOver = false;
    let gameBoardElement = document.getElementById('game-board');
    let currentPlayerElement = document.getElementById('current-player');
    let gameResultElement = document.getElementById('game-result');
    let resetBtn = document.getElementById('reset-btn');

    // 初始化棋盘
    function initBoard() {
        // 创建二维数组表示棋盘
        for (let i = 0; i < boardSize; i++) {
            board[i] = new Array(boardSize).fill(null);
        }

        // 创建棋盘网格
        gameBoardElement.innerHTML = '';
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => handleCellClick(row, col));
                
                gameBoardElement.appendChild(cell);
            }
        }
    }

    // 处理格子点击事件
    function handleCellClick(row, col) {
        if (gameOver || board[row][col] !== null) {
            return; // 游戏结束或已有棋子，不执行操作
        }

        // 放置棋子
        board[row][col] = currentPlayer;
        
        // 创建棋子元素
        const cell = document.querySelector(`.board-cell[data-row="${row}"][data-col="${col}"]`);
        const piece = document.createElement('div');
        piece.className = `piece ${currentPlayer}`;
        cell.appendChild(piece);

        // 检查是否获胜
        if (checkWin(row, col)) {
            gameOver = true;
            gameResultElement.textContent = `${currentPlayer === 'black' ? '黑棋' : '白棋'} 获胜！`;
            return;
        }

        // 检查是否平局
        if (checkDraw()) {
            gameOver = true;
            gameResultElement.textContent = '平局！';
            return;
        }

        // 切换玩家
        currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
        currentPlayerElement.textContent = currentPlayer === 'black' ? '黑棋' : '白棋';
    }

    // 检查是否获胜
    function checkWin(row, col) {
        const player = board[row][col];
        if (!player) return false;

        // 四个方向：水平、垂直、对角线（右上到左下）、对角线（左上到右下）
        const directions = [
            [[0, 1], [0, -1]],   // 水平
            [[1, 0], [-1, 0]],   // 垂直
            [[1, 1], [-1, -1]],  // 对角线1
            [[1, -1], [-1, 1]]   // 对角线2
        ];

        for (const [dir1, dir2] of directions) {
            let count = 1; // 当前棋子本身

            // 沿着第一个方向计算连续棋子数
            let r = row + dir1[0];
            let c = col + dir1[1];
            while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) {
                count++;
                r += dir1[0];
                c += dir1[1];
            }

            // 沿着第二个方向计算连续棋子数
            r = row + dir2[0];
            c = col + dir2[1];
            while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === player) {
                count++;
                r += dir2[0];
                c += dir2[1];
            }

            // 如果连续棋子数达到5个，则获胜
            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    // 检查是否平局
    function checkDraw() {
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                if (board[row][col] === null) {
                    return false;
                }
            }
        }
        return true;
    }

    // 重置游戏
    function resetGame() {
        gameOver = false;
        currentPlayer = 'black';
        gameResultElement.textContent = '';
        currentPlayerElement.textContent = '黑棋';
        initBoard();
    }

    // 绑定重置按钮事件
    resetBtn.addEventListener('click', resetGame);

    // 初始化游戏
    initBoard();
});