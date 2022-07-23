console.log('Javascript works')
//-----------------------------------------------------
// Declare state variables
//-----------------------------------------------------
let remainingMines;
let timer = 0;
let blockArray = [];
let checkArray = [];
let firstPicked;
let newId;
let clearArray;
let masterArray = [];
let noMine = true;
let clockMaster;

//-----------------------------------------------------
// Cache my DOM elements
//-----------------------------------------------------
let blockEl = document.querySelectorAll('.block');
let boardEl = document.getElementById('board');
let toggleEl = document.getElementById('toggle');
let dispMessageEl = document.querySelector('h2');
let remainingMinesEl = document.getElementById('remainingmines');
let timerEl = document.getElementById('timer');
//-----------------------------------------------------

//-----------------------------------------------------
// Add Event Listeners
//-----------------------------------------------------
boardEl.addEventListener('click', render);
toggleEl.addEventListener('click', clearMark);
//-----------------------------------------------------


//-----------------------------------------------------
// Initialize program
//-----------------------------------------------------
init();


//------------------------------------------------------
//                 F U N C T I O N S
//------------------------------------------------------

// Initialize program
//------------------------------------------------------
function init(){
    // Create the board (TRY TO CSS THIS LATER)
    blockEl.forEach(function(el){
        // // Create the board
        // el.style.border = '5px groove #FFEFCA';
        // el.style.padding = '15px';
        // el.style.backgroundImage = 'radial-gradient(circle, #5c4a0a, #65510d, #6d5710, #765e13, #7f6516, #81681b, #846a20, #866d25, #826c2c, #7e6b33, #7b6939, #77683f)';
        
        // Create the array containing objects
        blockArray.push(newSquare());
    });

    // Set initial values for state variables
    remainingMines = 20;
    timer = 0;
    firstPicked = false;
    noMine = true;
};

//----------------------------------------------------
// Render changes
//----------------------------------------------------
function render(e){

    // Capture the block ID
    let blockID = e.target.id;
    // Capture the block object
    let blockObj = e.target;


    if (blockID !== 'board'){
    // checks to see if user is clearing a square or 
    // marking a square
        clearCheck(blockObj, blockID);
    }
};

//--------------------------------------------------------
// Checks if User is CLEARING or MARKING
//--------------------------------------------------------
function clearCheck(obj, id){
    // Convert ID to number matching array
    id = convertID(id);

    if (toggleEl.innerText === 'CLEAR') {
        // Checks if this is the first action
        if (firstPicked === false){
            // randomizes mines after selection
            firstPick(id);
        } else {
            // determine if pick is a loser, winner, or cleared
            checkPick(id);
        };
    } else {
        // Checks if already marked
        if (blockArray[id].marked === true) {
            blockArray[id].marked = false;
            remainingMines++;
            remainingMinesEl.innerText = `Mines Remaining: ${remainingMines}`;
            obj.style.backgroundImage = 'radial-gradient(circle, #5c4a0a, #65510d, #6d5710, #765e13, #7f6516, #81681b, #846a20, #866d25, #826c2c, #7e6b33, #7b6939, #77683f)';
        } // Checks if already cleared
        else if (blockArray[id].cleared === true){
            console.log('Already cleared idiot');
        }
        else {
            // Change to marked spot
            blockArray[id].marked = true;
            obj.style.backgroundImage = 'radial-gradient(circle, #8f0000, #a04518, #b06e3b, #bf9465, #cfb995, #d7c7a7, #e0d4b9, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
            remainingMines--;
            remainingMinesEl.innerText = `Mines Remaining: ${remainingMines}`;
        };
    };
};

//---------------------------------------------------
// Toggle between Clearing blocks and Marking blocks
//---------------------------------------------------
function clearMark(e){
    if (toggleEl.innerText === 'CLEAR'){
        toggleEl.innerText = 'MARK';
        toggleEl.style.backgroundImage = 'radial-gradient(circle, #f2d1d7, #f2d1d7, #f2d1d7, #f2d1d7, #f2d1d7, #f5c7d0, #f8bdc9, #fab3c3, #fd9cb5, #ff83a9, #ff679d, #ff4593)';
    } else {
        toggleEl.innerText = 'CLEAR';
        toggleEl.style.backgroundImage = 'radial-gradient(circle, #ebe8dd, #ebe8dd, #ebe8dd, #ebe8dd, #ebe8dd, #eae6d7, #eae4d1, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
    };
};

