const gameBoardElm = document.querySelector("#game-board");
const playerElm = document.querySelector("#player");
const displayInfoElm = document.querySelector("#display-info");
let playerTurn = 'black';
playerElm.textContent = 'black';

const pieces = [
    rookPiece, knightPiece, bishopPiece, queenPiece,kingPiece, bishopPiece, knightPiece, rookPiece,
    pawnPiece, pawnPiece, pawnPiece, pawnPiece, pawnPiece, pawnPiece, pawnPiece, pawnPiece,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawnPiece, pawnPiece, pawnPiece, pawnPiece, pawnPiece, pawnPiece, pawnPiece, pawnPiece,
    rookPiece, knightPiece, bishopPiece, queenPiece,kingPiece, bishopPiece, knightPiece, rookPiece,

];
// Create the game board
function createBoard(){
    pieces.forEach((piece, index) =>{
        const squareElm = document.createElement('div');
        squareElm.classList.add('square');
        squareElm.innerHTML = piece;
        squareElm.firstChild?.setAttribute('draggable', true);

        squareElm.setAttribute('piece-id', index)
        const row = Math.floor((63- index)/8) + 1;
        if (row % 2 === 0){
            squareElm.classList.add(index % 2 === 0 ? "color-1" : "color-2")
        }else{
            squareElm.classList.add(index % 2 === 0 ? "color-2" : "color-1")
        }
        if (index <= 15){
            squareElm.firstChild.firstChild.classList.add('black')
        }
        if (index >= 48){
            squareElm.firstChild.firstChild.classList.add('white')
        }
        gameBoardElm.append(squareElm);
    })
}
createBoard();

const allSquareElms = document.querySelectorAll('.square');

allSquareElms.forEach(square =>{
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', dragDrop);
})
let startPositionId;
let draggedElm;

function dragStart(e){
    startPositionId = e.target.parentNode.getAttribute('piece-id');
    draggedElm = e.target;
}

function dragOver(e){
    e.preventDefault();
}

function dragDrop(e){
    e.stopPropagation();
    const correctTurn = draggedElm.firstChild.classList.contains(playerTurn)
    const takenPiece = e.target.classList.contains('piece');
    const valid = checkIfValidMove(e.target);
    const opponentTurn = playerTurn === 'white' ? 'black' : 'white';
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentTurn);

    if (correctTurn){
        // Check if it is a valid move or not
        if (takenByOpponent && valid){
            e.target.parentNode.append(draggedElm);
            e.target.remove();
            checkWinner();
            changePlayer();
            return;
        }

        if (takenPiece && !takenByOpponent){
            displayInfoElm.textContent = "you cannot go here";
            setTimeout(() =>{
                displayInfoElm.textContent = ""
            }, 2000);
            return;
        }

        if (valid){
            e.target.append(draggedElm);
            checkWinner();
            changePlayer();
            return;
        }
    }
}

