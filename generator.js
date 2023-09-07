function generateLegalMoves(whitesTurn) {
    // moveColor is the color of the pieces who's turn it is to move
    let moveColor;
    if (whitesTurn) {
        moveColor = "white"
    } else {
        moveColor = "black"
    }

    pieceList.forEach(piece => {
        // We only are looking for pieces on the board, not empty squares
        if (piece == 0) {
            return;
        }

        piece.currentLegalMoves = new Board();
        /* First make legal move bitboard all 0s for each piece
        piece.currentLegalMoves = [];
        for (let i = 0; i < 64; i++) {
            piece.currentLegalMoves.push(0);
        }
        */

        // We only can move the color of pieces who's turn it is
        if (piece.color != moveColor) {
            return;
        }

        if (piece.pieceType == "knight") {
            generateKnightMoves(piece);
        }
     
        if (piece.pieceType == "pawn") {
            generatePawnMoves(piece);
        }

        if (piece.pieceType == "bishop" || 
                piece.pieceType == "rook" || 
                piece.pieceType == "queen") {
            generateSliderMoves(piece);
        }

        if (piece.pieceType == "king") {
            generateKingMoves(piece);
        }
    });
}

function generateKnightMoves(piece) {
    let possibleKnightMoves = 
        [[-2, -1], [-2, 1], [2, -1], [2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2]];

    // First let's convert our 1D starting square index into 2 dimensions
    let oneDIndex = piece.getIndex();

    let startingIndex = [Math.floor(oneDIndex / 8), oneDIndex % 8];
    possibleKnightMoves.forEach(offset => {

        // Apply offsets to find ending index after potential move
        let endingIndex = [startingIndex[0] + offset[0], startingIndex[1] + offset[1]];
        // For each move we need to check if it's off the board
        if ((endingIndex[0] < 0 || endingIndex[0] > 7)
            || (endingIndex[1] < 0 || endingIndex[1] > 7)) {
            return;
        }
        // Now that we're done checking if the move is off the board,
        // let's go back to a 1D index to make the rest of the checks easier
        let index = (endingIndex[0] * 8) + endingIndex[1];
        // If the square is occupied by one of the same colored pieces, we can't move there
        if (mainBoard.checkSquare(index)) {
            if (getPieceWithIndex(index).color == piece.color) {
                return;
            }
        }
        // If we've passed all these tests, let's call it legal lol
        piece.currentLegalMoves.addPieceWithIndex(index);
    });
}

function generatePawnMoves(piece) {
    // Which way is "forward" for the pawn?
    let forwardOffset;
    if (piece.color == "white") {
        forwardOffset = 8;
    } else {
        forwardOffset = -8;
    }
    
    // Pawns can always move one square forward if it's empty

    let pawnIndex = piece.getIndex();
    if (!mainBoard.checkSquare(pawnIndex + forwardOffset)) {
        piece.currentLegalMoves.addPieceWithIndex(pawnIndex + forwardOffset);

        // Additionally, if the pawn has not yet moved,
        // It can move forward 2 squares, however both of the squares
        // must be unoccupied
        if (piece.hasMoved == false) {
            if (!mainBoard.checkSquare(pawnIndex + forwardOffset * 2)) {

                piece.currentLegalMoves.addPieceWithIndex(pawnIndex + forwardOffset * 2);
            }
        }
    }

    // Pawns can capture pieces only diagonally
    let firstDiagonalIndex = pawnIndex + forwardOffset + 1;
    let secondDiagonalIndex = pawnIndex + forwardOffset - 1;
    
    // We do this first check to aviod accessing attributes that don't exist
    if (mainBoard.checkSquare(firstDiagonalIndex)) {
        if (getPieceWithIndex(firstDiagonalIndex).color != piece.color) {
            piece.currentLegalMoves.addPieceWithIndex(firstDiagonalIndex);
        }
    }

    // Now the same thing for the other diagonal
        if (mainBoard.checkSquare(secondDiagonalIndex)) {
            if (getPieceWithIndex(secondDiagonalIndex).color != piece.color) {
                piece.currentLegalMoves.addPieceWithIndex(secondDiagonalIndex);
            }

        }
}

