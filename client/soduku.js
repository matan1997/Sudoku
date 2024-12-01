const ROW_SIZE = 9;
const COL_SIZE = 9;
const N = 9;
const EMPTY_CELL = "";
let gameBoard = []; 
const EASY = 20;
const MED = 44;
const HARD = 53;
const BASE_URL = `http://localhost:3000/soduku`; //${env.BACKEND_URL}
let winSteps;
let goodSteps;
let mistake;
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

const buildBoard = () => {
    const table = document.getElementById("myTable");
    let tbody = document.createElement("tbody");
    for (let col = 0; col < COL_SIZE; col++) {
        const colElement = document.createElement("tr");
        for (let row = 0; row < ROW_SIZE; row++) {
            const rowElement = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.maxLength = "1";
            input.setAttribute('max', COL_SIZE);
            input.setAttribute("min", EMPTY_CELL+1);
            input.setAttribute("place",(col*9)+row);
            input.readOnly = true;
            input.addEventListener("input", function() {
                if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
            });
           // input.id="k";
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

const validNum = (board,row, col ,num) => {
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

const solver = (board,row,col) => {

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
    winSteps = diff;
    mistake = 0;
    goodSteps = 0;
    const mistake_ht = document.getElementById("mistake-num");
    mistake_ht.textContent = mistake;
    makeBoard(); 
    gameBoard[0][8] = Math.floor(Math.random() * N)+1;
    gameBoard[3][3] = Math.floor(Math.random() * N)+1;
    gameBoard[6][6] = Math.floor(Math.random() * N)+1;
    gameBoard[2][0] = Math.floor(Math.random() * N)+1;
    gameBoard[7][2] = Math.floor(Math.random() * N)+1;
    gameBoard[1][4] = Math.floor(Math.random() * N)+1;
    gameBoard[4][7] = Math.floor(Math.random() * N)+1;
    gameBoard[5][1] = Math.floor(Math.random() * N)+1;
    gameBoard[8][5] = Math.floor(Math.random() * N)+1;
    await sodukuSolv(gameBoard);
    copy(soltion);
    startTimer();
    genarateByDiff(diff);
}

const cleanZeros = async (board) => {
    for (let col = 0; col < COL_SIZE; col++) {
        for (let row = 0; row < COL_SIZE; row++) {
            if (board[col][row] == 0){
                board[col][row] = EMPTY_CELL;
            }

        }
    }

    return board;
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

let choosenPlace;
let value;

const selectNumber = (value) =>{
    choosenPlace.value = value;
    checkInput(choosenPlace, value)
}

const checkInput = (element, value) => {
    const mistake_ht = document.getElementById("mistake-num");
    const place = parseInt(element.getAttribute('place'));
    const col = parseInt(place / 9);
    const row = place % 9;
    if (value !== soltion[col][row]){
        element.style.color = "red";
        if (element.value !== "") {
            mistake++;
            mistake_ht.textContent = mistake;
        }
        
    }else{

        let level = "מעולה !"
        if (mistake > 3 && mistake <= 6) {
            level = "טוב"
        } else if(mistake >= 7 && mistake <= 10){
            level = "לא טוב"
        }else if(mistake > 10){
            level = "גרוע."
        }
        
        element.style.color = "green";
        gameBoard[row][col] = value;
        element.readOnly = true;
        goodSteps++;
        console.log(`the goodSteps is ${goodSteps} and win step is ${winSteps}`);
        if (gameBoard == soltion || goodSteps === winSteps) {
            alert(`נצחון !\nהמשחק שלך היה ${level}`);
            stopTimer();
            updateLeaderBoard();
        }
    }
}

const checkBoard = () => { 
    const inputs = document.getElementsByTagName('input');
    const mistake_ht = document.getElementById("mistake-num");
    for (let row = 0; row < ROW_SIZE; row++) {
        for (let col = 0; col < COL_SIZE; col++) {
            const element = inputs[(row*9)+col];
            element.addEventListener("click", () =>{
                choosenPlace = element;
            })
            element.addEventListener("input", function() {
                value = parseInt(this.value);
                checkInput(element , value);
            });
        }
    }
}

const startTimer= () => {
    timerStart = true;
    startTime = Date.now();
    timerInterval = setInterval(updateTimer);
}

const stopTimer = async() => {
   timerStart = false; 
   //const ip = await fetch('https://api4.my-ip.io/ip.json').then(res => res.json());
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

const leaderBoard = async (winSteps) => { 
    const parent = document.getElementById("leaderBoardTable");
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    const COL_SIZE = 5;
    const ROW_MAX_SIZE = 7;
    let counter = 0;
    const start = {name: "Name", diff : "Difficulty", mistake : "mistakes", time: "Time"};
    const diff = parseInt(winSteps) === 20 ? "Easy"
                 : parseInt(winSteps) === 40 ? "Medium"
                  : "Hard";
    const data = await fetchUsers(diff)
    const NUM_USERS = data.length;
    data.unshift(start);
    const leaderBoardTable = document.getElementById("leaderBoard");
    const dimmedScreen = document.getElementById("dimmedScreen");
    const button = document.getElementById("closeTable");
    button.addEventListener("click", function () {
      leaderBoardTable.style.display = "none";
      dimmedScreen.style.display = "none";
    });
    leaderBoardTable.style.display = "flex";
    dimmedScreen.style.display = "block";
    const table = document.getElementById("leaderBoardTable");
    const tbody = document.createElement("tbody");
    for (let row = 0;  row < NUM_USERS + 1 && row < ROW_MAX_SIZE; row++) {
      const colElement = document.createElement("tr");
      for (let col = 0; col < COL_SIZE; col++) {
          const rowElement = document.createElement("td");
          rowElement.setAttribute('class','leaderboard-td');
          if (col === 0) {
            if(counter !== 0){
              rowElement.innerText = counter;
            }
            
          }else if(col === 1) {
            rowElement.innerText = data[counter].name;
          }else if (col === 2){
            rowElement.innerText = data[counter].diff;
          }else if (col === 3){
            rowElement.innerText = data[counter].mistake;
          }else{
            rowElement.innerText = data[counter].time;
          }
          colElement.appendChild(rowElement);
      }
      counter++;
      tbody.appendChild(colElement);
      table.appendChild(tbody);
    }
}

const calScore = (timeInMinute, diff, mistakes) => {
        const score = ((diff - mistakes) * 1200) - (timeInMinute * 100/(diff/10))

        return score;
} 
  
const fetchUsers = async (diff) => await fetch(BASE_URL+`/leaderboard/${diff}`)
                                            .then(response => response.json())
                                            .catch(error => console.error(error));
    
const updateLeaderBoard = async () => {
    const userName = prompt("Great Game !\n Enter your name")
    const ip = await fetch('https://api4.my-ip.io/ip.json').then(res => res.json());
    const time = document.getElementById('timer').textContent;
    const diff = parseInt(winSteps) === 20 ? "Easy"
        : parseInt(winSteps) === 40 ? "Medium"
        : "Hard";
    try {
      await fetch(BASE_URL+"/leaderboard", {
      method: "POST",
      body: JSON.stringify({ip : `${ip.ip}`,
                            name: `${userName}`,
                            diff: `${diff}`,
                            mistake:`${mistake}`,
                            time: `${time}`
                          }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }})
    } catch (error) {
        console.error("סאמק ערס יא אחושלוקי");
        console.error(error);
    }
}

window.onload = function () {
    makeBoard();
    buildBoard();
    checkBoard();
    dimmedScreen.style.display = "none";

}

// Connect to WebSocket
const socket = new WebSocket('wss://streaming.forexpros.com/echo/639/txcqqjvs/websocket');

socket.onopen = function () {
    const initial_message = ["{\"_event\":\"bulk-subscribe\",\"tzID\":8,\"message\":\"isOpenExch-2:%%isOpenExch-1:%%pid-1175152:%%isOpenExch-152:%%pid-1175153:%%pid-169:%%pid-166:%%pid-14958:%%pid-44336:%%isOpenExch-97:%%pid-8827:%%isOpenExch-1004:%%pid-8849:%%pid-8833:%%pid-8862:%%pid-8830:%%pid-8836:%%pid-8831:%%pid-8916:%%pid-23705:%%pid-23706:%%pid-23703:%%pid-23698:%%pid-8880:%%isOpenExch-118:%%pid-8895:%%pid-1141794:%%pid-6408:%%pid-6369:%%pid-13994:%%pid-6435:%%pid-13063:%%pid-26490:%%pid-243:%%pid-20:%%pid-172:%%isOpenExch-4:%%pid-27:%%isOpenExch-3:%%pid-167:%%isOpenExch-9:%%pid-178:%%isOpenExch-20:%%pid-6497:%%pid-941155:%%pid-8832:%%pid-1:%%isOpenExch-1002:%%pid-2:%%pid-3:%%pid-5:%%pid-7:%%pid-9:%%pid-10:%%pid-945629:%%pid-1057391:%%pid-1192319:%%pid-1129220:%%pid-1115746:%%pid-1057581:%%pid-49798:%%pid-49799:%%pid-1035793:%%isOpenExch-NaN:%%pid-1166456:%%pid-267:%%pid-8274:%%pid-7992:%%pid-17195:%%pid-252:%%pid-1179312:%%pid-241:%%pid-13969:%%pid-251:%%pidExt-945629:%%isOpenExch-1014:%%pid-1061443:%%pid-1061453:%%pid-1061448:%%pid-1177183:%%pid-1114630:%%cmt-1-5-945629:\"}"]
    const snp500_message = ["{\"_event\":\"bulk-subscribe\",\"tzID\":8,\"message\":\"isOpenExch-2:%%isOpenExch-1:%%pid-8849:%%isOpenExch-1004:%%pid-8833:%%pid-8862:%%pid-8830:%%pid-8836:%%pid-8831:%%pid-8916:%%pid-1175152:%%isOpenExch-152:%%pid-1175153:%%pid-169:%%pid-166:%%pid-14958:%%pid-44336:%%isOpenExch-97:%%pid-8827:%%pid-6408:%%pid-6369:%%pid-13994:%%pid-6435:%%pid-13063:%%pid-26490:%%pid-243:%%pid-23705:%%pid-23706:%%pid-23703:%%pid-23698:%%pid-8880:%%isOpenExch-118:%%pid-8895:%%pid-1141794:%%pid-20:%%pid-172:%%isOpenExch-4:%%pid-27:%%isOpenExch-3:%%pid-167:%%isOpenExch-9:%%pid-178:%%isOpenExch-20:%%pid-1:%%isOpenExch-1002:%%pid-2:%%pid-3:%%pid-5:%%pid-7:%%pid-9:%%pid-10:%%pid-8832:%%pid-6497:%%pid-941155:%%pid-14175:%%pid-525:%%pid-45279:%%pid-14210:%%pid-14211:%%pid-38150:%%pid-14220:%%pid-38165:%%pid-1131597:%%pid-1202649:%%isOpenExch-47:%%pid-8839:%%isOpenExch-NaN:%%pid-251:%%pid-8274:%%pid-255:%%pid-6386:%%pid-6445:%%pid-6376:%%pid-6462:%%pid-7870:%%pid-6405:%%pid-13842:%%pid-7968:%%pid-8310:%%pidExt-166:%%cmt-1-5-166:%%pid-942611:%%pid-179:%%pid-170:\"}"]
    // Subscribe to Bitcoin data
    socket.send(initial_message);

    // Subscribe to S&P 500 data
    socket.send(snp500_message);
};

socket.onmessage = function (event) {
    try {
        const rawMessage = event.data;
        const check = rawMessage.indexOf("message");

        if (check !== -1) {
            let cleanedMessage = rawMessage.slice(2, -1);

            // Remove the extra backslashes to normalize the JSON string
            cleanedMessage = cleanedMessage.replace(/\\/g, '');
            cleanedMessage = cleanedMessage.slice(1, -1);
            cleanedMessage = cleanedMessage.replace(/\\"/g, '"');
            const startIndex = cleanedMessage.indexOf("::");
            cleanedMessage = cleanedMessage.slice(startIndex + 2);
            cleanedMessage = cleanedMessage.slice(0, -2);

            // Parse the cleaned message into a JavaScript object
            let message = JSON.parse(cleanedMessage);
           // Extract the required fields
            let pid = message.pid || "";
            let lastPrice = message.last || "";
            let percentageChange = message.pcp || "";
            let percentageChange_po = parseFloat(message.pcp) || 0;

            // Handle Bitcoin data
            if (pid === '1057391') {
                console.log(`PID: ${pid}, Last Price: ${lastPrice}, Percentage Change: ${percentageChange}`);
                document.getElementById('bitcoin-price').innerText = `$${lastPrice}`;
                document.getElementById('bitcoin-percentage').innerText = `${percentageChange}`;
                document.getElementById('bitcoin-percentage').className = `percentage ${percentageChange_po < 0 ? 'negative' : 'positive'}`;
                document.getElementById('bitcoin-percentage').classList.add('changed');
                // Remove the 'changed' class after a short delay
                setTimeout(() => {
                    document.getElementById('bitcoin-percentage').classList.remove('changed');
                }, 1000); // Adjust delay as needed
            }

            // Handle S&P 500 data
            if (pid == '166') {
                console.log(`PID: ${pid}, Last Price: ${lastPrice}, Percentage Change: ${percentageChange}`);
                document.getElementById('snp500-price').innerText = `${lastPrice}`;
                document.getElementById('snp500-percentage').innerText = `${percentageChange}`;
                document.getElementById('snp500-percentage').innerText = `${percentageChange}`;
                document.getElementById('snp500-percentage').className = `percentage ${percentageChange_po < 0 ? 'negative' : 'positive'}`;
                document.getElementById('snp500-percentage').classList.add('changed');
                // Remove the 'changed' class after a short delay
                setTimeout(() => {
                    document.getElementById('snp500-percentage').classList.remove('changed');
                }, 1000); // Adjust delay as needed
            }

    // Log the extracted data for debugging
    console.log(`PID: ${pid}, Last Price: ${lastPrice}, Percentage Change: ${percentageChange}`);
    
        }
    } catch (e) {
        console.error('Failed to decode JSON message:', e);
    }
};

// Error handling
socket.onerror = function (error) {
    console.error('WebSocket Error:', error);
};
