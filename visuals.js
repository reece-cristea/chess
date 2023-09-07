function allowDrop(ev) {  

    // This is what allows the drop
    ev.preventDefault();
    
    highlightSquare(ev);
}


function noDrop(ev) {  
    highlightSquare(ev);
}


function highlightSquare(ev) {
    // Let's highlight the current board square we're dragging over
    
    // We want to get to the <td> element
    let elementToHighlight = ev.target.parentElement;
    // So if we're hovering over a boardSquare, the next one up
    // Is the <td>. This is because sometimes we're hovering over
    // Empty squares and sometimes we hover over images
    if (elementToHighlight.classList.contains("boardSquare")) {
        elementToHighlight =  elementToHighlight.parentElement;
    }

    // We'll need to set this value back to 1 when we stop hovering
    elementToHighlight.style.opacity = "0.70";
}


function unhighlight(ev) {
    
    let elementToHighlight = ev.target.parentElement;
    if (elementToHighlight.classList.contains("boardSquare")) {
        elementToHighlight =  elementToHighlight.parentElement;
    }

    // We'll need to set this value back to 1 when we stop hovering
    elementToHighlight.style.opacity = "1";
}


function drag(ev) {
    // When the user drags an image, we store the id
    // of the image element so we can manipulate it later
    ev.dataTransfer.setData("text", ev.target.id);
    pieceLocation = ev.target.id.slice(0, 2);
    currentMoveFrom = pieceLocation;
    showLegalSquares(pieceLocation);
}


function castling(kingImg, rookImg) {
    // This function takes HTML elements for the king and rook
    // That are currently castling and performs all nessesary
    // actions in the HTML and backend

    // Let's start with visual cleanup
    let square = rookImg.parentElement;
    elementToHighlight = square.parentElement;
    elementToHighlight.style.opacity = "1";

    for (let i = 0; i < 64; i++) {
        squareList[i].squareElement.style.backgroundColor = 'transparent';
    }
    
    // Highlighting the squares for this move
    let previousSquare = kingImg.parentElement;
    square.style.backgroundColor = "rgba(227, 237, 74, 0.35)";
    previousSquare.style.backgroundColor = "rgba(227, 237, 74, 0.35)";

    // Now we need to know which side we are castling to
    let rookLocation = rookImg.id.slice(0, 2);
    let kingLocation = kingImg.id.slice(0, 2);
    let rookIndex = frTo64(rookLocation[0], parseInt(rookLocation[1]));
    let kingIndex = frTo64(kingLocation[0], parseInt(kingLocation[1]));
    let newKingIndex;
    let newRookIndex;
    if (rookIndex % 8 == 0) {
        // Rook is on left side
        newKingIndex = kingIndex - 2;
        newRookIndex = kingIndex - 1;

    } else {
        // Rook is on right side
        newKingIndex = kingIndex + 2;
        newRookIndex = kingIndex + 1;
    }

    // Now we can move the HTML elements to their right place
    getSquareWithIndex(newKingIndex).squareElement.appendChild(kingImg);
    getSquareWithIndex(newRookIndex).squareElement.appendChild(rookImg);

    // Both the ids for rook and king need to be updated
    kingImg.id = `${getSquareWithIndex(newKingIndex).squareElement.id}image`;
    rookImg.id = `${getSquareWithIndex(newRookIndex).squareElement.id}image`;

    // Let's get the king and rook from boardState
    let king = getPieceWithIndex(kingIndex);
    let rook = getPieceWithIndex(rookIndex);

    //Both the pieces have moved now
    king.hasMoved = true;
    rook.hasMoved = true;

    // Let's move the pieces on bitboard
    kingCurrentMoveTo = getSquareWithIndex(newKingIndex).squareElement.id;
    kingCurrentMoveFrom = getSquareWithIndex(kingIndex).squareElement.id;
    mainBoard.moveFromTo(kingCurrentMoveFrom, kingCurrentMoveTo);
    king.file = kingCurrentMoveTo[0];
    king.rank = parseInt(kingCurrentMoveTo[1]);

    rookCurrentMoveTo = getSquareWithIndex(newRookIndex).squareElement.id;
    rookCurrentMoveFrom = getSquareWithIndex(rookIndex).squareElement.id;
    mainBoard.moveFromTo(rookCurrentMoveFrom, rookCurrentMoveTo);
    rook.file = rookCurrentMoveTo[0];
    rook.rank = parseInt(rookCurrentMoveTo[1]);

    // We need to update who's turn it is
    whitesMove = !whitesMove;

    // Generate new legal moves
    generateLegalMoves(whitesMove);
}

