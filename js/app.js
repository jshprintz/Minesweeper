console.log("Javascript works")
//-----------------------------------------------------
// Declare state variables
//-----------------------------------------------------
let remainingMines;
let timer;
let blockArray = [];
let firstPicked;
let newId;

//-----------------------------------------------------
// Cache my DOM elements
//-----------------------------------------------------
let blockEl = document.querySelectorAll('.block');
let boardEl = document.getElementById('board');
let toggleEl = document.getElementById('toggle');
let dispMessageEl = document.querySelector('h2');
let remainingMinesEl = document.getElementById('remainingmines');
let squareEl = document.getElementById('sq1');
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
        // Create the board
        el.style.border = '5px groove #FFEFCA';
        el.style.padding = '15px';
        el.style.backgroundImage = 'radial-gradient(circle, #5c4a0a, #65510d, #6d5710, #765e13, #7f6516, #81681b, #846a20, #866d25, #826c2c, #7e6b33, #7b6939, #77683f)';
        
        // Create the array containing objects
        blockArray.push(newSquare());
    });

    // Set initial values for state variables
    remainingMines = 20;
    timer = 0;
    firstPicked = false;
};

//----------------------------------------------------
// Render changes
//----------------------------------------------------
function render(e){
    // Capture the block ID
    let blockID = e.target.id;

    // Capture the block object
    let blockObj = e.target;

    // checks to see if user is clearing a square or 
    // marking a square
    clearCheck(blockObj, blockID);
};

//--------------------------------------------------------
// Checks if User is CLEARING or MARKING
//--------------------------------------------------------
function clearCheck(obj, id){
    // Convert ID to number matching array
    id = convertID(id);

    if (toggleEl.innerText === 'CLEAR') {
        // Change to cleared spot
        obj.style.backgroundImage = 'radial-gradient(circle, #ffffff, #fcfafc, #faf5f7, #f9f0ef, #f5ece7, #f4e8de, #f0e5d4, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
        if (firstPicked === false){
            firstPick(id);
        } else {
            checkPick(id);
        };
    } else {
        // Checks if already marked
        if (blockArray[id].marked === true) {
            console.log("Already marked idiot");
        } 
        else if (blockArray[id].cleared === true){
            console.log("Already cleared idiot");
        }
        else {
            // Change to marked spot
            blockArray[id].marked = true;
            obj.style.backgroundImage = 'radial-gradient(circle, #8f0000, #a04518, #b06e3b, #bf9465, #cfb995, #d7c7a7, #e0d4b9, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
            remainingMines--;
            remainingMinesEl.innerText = `Mines Remaining: ${remainingMines}`
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
    // Mark first pick square as cleared
    blockArray[id].cleared = true;
    // Randomize mines throughout the board
    randomMines(id);
    // Run computerClear()
    computerClear(id);
};

//---------------------------------------------------
// CHECK PICK to see if it's a mine, a winner, or a clear
//---------------------------------------------------
function checkPick(id){
    // run checkMine()
    checkMine(id);
    // mark picked square as cleared
    blockArray[id].cleared = true;
    // Run checkWin()
    checkWin();
    // Run computerClear()
    computerClear(id);
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

//----------------------------------------------------
//  Randomizes the placement of mines on the board
//----------------------------------------------------

function randomMines(id){
    for (let i=0; i < 20; i++){
        let randNum = Math.floor(Math.random() * 100);
        if (randNum !== id){
            // Change square to containing mine
            blockArray[randNum].mine = true;
        } else {
            // If the random number is equal to the first
            // mine selected, just run again.
            i -= 1;
        }
    }
    console.log(blockArray);
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

//-----------------------------------------------------
// Checks if user clicked on mine
//-----------------------------------------------------
function checkMine(id){
    if (blockArray[id].mine === true) bigLoser();
};

//-----------------------------------------------------
// User lost!
//-----------------------------------------------------

function bigLoser(){
    console.log("You Lost!");
};

//-----------------------------------------------------
// User won!
//-----------------------------------------------------
function bigWinner(){
    console.log("You Won!");
};

//-----------------------------------------------------
// Computer clears adjacent free squares
//-----------------------------------------------------
function computerClear(id){
    console.log(`Block Selected: ${id}`);
    // -------NOT INCLUDING CORNERS------
    // Top Row
    if ((id > 0) && (id < 9)){
        console.log("top row not including corners");
    } 
    // Bottom Row
    else if ((id > 90) && (id < 99)){
        console.log("bottom row not including corners");
    } 
    // Left Row
    else if ((id !== 0) && (id !== 90) && (id % 10 === 0)){
        console.log("left row not including corners");
    } 
    // Right Row
    else if ((id !== 9) && (id !== 99) && (id % 10 === 9)){
        console.log("right row not including corners");
    } 
    // -----------CORNERS-----------
    // Top Left
    else if (id === 0){
        console.log("top left corner");
    } 
    // Top Right
    else if (id === 9){
        console.log("top right corner");
    } 
    // Bottom Left
    else if (id === 90){
        console.log("bottom left corner");
    } 
    // Bottom Right
    else if (id === 99){
        console.log("bottom right corner");
    } 
    // Middle of grid
    else{
        console.log("middle of grid");
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
        
            //Display number of surrounding mines
        if (blockArray[id].surroundingMines !== 0);
            //
    };
    console.log(blockArray[id].surroundingMines);

};