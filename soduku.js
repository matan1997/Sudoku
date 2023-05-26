const ROW_SIZE = 9;
const COL_SIZE = 9;
const N = 9;
const EMPTY_CELL = "";
const gameBoard = [];
const EASY = 20;
const MED = 40;
const HARD = 60;
let soltion = [];

const makeBoard = () => {
    for (let col = 0; col < COL_SIZE; col++) {
        gameBoard[col] = []
    }

    for (let col = 0; col < COL_SIZE; col++) {
        for (let row = 0; row < COL_SIZE; row++) {
            gameBoard[col][row] = EMPTY_CELL;
        }
    }
}

const copy = (board) => {

    for (let col = 0; col < COL_SIZE; col++) {
        board[col] = []
    }

    for (let col = 0; col < COL_SIZE; col++) {
        for (let row = 0; row < COL_SIZE; row++) {
            board[col][row] = gameBoard[col][row];
        }
    }
}

const buildBoard = () => { //work
    const table = document.getElementById("myTable");
    let tbody = document.createElement("tbody");
    for (let col = 0; col < COL_SIZE; col++) {
        const colElement = document.createElement("tr");
        for (let row = 0; row < ROW_SIZE; row++) {
            const rowElement = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number"
            input.setAttribute('max', COL_SIZE);
            input.setAttribute("min", EMPTY_CELL+1);
            input.setAttribute("place",(row*9)+col);
            input.addEventListener("change", function() {
                let v = parseInt(this.value);
                if (v < 1) this.value = 1;
                if (v > COL_SIZE) this.value = COL_SIZE;
            });
            input.id="k";
            rowElement.appendChild(input);
            colElement.appendChild(rowElement);
        }
        tbody.appendChild(colElement);

        if((col+1) % 3 === 0){
            table.appendChild(tbody);
            tbody = document.createElement("tbody");
        }
    }
}

const validNum = (board,row, col ,num) => { //worked
    for(let x = 0; x <= 8; x++){
        if (board[row][x] == num)
            return false;
    }
 
    for(let x = 0; x <= 8; x++){
        if (board[x][col] == num)
            return false;
        
    }
 
    let startRow = row - row % 3,
        startCol = col - col % 3;
         
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            if (board[i + startRow][j + startCol] == num)
                return false;
        }
    }

    return true;
}

const sodukuSolv = (board) => solver(board,0,0);

const solver = (board,row,col) => { //worked

    if(row == ROW_SIZE - 1 && col == COL_SIZE){
        return true;
    }

    if(col == COL_SIZE){
        row++;
        col = 0;
    }

    if(board[row][col] != EMPTY_CELL){
        return solver(board, row, col+1);
    }

    for (let number = 1; number <= ROW_SIZE; number++) {
        if(validNum(board, row, col ,number)){
            board[row][col] = number;
            if(solver(board, row, col+1)){
                return true;
            }
        }
        board[row][col] = EMPTY_CELL;
    }
        
    return false;
}

const updateBoard = async(board) => {
    const inputs = document.getElementsByTagName('input');

    for (let row = 0; row < ROW_SIZE; row++) {
        for (let col = 0; col < COL_SIZE; col++) {
            const element = inputs[(row*9)+col];
            
            element.value = board[row][col];
        }
    }
}

const solve = () => {
    updateBoard(soltion);
}

const genarateGame = async(diff) => {
    makeBoard();
    let row = 0;
    let col = 0;
    const num = Math.floor(Math.random() * N)+1;
    gameBoard[row][col] = num; 
    gameBoard[8][8] = Math.floor(Math.random() * N)+1;
    gameBoard[3][3] = Math.floor(Math.random() * N)+1;
    await sodukuSolv(gameBoard);
    copy(soltion);
    genarateByDiff(diff);
    //updateBoard(gameBoard);
}

const genarateByDiff = async(diff) => {
    let counter = 0;
    let check = 0;
    while (counter < diff) {
        const col = Math.floor(Math.random() * 9);
        const row = Math.floor(Math.random() * 9);
        check++;
        if(gameBoard[row][col] !== EMPTY_CELL){
            gameBoard[row][col] = EMPTY_CELL;
            check = 0;
            counter++
        }
    }

    updateBoard(gameBoard);
}

window.onload = function () {
    makeBoard();
    buildBoard();
}

// const inputs = document.getElementsByTagName('input');

// inputs.addEventListener("wrong", function() {
//     let v = parseInt(this.value);
//     if (v ==! soltion[row][col]) this.style.color = "red";
//     if (v ==! soltion[row][col]) this.style.color = "green";
// });
