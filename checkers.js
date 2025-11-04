class CheckersGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.validMoves = [];
        this.gameOver = false;
        this.initializeBoard();
        this.renderBoard();
        this.setupEventListeners();
    }

    initializeBoard() {
        // 创建8x8棋盘
        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                // 只在深色格子上放置棋子
                if ((row + col) % 2 === 1) {
                    if (row < 3) {
                        // 红方棋子在顶部3行
                        this.board[row][col] = { color: 'red', isKing: false };
                    } else if (row > 4) {
                        // 黑方棋子在底部3行
                        this.board[row][col] = { color: 'black', isKing: false };
                    } else {
                        // 中间两行为空
                        this.board[row][col] = null;
                    }
                } else {
                    // 浅色格子始终为空
                    this.board[row][col] = null;
                }
            }
        }
    }

    renderBoard() {
        const checkerboard = document.getElementById('checkerboard');
        checkerboard.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;

                // 如果格子上有棋子，添加棋子元素
                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `piece ${piece.color} ${piece.isKing ? 'king' : ''}`;
                    pieceElement.dataset.row = row;
                    pieceElement.dataset.col = col;
                    square.appendChild(pieceElement);
                }

                checkerboard.appendChild(square);
            }
        }

        // 更新当前玩家显示
        document.getElementById('current-player').textContent = 
            this.currentPlayer === 'red' ? '红方' : '黑方';
    }

    setupEventListeners() {
        // 棋盘点击事件
        document.getElementById('checkerboard').addEventListener('click', (e) => {
            if (this.gameOver) return;

            const target = e.target;
            
            // 点击棋子
            if (target.classList.contains('piece')) {
                const row = parseInt(target.dataset.row);
                const col = parseInt(target.dataset.col);
                this.selectPiece(row, col);
            } 
            // 点击格子
            else if (target.classList.contains('square')) {
                const row = parseInt(target.dataset.row);
                const col = parseInt(target.dataset.col);
                this.movePiece(row, col);
            }
        });

        // 重新开始按钮
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });
    }

    selectPiece(row, col) {
        const piece = this.board[row][col];
        
        // 只能选择当前玩家的棋子
        if (piece && piece.color === this.currentPlayer) {
            // 取消之前的选择
            this.clearSelection();
            
            // 选择新棋子
            this.selectedPiece = { row, col };
            this.validMoves = this.calculateValidMoves(row, col);
            
            // 高亮选中的棋子和有效移动位置
            document.querySelector(`.piece[data-row="${row}"][data-col="${col}"]`)
                .parentElement.classList.add('selected');
                
            this.validMoves.forEach(move => {
                document.querySelector(`.square[data-row="${move.row}"][data-col="${move.col}"]`)
                    .classList.add('valid-move');
            });
        }
    }

    clearSelection() {
        // 清除所有高亮
        document.querySelectorAll('.square.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.square.valid-move').forEach(el => el.classList.remove('valid-move'));
        
        this.selectedPiece = null;
        this.validMoves = [];
    }

    calculateValidMoves(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];

        const moves = [];
        const directions = [];

        // 普通棋子只能向前移动，王棋可以向前后移动
        if (piece.color === 'red' || piece.isKing) {
            directions.push({ dr: -1, dc: -1 }, { dr: -1, dc: 1 }); // 红方或王棋向上
        }
        if (piece.color === 'black' || piece.isKing) {
            directions.push({ dr: 1, dc: -1 }, { dr: 1, dc: 1 }); // 黑方或王棋向下
        }

        // 检查普通移动
        for (const dir of directions) {
            const newRow = row + dir.dr;
            const newCol = col + dir.dc;
            
            if (this.isValidPosition(newRow, newCol) && !this.board[newRow][newCol]) {
                moves.push({ row: newRow, col: newCol, capture: false });
            }
        }

        // 检查跳跃吃子
        for (const dir of directions) {
            const jumpRow = row + dir.dr * 2;
            const jumpCol = col + dir.dc * 2;
            const captureRow = row + dir.dr;
            const captureCol = col + dir.dc;
            
            if (this.isValidPosition(jumpRow, jumpCol) && 
                !this.board[jumpRow][jumpCol] &&
                this.board[captureRow][captureCol] &&
                this.board[captureRow][captureCol].color !== piece.color) {
                moves.push({ 
                    row: jumpRow, 
                    col: jumpCol, 
                    capture: true, 
                    captureRow: captureRow, 
                    captureCol: captureCol 
                });
            }
        }

        return moves;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    movePiece(row, col) {
        if (!this.selectedPiece || this.gameOver) return;

        // 检查是否是有效移动
        const move = this.validMoves.find(m => m.row === row && m.col === col);
        if (!move) return;

        const piece = this.board[this.selectedPiece.row][this.selectedPiece.col];
        
        // 执行移动
        this.board[row][col] = piece;
        this.board[this.selectedPiece.row][this.selectedPiece.col] = null;
        
        // 如果是吃子移动，移除被吃的棋子
        if (move.capture) {
            this.board[move.captureRow][move.captureCol] = null;
        }
        
        // 检查是否可以成王（到达对方底线）
        if (!piece.isKing) {
            if ((piece.color === 'red' && row === 0) || 
                (piece.color === 'black' && row === 7)) {
                piece.isKing = true;
            }
        }
        
        // 清除选择
        this.clearSelection();
        
        // 切换玩家
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        
        // 重新渲染棋盘
        this.renderBoard();
        
        // 检查游戏是否结束
        this.checkGameOver();
    }

    checkGameOver() {
        let redPieces = 0;
        let blackPieces = 0;
        
        // 计算双方棋子数量
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    if (piece.color === 'red') redPieces++;
                    else blackPieces++;
                }
            }
        }
        
        // 检查是否有玩家没有棋子了
        if (redPieces === 0 || blackPieces === 0) {
            this.gameOver = true;
            const winner = redPieces > 0 ? '红方' : '黑方';
            alert(`游戏结束！${winner}获胜！`);
        }
    }

    resetGame() {
        this.board = [];
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.validMoves = [];
        this.gameOver = false;
        this.initializeBoard();
        this.renderBoard();
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new CheckersGame();
});