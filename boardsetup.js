function setNewBoard() {

    let pieceOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
    var pieceStyle = document.getElementById("pieceStyle").value;

    // Wipe everything from piecelist and mainboard
    pieceList = [];
    mainBoard = new Board();

    // White always starts
    whitesMove = true;

    // Unhighlight any previously made moves
    for (let i = 0; i < 64; i++) {
        squareList[i].squareElement.style.backgroundColor = 'transparent';
    } 

    // Remove any captured pieces from the side of board
    document.getElementById("whitePieces").innerHTML = "";
    document.getElementById("blackPieces").innerHTML = "";

    for (let rank = 8; rank >= 1; rank--)
    {     
        
        let blackCounter = 0;
        let whiteCounter = 0;

        for (let i = 0; i <= 7; i++) {
            
            let file = fileArray[i];
            let square = document.getElementById(`${file}${rank}`);

            //Clear any pieces already in square
            square.innerHTML = "";
            
            //Black pieces (except pawns)
            if (rank == 8) {
                let pieceType = pieceOrder[blackCounter]
                
                let notPawn = new Piece("black", pieceType, pieceStyle, file, rank);
                notPawn.putPieceOnBoard();

                blackCounter++;
                boardState.push(notPawn);
                pieceList.push(notPawn);
                mainBoard.addPiece(notPawn);
            }
            
            //Black pawns
            if (rank == 7) {
                let pawn = new Piece("black", "pawn", pieceStyle, file, rank);
                pawn.putPieceOnBoard();
                boardState.push(pawn);
                pieceList.push(pawn);
                mainBoard.addPiece(pawn);
            }

            //Update boardstate with empty squares
            if (rank > 2 && rank < 7) {
                boardState.push(0);
            }

            //White pawns
            if (rank == 2) {
                let pawn = new Piece("white", "pawn", pieceStyle, file, rank);
                pawn.putPieceOnBoard();
                boardState.push(pawn);
                pieceList.push(pawn);
                mainBoard.addPiece(pawn);
            }

            //White pieces (except pawns)
            if (rank == 1) {
                let pieceType = pieceOrder[whiteCounter]
                
                let notPawn = new Piece("white", pieceType, pieceStyle, file, rank);
                notPawn.putPieceOnBoard();

                whiteCounter++;
                boardState.push(notPawn);
                pieceList.push(notPawn);
                mainBoard.addPiece(notPawn);
            }
        }
    }
    
    // Finally generate all new legal moves
    generateLegalMoves(whitesMove);
}


function buildTable() {
    
    let table = document.getElementById("board");


    // The outer loop is for each rank (row) on the board
    for (let rank = 8; rank >= 1; rank--)
    {
        let row = table.insertRow(-1);
        let nextSquareGrey;
        
        // Even ranks (rows) start with a white square
        if (rank % 2 == 0) {
            nextSquareGrey = false;
        } else {
            nextSquareGrey = true;
        }

        // The innerloop generates each file (column) within one rank
        for (let i = 0; i <= 7; i++) {
            let file = fileArray[i];
            let cell = row.insertCell(-1);

            let squareElement = document.createElement("div");
            squareElement.id = `${file}${rank}`;
            squareElement.className = "boardSquare";

            // Making every other square grey in this rank (row) dark color
            if (nextSquareGrey) {
                cell.style.backgroundColor = darkColor;
                squareElement.classList.add("dark");
                nextSquareGrey = false;
            } 
            // If not make it light color
            else {
                cell.style.backgroundColor = lightColor;
                nextSquareGrey = true;
                squareElement.classList.add("light");
            }
           
            squareElement.ondrop = function() {movePiece(event)};
            squareElement.ondragover = function() {noDrop(event)};
            squareElement.ondragleave = function() {unhighlight(event)};

            cell.append(squareElement);
            
            let square = new Square(file, rank, squareElement);
            squareList.push(square);
            squareArray.push(squareElement);

        }
    }
}

