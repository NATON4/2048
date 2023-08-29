const board = document.querySelector(".grid");
const startButton = document.getElementById("start-button");
const container = document.querySelector(".container");
const coverScreen = document.querySelector(".cover-screen");
const result = document.getElementById("result");
const overText = document.getElementById("cover-screen__over-text");
const rows = 4;
const columns = 4;

let matrix;
let score;
let bestScore;
let isSwiped;
let touchY;
let initialY = 0;
let touchX;
let initialX = 0;
let swipeDirection;
let rectLeft = board.getBoundingClientRect().left;
let rectTop = board.getBoundingClientRect().top;

function getXY(e){
    touchX = e.touches[0].pageX - rectLeft;
    touchY = e.touches[0].pageY - rectTop;
}

function createGrid() {
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            const boxDiv = document.createElement("div");
            boxDiv.classList.add("box");
            boxDiv.setAttribute("data-position", `${rowIndex}_${columnIndex}`);

            const cellValue = matrix[rowIndex][columnIndex];

            if (cellValue !== 0) {
                boxDiv.classList.add(`box_value-${cellValue}`);
                boxDiv.innerText = cellValue;
            } else {
                boxDiv.classList.add("box_value-0");
            }

            board.appendChild(boxDiv);
        }
    }
}

function adjacentCheck(matrix) {
    const rows = matrix.length;
    const columns = matrix[0].length;

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columns - 1; columnIndex++) {
            if (matrix[rowIndex][columnIndex] === matrix[rowIndex][columnIndex + 1]) {
                return true;
            }
        }
    }

    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        for (let rowIndex = 0; rowIndex < rows - 1; rowIndex++) {
            if (matrix[rowIndex][columnIndex] === matrix[rowIndex + 1][columnIndex]) {
                return true;
            }
        }
    }

    return false;
}

function isPossibleMovesCheck() {
    for (let rowIndex in matrix) {
        if (adjacentCheck(matrix[rowIndex])) {
            return true;
        }
    }

    return false;
}

function randomPosition(arr) {
    return Math.floor(Math.random() * arr.length);
}

function hasEmptyBox(){

    for (let rowIndex in matrix) {
        for (let columnIndex in matrix[rowIndex]) {
            if (matrix[rowIndex][columnIndex] === 0) {
                return true;
            }
        }
    }

    return false;
}

function generateRandomNumber() {
    return Math.random() < 0.5 ? 2 : 4;
}

function generateRandomCell() {

    if (hasEmptyBox()) {
        let randomRow = randomPosition(matrix);
        let randomCol = randomPosition(matrix[randomPosition(matrix)]);

        if (matrix[randomRow][randomCol] === 0) {
            const randomNumber = generateRandomNumber();
            const currentCell = document.querySelector(`[data-position = '${randomRow}_${randomCol}']`);
            matrix[randomRow][randomCol] = randomNumber;
            currentCell.innerHTML = randomNumber;
            currentCell.classList.add(`box_value-${randomNumber}`);
            saveGameState();
        } else {
            generateRandomCell();
            saveGameState();        }
    } else {
        gameOverCheck();
        saveGameState();
    }
}

function removeZero(arr) {
    return arr.filter(function(num) {
        return num;
    });
}

function sumAndFillCells(arr, reverseArr = false) {
    arr = reverseArr ? removeZero(arr).reverse() : removeZero(arr);

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] += arr[i + 1];
            arr[i + 1] = 0;
            score += arr[i];
        }
    }

    arr = reverseArr ? removeZero(arr).reverse() : removeZero(arr);

    let missingCount = 4 - arr.length;
    while (missingCount > 0) {
        if (reverseArr) {
            arr.unshift(0);
        } else {
            arr.push(0);
        }
        missingCount -= 1;
    }
    
    return arr;
}

board.addEventListener("touchstart", (event) => {
    isSwiped = true;
    getXY(event);
    initialX = touchX;
    initialY = touchY;
});

board.addEventListener("touchmove", (event) => {
    if (isSwiped) {
        getXY(event);
        let diffX = touchX - initialX;
        let diffY = touchY - initialY;
        if (Math.abs(diffY) > Math.abs(diffX)) {
            swipeDirection = diffY > 0 ? "down" : "up";
        } else {
            swipeDirection = diffX > 0 ? "right" : "left";
        }
    }
});

