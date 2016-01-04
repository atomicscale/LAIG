/**
 *  GameState File
 */

var degToRad = Math.PI / 180.0;

/**
 *
 */
function GameState(scene) {

  CGFscene.call(this);

  this.scene = scene;
  this.state = 0;

  this.WhitePieces = [];
  this.BlackPieces = [];

  this.server = new PrologServer(this.scene);

  this.BlackPieces[1] = new MyPiece(this.scene, 1, 0, 0, 1, 0);
  this.BlackPieces[2] = new MyPiece(this.scene, 2, 0, 0, 3, 0);
  this.BlackPieces[3] = new MyPiece(this.scene, 3, 0, 0, 5, 0);
  this.BlackPieces[4] = new MyPiece(this.scene, 4, 0, 0, 7, 0);
  this.BlackPieces[5] = new MyPiece(this.scene, 5, 0, 1, 0, 0);
  this.BlackPieces[6] = new MyPiece(this.scene, 6, 0, 1, 2, 0);
  this.BlackPieces[7] = new MyPiece(this.scene, 7, 0, 1, 4, 0);
  this.BlackPieces[8] = new MyPiece(this.scene, 8, 0, 1, 6, 0);
  
  this.WhitePieces[9] = new MyPiece(this.scene, 19, 1, 6, 0, 0);
  this.WhitePieces[10] = new MyPiece(this.scene, 20, 1, 6, 2, 0);
  this.WhitePieces[11] = new MyPiece(this.scene, 21, 1, 6, 4, 0);
  this.WhitePieces[12] = new MyPiece(this.scene, 22, 1, 6, 6, 0);
  this.WhitePieces[13] = new MyPiece(this.scene, 23, 1, 7, 1, 0);
  this.WhitePieces[14] = new MyPiece(this.scene, 24, 1, 7, 3, 0);
  this.WhitePieces[15] = new MyPiece(this.scene, 25, 1, 7, 5, 0);
  this.WhitePieces[16] = new MyPiece(this.scene, 26, 1, 7, 7, 0);
  


  /* Represents the game board */
  this.gameBoard = [
                    [[],[this.BlackPieces[1]],[],[this.BlackPieces[2]],[],[this.BlackPieces[3]],[],[this.BlackPieces[4]]],
                    [[this.BlackPieces[5]],[],[this.BlackPieces[6]],[],[this.BlackPieces[7]],[],[this.BlackPieces[8]],[]],
                    [[],[],[],[],[],[],[],[]],
                    [[],[],[],[],[],[],[],[]],
                    [[],[],[],[],[],[],[],[]],
                    [[],[],[],[],[],[],[],[]],
                    [[],[this.WhitePieces[9]],[],[this.WhitePieces[10]],[],[this.WhitePieces[11]],[],[this.WhitePieces[12]]],
                    [[this.WhitePieces[13]],[],[this.WhitePieces[14]],[],[this.WhitePieces[15]],[],[this.WhitePieces[16]],[]]
                    ];


  this.board = new MyBoard(this.scene);

  /* Picking Variables */
  this.selectedPiece;
  this.selectedType;
  this.selectedCell;

}

/**
 *
 */
GameState.prototype.display = function() {

}

/**
 *
 */
GameState.prototype.logic = function () {

  // 0 -> Scene Loaded Ok!
  // 1 -> Picking Piece
  // 2 -> Board Picking
  // 3 -> Moving Piece

  switch(this.state){

      case 0:
        console.log("Scene Loaded Ok! Changing to state 1!\n");
        this.state = 1;
        break;

      case 1:
        console.log("<--- Picking Piece --->");
        if(this.PiecePicked())
          this.state = 2;
        break;

      case 2:
        console.log("<--- Board Picking --->");
        if(this.BoardPick())
          this.state = 3;
        break;

      case 3:
        console.log("<--- Moving Piece --->");
        this.checkIfTheMoveIsPossible();
        this.movePiece();
        this.state = 1;
      default:
        break;
  }

}


/**
 *
 */
GameState.prototype.PiecePicked = function () {

      if(this.scene.pickMode == false){

        if(this.scene.pickResults != null && this.scene.pickResults.length > 0){

            var object = this.scene.pickResults[0][0];
            var objectId = this.scene.pickResults[0][1];

            if(object){

              console.log("Select Piece -> " + objectId);
              this.selectedPiece = object;
              this.selectedtype = object.objectName();
              this.scene.pickResults.splice(0, this.scene.pickResults.length);
              return true;

            }

            console.log("---> Pressed outside pieces! Try again!");
            this.scene.pickResults.splice(0, this.scene.pickResults.length);

        }
      }

    return false;
}

GameState.prototype.BoardPick = function () {

  if (this.scene.pickMode == false) {

    if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {

      var object = this.scene.pickResults[0][0];
			var objectId = this.scene.pickResults[0][1];

      if (object){

				this.selectedCell = object;
				console.log("Selected board -> " + objectId);
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
				return true;

			}

			console.log("---> Pressed outside Board! Try again!");
			this.scene.pickResults.splice(0,this.scene.pickResults.length);

		}
	}

	   return false;
}


