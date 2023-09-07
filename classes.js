
class Board {
    constructor()
    {
        this.start = 0n
    }
    addPiece(piece){
        let posNum = BigInt(frTo64(piece.file, piece.rank));
        this.start |= (1n << posNum);
    }
    addPieceWithIndex(index){
        let indexNum = BigInt(index);
        this.start |= (1n << indexNum);
    }
    checkSquare(indexNum){
        if ((1n << BigInt(indexNum)) & this.start){
            return true;
        }
        else{
            return false;
        }
    }
    moveFromTo(from, to)
    {
        let posFrom = BigInt(frTo64(from[0], parseInt(from[1])));
        let posTo = BigInt(frTo64(to[0], parseInt(to[1])));
        this.start ^= (1n << posFrom);
        this.start |= (1n << posTo);
    }
}


class Square {
    constructor(file, rank, squareElement)
    {
        this.file = file;
        this.rank = rank;
        this.squareElement = squareElement;
        this.isKing = false;
    }
    getIndex(){
        return frTo64(this.file, this.rank);
    }
}


class Piece {
    constructor(color, pieceType, pieceStyle, file, rank){
        this.color = color;
        this.pieceType = pieceType;
        this.pieceStyle = pieceStyle;
        this.img_pathname = `Pieces/${this.pieceStyle}/${this.color}_${this.pieceType}.png`;
        this.file = file; //Letter left to right
        this.rank = rank; //Number bottom to top
        this.captured = false;
        this.hasMoved = false;
        this.currentLegalMoves = [];
    }
    putPieceOnBoard() {
        document.getElementById(`${this.file}${this.rank}`).innerHTML +=
        `<img draggable="true" class="Piece" src="${this.img_pathname}" 
        id="${this.file}${this.rank}image" ondragstart="drag(event)"
        ondragend="unShowLegalSquares()">`
    }
    capturePiece() {
        document.getElementById(`${this.color}Pieces`).innerHTML += `<img src="${this.img_pathname}" style="position: relative">`;
        this.captured = true;
    }
    getIndex(){
        return frTo64(this.file, this.rank);
    }
    changePieceImg(){
        document.getElementById(`${this.file}${this.rank}image`).src = `Pieces/${this.pieceStyle}/${this.color}_${this.pieceType}.png`;
    }
}