board.addEventListener("touchend", () => {
    isSwiped = false;
    let swipeCalls = {
        up: slideUp,
        down: slideDown,
        left: slideLeft,
        right: slideRight,
    };
    swipeCalls[swipeDirection]();
    document.getElementById("score").innerText = score;
});

function hideMainElements() {
    coverScreen.classList.remove("hide");
    container.classList.add("hide");
    overText.classList.remove("hide");
}

function createRestartButton() {
    const newButton = document.createElement("button");
    newButton.innerText = "Restart Game";
    newButton.classList.add("cover-screen__start-button");
    newButton.addEventListener("click", resetGame);
    startButton.replaceWith(newButton);
}

function clearMatrixFromLocalStorage() {
    const gameState = {
        matrix: null,
        score: score
    };
    localStorage.setItem("gameState", JSON.stringify(gameState));
}

function gameOverCheck() {
    if (!isPossibleMovesCheck()) {
        clearMatrixFromLocalStorage();
        hideMainElements();
        result.innerText = `Final score: ${score}`;
        createRestartButton();
        updateBestScore();
    }
}

function saveGameState() {
    const gameState = {
        matrix: matrix,
        score: score
    };
    localStorage.setItem("gameState", JSON.stringify(gameState));
}

function fillMatrixWithZeros() {
    matrix = Array.from({ length: rows }, () => Array(columns).fill(0));
    return matrix;
}

function startFullNewGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    hideBoard();
    fillMatrixWithZeros();
    createGrid();
    generateRandomCell();
    generateRandomCell();
    loadBestScore();
    saveGameState();
}

function startGame() {
    const savedGameState = localStorage.getItem("gameState");

    const userChoice = confirm("Restore the previous game?");
    if (userChoice) {
        const gameState = JSON.parse(savedGameState);
        matrix = gameState.matrix;
        score = gameState.score;
        document.getElementById("score").innerText = score;
        hideBoard();
        createGrid();
        loadBestScore();
    } else {
        startFullNewGame();
    }
}

function hideBoard() {
    board.innerHTML = "";
    container.classList.remove("hide");
    coverScreen.classList.add("hide");
}

function loadBestScore() {
    const savedBestScore = localStorage.getItem("bestScore");
    bestScore = savedBestScore !== null ? parseInt(savedBestScore) : 0;
    document.getElementById("best-score").innerText = bestScore;
}

function saveBestScore() {
    localStorage.setItem("bestScore", bestScore.toString());
}

function updateBestScore() {
    if (score > bestScore) {
        bestScore = score;
        document.getElementById("best-score").innerText = bestScore;
        saveBestScore();
    }
}

function resetGame() {
    startFullNewGame();
}

startButton.addEventListener("click", () => {
    startGame();
    swipeDirection = "";
});

function updateElement(rowIndex, columnIndex, value) {
    matrix[rowIndex][columnIndex] = value;
    const element = document.querySelector(`[data-position='${rowIndex}_${columnIndex}']`);
    element.innerHTML = value ? value : "";
    element.classList.value = "";
    element.classList.add("box", `box_value-${value}`);
}

function slideDown() {
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        let num = [];
        
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            let indices = matrix[rowIndex][columnIndex];
            num.push(indices);
        }
        
        num = sumAndFillCells(num, true);
        
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            updateElement(rowIndex, columnIndex, num[rowIndex]);
        }
    }
    generateRandomCell();
}

function slideUp() {
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        let num = [];

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            let indices = matrix[rowIndex][columnIndex];
            num.push(indices);
        }
        
        num = sumAndFillCells(num);
        
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            updateElement(rowIndex, columnIndex, num[rowIndex]);
        }
    }
    generateRandomCell();
}

function slideRight() {
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        let num = [];
        
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            let indices = matrix[rowIndex][columnIndex];
            num.push(indices);
        }
        
        num = sumAndFillCells(num, true);
        
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            updateElement(rowIndex, columnIndex, num[columnIndex]);
        }
    }
    generateRandomCell();
}

function slideLeft() {
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        let num = [];
        
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            let indices = matrix[rowIndex][columnIndex];
            num.push(indices);
        }
        
        num = sumAndFillCells(num);
        
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            updateElement(rowIndex, columnIndex, num[columnIndex]);
        }
    }
    generateRandomCell();
}

document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") {
        slideLeft();
    } else if (e.code === "ArrowRight") {
        slideRight();
    } else if (e.code === "ArrowUp") {
        slideUp();
    } else if (e.code === "ArrowDown") {
        slideDown();
    }
    document.getElementById("score").innerText = score;
    updateBestScore();
});