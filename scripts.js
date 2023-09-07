function convertFRToIndex(location) {
    // When given a file and rank (ex "G3"), this 
    // function converts that rank to it's appropriate index
    // in a 64 element array
    for (let i = 0; i < 64; i++) {
       if (squareArray[i].id == location) {
           return i;
       }
    }
}

function frTo64(file, rank){
    fileNum = file.charCodeAt(0) - 65;
    rankNum = rank - 1;
    return rankNum * 8 + fileNum;
}


function getPiece(location) //takes file and rank location ex. B6
{
    for (let i = 0; i < pieceList.length; i++)
    {
        if (frTo64(pieceList[i].file, pieceList[i].rank) == location)
        {
            return pieceList[i];
        }
    }
}

function getPieceWithIndex(index)
{
    for (let i = 0; i < pieceList.length; i++)
    {
        if (pieceList[i].getPieceIndex() == index)
        {
            return pieceList[i];
        }
    }
}

function getPieceWithIndex(index)
{
    for (let i = 0; i < pieceList.length; i++)
    {
        if (pieceList[i].getIndex() == index)
        {
            return pieceList[i];
        }
    }
}

function getSquareWithIndex(index)
{
    for (let i = 0; i < squareList.length; i++)
    {
        if (squareList[i].getIndex() == index)
        {
            return squareList[i];
        }
    }
}

function removePiece(piece)
{
    let pieceIndex = pieceList.indexOf(piece);
    pieceList.splice(pieceIndex, 1);
}


let fileArray = [ "A", "B", "C", "D", "E", "F", "G", "H" ]

let mainBoard = new Board();

let pieceList = []

let squareList = []

let boardState = []

let squareArray = []

// White is always the first to move
let whitesMove = true;

let currentMoveFrom = 0;
let currentMoveTo = 0;

// Current Color Scheme
let darkColor = "#b48c64";
let lightColor = "#f4dcb4";

window.onload = function()
{
    buildTable();
    setNewBoard();
}