function movePiece(ev) {
    let piece;
    let pieceID;
    let elementToHighlight;
    let square;

    // Every time we make a move we play this sound effect
    var snd = new Audio("Sounds/move.wav"); // buffers automatically when created
    snd.play();

    // This means the square is occupied by a piece because
    // The event.target is an <img> element
    if (ev.target.classList.contains("capture")) {

        let capturedPieceImg = ev.target.previousElementSibling;
        let capturedPieceLocation = capturedPieceImg.id.slice(0, 2);
        let capturedPieceIndex = frTo64(capturedPieceLocation[0], parseInt(capturedPieceLocation[1]));
        let capturedPiece = getPieceWithIndex(capturedPieceIndex);
        square = capturedPieceImg.parentElement;
        pieceID = ev.dataTransfer.getData("text");
        piece = document.getElementById(pieceID);
        let pieceLocation = piece.id.slice(0, 2);
        let pieceIndex = frTo64(pieceLocation[0], parseInt(pieceLocation[1]));
        let pieceClass = getPieceWithIndex(pieceIndex);

        // Are we capturing a piece of the same color?
        // If so that indicates we are actually trying to castle
        if (pieceClass.color == capturedPiece.color) {
            castling(piece, capturedPieceImg);
            return;
        }
        
        
        // We have to erase the img inside table cell
        // This is the piece we are capturing!
        square.innerHTML = "";
        if (mainBoard.checkSquare(frTo64(square.id[0], square.id[1])))
        {
            let capPieceIndex = frTo64(square.id[0], parseInt(square.id[1]));
            let capPiece = getPieceWithIndex(capPieceIndex);
            capPiece.capturePiece();
            removePiece(capPiece);
        }
    } 
    else {
        square = ev.target.parentElement;
        pieceID = ev.dataTransfer.getData("text");
        piece = document.getElementById(pieceID)
    }
    
    //check if pawn hits end of board for queening
    let pieceLocation = piece.id.slice(0,2);
    let movedPiece = getPieceWithIndex(frTo64(pieceLocation[0], parseInt(pieceLocation[1])));
    if(parseInt(square.id[1]) == 8 && movedPiece.color == "white" && movedPiece.pieceType == "pawn")
    {
        movedPiece.pieceType = "queen";
        movedPiece.changePieceImg();
    }
    if(parseInt(square.id[1]) == 1 && movedPiece.color == "black" && movedPiece.pieceType == "pawn")
    {
        movedPiece.pieceType = "queen";
        movedPiece.changePieceImg();
    }

    //Move the html element to proper table cell
    previousSquare = piece.parentElement;
    square.appendChild(piece);

    // Unhighlight the square we dragged onto
    // We do this because the user never dragged off the
    // square they dropped, so it wasn't unhighlighted that way

    elementToHighlight = square.parentElement;
    elementToHighlight.style.opacity = "1";

    // Now we show the square we moved from and the square we moved to
    // By highlighting them yellow until the next move
    
    // But first, we unhighlight the previous two squares
    for (let i = 0; i < 64; i++) {
        squareList[i].squareElement.style.backgroundColor = 'transparent';
    } 
    square.style.backgroundColor = "rgba(227, 237, 74, 0.35)";
    previousSquare.style.backgroundColor = "rgba(227, 237, 74, 0.35)";

    //Move piece on bitboard
    currentMoveTo = square.id;
    mainBoard.moveFromTo(currentMoveFrom, currentMoveTo);
    let pieceIndex = frTo64(currentMoveFrom[0], parseInt(currentMoveFrom[1]))
    let pieceMoved = getPiece(pieceIndex);
    pieceMoved.file = currentMoveTo[0];
    pieceMoved.rank = parseInt(currentMoveTo[1]);
    piece.id = `${square.id}image`;
    pieceMoved.hasMoved = true;


    // We need to update who's turn it is
    whitesMove = !whitesMove

    // Generate new legal moves
    generateLegalMoves(whitesMove);

}



function showLegalSquares(movingPieceLocation) {
    let index = frTo64(movingPieceLocation[0], parseInt(movingPieceLocation[1]));
    let movingPiece = getPieceWithIndex(index);
    for (let i = 0; i < 64; i++) {
        if (movingPiece.currentLegalMoves.checkSquare(i)) {
            
            // If the square is empty, let's add a circle
            if (!mainBoard.checkSquare(i)) {
                let circle = document.createElement('img');
                circle.src = `PieceMovementIndicators/circle.png`;
                circle.classList.add("indicator");
                circle.style.opacity = ".8";
                getSquareWithIndex(i).squareElement.appendChild(circle);
            } else {
                // Otherwise, we must be capturing a piece, so we add that image
                let corners = document.createElement('img');
                corners.src = `PieceMovementIndicators/capture.png`;
                corners.classList.add("indicator");
                corners.classList.add("capture");
                corners.style.opacity = ".8";
                getSquareWithIndex(i).squareElement.appendChild(corners);
            }

            getSquareWithIndex(i).squareElement.ondragover = function() {allowDrop(event)};
        }
    }
} 


function unShowLegalSquares() {
    for (let i = 0; i < 64; i++) {
        let square = squareList[i];
        // We only want to remove the images that are
        // move indicators in each square
        let children = square.squareElement.children;
        for (let i = 0; i < children.length; i++) {
            child = children[i];
            if (child.classList.contains("indicator")) {
                child.remove();
            }
        }
        square.squareElement.ondragover = function() {noDrop(event)};
    } 
}