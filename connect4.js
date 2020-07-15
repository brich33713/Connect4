/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

function setwidth() {
	let width = Number(prompt('How many columns would you like? A normal game is 7'));
	return width;
}
function setHeight() {
	let height = Number(prompt('How many rows would you like? A normal game is 6'));
	return height;
}

let WIDTH = setwidth();
let HEIGHT = setHeight();

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	board = [];
	for (let i = 0; i < HEIGHT; i++) {
		board.push([]);
		for (let j = 0; j < WIDTH; j++) {
			board[i][j] = 'null';
		}
	}

	return board;
}

function createTopRow(htmlBoard) {
  
  for (var y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (var x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.prepend(row);
	}
}

function createOtherRows(htmlBoard) {
  // creates the top row selecting which column the player will drop their piece in
  let top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
  for (var x = 0; x < WIDTH; x++) {
		var headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.prepend(top);
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	let htmlBoard = document.querySelector('#board');
	htmlBoard.innerText = '';
	htmlBoard.addEventListener('click', handleClick);
  
  //creates top row for selecting column
  createTopRow(htmlBoard);
  
  //creates rest of the table for holding pieces
	createOtherRows(htmlBoard);
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0
	let count = 0;
	for (let array of board) {
		if (array[x] !== 'null') {
			count++;
		}
	}
	return count;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	const newPiece = document.createElement('div');
	newPiece.className = currPlayer === 1 ? 'piece player1' : 'piece player2';
	document.getElementById(`${y}-${x}`).append(newPiece);
}

/** endGame: announce game end */

function endGame(msg) {
	// TODO: pop up alert message
	let message = alert(msg);
	WIDTH = Number(prompt('How many columns would you like? A normal game is 7'));
	HEIGHT = Number(prompt('How many rows would you like? A normal game is 6'));
	makeBoard();
	makeHtmlBoard();
}

// check if all cells in board are filled; if so call, call endGame
function checkForTie() {
	for (let row of board) {
		for (let cell of row) {
			if (cell === 'null') {
				return;
			}
		}
	}
	return endGame(`It's a draw!`);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	console.log(y);
	if (y === null) {
		return;
	} else if (y >= HEIGHT) {
		alert('Column is full');
	}

	/* place piece in board and add to HTML table
  TODO: add line to update in-memory board*/

	board[y][x] = currPlayer;
	placeInTable(y, x);

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	checkForTie();

	// switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
  document.querySelector("h3").innerText = `Player ${currPlayer}'s Turn`
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		/* Check four cells to see if they're all color of current player
      - cells: list of four (y, x) cells
      - returns true if all are legal coordinates & all match currPlayer */

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	/*Checks all possible forms of wins, 
  this takes the location of the piece just played and checks the location for every piece in a win scenario from this move
  by running the array through the win function to see if every item in 
  array is the same player.*/

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			//check if 4 in a row horizontally
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			//check if 4 in a row vertically
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			//check if 4 in a row diagonally right
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			//check if 4 in a row diagonally left
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
