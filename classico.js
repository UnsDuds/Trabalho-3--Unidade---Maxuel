// Seleciona o tabuleiro e os botões
const chessBoard = document.getElementById("chess-board");
const resetButton = document.getElementById("reset-board");
const goBackButton = document.getElementById("go-back");

let boardState = []; // Estado atual do tabuleiro
let moveHistory = []; // Histórico de movimentos
let selectedPiece = null; // Peça selecionada para movimentação
let currentPlayer = "white"; // Jogador atual (white ou black)

/**
 * Inicializa o tabuleiro de xadrez com as peças em suas posições iniciais.
 */
function initializeBoard() {
    chessBoard.innerHTML = "";
    const testPieces = [
        ["R", "N", "B", "Q", "K", "B", "N", "R"],
        ["P", "P", "P", "P", "P", "P", "P", "P"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["p", "p", "p", "p", "p", "p", "p", "p"],
        ["r", "n", "b", "q", "k", "b", "n", "r"]
    ];

    testPieces.forEach((row, rowIndex) => {
        row.forEach((piece, colIndex) => {
            const cell = createCell(rowIndex, colIndex, piece);
            chessBoard.appendChild(cell);
        });
    });
}


/**
 * Cria uma célula do tabuleiro com ou sem peça.
 */
function createCell(row, col, piece) {
    const cell = document.createElement("div");
    const isWhite = (row + col) % 2 === 0;
    cell.classList.add(isWhite ? "white" : "black");
    cell.dataset.row = row;
    cell.dataset.col = col;

    if (piece) {
        const pieceDiv = createPieceElement(piece);
        cell.appendChild(pieceDiv);
    }

    cell.addEventListener("click", () => handleCellClick(cell));
    return cell;
}

/**
 * Cria o elemento visual de uma peça baseado no tipo.
 */
function createPieceElement(piece) {
    const pieceDiv = document.createElement("div");
    pieceDiv.classList.add("piece");

    const pieceSymbols = {
        p: "♟", P: "♙",
        r: "♜", R: "♖",
        n: "♞", N: "♘",
        b: "♝", B: "♗",
        q: "♛", Q: "♕",
        k: "♚", K: "♔"
    };

    pieceDiv.textContent = pieceSymbols[piece];
    pieceDiv.dataset.piece = piece;
    pieceDiv.dataset.color = piece === piece.toUpperCase() ? "black" : "white";

    return pieceDiv;
}


/**
 * Manipula o clique em uma célula do tabuleiro.
 */
function handleCellClick(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const pieceElement = cell.querySelector(".piece");

    if (selectedPiece) {
        // Movimentação de peça
        movePiece(cell, row, col);
    } else if (pieceElement && pieceElement.dataset.color === currentPlayer) {
        // Seleciona uma peça para movimentação
        selectPiece(cell, pieceElement);
    }
}

/**
 * Seleciona uma peça para movimentação.
 */
function selectPiece(cell, pieceElement) {
    selectedPiece = { cell, piece: pieceElement };
    cell.classList.add("selected");
}

/**
 * Move a peça para a célula de destino.
 */
function movePiece(destinationCell, row, col) {
    const originCell = selectedPiece.cell;
    const movingPiece = selectedPiece.piece;

    // Validar movimento básico (apenas movimento, sem regras específicas)
    const isValid = validateMove(originCell, destinationCell);

    if (!isValid) {
        alert("Movimento inválido!");
        clearSelection();
        return;
    }

    // Salvar o estado atual no histórico
    moveHistory.push({
        from: { row: parseInt(originCell.dataset.row), col: parseInt(originCell.dataset.col), piece: movingPiece.dataset.piece },
        to: { row, col, piece: destinationCell.querySelector(".piece")?.dataset.piece || null }
    });

    // Realizar o movimento
    destinationCell.innerHTML = "";
    destinationCell.appendChild(movingPiece);
    originCell.innerHTML = "";

    // Atualizar jogador atual
    currentPlayer = currentPlayer === "white" ? "black" : "white";

    clearSelection();
}

/**
 * Valida se o movimento é permitido (validação básica).
 */
function validateMove(originCell, destinationCell) {
    const originRow = parseInt(originCell.dataset.row);
    const originCol = parseInt(originCell.dataset.col);
    const destinationRow = parseInt(destinationCell.dataset.row);
    const destinationCol = parseInt(destinationCell.dataset.col);

    const piece = selectedPiece.piece.dataset.piece.toLowerCase();

    // Proíbe capturar peças da mesma cor
    const targetPiece = destinationCell.querySelector(".piece");
    if (targetPiece && targetPiece.dataset.color === currentPlayer) return false;

    // Validação simples para peões (exemplo: apenas para frente, sem diagonal ainda)
    if (piece === "p" || piece === "P") {
        const direction = currentPlayer === "white" ? -1 : 1;
        if (destinationRow === originRow + direction && originCol === destinationCol && !targetPiece) {
            return true;
        }
        // Adicionar mais validações de movimento (ex.: captura diagonal)
    }

    // Adicione aqui regras específicas para outras peças
    return true; // Permitir movimento para simplificação
}

/**
 * Limpa a seleção atual.
 */
function clearSelection() {
    if (selectedPiece) {
        selectedPiece.cell.classList.remove("selected");
        selectedPiece = null;
    }
}

/**
 * Reinicia o tabuleiro para o estado inicial.
 */
resetButton.addEventListener("click", () => {
    initializeBoard();
});

/**
 * Desfaz o último movimento.
 */
goBackButton.addEventListener("click", () => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory.pop();

    // Restaurar estado anterior
    const fromCell = document.querySelector(`[data-row="${lastMove.from.row}"][data-col="${lastMove.from.col}"]`);
    const toCell = document.querySelector(`[data-row="${lastMove.to.row}"][data-col="${lastMove.to.col}"]`);

    fromCell.innerHTML = "";
    toCell.innerHTML = "";

    if (lastMove.from.piece) {
        fromCell.appendChild(createPieceElement(lastMove.from.piece));
    }
    if (lastMove.to.piece) {
        toCell.appendChild(createPieceElement(lastMove.to.piece));
    }

    // Alternar jogador de volta
    currentPlayer = currentPlayer === "white" ? "black" : "white";
});
document.getElementById('go-back').addEventListener('click',()=>
    {
    window.location.href = 'menu.html';
});
// Inicializa o tabuleiro ao carregar a página
initializeBoard();