function checkIfValidMove(target){
    const targetId =  Number(target.getAttribute('piece-id'))
                    || Number(target.parentNode.getAttribute('piece-id'));
    const startId = Number(startPositionId);
    const piece = draggedElm.id;
    console.log(startId, targetId, piece);

    if (piece === "pawn-piece"){
        const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];
        if (
            starterRow.includes(startId) && startId + 8 * 2 === targetId ||
            (startId + 8) === targetId ||
            (startId + 8) - 1 === targetId && document.querySelector(`[piece-id = "${(startId + 8) - 1 }"]`).firstChild ||
            (startId + 8) + 1 === targetId && document.querySelector(`[piece-id = "${(startId + 8) + 1 }"]`).firstChild

        ){
            return true;
        }
    }else if (piece === "knight-piece"){
        if (
            startId + 8 * 2 + 1 === targetId ||
            startId + 8 * 2 - 1 === targetId ||
            startId + 8 - 2 === targetId ||
            startId + 8 + 2 === targetId ||
            startId - 8 * 2 + 1 === targetId ||
            startId - 8 * 2 - 1 === targetId ||
            startId - 8 - 2 === targetId ||
            startId - 8 + 2 === targetId
        ){return true;}
    }else if (piece === "bishop-piece" || piece === "queen-piece"){
        if (
            startId + 8 + 1 === targetId
            ||
            startId + 8 * 2 + 2 === targetId && !document.querySelector(`[piece-id = "${startId + 8 + 1}"]`).firstChild
            ||
            startId + 8 * 3 + 3 === targetId && !document.querySelector(`[piece-id = "${startId + 8 + 1}"]`).firstChild &&
                    !document.querySelector(`[piece-id = "${startId + 8 * 2 + 2}"]`).firstChild
            ||
            startId + 8 * 4 + 4 === targetId && !document.querySelector(`[piece-id = "${startId + 8 + 1}"]`).firstChild &&
                    !document.querySelector(`[piece-id = "${startId + 8 * 2 + 2}"]`).firstChild &&
                    !document.querySelector(`[piece-id = "${startId + 8 * 3 + 3}"]`).firstChild
            ||
            startId + 8 * 5 + 5 === targetId && !document.querySelector(`[piece-id = "${startId + 8 + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2 + 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 3 + 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 4 + 4}"]`).firstChild
            ||
            startId + 8 * 6 + 6 === targetId && !document.querySelector(`[piece-id = "${startId + 8 + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2 + 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 3 + 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 4 + 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 5 + 5}"]`).firstChild
            ||
            startId + 8 * 7 + 7 === targetId && !document.querySelector(`[piece-id = "${startId + 8 + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2 + 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 3 + 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 4 + 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 5 + 5}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 6 + 6}"]`).firstChild
            ||
            //........
            startId - 8 - 1 === targetId
            ||
            startId - 8 * 2 - 2 === targetId && !document.querySelector(`[piece-id = "${startId - 8 - 1}"]`).firstChild
            ||
            startId - 8 * 3 - 3 === targetId && !document.querySelector(`[piece-id = "${startId - 8 - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2 - 2}"]`).firstChild
            ||
            startId - 8 * 4 - 4 === targetId && !document.querySelector(`[piece-id = "${startId - 8 - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2 - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3 - 3}"]`).firstChild
            ||
            startId - 8 * 5 - 5 === targetId && !document.querySelector(`[piece-id = "${startId - 8 - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2 - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3 - 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 4 - 4}"]`).firstChild
            ||
            startId - 8 * 6 - 6 === targetId && !document.querySelector(`[piece-id = "${startId - 8 - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2 - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3 - 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 4 - 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 5 - 5}"]`).firstChild
            ||
            startId - 8 * 7 - 7 === targetId && !document.querySelector(`[piece-id = "${startId - 8 - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2 - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3 - 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 4 - 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 5 - 5}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 6 - 6}"]`).firstChild
            ||
            //......................
            startId - 8 + 1 === targetId
            ||
            startId - 8 * 2 + 2 === targetId && !document.querySelector(`[piece-id = "${startId - 8 + 1}"]`).firstChild
            ||
            startId - 8 * 3 + 3 === targetId && !document.querySelector(`[piece-id = "${startId - 8 + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2 + 2}"]`).firstChild
            ||
            startId - 8 * 4 + 4 === targetId && !document.querySelector(`[piece-id = "${startId - 8 + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2 + 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3 + 3}"]`).firstChild
            ||
            startId - 8 * 5 + 5 === targetId && !document.querySelector(`[piece-id = "${startId - 8 + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2 + 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3 + 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 4 + 4}"]`).firstChild
            ||
            startId - 8 * 6 + 6 === targetId && !document.querySelector(`[piece-id = "${startId - 8 + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2 + 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3 + 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 4 + 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 5 + 5}"]`).firstChild
            ||
            startId - 8 * 7 + 7 === targetId && !document.querySelector(`[piece-id = "${startId - 8 + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2 + 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3 + 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 4 + 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 5 + 5}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 6 + 6}"]`).firstChild
            ||
            //...........
            startId + 8 - 1 === targetId
            ||
            startId + 8 * 2 - 2 === targetId && !document.querySelector(`[piece-id = "${startId + 8 - 1}"]`).firstChild
            ||
            startId + 8 * 3 - 3 === targetId && !document.querySelector(`[piece-id = "${startId + 8 - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2 - 2}"]`).firstChild
            ||
            startId + 8 * 4 - 4 === targetId && !document.querySelector(`[piece-id = "${startId + 8 - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2 - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 3 - 3}"]`).firstChild
            ||
            startId + 8 * 5 - 5 === targetId && !document.querySelector(`[piece-id = "${startId + 8 - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2 - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 3 - 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 4 - 4}"]`).firstChild
            ||
            startId + 8 * 6 - 6 === targetId && !document.querySelector(`[piece-id = "${startId + 8 - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2 - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 3 - 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 4 - 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 5 - 5}"]`).firstChild
            ||
            startId + 8 * 7 - 7 === targetId && !document.querySelector(`[piece-id = "${startId - 8 - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2 - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 3 - 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 4 - 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 5 - 5}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 6 - 6}"]`).firstChild

        ){return true;}
    }else if (piece === "king-piece"){
        if (
            startId + 1 === targetId ||
            startId - 1 === targetId ||
            startId + 8 === targetId ||
            startId - 8 === targetId ||
            startId + 8 - 1 === targetId ||
            startId + 8 + 1 === targetId ||
            startId - 8 + 1 === targetId ||
            startId - 8 - 1 === targetId
        ){return true}
    }

    if (piece === "rook-piece" || piece === "queen-piece"){
        if (
            startId + 8 === targetId ||
            startId + 8 * 2 === targetId && !document.querySelector(`[piece-id = "${startId + 8}"]`).firstChild ||
            startId + 8 * 3 === targetId && !document.querySelector(`[piece-id = "${startId + 8}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2}"]`).firstChild
            ||
            startId + 8 * 4 === targetId && !document.querySelector(`[piece-id = "${startId + 8}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 3}"]`).firstChild
            ||
            startId + 8 * 5 === targetId && !document.querySelector(`[piece-id = "${startId + 8}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 4}"]`).firstChild
            ||
            startId + 8 * 6 === targetId && !document.querySelector(`[piece-id = "${startId + 8}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 5}"]`).firstChild
            ||
            startId + 8 * 7 === targetId && !document.querySelector(`[piece-id = "${startId + 8}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 5}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 8 * 6}"]`).firstChild
            ||
            // --
            startId - 8 === targetId ||
            startId - 8 * 2 === targetId && !document.querySelector(`[piece-id = "${startId - 8}"]`).firstChild ||
            startId - 8 * 3 === targetId && !document.querySelector(`[piece-id = "${startId - 8}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2}"]`).firstChild
            ||
            startId - 8 * 4 === targetId && !document.querySelector(`[piece-id = "${startId - 8}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3}"]`).firstChild
            ||
            startId - 8 * 5 === targetId && !document.querySelector(`[piece-id = "${startId - 8}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 4}"]`).firstChild
            ||
            startId - 8 * 6 === targetId && !document.querySelector(`[piece-id = "${startId - 8}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 5}"]`).firstChild
            ||
            startId - 8 * 7 === targetId && !document.querySelector(`[piece-id = "${startId - 8}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 5}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 8 * 6}"]`).firstChild
            ||
            //....
            startId - 1 === targetId ||
            startId - 2 === targetId && !document.querySelector(`[piece-id = "${startId - 1}"]`).firstChild ||
            startId - 3 === targetId && !document.querySelector(`[piece-id = "${startId - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 2}"]`).firstChild
            ||
            startId - 4 === targetId && !document.querySelector(`[piece-id = "${startId - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 3}"]`).firstChild
            ||
            startId - 5 === targetId && !document.querySelector(`[piece-id = "${startId - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 4}"]`).firstChild
            ||
            startId - 6 === targetId && !document.querySelector(`[piece-id = "${startId - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 5}"]`).firstChild
            ||
            startId - 7 === targetId && !document.querySelector(`[piece-id = "${startId - 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 5}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId - 6}"]`).firstChild
            ||
            // --
            startId + 1 === targetId ||
            startId + 2 === targetId && !document.querySelector(`[piece-id = "${startId + 1}"]`).firstChild ||
            startId + 3 === targetId && !document.querySelector(`[piece-id = "${startId + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 2}"]`).firstChild
            ||
            startId + 4 === targetId && !document.querySelector(`[piece-id = "${startId + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 3}"]`).firstChild
            ||
            startId + 5 === targetId && !document.querySelector(`[piece-id = "${startId + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 4}"]`).firstChild
            ||
            startId + 6 === targetId && !document.querySelector(`[piece-id = "${startId + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 5}"]`).firstChild
            ||
            startId + 7 === targetId && !document.querySelector(`[piece-id = "${startId + 1}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 2}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 3}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 4}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 5}"]`).firstChild &&
            !document.querySelector(`[piece-id = "${startId + 6}"]`).firstChild

        ){return true}
    }
}
function changePlayer(){
    if (playerTurn === "black"){
        reverseIds();
        playerTurn = "white";
        playerElm.textContent = "white"
    }else{
        revertIds();
        playerTurn = "black";
        playerElm.textContent = "black";
    }
}


function revertIds(){
    const allSquareElms = document.querySelectorAll('.square');
    allSquareElms.forEach((square, i) => square.setAttribute('piece-id', i));
}
function reverseIds(){
    const allSquareElms = document.querySelectorAll('.square');
    allSquareElms.forEach((square, i) => square.setAttribute('piece-id', 63-i))
}

function checkWinner(){
    const kingPieces = Array.from(document.querySelectorAll('#king-piece'));
    if (!kingPieces.some(king => king.firstChild.classList.contains('white'))){
        displayInfoElm.innerHTML = "Black Player wins!"
        document.querySelectorAll('.square').forEach(square => square.firstChild?.setAttribute('draggable', false));
    }

    if (!kingPieces.some(king => king.firstChild.classList.contains('black'))){
        displayInfoElm.innerHTML = "White Player wins!"
        document.querySelectorAll('.square').forEach(square => square.firstChild?.setAttribute('draggable', false));
    }
}