GameState.prototype.movePiece = function () {

    var id = this.selectedCell.getid();

    // Getting the coordinates of the next cell
    if(id <= 8){
      var coordToMoveX = 0;
      var coordToMoveY = Math.abs((8 - id) - 7);
    } else if(id <= 16){
      var coordToMoveX = 1;
      var coordToMoveY = Math.abs((16 - id) - 7);
    } else if(id <= 24){
      var coordToMoveX = 2;
      var coordToMoveY = Math.abs((24 - id) - 7);
    } else if(id <= 32){
      var coordToMoveX = 3;
      var coordToMoveY = Math.abs((32 - id) - 7);
    } else if(id <= 40){
      var coordToMoveX = 4;
      var coordToMoveY = Math.abs((40 - id) - 7);
    } else if(id <= 48){
      var coordToMoveX = 5;
      var coordToMoveY = Math.abs((48- id) - 7);
    } else if(id <= 56){
      var coordToMoveX = 6;
      var coordToMoveY = Math.abs((56 - id) - 7);
    } else if(id <= 64){
      var coordToMoveX = 7;
      var coordToMoveY = Math.abs((64 - id) - 7);
    }

    // Moving Piece
    var rowPiece = this.selectedPiece.getRow();
    var colPiece = this.selectedPiece.getCol();


    for(var i = this.gameBoard[rowPiece][colPiece].length - 1; i >= 0; i--){

        var idPieceTop = this.gameBoard[rowPiece][colPiece][i].getid();
        var typePiece = this.gameBoard[rowPiece][colPiece][i].getType();

        var increment = this.gameBoard[coordToMoveX][coordToMoveY].length;

        this.pushPieceBoard(idPieceTop, coordToMoveX, coordToMoveY, typePiece); // pushing piece to the board
        this.gameBoard[rowPiece][colPiece].splice(i, 1);

        if(typePiece == 0)
        {

          this.BlackPieces[idPieceTop].setRow(coordToMoveX);
          this.BlackPieces[idPieceTop].setCol(coordToMoveY);
          this.BlackPieces[idPieceTop].setHeight(increment);

        } else if(typePiece == 1){

          this.WhitePieces[idPieceTop].setRow(coordToMoveX);
          this.WhitePieces[idPieceTop].setCol(coordToMoveY);
          this.WhitePieces[idPieceTop].setHeight(increment);

        }

    }

}

GameState.prototype.pushPieceBoard = function (id, row, col, type) {

      if(type == 0)
        this.gameBoard[row][col].push(this.BlackPieces[id]);
      else if(type == 1)
        this.gameBoard[row][col].push(this.WhitePieces[id]);

}


GameState.prototype.checkIfTheMoveIsPossible = function () {

      var currentRow = this.selectedPiece.getRow();
      var currentCol = this.selectedPiece.getCol();

      var cellId = this.selectedCell.getid();

      // Converting board
      var boardGame = this.convertBoard();

      // Getting the coordinates of the next cell
      if(cellId <= 8){
        var nextRow = 0;
        var nextCol = Math.abs((8 - cellId) - 7);
      } else if(cellId <= 16){
        var nextRow = 1;
        var nextCol = Math.abs((16 - cellId) - 7);
      } else if(cellId <= 24){
        var nextRow = 2;
        var nextCol = Math.abs((24 - cellId) - 7);
      } else if(cellId <= 32){
        var nextRow = 3;
        var nextCol = Math.abs((32 - cellId) - 7);
      } else if(cellId <= 40){
        var nextRow = 4;
        var nextCol = Math.abs((40 - cellId) - 7);
      } else if(cellId <= 48){
        var nextRow = 5;
        var nextCol = Math.abs((48 - cellId) - 7);
      } else if(cellId <= 56){
        var nextRow = 6;
        var nextCol = Math.abs((56 - cellId) - 7);
      } else if(cellId <= 64){
        var nextRow = 7;
        var nextCol = Math.abs((64 - cellId) - 7);
      }


      // Getting the direction

      if(currentRow == nextRow){

        // Moving left or right

          if(currentCol - nextCol < 0)
          {
            // Right Move

            var requestString = "checkRightMoves(" + boardGame + "," + currentRow + "," + currentCol + ")";

            var rightMoves;
            console.log("Can't move to right")

            /* Add impossible moves*/

         /*   this.server.getPrologRequest(requestString, function(data) {
             rightMoves = data.currentTarget.responseText;
            });
		*/
            if(rightMoves == 6){
              console.log("Can move to right");
            }


          } else {

            // Left Move

            /* */


          }


      } else if(currentCol == nextCol) {

        // Moving down or up

        if(currentRow - nextRow < 0)
        {

          // Up move

          /* */


        } else {

          // Down Move


          /* */

        }


      } else {

        // Other Directions

        // Lower Right
        if(currentCol - nextCol > 0 && currentRow - nextRow > 0){

        }

        // Lower Left
        if(currentCol - nextCol > 0 && currentRow - nextRow < 0){

        }

        // Up Left
        if(currentCol - nextCol < 0 && currentRow - nextRow < 0){

        }

        // Up Right
        if(currentCol - nextCol < 0 && currentRow - nextRow > 0){

        }

      }

}

GameState.prototype.convertBoard = function() {

    var resultBoard = "[";

    for(var i = 0; i < 8; i++){

      for(var j = 0; j < 8; j++){

        if(j == 0)
          resultBoard += "[[";
        else
          resultBoard += "[";

        for(var k = 0; k < this.gameBoard[i][j].length; k++){

            if((this.gameBoard[i][j][k] instanceof MyPiece && i == 0))
            {
              var type = this.gameBoard[i][j][k].getType();

              if(type == 0)
                resultBoard += "0";
              else if(type == 1)
                resultBoard += "1";

            } else {

              var type = this.gameBoard[i][j][k].getType();

              if(k != this.gameBoard[i][j].length - 1){

                  if(type == 0)
                    resultBoard += "0,";
                  else if(type == 1)
                    resultBoard += "1,";

              } else {

                if(type == 0)
                  resultBoard += "0";
                else if(type == 1)
                  resultBoard += "1";

              }

            }
        }

        resultBoard += "]";

        if(j == 7)
          resultBoard += "]";
        else
          resultBoard += ",";
      }

      if(i == 7)
       resultBoard += "]";
      else
        resultBoard += ",";

    }

    //resultBoard += "]";

    return resultBoard;

}
