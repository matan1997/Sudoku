const ROW_SIZE = 9;
const COL_SIZE = 9;
const N = 9;
const EMPTY_CELL = "";
const gameBoard = [];
const EASY = 20;
const MED = 40;
const HARD = 60;
let winSteps;
let mestake;
let startTime;
let timerInterval;
let timerStart;
let soltion = [];
let ip;

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
            input.setAttribute("place",(col*9)+row);
            input.readOnly = true;
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
            if (gameBoard[row][col] !== EMPTY_CELL) {
                element.readOnly = true;
            }else{
                element.readOnly = false;
            }
            element.value = board[row][col];
            element.style.color = "black";
        }
    }
}

const solve = () => {
    updateBoard(soltion);
    stopTimer();
}

const genarateGame = async(diff) => {
    winSteps = diff; //to change
    mestake = 0;
    makeBoard();
    let row = 0;
    let col = 0;
    const num = Math.floor(Math.random() * N)+1;
    gameBoard[row][col] = num; 
    gameBoard[8][8] = Math.floor(Math.random() * N)+1;
    gameBoard[3][3] = Math.floor(Math.random() * N)+1;
    await sodukuSolv(gameBoard);
    copy(soltion);
    startTimer();
    genarateByDiff(diff);
}

const genarateByDiff = async(diff) => {
    let counter = 0;
    while (counter < diff) {
        const col = Math.floor(Math.random() * 9);
        const row = Math.floor(Math.random() * 9);
        if(gameBoard[row][col] !== EMPTY_CELL){
            gameBoard[row][col] = EMPTY_CELL;
            counter++
        }
    }

    updateBoard(gameBoard);
}

const checkBoard = () => {
    let counter = 0;
    const inputs = document.getElementsByTagName('input');

    for (let row = 0; row < ROW_SIZE; row++) {
        for (let col = 0; col < COL_SIZE; col++) {
            const element = inputs[(row*9)+col];
            element.addEventListener("input", function() {
                const value = parseInt(this.value);
                const place = parseInt(this.getAttribute('place'));
                const col = parseInt(place / 9);
                const row = place % 9;
                console.log(soltion[col][row]);//to delete
                if (value !== soltion[col][row]){
                    this.style.color = "red";
                    if (this.value !== "") {
                        mestake++;
                        console.log(mestake);
                    }
                    
                }else{
                    this.style.color = "green";
                    gameBoard[row][col] = value;
                    this.readOnly = true;
                    counter++;
                    if (gameBoard == soltion || counter === winSteps) {
                        alert("WIN");
                        stopTimer();
                    }else{
                        console.log("no baby");
                    }
                }
            });
        }
    }

    Array.prototype.forEach.call(inputs, element => {
        element.addEventListener("input", function() {
            // console.log(String(gameBoard));
            // console.log(String(soltion));
            if (String(soltion) === String(gameBoard)) {
                alert("win");
            }else{
                console.log("no baby");
            }
        });
      });

}

const startTimer= () => {
    timerStart = true;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer);
}

const stopTimer = async() => {
   timerStart = false; 
   await fetch('https://api.ipify.org?format=json')
   .then(response => response.json())
   .then(data => console.log(data.ip))
}

const updateTimer = () => {
    if(timerStart){
        const elapsedTime = Date.now() - startTime;
        const formattedTime = formatTime(elapsedTime);
        document.getElementById('timer').textContent = formattedTime;
    }
}
  
const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / 1000 / 60) % 60;
    const hours = Math.floor(milliseconds / 1000 / 60 / 60);
  
    const formattedSeconds = padNumber(seconds);
    const formattedMinutes = padNumber(minutes);
    const formattedHours = padNumber(hours);
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
  
const padNumber = (value) => {
    return value.toString().padStart(2, '0');
}

window.onload = function () {
    makeBoard();
    buildBoard();
    checkBoard();

}

