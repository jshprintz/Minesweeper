console.log('Javascript works')
//-----------------------------------------------------
// Images obtained:
// Explosion: https://www.pngwing.com/en/free-png-vdqes/download
//
// Camo: https://www.wallpaperflare.com/green-and-black-camouflage-textile-leaf-plant-part-no-people-wallpaper-pgcyo/download/1920x1080
//
// Music Gustav Holst: The Planets — “Mars, the Bringer of War”
//https://commons.wikimedia.org/wiki/File:Gustav_Holst_-_the_planets,_op._32_-_i._mars,_the_bringer_of_war.ogg
//----------------------------------------------------

//-----------------------------------------------------
// Declare state variables
//-----------------------------------------------------
let remainingMines;
let minutes = 0;
let seconds = 0;
let blockArray = [];
let checkArray = [];
let firstPicked;
let newId;
let clearArray;
let masterArray = [];
let noMine = true;
let clockMaster;
let timerDisp = '';

//-----------------------------------------------------
// Declare constant variables
//-----------------------------------------------------
const posHeadline = [`Great job! I knew you could do it!`,
`That's the square I would have picked!`, `You'll get promoted for this.`,
`Phenominal! Only ${remainingMines} to go!`,`We're all counting on you!`,
`Can you clear any faster?`, `We'll win this war yet!`, `Great work!`,
`There was never a doubt in my mind!`];

const negHeadline = [`And now we're all dead!`,`And we lost the war. I knew you weren't ready.`,
`No wonder machines do this now.`,`Don't you know how numbers work?`,
`That was the worst square you could have picked.`, `Horrible choice. Just horrible.`,
`If you want to help us, you can join our enemy.`];

const spriteWidth = 180;
const spriteHeight = 240;
const player = new Audio();



//-----------------------------------------------------
// Cache my DOM elements
//-----------------------------------------------------
const blockEl = document.querySelectorAll('.block');
const boardEl = document.getElementById('board');
const toggleEl = document.getElementById('toggle');
const dispMessageEl = document.querySelector('h2');
const remainingMinesEl = document.getElementById('remainingmines');
const timerEl = document.getElementById('timer');
const bgCheckbox = document.querySelector('input[type="checkbox"]');
//-----------------------------------------------------

//-----------------------------------------------------
// Add Event Listeners
//-----------------------------------------------------
boardEl.addEventListener('click', render);
toggleEl.addEventListener('click', clearMark);
bgCheckbox.addEventListener('change', switchMusic);
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
    
    // Create the array containing objects
    blockEl.forEach(function(el){
        // Push new object
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
            remainingMinesEl.innerText = `Mines: ${remainingMines}`;
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
            remainingMinesEl.innerText = `Mines: ${remainingMines}`;
            checkWin();
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
    // Display positive headline
    headline(true);
    // Autoplay music
    player.src = 'https://upload.wikimedia.org/wikipedia/commons/5/54/Gustav_Holst_-_the_planets%2C_op._32_-_i._mars%2C_the_bringer_of_war.ogg';
    player.setAttribute('preload', 'auto');
    player.play();

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
        // Positive headline
        headline(true);
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
        
        console.log("You Lose!")
        remainingMines++;
        headline(false);
        explosion(id);
        return false;
    } else {
        return true;
    }
};

//-----------------------------------------------------
// User won!
//-----------------------------------------------------
function bigWinner(){
    dispMessageEl.innerText = `You did it! Congratualtions!
                Now see if you can do it in under ${timerDisp}.`
    remainingMines = 0;
    revealBoard();
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
    console.log("Check win");
    let winCount = 0;
    // Checks each object to see if it's cleared
    for(const i in blockArray){
        if ((blockArray[i].cleared === true) && 
            (blockArray[i].mine === false)) {
                winCount += 1;
            }
    };
    // Checks if user won
    console.log(winCount, "Win Count")
    if (winCount === 80) bigWinner();
};

//--------------------------------------------------------
// Reveal the board
//--------------------------------------------------------
function revealBoard(){
    boardEl.removeEventListener('click', render);
    toggleEl.addEventListener('click', clearMark);

    clearInterval(clockMaster);
    remainingMinesEl.innerText = `Mines: ${remainingMines}`;
    player.pause();

    for (let i=0; i<blockArray.length; i++){
        if (blockArray[i].cleared === false) {
            blockEl[i].style.backgroundImage = 'radial-gradient(circle, #bb7617, #bb7617, #bb7617, #bb7617, #bb7617, #b67316, #b16f16, #ac6c15, #a06514, #955e13, #8a5711, #7f5010)';
        }
        
        if ((blockArray[i].mine === true) && (blockArray[i].marked === true)){
            blockEl[i].style.backgroundImage = 'radial-gradient(circle, #4d3434, #6c565a, #8a7a80, #aaa0a7, #ccc8cd, #d2cdd3, #d9d2d8, #e0d7de, #ceb9bf, #bb9d9b, #a38475, #826f52)';
        } else if (blockArray[i].mine === true) {
            blockEl[i].style.backgroundImage = 'radial-gradient(circle, #d16b6b, #c36265, #b45a5e, #a65158, #984951, #99484c, #9a4747, #9b4742, #a8503b, #b25b32, #b86726, #bb7617)';
        }
    };
};

//------------------------------------------------------
// Clock to keep score
//------------------------------------------------------
function clock(){
    seconds++;

    //convert to minutes
    if (seconds === 60){
        seconds = 0;
        minutes++;
    };
    //format timer
        timerDisp = `${minutes} : ${seconds}`;

    if ((minutes < 10) && (seconds >= 10)){
        timerDisp = `0${minutes} : ${seconds}`;
    } else if ((minutes < 10) && (seconds < 10)){
        timerDisp = `0${minutes} : 0${seconds}`;    
    } else {
        timerDisp = `${minutes} : ${seconds}`;
    };

    timerEl.innerText = timerDisp;
};

//---------------------------------------------
// Populates a message in the h2
//---------------------------------------------

function headline(pos){
    if (pos === true){
        dispMessageEl.innerText = posHeadline[Math.floor(Math.random() * posHeadline.length)];
    } else {
        dispMessageEl.innerText = negHeadline[Math.floor(Math.random() * negHeadline.length)];
    };
};

//----------------------------------------------
// Sprite image explosion
//----------------------------------------------

function explosion(id){
    blockEl[id].style.spriteWidth = spriteWidth;
    blockEl[id].style.height = spriteHeight;
    blockEl[id].style.backgroundImage = 'url(../images/explosion.png) 0 0';
};

//------------------------------------------------
// Switch music on and off
//------------------------------------------------

function switchMusic(){
    bgCheckbox.checked ? player.play() : player.pause();
}