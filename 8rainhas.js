const board = document.getElementById("game-board");
const feedback = document.getElementById("feedback");
let currentLevel = 1;
const maxLevels = 12;
const boardSize = 8; // Tamanho do tabuleiro (8x8)
let queens = [];

// Gerar níveis com células bloqueadas (exemplo simplificado)
const levels = Array.from({ length: maxLevels }, () => Array(64).fill(0));

/**
 * Inicializa o tabuleiro para o nível atual.
 */
function createBoard(level) {
    board.innerHTML = "";
    queens = [];
    feedback.textContent = "";

    const cells = levels[level - 1];
    const gridSize = boardSize + 2; // Inclui bordas

    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const div = document.createElement("div");
            const index = (row - 1) * boardSize + (col - 1); // Índice da célula

            if (row === 0 || row === gridSize - 1 || col === 0 || col === gridSize - 1) {
                // Letras (A-H) e números (1-8) nas bordas
                if (row === 0 && col > 0 && col < gridSize - 1) {
                    div.textContent = String.fromCharCode(64 + col); // Letras A-H
                    div.classList.add("col-label");
                } else if (row === gridSize - 1 && col > 0 && col < gridSize - 1) {
                    div.textContent = String.fromCharCode(64 + col); // Letras A-H
                    div.classList.add("col-label");
                } else if (col === 0 && row > 0 && row < gridSize - 1) {
                    div.textContent = gridSize - 1 - row; // Números 1-8
                    div.classList.add("row-label");
                } else if (col === gridSize - 1 && row > 0 && row < gridSize - 1) {
                    div.textContent = gridSize - 1 - row; // Números 1-8
                    div.classList.add("row-label");
                }
            } else {
                div.classList.add("cell");
                if (cells[index] === 1) div.classList.add("blocked"); // Células bloqueadas

                // Determinar o padrão de cores (tabuleiro xadrez)
                const isDark = (row + col) % 2 === 0;
                if (isDark) div.classList.add("dark");

                div.dataset.index = index;
                div.addEventListener("click", () => placeQueen(div, index));
            }

            board.appendChild(div);
        }
    }
}

/**
 * Adiciona uma rainha na célula clicada.
 */
function placeQueen(cell, index) {
    if (cell.classList.contains("blocked") || cell.querySelector(".queen")) {
        return; // Célula inválida
    }
    if (!isValidMove(index)) {
        feedback.textContent = "Movimento inválido! As rainhas não podem se atacar.";
        return;
    }

    const queen = document.createElement("div");
    queen.classList.add("queen");
    cell.appendChild(queen);
    queens.push(index);

    feedback.textContent = "";

    if (queens.length === 8) {
        feedback.textContent = "Parabéns! Você completou esta fase!";
    }
}

/**
 * Verifica se a posição é válida para uma rainha.
 */
function isValidMove(index) {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    for (const queen of queens) {
        const qRow = Math.floor(queen / boardSize);
        const qCol = queen % boardSize;

        // Mesma linha, coluna ou diagonal
        if (qRow === row || qCol === col || Math.abs(qRow - row) === Math.abs(qCol - col)) {
            return false;
        }
    }
    return true;
}

/**
 * Reinicia a fase atual.
 */
document.getElementById("reset-btn").addEventListener("click", () => createBoard(currentLevel));

/**
 * Avança para a próxima fase.
 */
document.getElementById("next-btn").addEventListener("click", () => {
    if (currentLevel < maxLevels) {
        currentLevel++;
        createBoard(currentLevel);
    } else {
        feedback.textContent = "Você completou todas as fases!";
    }
});

document.getElementById('return').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Inicializa o tabuleiro no nível 1
createBoard(currentLevel);
