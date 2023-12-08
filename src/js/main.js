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
            changePlayer();
            return;
        }
    }
}

function checkIfValidMove(target){
    const targetId =  Number(target.getAttribute('piece-id'))
                    || Number(target.parentNode.getAttribute('piece-id'));
    const startId = startPositionId;
    const piece = draggedElm.id;
    console.log(startId, targetId, piece);

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