//---------------------------------------------------
// FIRST SELECTION of the game
//---------------------------------------------------
function firstPick(id){
    firstPicked = true;
    // Randomize mines throughout the board
    randomMines(id);
    // Determines the amount of mines surrounding each square
    assignSurrounding();
    // Clears the current square
    clearSquare(id);
    // Run computerClear()
    computerClear(id);
    // Start clock
    clockMaster = setInterval(clock, 1000);

    console.log(checkArray, "CheckArray");
};

//---------------------------------------------------
// CHECK PICK to see if it's a mine, a winner, or a clear
//---------------------------------------------------
function checkPick(id){
    // run checkMine()
    noMine = checkMine(id);
    // If user did not click on a mine
    if ((noMine === true) && (blockArray[id].cleared === false)){
        // Clears the current square
        clearSquare(id);
        // Run checkWin()
        checkWin();
        // Run computerClear()
        computerClear(id);
    } else if (noMine === false){
        clearInterval(clockMaster);
        revealBoard();
    }
};

//-----------------------------------------------------
// Computer clears adjacent free squares
//-----------------------------------------------------
function computerClear(id){

    // Determine what blocks, if any, that surround the
    // current selection should be cleared by the
    // computer.

    // If adjacent square does not contain a mine, clear it.

    if ((id > 0) && (id < 9)){
        if (blockArray[id-1].mine === false) 
            clearSquare(id-1);
        if (blockArray[id+1].mine === false) 
            clearSquare(id+1);
        if (blockArray[id+9].mine === false) 
            clearSquare(id+9);
        if (blockArray[id+10].mine === false) 
            clearSquare(id+10);
        if (blockArray[id+11].mine === false) 
            clearSquare(id+11);
    } 
    // Bottom Row
    else if ((id > 90) && (id < 99)){
        if (blockArray[id-11].mine === false) 
            clearSquare(id-11);
        if (blockArray[id-10].mine === false) 
            clearSquare(id-10);
        if (blockArray[id-9].mine === false) 
            clearSquare(id-9);
        if (blockArray[id-1].mine === false) 
            clearSquare(id-1);
        if (blockArray[id+1].mine === false) 
            clearSquare(id+1);
    } 
    // Left Row
    else if ((id !== 0) && (id !== 90) && (id % 10 === 0)){
        if (blockArray[id-10].mine === false) 
            clearSquare(id-10);
        if (blockArray[id-9].mine === false) 
            clearSquare(id-9);
        if (blockArray[id+1].mine === false) 
            clearSquare(id+1);
        if (blockArray[id+10].mine === false) 
            clearSquare(id+10);
        if (blockArray[id+11].mine === false) 
            clearSquare(id+11);
    } 
    // Right Row
    else if ((id !== 9) && (id !== 99) && (id % 10 === 9)){
        if (blockArray[id-11].mine === false) 
            clearSquare(id-11);
        if (blockArray[id-10].mine === false) 
            clearSquare(id-10);
        if (blockArray[id-1].mine === false) 
            clearSquare(id-1);
        if (blockArray[id+9].mine === false) 
            clearSquare(id+9);
        if (blockArray[id+10].mine === false) 
            clearSquare(id+10);
    } 
    // -----------CORNERS-----------
    // Top Left
    else if (id === 0){
        if (blockArray[1].mine === false) 
            clearSquare(1);
        if (blockArray[10].mine === false) 
            clearSquare(10);
        if (blockArray[11].mine === false) 
            clearSquare(11);
    } 
    // Top Right
    else if (id === 9){
        if (blockArray[8].mine === false) 
            clearSquare(8);
        if (blockArray[19].mine === false) 
            clearSquare(19);
        if (blockArray[18].mine === false) 
            clearSquare(18);
    } 
    // Bottom Left
    else if (id === 90){
        if (blockArray[80].mine === false) 
            clearSquare(80);
        if (blockArray[81].mine === false) 
            clearSquare(81);
        if (blockArray[91].mine === false) 
            clearSquare(91);
    } 
    // Bottom Right
    else if (id === 99){
        if (blockArray[98].mine === false) 
            clearSquare(98);
        if (blockArray[88].mine === false) 
            clearSquare(88);
        if (blockArray[89].mine === false) 
            clearSquare(89);
    } 
    // Middle of grid
    else{
        if (blockArray[id-11].mine === false) 
            clearSquare(id-11);
        if (blockArray[id-10].mine === false) 
            clearSquare(id-10);
        if (blockArray[id-9].mine === false) 
            clearSquare(id-9);
        if (blockArray[id-1].mine === false) 
            clearSquare(id-1);
        if (blockArray[id+1].mine === false) 
            clearSquare(id+1);
        if (blockArray[id+9].mine === false) 
            clearSquare(id+9);
        if (blockArray[id+10].mine === false) 
            clearSquare(id+10);
        if (blockArray[id+11].mine === false) 
            clearSquare(id+11);
    };

    if (checkArray.length > 0) {
    // If checkArray contains original square selected, remove
        for (const i in checkArray){
            if (checkArray[i]===id){
                checkArray.splice(i, 1);
            }
        }
        // Check remaining squares
        checkArrayClear();
    };
};

