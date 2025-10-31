class CheckersGame {
    constructor() {
        this.board = [];
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.gameOver = false;
        this.redPieces = 12;  // 红方初始棋子数
        this.blackPieces = 12; // 黑方初始棋子数
        this.initializeBoard();
        this.renderBoard();
        this.updateGameInfo();
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
                        this.board[row][col] = 'red';
                    } else if (row > 4) {
                        // 黑方棋子在底部3行
                        this.board[row][col] = 'black';
                    } else {
                        this.board[row][col] = null;
                    }
                } else {
                    this.board[row][col] = null;
                }
            }
        }
    }

    renderBoard() {
        const boardElement = document.getElementById('checkerboard');
        boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;

                // 添加棋子
                const piece = this.board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece', piece);
                    
                    // 检查是否是王棋
                    if (this.isKing(piece, row)) {
                        pieceElement.classList.add('king');
                    }
                    
                    square.appendChild(pieceElement);
                }

                square.addEventListener('click', () => this.handleSquareClick(row, col));
                boardElement.appendChild(square);
            }
        }
    }

    isKing(piece, row) {
        // 简化处理：直接根据位置判断是否是王棋
        // 实际游戏中，应为每个棋子维护一个isKing属性
        if (piece === 'red' && row === 7) return true;
        if (piece === 'black' && row === 0) return true;
        return false;
    }

    handleSquareClick(row, col) {
        if (this.gameOver) return;

        const piece = this.board[row][col];

        // 如果已经选中了一个棋子
        if (this.selectedPiece) {
            const [selectedRow, selectedCol] = this.selectedPiece;
            
            // 如果点击的是已选中的棋子，则取消选择
            if (selectedRow === row && selectedCol === col) {
                this.selectedPiece = null;
                this.renderBoard();
                return;
            }
            
            // 尝试移动棋子
            if (this.isValidMove(selectedRow, selectedCol, row, col)) {
                this.movePiece(selectedRow, selectedCol, row, col);
                
                // 检查是否需要继续跳跃
                if (this.canContinueJump(selectedRow, selectedCol, row, col)) {
                    // 玩家可以继续跳跃
                    this.selectedPiece = [row, col];
                    this.renderBoard();
                    // 高亮选中的棋子
                    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
                    square.classList.add('selected');
                } else {
                    this.selectedPiece = null;
                    this.switchPlayer();
                    this.renderBoard();
                    this.updateGameInfo();
                    this.checkGameOver();
                }
                return;
            }
        }

        // 选择一个棋子
        if (piece && piece === this.currentPlayer) {
            this.selectedPiece = [row, col];
            this.renderBoard();
            // 高亮选中的棋子
            const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
            square.classList.add('selected');
        }
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        // 基本移动规则检查
        const rowDiff = toRow - fromRow;
        const colDiff = Math.abs(toCol - fromCol);
        
        // 只能在深色格子上移动
        if ((toRow + toCol) % 2 === 0) return false;
        
        // 目标位置必须为空
        if (this.board[toRow][toCol] !== null) return false;
        
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;
        
        // 检查是否是王棋
        const isKing = this.isKing(piece, fromRow);
        
        // 王棋可以向前或向后移动
        if (isKing) {
            // 对角线移动
            if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;
        } else {
            // 普通棋子只能向前移动（根据颜色决定方向）
            if (piece === 'red' && rowDiff <= 0) return false;
            if (piece === 'black' && rowDiff >= 0) return false;
        }
        
        // 普通移动（对角线一格）
        if (Math.abs(rowDiff) === 1 && colDiff === 1) return true;
        
        // 跳跃移动（对角线两格，需要跳过对方棋子）
        if (Math.abs(rowDiff) === 2 && colDiff === 2) {
            const middleRow = fromRow + rowDiff / 2;
            const middleCol = fromCol + (toCol - fromCol) / 2;
            const middlePiece = this.board[middleRow][middleCol];
            
            // 中间必须有对方棋子
            if (middlePiece && middlePiece !== piece) {
                return true;
            }
        }
        
        return false;
    }

    canContinueJump(fromRow, fromCol, toRow, toCol) {
        // 检查跳跃后是否可以继续跳跃
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        
        // 只检查跳跃移动
        if (Math.abs(rowDiff) !== 2 || Math.abs(colDiff) !== 2) return false;
        
        // 检查四个对角线方向是否有可跳的棋子
        const directions = [
            [2, 2], [2, -2], [-2, 2], [-2, -2]  // 跳跃方向
        ];
        
        for (const [dRow, dCol] of directions) {
            const newRow = toRow + dRow;
            const newCol = toCol + dCol;
            const middleRow = toRow + dRow/2;
            const middleCol = toCol + dCol/2;
            
            // 检查边界
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) continue;
            if (middleRow < 0 || middleRow > 7 || middleCol < 0 || middleCol > 7) continue;
            
            // 检查中间是否有对方棋子，目标位置是否为空
            if (this.board[middleRow][middleCol] && 
                this.board[middleRow][middleCol] !== this.currentPlayer && 
                this.board[newRow][newCol] === null) {
                return true;
            }
        }
        
        return false;
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        // 移动棋子
        const piece = this.board[fromRow][fromCol];
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // 如果是跳跃移动，移除被跳过的棋子
        if (Math.abs(toRow - fromRow) === 2) {
            const middleRow = fromRow + (toRow - fromRow) / 2;
            const middleCol = fromCol + (toCol - fromCol) / 2;
            const capturedPiece = this.board[middleRow][middleCol];
            this.board[middleRow][middleCol] = null;
            
            // 更新棋子数量
            if (capturedPiece === 'red') {
                this.redPieces--;
            } else if (capturedPiece === 'black') {
                this.blackPieces--;
            }
        }
        
        // 检查是否成为王棋
        this.checkForKing(toRow, toCol);
    }

    checkForKing(row, col) {
        const piece = this.board[row][col];
        if (!piece) return;
        
        // 红方棋子到达对面成为王棋
        if (piece === 'red' && row === 7) {
            // 这里应该为棋子添加一个王棋标记
            // 为简化实现，我们重新渲染整个棋盘
        }
        
        // 黑方棋子到达对面成为王棋
        if (piece === 'black' && row === 0) {
            // 这里应该为棋子添加一个王棋标记
            // 为简化实现，我们重新渲染整个棋盘
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
    }

    updateGameInfo() {
        document.getElementById('current-player').textContent = 
            this.currentPlayer === 'red' ? '红方' : '黑方';
    }

    checkGameOver() {
        // 检查是否有一方棋子数为0
        if (this.redPieces === 0) {
            this.gameOver = true;
            setTimeout(() => {
                alert('黑方获胜！');
            }, 10);
        } else if (this.blackPieces === 0) {
            this.gameOver = true;
            setTimeout(() => {
                alert('红方获胜！');
            }, 10);
        } else {
            // 检查当前玩家是否还有可移动的棋子
            let hasValidMove = false;
            
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (this.board[row][col] === this.currentPlayer) {
                        // 检查这个棋子是否有任何有效的移动
                        if (this.hasValidMoves(row, col)) {
                            hasValidMove = true;
                            break;
                        }
                    }
                }
                if (hasValidMove) break;
            }
            
            if (!hasValidMove) {
                this.gameOver = true;
                setTimeout(() => {
                    const winner = this.currentPlayer === 'red' ? '黑方' : '红方';
                    alert(`${winner}获胜！对方无法移动棋子。`);
                }, 10);
            }
        }
    }

    hasValidMoves(row, col) {
        // 检查指定棋子是否有任何有效的移动
        const directions = [
            [1, 1], [1, -1], [-1, 1], [-1, -1]  // 四个对角线方向
        ];
        
        for (const [dRow, dCol] of directions) {
            // 检查普通移动
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
                if (this.isValidMove(row, col, newRow, newCol)) {
                    return true;
                }
            }
            
            // 检查跳跃移动
            const jumpRow = row + 2 * dRow;
            const jumpCol = col + 2 * dCol;
            
            if (jumpRow >= 0 && jumpRow <= 7 && jumpCol >= 0 && jumpCol <= 7) {
                if (this.isValidMove(row, col, jumpRow, jumpCol)) {
                    return true;
                }
            }
        }
        
        return false;
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new CheckersGame();
});