function generateSliderMoves(piece) {
    // This fucntion generates moves for the pieces I consider
    // to be "sliding" pieces. (Bishops, Queens, and Rooks)
    
    // First let's figure out the offsets for each direction a
    // Sliding piece could go on a 2D array represented board
    let NorthOffset = [-1, 0];
    let EastOffset = [0, 1];
    let SouthOffset = [1, 0];
    let WestOffset = [0, -1];
    let NorthEastOffset = [-1, 1];
    let NorthWestOffset = [-1, -1];
    let SouthEastOffset = [1, 1];
    let SouthWestOffset = [1, -1];

    let directions = [];

    // Depending on the type of piece, it can slide in different directions.
    if (piece.pieceType == "rook" || piece.pieceType == "queen") {
        directions.push(NorthOffset, EastOffset, SouthOffset, WestOffset);
    }

    if (piece.pieceType == "bishop" || piece.pieceType == "queen") {
        directions.push(NorthEastOffset, NorthWestOffset, SouthEastOffset, SouthWestOffset);
    }

    // First let's convert our 1D starting square index into 2 dimensions
    let oneDIndex = piece.getIndex();

    let startingIndex = [Math.floor(oneDIndex / 8), oneDIndex % 8];

    // We go in each direction till we hit a piece or the end of the board
    let targetSquare;
    directions.forEach(offset => {
        // .slice actually copies the array instead
        // of just making reference to it
        targetSquare = startingIndex.slice();
        while (true) {
            targetSquare[0] += offset[0];
            targetSquare[1] += offset[1];

            // Is the target square off the board?
            if ((targetSquare[0] < 0 || targetSquare[0] > 7)
                || (targetSquare[1] < 0 || targetSquare[1] > 7)) {
                break;
            }

            // Now that we're done checking if the move is off the board,
            // let's go back to a 1D index to make the rest of the checks easier
            let index = (targetSquare[0] * 8) + targetSquare[1];

            // Is the target square empty, if so, we can move there and continue the loop
            if (!mainBoard.checkSquare(index)) {
                piece.currentLegalMoves.addPieceWithIndex(index);
                continue;
            }

            // If the square is occupied by a friendly piece, we can't move there
            // Additonally, we can't go any farther in that direction.
            // So we break the loop
            if (getPieceWithIndex(index).color == piece.color) {
                break;
            }
            // However, if it's an enemy piece, we can capture.
            // But we still can't keep going that direction.
            else {
                piece.currentLegalMoves.addPieceWithIndex(index);
                break;
            }

        }
    });
}

function generateKingMoves(piece) {
    // I am purposefully keeping king moves seperate from other
    // Sliding pieces for the practicality of implementing
    // Castling later on
    
    // First let's figure out the offsets for each direction a
    // King could go on a 2D array represented board
    let NorthOffset = [-1, 0];
    let EastOffset = [0, 1];
    let SouthOffset = [1, 0];
    let WestOffset = [0, -1];
    let NorthEastOffset = [-1, 1];
    let NorthWestOffset = [-1, -1];
    let SouthEastOffset = [1, 1];
    let SouthWestOffset = [1, -1];

    directions = [NorthOffset, EastOffset, SouthOffset, WestOffset,
        NorthEastOffset, NorthWestOffset, SouthEastOffset, SouthWestOffset];

    // First let's convert our 1D starting square index into 2 dimensions
    let oneDIndex = piece.getIndex();

    let startingIndex = [Math.floor(oneDIndex / 8), oneDIndex % 8];

    let targetSquare;
    directions.forEach(offset => {
        targetSquare = startingIndex.slice();
        targetSquare[0] += offset[0];
        targetSquare[1] += offset[1];

        // Is the target square off the board?
        if ((targetSquare[0] < 0 || targetSquare[0] > 7)
            || (targetSquare[1] < 0 || targetSquare[1] > 7)) {
            return;
        }

        // Now that we're done checking if the move is off the board,
        // let's go back to a 1D index to make the rest of the checks easier
        let index = (targetSquare[0] * 8) + targetSquare[1];

        // Is the target square empty, if so, we can move there and go to next offset
        if (!mainBoard.checkSquare(index)) {
            piece.currentLegalMoves.addPieceWithIndex(index);
            return;
        }

        // If the square is occupied by a friendly piece, we can't move there
        if (getPieceWithIndex(index).color == piece.color) {
            return;
        }
        // However, if it's an enemy piece, we can capture.
        else {
            piece.currentLegalMoves.addPieceWithIndex(index);
            return;
        }
    });

    // Time to check if the king can castle
    // The king can't be in check when castling, remember to implement this!!!!
    if (piece.hasMoved) {
        return;
    }

    // First we'll check queenside caslting assuming white is on bottom of board
    // This could lead to errors later on but is fixable lol
    // First we check if the rook is there
    let rookLocation = oneDIndex - 4;
    if (mainBoard.checkSquare(rookLocation)) {
        // Then we check if the piece in the square has moved
        // If not, it must be our rook and it's legal to castle with
        if (getPieceWithIndex(rookLocation).hasMoved == false) {
            // Now we must make sure the 3 squares between them are empty
            let allEmpty = true;
            for (let i = oneDIndex - 1; i > rookLocation; i--) {
                if (mainBoard.checkSquare(i)) {
                    allEmpty = false;
                    break;
                }
            }
            // If all the square are empty, we meet all conditions for castling
            if (allEmpty) {
                piece.currentLegalMoves.addPieceWithIndex(rookLocation);
            }
        }
    }

    // Now we check the kingside rook
    rookLocation = oneDIndex + 3;
    if (mainBoard.checkSquare(rookLocation)) {
        // Then we check if the piece in the square has moved
        // If not, it must be our rook and it's legal to castle with
        if (getPieceWithIndex(rookLocation).hasMoved == false) {
            // Now we must make sure the 3 squares between them are empty
            let allEmpty = true;
            for (let i = oneDIndex + 1; i < rookLocation; i++) {
                if (mainBoard.checkSquare(i)) {
                    allEmpty = false;
                    break;
                }
            }
            // If all the square are empty, we meet all conditions for castling
            if (allEmpty) {
                piece.currentLegalMoves.addPieceWithIndex(rookLocation);
            }
        }
    }
}