//---------------------------------------------------------
// Clears a square cleared by the computer
//---------------------------------------------------------
function clearSquare(id){
    blockArray[id].cleared = true;
    // Change to cleared spot
    let squareEl = document.getElementById('sq' + id);
    squareEl.style.backgroundImage = 'radial-gradient(circle, #ffffff, #fcfafc, #faf5f7, #f9f0ef, #f5ece7, #f4e8de, #f0e5d4, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
    
    //Updates inner square with number and color
    if (blockArray[id].surroundingMines !== 0){
        squareEl.innerText = blockArray[id].surroundingMines;
        if (squareEl.innerText === '1'){
            squareEl.style.color = 'blue';
        } else if (squareEl.innerText === '2'){
            squareEl.style.color = 'green';
        } else if (squareEl.innerText === '3'){
            squareEl.style.color = 'orange';
        } else if (squareEl.innerText === '4'){
            squareEl.style.color = 'purple';
        } else if (squareEl.innerText === '5'){
            squareEl.style.color = 'red';
        } else if (squareEl.innerText === '6'){
            squareEl.style.color = 'yellow';
        } else if (squareEl.innerText === '7'){
            squareEl.style.color = 'brown';
        } else {
            squareEl.style.color = 'white';
        };
    };


    // Keep a record of all zeroes
    if (blockArray[id].surroundingMines === 0){
        masterArray.push(id); // Master record of zeros
        checkArray.push(id); // Working record of zeros
        for (let i=0; i<(masterArray.length - 1); i++){
            // if the square in question (the one just added)
            // is already on the master list, delete it from
            // both the master list and the working list
            if (masterArray[i] === id){
                masterArray.pop(); 
                checkArray.pop();
            };
        }
    };
};
//-----------------------------------------------------
// CheckArray Clear (clears surrounding squares)
//-----------------------------------------------------
function checkArrayClear(){
    // Removes next square to clear and sends it to computerClear
    clearArray = checkArray.shift();
    computerClear(clearArray);
};

//-----------------------------------------------------
// Assigns each square with the number of surrounding
// mines
//-----------------------------------------------------
function assignSurrounding(){
    // Loop through array assigning the amount of
    // surrounding mines
    for (let id = 0; id < blockArray.length; id++){
        // -------NOT INCLUDING CORNERS------
        // Top Row
        if ((id > 0) && (id < 9)){
            if (blockArray[id-1].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+1].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+9].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+10].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+11].mine === true) 
                blockArray[id].surroundingMines += 1;
        } 
        // Bottom Row
        else if ((id > 90) && (id < 99)){
            if (blockArray[id-11].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id-10].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id-9].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id-1].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+1].mine === true) 
                blockArray[id].surroundingMines += 1;
        } 
        // Left Row
        else if ((id !== 0) && (id !== 90) && (id % 10 === 0)){
            if (blockArray[id-10].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id-9].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+1].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+10].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+11].mine === true) 
                blockArray[id].surroundingMines += 1;
        } 
        // Right Row
        else if ((id !== 9) && (id !== 99) && (id % 10 === 9)){
            if (blockArray[id-11].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id-10].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id-1].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+9].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+10].mine === true) 
                blockArray[id].surroundingMines += 1;
        } 
        // -----------CORNERS-----------
        // Top Left
        else if (id === 0){
            if (blockArray[1].mine === true) 
                blockArray[0].surroundingMines += 1;
            if (blockArray[10].mine === true) 
                blockArray[0].surroundingMines += 1;
            if (blockArray[11].mine === true) 
                blockArray[0].surroundingMines += 1;
        } 
        // Top Right
        else if (id === 9){
            if (blockArray[8].mine === true) 
                blockArray[9].surroundingMines += 1;
            if (blockArray[19].mine === true) 
                blockArray[9].surroundingMines += 1;
            if (blockArray[18].mine === true) 
                blockArray[9].surroundingMines += 1;
        } 
        // Bottom Left
        else if (id === 90){
            if (blockArray[80].mine === true) 
                blockArray[90].surroundingMines += 1;
            if (blockArray[81].mine === true) 
                blockArray[90].surroundingMines += 1;
            if (blockArray[91].mine === true) 
                blockArray[90].surroundingMines += 1;
        } 
        // Bottom Right
        else if (id === 99){
            if (blockArray[98].mine === true) 
                blockArray[99].surroundingMines += 1;
            if (blockArray[88].mine === true) 
                blockArray[99].surroundingMines += 1;
            if (blockArray[89].mine === true) 
                blockArray[99].surroundingMines += 1;
        } 
        // Middle of grid
        else{
            if (blockArray[id-11].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id-10].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id-9].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id-1].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+1].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+9].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+10].mine === true) 
                blockArray[id].surroundingMines += 1;
            if (blockArray[id+11].mine === true) 
                blockArray[id].surroundingMines += 1;
        };
    };
