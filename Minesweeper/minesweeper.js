var minesweeperGame = document.getElementById("minesweeper-game");
const gameOver = getByClass("minesweeper-game__game-over");
const newGameButton = getByClass("minesweeper-game__new-game");
newGameButton.addEventListener('click', startGame);
var tiles = 81;
let listOfTiles = [];
let arrayResult = [];


function createBomb() {
    const bomb = {
        name: "bomb",
        dataPath: "img/bomb.png",
        getBomb: true
    }
    return bomb;
}

function addHide(objectToHide){
    return objectToHide.classList.toggle("hide");
}

function removeHide(player){
    return player.classList.remove("hide");
}

function getByClass(className) {
    return document.getElementsByClassName(className)[0];
}

function randomizeBombs(arrayTiles) {
    var countBomb = 0;
    while (countBomb < 10) {
        let random1 = Math.floor(Math.random() * 9);
        let random2 = Math.floor(Math.random() * 9);
        if (arrayTiles[random1][random2].bomb !== true) {
            arrayTiles[random1][random2].bomb = true;
            countBomb++;
        }
        console.log(random1, random2);
        console.log(arrayTiles[random1][random2]);

    }

    console.log(arrayTiles);
    return arrayTiles;
}

function flip() {
    this.classList.toggle("tile--flip");
    let tile = this;
    removeClick(tile);
    const tileX = parseFloat(tile.getAttribute('data-x'));
    const tileY = parseFloat(tile.getAttribute('data-y'));
    tile = arrayResult[tileX][tileY];

    // TODO: if not bomb, run recursion
    if (!tile.bomb) {
        openNeighborTiles(tileX, tileY);
    }else{
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let tileToTurn = getDOMTile(i,j)
                tileToTurn.classList.add("tile--flip");
            }
        }
        removeHide(gameOver);
    }
}

function removeClick($element) {
    $element.removeEventListener("click", flip);
}

function getDOMTile(tileX,tileY){
    return document.querySelectorAll(`[data-x="${tileX}"][data-y="${tileY}"]`)[0];
}

function openNeighborTiles(tileX, tileY) {
    const cell = arrayResult[tileX][tileY];
    const $tile = getDOMTile(tileX,tileY);
    if (cell && !cell.open && !cell.bomb) {
        $tile.classList.add("tile--flip");
        removeClick($tile);
        arrayResult[tileX][tileY].open = true;
    } else{
        return;
    }

    if (cell.count) {
        return
    }

    //   X e Y
    // [1][2][3]
    // [4][E][6]
    // [7][8][9]

    if (getTile(arrayResult, cell.x - 1, cell.y)) openNeighborTiles(cell.x - 1, cell.y); // 2
    if (getTile(arrayResult, cell.x + 1, cell.y)) openNeighborTiles(cell.x + 1, cell.y); // 8
    if (getTile(arrayResult, cell.x, cell.y - 1)) openNeighborTiles(cell.x, cell.y - 1); // 4
    if (getTile(arrayResult, cell.x, cell.y + 1)) openNeighborTiles(cell.x, cell.y + 1); // 6

    if (getTile(arrayResult, cell.x - 1, cell.y - 1)) openNeighborTiles(cell.x - 1, cell.y - 1); // 1
    if (getTile(arrayResult, cell.x - 1, cell.y + 1)) openNeighborTiles(cell.x - 1, cell.y + 1); // 3
    if (getTile(arrayResult, cell.x + 1, cell.y + 1)) openNeighborTiles(cell.x + 1, cell.y + 1); // 9
    if (getTile(arrayResult, cell.x + 1, cell.y - 1)) openNeighborTiles(cell.x + 1, cell.y - 1); // 7

}

function getTile(board, x, y) {
    return board[x] && board[x][y];
}

function generateArrays() {
    let i, j;
    let arrayTiles = [];
    for (i = 0; i < 9; i++) {
        arrayTiles[i] = [];
        for (j = 0; j < 9; j++) {
            arrayTiles[i][j] = {
                bomb: false,
                nome: "tile",
                count: 0,
                open: false,
                x: i,
                y: j
            };
        }
    }
    return arrayTiles;
}

function generateTiles() {
    listOfTiles = generateArrays();
    console.log(listOfTiles);
    arrayResult = randomizeBombs(listOfTiles);
    console.log(arrayResult);
    distributeNumbersBombs(arrayResult);

    let result = arrayResult.map(function (row, rowIndex) {
        return row.map(function (tile, tileIndex) {
            const bomb = tile.bomb ? createBomb() : false;
            return createSingleTile(tile, rowIndex, tileIndex, bomb);
        });
    });

    return result;
}

function distributeNumbersBombs(arrayResult) {
    arrayResult.forEach(function (array) {
        array.filter(function (object) { return object.bomb })
            .forEach(function (object) {
                const neighbors = getNeighbors(arrayResult, object);
                neighbors.filter(function (neighbor) { return neighbor != null && !neighbor.bomb })
                    .forEach(function (neighbor) { neighbor.count++ });
            });
    });
    console.log(arrayResult);
}

function validationOfNumbers(arrayResult) {
    arrayResult.forEach(function (array) {
        array.filter(function (object) { return object.bomb })
            .forEach(function (object) {
                const neighbors = getNeighbors(arrayResult, object);
                neighbors.filter(function (neighbor) { return neighbor != null && !neighbor.bomb })
                    .forEach(function (neighbor) { flip(neighbor) });
            });
    });
}

function getNeighbors(arrayResult, object) {
    const neighbors = [
        getTile(arrayResult, object.x, object.y - 1),
        getTile(arrayResult, object.x, object.y + 1),
        getTile(arrayResult, object.x - 1, object.y),
        getTile(arrayResult, object.x - 1, object.y - 1),
        getTile(arrayResult, object.x - 1, object.y + 1),
        getTile(arrayResult, object.x + 1, object.y),
        getTile(arrayResult, object.x + 1, object.y - 1),
        getTile(arrayResult, object.x + 1, object.y + 1)
    ]
    return neighbors
}

function createSingleTile(tile, rowIndex, tileIndex, bomb) {

    var tileElement = document.createElement("div");
    tileElement.className = 'tile';
    // tileElement.setAttribute("id", ("tile--" + rowIndex + tileIndex));
    tileElement.setAttribute("data-x", rowIndex);
    tileElement.setAttribute("data-y", tileIndex);


    var tileFront = document.createElement("div");
    tileFront.className = "tile__front";
    tileElement.appendChild(tileFront);

    if (tile.bomb === true) {
        var tileBomb = document.createElement("img");
        tileBomb.src = bomb.dataPath;
        tileBomb.className = "tile__photo tile__back bomb--color";
        tileElement.appendChild(tileBomb);
    } else {
        var tileBack = document.createElement("div");
        tileBack.className = "tile__back empty--color";
        if(!tile.count == 0){
            tileBack.innerText = tile.count;
        }
        tileElement.appendChild(tileBack);
    }

    tileElement.addEventListener('click', flip);
    return tileElement
}

function colorNumbers(){
    
}

function resetGame() {
    listOfTiles = [];
    arrayResult = [];
    minesweeperGame.innerHTML = "";
    removeHide(gameOver);
}

function startGame() {
    resetGame();
    let listOfTiles = generateTiles();

    var i, j;
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            minesweeperGame.appendChild(listOfTiles[i][j]);
        }
    }
    addHide(gameOver);
}


startGame();