console.log("Javascript works")
//-----------------------------------------------------
// Declare state variables
//-----------------------------------------------------
let remainingMines;
let timer;
let blockArray = [];
let firstPicked;

//-----------------------------------------------------
// Cache my DOM elements
//-----------------------------------------------------
let blockEl = document.querySelectorAll('.block');
let boardEl = document.getElementById('board');
let toggleEl = document.getElementById('toggle');
let dispMessageEl = document.querySelector('h2');
let remainingMinesEl = document.getElementById('remainingmines');
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
    console.log(blockID)

    // Capture the block object
    let blockObj = e.target;

    // checks to see if user is clearing a square or 
    // marking a square
    clearCheck(blockObj);
};

//--------------------------------------------------------
// Checks if User is CLEARING or MARKING
//--------------------------------------------------------
function clearCheck(block){
    if (toggleEl.innerText === 'CLEAR') {
        // Change to cleared spot
        block.style.backgroundImage = 'radial-gradient(circle, #ffffff, #fcfafc, #faf5f7, #f9f0ef, #f5ece7, #f4e8de, #f0e5d4, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
        if (firstPicked === false){
            firstPick();
        } else {
            checkPick();
        };
    } else {
        // Change to marked spot
        block.style.backgroundImage = 'radial-gradient(circle, #8f0000, #a04518, #b06e3b, #bf9465, #cfb995, #d7c7a7, #e0d4b9, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
        remainingMines--;
        remainingMinesEl.innerText = `Mines Remaining: ${remainingMines}`
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
function firstPick(){
    // Mark first pick square as cleared

    // Randomize mines throughout the board

    // Run computerClear()

};

//---------------------------------------------------
// CHECK PICK to see if it's a mine, a winner, or a clear
//---------------------------------------------------
function checkPick(){
    // run checkMine()

    // mark picked square as cleared

    // Run checkWin()

    // Run computerClear()
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
    };
    return newBlock;
};