console.log(blockArray);
};

//-----------------------------------------------------
// Converts the string ID to a numerical form that 
// matches with the array
//-----------------------------------------------------
function convertID(id){
    // Extract the number from the rest of the string
    id = id.substring(2,id.length);
    // Convert the remaining string into a number
    // and subtract 1 so it matches the array
    id = Number(id);
    // return array index
    return id;
};

//-----------------------------------------------------
// Returns an object representing the square's
// data that's pushed into the array
//-----------------------------------------------------
function newSquare(){
    const newBlock = {
        mine: false,
        cleared: false,
        surroundingMines: 0,
        marked: false,
    };
    return newBlock;
};

//-----------------------------------------------------
// Checks if user clicked on mine
//-----------------------------------------------------
function checkMine(id){
    if (blockArray[id].mine === true) {
        //squareEl[id].innerText = 'M';
        console.log("You Lose!")
        return false;
    } else {
        return true;
    }
};

//-----------------------------------------------------
// User won!
//-----------------------------------------------------
function bigWinner(){
    console.log('You Won!');
    clearInterval(clockMaster);
};

//----------------------------------------------------
//  Randomizes the placement of mines on the board
//----------------------------------------------------

function randomMines(id){
    for (let i=0; i < 20; i++){
        let randNum = Math.floor(Math.random() * 100);
        if ((randNum !== id) && (blockArray[randNum].mine === false)){
            // Change square to containing mine
            blockArray[randNum].mine = true;
        } else {
            // If the random number is equal to the first
            // mine selected, just run again.
            i -= 1;
        }
    }
};

//-----------------------------------------------
// Checks to see if the user has won
// ----------------------------------------------
function checkWin(){
    let winCount = 0;
    // Checks each object to see if it's cleared
    for(const i in blockArray){
        if ((blockArray[i].cleared === true) && 
            (blockArray[i].mine === false)) {
                winCount += 1;
            }
    };
    // Checks if user won
    if (winCount === 80) bigWinner();
};

//--------------------------------------------------------
// Reveal the board
//--------------------------------------------------------
function revealBoard(){
    console.log("board reveal");
    boardEl.removeEventListener('click', render);

    for (let i=0; i<blockArray.length; i++){
        if (blockArray[i].cleared === false) {
            blockEl[i].style.backgroundImage = 'radial-gradient(circle, #bb7617, #bb7617, #bb7617, #bb7617, #bb7617, #b67316, #b16f16, #ac6c15, #a06514, #955e13, #8a5711, #7f5010)';
        }
        
        if (blockArray[i].mine === true){
            blockEl[i].style.backgroundImage = 'radial-gradient(circle, #d16b6b, #c36265, #b45a5e, #a65158, #984951, #99484c, #9a4747, #9b4742, #a8503b, #b25b32, #b86726, #bb7617)';
        }
    };
};

//------------------------------------------------------
// Clock to keep score
//------------------------------------------------------
function clock(){
    timer++;
    timerEl.innerText = `Seconds: ${timer}`;
};