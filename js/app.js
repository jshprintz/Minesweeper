console.log('Javascript works')
//-----------------------------------------------------
// Media obtained:
// Explosion: https://freesound.org/people/Iwiploppenisse/sounds/156031/
//
// Camo: https://www.wallpaperflare.com/green-and-black-camouflage-textile-leaf-plant-part-no-people-wallpaper-pgcyo/download/1920x1080
//
// Music Gustav Holst: The Planets — “Mars, the Bringer of War”
// https://commons.wikimedia.org/wiki/File:Gustav_Holst_-_the_planets,_op._32_-_i._mars,_the_bringer_of_war.mp3
//
// Cheering Sound
// https://freesound.org/people/jayfrosting/sounds/333404/
//----------------------------------------------------

//-----------------------------------------------------
//              Cache my DOM elements
//-----------------------------------------------------
const blockEl = document.querySelectorAll('.block');
const boardEl = document.getElementById('board');
const toggleEl = document.getElementById('toggle');
const modeSelectEl = document.getElementById('modeSelect');
const dispMessageEl = document.querySelector('h2');
const remainingMinesEl = document.getElementById('remainingmines');
const timerEl = document.getElementById('timer');
const soundEl = document.getElementById('checkSound');
const musicEl = document.getElementById('checkMusic');
//-----------------------------------------------------

//-----------------------------------------------------
//              Declare state variables
//-----------------------------------------------------
// Mine Count variables
let [startMines, totalMineCount, remainingMines] = [20, 0, 0];
// Time variables
let [minutes, seconds, timerDisp, clockMaster] = [0, 0, '', null];
// Computer clear variables
let [squareArray, clearArray, mainArray, clear] = [ [], [], [], ''];

// Misc. Variables
let firstPicked = false;
let newId;
let noMine = true;
let playSound = true;
let playMusic = true;
let level = 1;
let lose = false;
let score = 0;
let tutorial = false;
let repeatTutorial = true;

//-----------------------------------------------------
//              Declare constant variables
//-----------------------------------------------------
const posHeadline = [`Great job! I knew you could do it!`,
`That's the square I would have picked!`, `You'll get promoted for this.`,
`Phenominal! Keep it up!`,`We're all counting on you!`,
`Can you clear any faster?`, `We'll win this war yet!`, `Great work!`,
`There was never a doubt in my mind!`];

const negHeadline = [`And now we're all dead!`,`And we lost the war. I knew you weren't ready.`,
`No wonder machines do this now.`,`Don't you know how numbers work?`,
`That was the worst square you could have picked.`, `Horrible choice. Just horrible.`,
`If you want to help us, you can join our enemy.`];

const playerMusic = new Audio('audio/Gustav_Holst_-_the_planets,_op._32_-_i._mars,_the_bringer_of_war-[AudioTrimmer.com].mp3');
const playerBomb = new Audio('audio/156031__iwiploppenisse__explosion.mp3');
const playerCheer = new Audio('audio/333404__jayfrosting__cheer-2.wav');

//-----------------------------------------------------
//                 Initialize program
//-----------------------------------------------------
init();

//------------------------------------------------------
//                 F U N C T I O N S
//------------------------------------------------------

//------------------------------------------------------
//             Initialize program function
//------------------------------------------------------
function init(){
    //Add Initial Event Listeners
    toggleEl.addEventListener('click', toggleButton);
    musicEl.addEventListener('change', switchMusic);
    soundEl.addEventListener('change', switchSound);
    modeSelectEl.addEventListener('click', changeMode);
    
    // Create the array containing each square
    // as an object.
    blockEl.forEach(function(){
        // Push new square object to array
        squareArray.push(newSquare());
    });

    // Set initial values for state variables
    remainingMines = startMines;
    firstPicked = false;
    noMine = true;

    // Set the volume for all of the sounds
    playerMusic.loop = true;
    playerMusic.volume = 0.2;
    playerBomb.volume = 0.1;
    playerCheer.volume = 0.1;
};

//----------------------------------------------------
//                      Render changes
//----------------------------------------------------
function render(e){
    modeSelectEl.removeEventListener('click', changeMode);
    

    // Capture the block ID
    let blockID = e.target.id;
    // Capture the block object
    let blockObj = e.target;
    // Ensures user picks a square and not the board
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
            // User picking for the first time
            toggleEl.addEventListener('click', toggleButton); 
            firstPick(id);
        } else {
            // determine if pick is a loser, winner, or cleared
            checkPick(id);
        };
    } else {
        // Marks the square with a flag
        flagSquare(obj, id);
    };
};

//---------------------------------------------------
//           FIRST SELECTION of the game
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

    if (tutorial === true){
        casualTeachOne();
    } else {
        // Display positive headline
        headline(true);
        // Starts music over for casual play
        // Continues music for Survivor play
        if (playMusic === true){
            if (modeSelectEl.innerText === 'CASUAL'){
                playerMusic.src = 'audio/Gustav_Holst_-_the_planets,_op._32_-_i._mars,_the_bringer_of_war-[AudioTrimmer.com].mp3';
                playerMusic.play();
            } else{
                playerMusic.play();
            };
        };
    };
};

//---------------------------------------------------
// CHECK PICK to see if it's a mine, a winner, or a clear
//---------------------------------------------------
function checkPick(id){
    // run checkMine()
    noMine = checkMine(id);
    // If user did not click on a mine
    if ((noMine === true) && (squareArray[id].cleared === false)){
        // Clears the current square
        clearSquare(id);
        // Positive headline
        headline(true);
        // Run computerClear()
        computerClear(id);
        // Run checkWin()
        checkWin();
    } else if (noMine === false){
        clearInterval(clockMaster);
        revealBoard(id);
    }
};

//-----------------------------------------------------
// Computer clears adjacent free squares
//-----------------------------------------------------
function computerClear(id){
let testCorner = true;
    // Determine what blocks, if any, that surround the
    // current selection should be cleared by the
    // computer.

    // If adjacent square does not contain a mine, clear it.

    // Top Row
    if ((id > 0) && (id < 9)){
        if ((squareArray[id-1].mine === false)
            && (squareArray[id-1].flagged === false))
            clearSquare(id-1);
        if ((squareArray[id+1].mine === false)
            && (squareArray[id+1].flagged === false)) 
            clearSquare(id+1);
        if ((squareArray[id+9].mine === false)
            && (squareArray[id+9].flagged === false)){ 
            testCorner = checkCorners(id, 9);
            if (testCorner === true) clearSquare(id+9);
        };
        if ((squareArray[id+10].mine === false)
            && (squareArray[id+10].flagged === false))
            clearSquare(id+10);
        if ((squareArray[id+11].mine === false)
            && (squareArray[id+11].flagged === false)){ 
            testCorner = checkCorners(id, 11);
            if (testCorner === true) clearSquare(id+11);
        };
    } 
    // Bottom Row
    else if ((id > 90) && (id < 99)){
        if ((squareArray[id-11].mine === false)
            && (squareArray[id-11].flagged === false)){ 
            testCorner = checkCorners(id, -11);
            if (testCorner === true) clearSquare(id-11);
        };
        if ((squareArray[id-10].mine === false)
            && (squareArray[id-10].flagged === false))
            clearSquare(id-10);
        if ((squareArray[id-9].mine === false)
            && (squareArray[id-9].flagged === false)){ 
            testCorner = checkCorners(id, -9);
            if (testCorner === true) clearSquare(id-9);
        };
        if ((squareArray[id-1].mine === false)
            && (squareArray[id-1].flagged === false))
            clearSquare(id-1);
        if ((squareArray[id+1].mine === false)
            && (squareArray[id+1].flagged === false))
            clearSquare(id+1);
    } 
    // Left Row
    else if ((id !== 0) && (id !== 90) && (id % 10 === 0)){
        if ((squareArray[id-10].mine === false)
            && (squareArray[id-10].flagged === false)) 
            clearSquare(id-10);
        if ((squareArray[id-9].mine === false)
            && (squareArray[id-9].flagged === false)){ 
            testCorner = checkCorners(id, -9);
            if (testCorner === true) clearSquare(id-9);
        };
        if ((squareArray[id+1].mine === false)
            && (squareArray[id+1].flagged === false))
            clearSquare(id+1);
        if ((squareArray[id+10].mine === false)
            && (squareArray[id+10].flagged === false)) 
            clearSquare(id+10);
        if ((squareArray[id+11].mine === false)
            && (squareArray[id+11].flagged === false)){
            testCorner = checkCorners(id, 11);
            if (testCorner === true) clearSquare(id+11);
        };
    } 
    // Right Row
    else if ((id !== 9) && (id !== 99) && (id % 10 === 9)){
        if ((squareArray[id-11].mine === false)
            && (squareArray[id-11].flagged === false)){ 
            testCorner = checkCorners(id, -11);
            if (testCorner === true) clearSquare(id-11);
        };
        if ((squareArray[id-10].mine === false)
            && (squareArray[id-10].flagged === false))
            clearSquare(id-10);
        if ((squareArray[id-1].mine === false)
            && (squareArray[id-1].flagged === false)) 
            clearSquare(id-1);
        if ((squareArray[id+9].mine === false)
            && (squareArray[id+9].flagged === false)){
            testCorner = checkCorners(id, 9);
            if (testCorner === true) clearSquare(id+9);
        };
        if ((squareArray[id+10].mine === false)
            && (squareArray[id+10].flagged === false))
            clearSquare(id+10);
    } 
    // -----------CORNERS-----------
    // Top Left
    else if (id === 0){
        if ((squareArray[1].mine === false)
            && (squareArray[1].flagged === false))
            clearSquare(1);
        if ((squareArray[10].mine === false)
            && (squareArray[10].flagged === false))
            clearSquare(10);
        if ((squareArray[11].mine === false)
            && (squareArray[11].flagged === false)){
            testCorner = checkCorners(id, 11);
            if (testCorner === true) clearSquare(id+11);
        };
    } 
    // Top Right
    else if (id === 9){
        if ((squareArray[8].mine === false) 
            && (squareArray[8].flagged === false))
            clearSquare(8);
        if ((squareArray[19].mine === false)
            && (squareArray[19].flagged === false))
            clearSquare(19);
        if ((squareArray[18].mine === false)
            && (squareArray[18].flagged === false)){
            testCorner = checkCorners(id, 9);
            if (testCorner === true) clearSquare(id+9);
        };
    } 
    // Bottom Left
    else if (id === 90){
        if ((squareArray[80].mine === false)
            && (squareArray[80].flagged === false))
                clearSquare(80);
        if ((squareArray[81].mine === false)
            && (squareArray[81].flagged === false)){ 
            testCorner = checkCorners(id, -9);
            if (testCorner === true) clearSquare(id-9);
        };
        if ((squareArray[91].mine === false)
            && (squareArray[91].flagged === false))
                clearSquare(91);
    } 
    // Bottom Right
    else if (id === 99){
        if ((squareArray[98].mine === false) 
            && (squareArray[98].flagged === false))
                clearSquare(98);
        if ((squareArray[88].mine === false)
            && (squareArray[88].flagged === false)){ 
            testCorner = checkCorners(id, -11);
            if (testCorner === true) clearSquare(id-11);
        };
        if ((squareArray[89].mine === false) 
            && (squareArray[89].flagged === false))
                clearSquare(89);
    } 
    // Middle of grid
    else{
        if ((squareArray[id-11].mine === false)
            && (squareArray[id-11].flagged === false)){ 
            testCorner = checkCorners(id, -11);
            if (testCorner === true) clearSquare(id-11);
        };
        if ((squareArray[id-10].mine === false)
            && (squareArray[id-10].flagged === false))
                clearSquare(id-10);
        if ((squareArray[id-9].mine === false)
            && (squareArray[id-9].flagged === false)){ 
            testCorner = checkCorners(id, -9);
            if (testCorner === true) clearSquare(id-9);
        };
        if ((squareArray[id-1].mine === false) 
            && (squareArray[id-1].flagged === false)) 
                clearSquare(id-1);
        if ((squareArray[id+1].mine === false)
            && (squareArray[id+1].flagged === false))
                clearSquare(id+1);
        if ((squareArray[id+9].mine === false)
            && (squareArray[id+9].flagged === false)){
            testCorner = checkCorners(id, 9);
            if (testCorner === true) clearSquare(id+9);
        };
        if ((squareArray[id+10].mine === false) 
            && (squareArray[id+10].flagged === false))
                clearSquare(id+10);
        if ((squareArray[id+11].mine === false)
            && (squareArray[id+11].flagged === false)){
            testCorner = checkCorners(id, 11);
            if (testCorner === true) clearSquare(id+11);
        };
    };
    // clearArray is the array that contains the found squares
    // the computer needs to clear.
    if (clearArray.length > 0) {
    // If clearArray contains original square selected, remove
        for (const i in clearArray){
            if (clearArray[i]===id){
                clearArray.splice(i, 1);
            };
        };

        // Check remaining squares
        clearArrayClear();
    };
};

//-------------------------------------------------
// Check corners
//-------------------------------------------------
function checkCorners(id, num){
    let long = 0;
    let lat = 10;
    
    // Determines where on the board the square is
    if (num === 11){
        long = 1;
        lat = 10;
    } else if (num === 9){
        long = -1;
        lat = 10;
    } else if (num === -9){
        long = 1;
        lat = -10;
    } else if (num === -11){
        long = -1;
        lat = -10;
    };

    // Checks corners to see if they are accessible to clear.
    // If there is no path because of mines or marks, it
    // will not clear.
    
    // Both paths contain Mines 
    if ((squareArray[id+long].mine === true)
        && (squareArray[id+lat].mine === true)){
            return false;
    } // One Mine, one Mark
    else if ((squareArray[id+long].mine === true)
        && (squareArray[id+lat].flagged === true)){
            return false;
    } // One Mine, one Mark
    else if ((squareArray[id+long].flagged === true)
        && (squareArray[id+lat].mine === true)){
            return false;
    } // Both paths contain Mines 
    else if ((squareArray[id+long].flagged === true)
        && (squareArray[id+lat].flagged === true)){
            return false;
    } else return true;
};

//---------------------------------------------------------
// Clears a square cleared by the computer
//---------------------------------------------------------
function clearSquare(id){
    squareArray[id].cleared = true;
    squareArray[id].flagged = false;
    mineCount();
    // Change background to cleared spot
    let squareEl = document.getElementById('sq' + id);
    squareEl.style.backgroundImage = 'radial-gradient(circle, #ffffff, #fcfafc, #faf5f7, #f9f0ef, #f5ece7, #f4e8de, #f0e5d4, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
    
    //Updates inner square with number and color
    if (squareArray[id].surroundingMines !== 0){
        squareEl.innerText = squareArray[id].surroundingMines;
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
            squareEl.style.color = 'brown';
        } else if (squareEl.innerText === '7'){
            squareEl.style.color = 'gray';
        } else {
            squareEl.style.color = 'black';
        };
    };

    // Keep a main record of all squares with no
    // surrounding mines.
    // If square does not have surrounding mines,
    // add square to main array and clear array.
    if (squareArray[id].surroundingMines === 0){
        mainArray.push(id); // Master record of zeros
        clearArray.push(id); // Working record of zeros
        for (let i=0; i<(mainArray.length - 1); i++){
            // if the square in question (the one just added)
            // is already on the main array, delete it from
            // both the master list and the working list
            if (mainArray[i] === id){
                mainArray.pop(); 
                clearArray.pop();
            };
        }
    };
};

//-----------------------------------------------------
// clearArray Clear (clears surrounding squares)
//-----------------------------------------------------
function clearArrayClear(){
    // Removes next square to clear and sends it to computerClear
    clear = clearArray.shift();
    computerClear(clear);
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
        flagged: false,
    };
    return newBlock;
};

//-----------------------------------------------------
// Checks if user clicked on mine
//-----------------------------------------------------
function checkMine(id){
    if (squareArray[id].mine === true) {
        // Final mine count
        mineCount();
        // Negative headline
        headline(false);
        // Explosion audio
        explosion();
        // Don't continue
        return false;
    } else {
        // Not a mine, contine
        return true;
    }
};

//-----------------------------------------------------
//                      User won!
//-----------------------------------------------------
function bigWinner(){
    if (playSound === true){    
        playerCheer.play();
    };
        // Tutorial victory
    if (tutorial === true){
        // stops the clock
        clearInterval(clockMaster);
        dispMessageEl.innerText = `Great job! Now let's learn Survivor mode`;
        setTimeout(reset, 5000);
    }   // Casual mode Victory
    else if (modeSelectEl.innerText === 'CASUAL'){
        dispMessageEl.innerText = `You did it! Congratualtions!
                    Now see if you can do it in under ${timerDisp}.`;
        playerMusic.pause();
        revealBoard();
    }   // Survivor mode next level
    else {
        dispMessageEl.innerText = `Great job! This next one has ${startMines + 5} mines!`;
        playerMusic.volume = 0.1;
        revealBoard();
    };
};

//----------------------------------------------------
//      Randomizes the placement of mines on the board
//----------------------------------------------------
function randomMines(id){
    for (let i=0; i < startMines; i++){
        // Random number generator
        let randNum = Math.floor(Math.random() * 100);
        // Confirm random number is not first square
        // and random number has not already been drawn
        if ((randNum !== id) && (squareArray[randNum].mine === false)){
            // Change square to containing mine
            squareArray[randNum].mine = true;
        } else {
            // If the random number is equal to the first
            // mine selected, just run again.
            i -= 1;
        }
    }
};

//-----------------------------------------------
//          Checks to see if the user has won
//-----------------------------------------------
function checkWin(){
    let winCount = 0;
    // Checks each object to see if it's cleared
    for(const i in squareArray){
            // if non mines are cleared
        if (((squareArray[i].cleared === true) && 
            (squareArray[i].mine === false)) || 
            // if mines are marked
            ((squareArray[i].mine === true) &&
            (squareArray[i].flagged === true))) {
                winCount += 1;
            };
        
    };
    // Checks if user won
    if (winCount === 100) bigWinner();
};

//------------------------------------------------------
//              Clock to keep score
//------------------------------------------------------
function clock(){
    
    //          CALCULATE TIME
    //---------------------------------------
    if (modeSelectEl.innerText === 'CASUAL'){
        // Casual mode
        seconds++;
        //convert to minutes
        if (seconds === 60){
            seconds = 0;
            minutes++;
        };
    } else {
        // Survivor Mode
        seconds--;
        //convert to seconds
        if (seconds <= 0){
            if (minutes === 0){
                // Out of time
                explosion();
                dispMessageEl.innerText = 'You ran out of time!';
                revealBoard();
            } else {
                // Tick down a minute
                seconds = 59;
                minutes--;
            }
        };
    }

    //              DISPLAY TIME
    //-------------------------------------
    //format timer
        timerDisp = `${minutes} : ${seconds}`;

    if ((minutes < 10) && (seconds >= 10)){
        timerDisp = `0${minutes} : ${seconds}`;
    } else if ((minutes < 10) && (seconds < 10)){
        timerDisp = `0${minutes} : 0${seconds}`;    
    } else {
        timerDisp = `${minutes} : ${seconds}`;
    };
    //display timer
    timerEl.innerText = timerDisp;
};

//---------------------------------------------
//          Populates a message in the h2
//---------------------------------------------
function headline(pos){
    // Positive headline
    if (pos === true){
        dispMessageEl.innerText = posHeadline[Math.floor(Math.random() * posHeadline.length)];
    } // Negative headline
    else {
        dispMessageEl.innerText = negHeadline[Math.floor(Math.random() * negHeadline.length)];
    };
};

//----------------------------------------------
//          Explosion sound and graphic
//----------------------------------------------
function explosion(){
    // Sound On
    if (playSound === true){
        playerBomb.src = 'audio/156031__iwiploppenisse__explosion.mp3';
        playerBomb.play();
    }; 
    // Pause music
    playerMusic.pause(); 

    // If Survivor mode, calculate score
    if (modeSelectEl.innerText === 'SURVIVOR') calculateScore();
};

//------------------------------------------------
//              Switch music on and off
//------------------------------------------------
function switchMusic(){
    musicEl.checked ? playMusic = true : playMusic = false;
    playMusic === true ? playerMusic.play() : playerMusic.pause();
};

//------------------------------------------------
//              Switch sound on and off
//------------------------------------------------
function switchSound(){
    soundEl.checked ? playSound = true : playSound = false;
};

//---------------------------------------------------
//      Runs through logic when a user Marks a square
//---------------------------------------------------
function flagSquare(obj, id){
    // Checks if already marked
    if (squareArray[id].flagged === true) {
        squareArray[id].flagged = false;
        obj.style.backgroundImage = 'radial-gradient(circle, #5c4a0a, #65510d, #6d5710, #765e13, #7f6516, #81681b, #846a20, #866d25, #826c2c, #7e6b33, #7b6939, #77683f)';
        mineCount();
        checkWin();
    } // Checks if already cleared
    else if (squareArray[id].cleared === true){
        headline(true);
        checkWin();
    }
    else {
        // Change to marked spot
        squareArray[id].flagged = true;
        obj.style.backgroundImage = 'radial-gradient(circle, #8f0000, #a04518, #b06e3b, #bf9465, #cfb995, #d7c7a7, #e0d4b9, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
        mineCount();
        checkWin();
    };
};

//------------------------------------------------------
//          Counts the remaining mines
//------------------------------------------------------
function mineCount(){
    remainingMines = startMines;

    // searches for flagged mines
    squareArray.forEach(function(el){
        if (el.flagged === true) remainingMines--;
    });
    // checks for misflags
    if (remainingMines < 0){
        remainingMines = 0;
        dispMessageEl.innerText = `Check your flags! We only started with ${startMines} mines!!`;
    };
    // displays final mine count
    remainingMinesEl.innerText = `Mines: ${remainingMines}`;
    return remainingMines;
};

//-----------------------------------------------------
//          Play Again display message
//-----------------------------------------------------
function playAgain(){
    // Casual mode Play Again?
    if (modeSelectEl.innerText === 'CASUAL'){
        dispMessageEl.innerText = `Would you like to play again?`;
    } // Survivor mode Play Again?
    else if (lose === true) {
        dispMessageEl.innerText = `You made it to LEVEL ${level} and scored ${score} points!
        Play Again?`;
    } // Survivor mode Next Level
    else {
        dispMessageEl.innerText = `Ready for LEVEL ${level + 1}?`;
    };
    // YES button display
    toggleEl.innerText = `YES`;
    toggleEl.style.backgroundImage = 'radial-gradient(circle, #ebe8dd, #ebe8dd, #ebe8dd, #ebe8dd, #ebe8dd, #eae6d7, #eae4d1, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
    toggleEl.addEventListener('click', reset);
};

//----------------------------------------------------
//  Resets the game if the user wants to play again
//----------------------------------------------------
function reset(e){
    // Resets event listeners
    toggleEl.removeEventListener('click', reset);
    toggleEl.innerText = 'CLEAR';
    toggleEl.style.backgroundImage = 'radial-gradient(circle, #ebe8dd, #ebe8dd, #ebe8dd, #ebe8dd, #ebe8dd, #eae6d7, #eae4d1, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';

    squareArray = [];

    // Create the array containing objects
    blockEl.forEach(function(el){
        // Reset board
        el.style.border = '5px groove #FFEFCA';
        el.style.backgroundImage = 'radial-gradient(circle, #5c4a0a, #65510d, #6d5710, #765e13, #7f6516, #81681b, #846a20, #866d25, #826c2c, #7e6b33, #7b6939, #77683f)';
        el.innerText = '';
        el.style.fontSize = '10pt';
        // Push new object
        squareArray.push(newSquare());
    });
    

    // Set initial values for state variables
    mainArray = [];
    clearArray = [];
    firstPicked = false;
    noMine = true;

    // Directing to appropriate level/reset
    resetSelect();
    // Reset minecount
    mineCount();
    boardEl.addEventListener('click', render);

    if (tutorial === true){
        survivorTeachOne();
    };
};

//--------------------------------------------------------
//                  Reveal the board
//--------------------------------------------------------
function revealBoard(id){
    //remove old event listeners
    boardEl.removeEventListener('click', render);
    toggleEl.removeEventListener('click', toggleButton);
    // stops the clock
    clearInterval(clockMaster);
    // final mine count
    mineCount();

    // Changes all of the background images for the squares
    // based on the data pulled from the object
    for (let i=0; i<squareArray.length; i++){
        if ((squareArray[i].cleared === false) && (squareArray[i].flagged === false)) {
            // Not cleared, not flagged squares
            blockEl[i].style.backgroundImage = 'radial-gradient(circle, #bb7617, #bb7617, #bb7617, #bb7617, #bb7617, #b67316, #b16f16, #ac6c15, #a06514, #955e13, #8a5711, #7f5010)';
        }
            // Successfully marked mines
        if ((squareArray[i].mine === true) && (squareArray[i].flagged === true)){
            blockEl[i].style.backgroundImage = 'radial-gradient(circle, #4d3434, #6c565a, #8a7a80, #aaa0a7, #ccc8cd, #d2cdd3, #d9d2d8, #e0d7de, #ceb9bf, #bb9d9b, #a38475, #826f52)';
        } else if (squareArray[i].mine === true) {
            // Not marked mines
            blockEl[i].style.backgroundImage = 'radial-gradient(circle, #d16b6b, #c36265, #b45a5e, #a65158, #984951, #99484c, #9a4747, #9b4742, #a8503b, #b25b32, #b86726, #bb7617)';
        } else if ((squareArray[i].mine === false) && (squareArray[i].flagged === true)){
            // Wrongly marked
            blockEl[i].style.backgroundImage = 'radial-gradient(circle, #4d3434, #6c565a, #8a7a80, #aaa0a7, #ccc8cd, #d2cdd3, #d9d2d8, #e0d7de, #ceb9bf, #bb9d9b, #a38475, #826f52)';
            blockEl[i].innerText = 'X';
            blockEl[i].style.color = 'red';
            blockEl[i].style.fontSize = '20pt';
        }
    };

    if (tutorial === true){
        dispMessageEl.innerText = `Practice makes perfect. Let's learn SURVIVOR mode!`;
        setTimeout(reset, 5000);
    } else{
        // Five seconds display before changing headline
        // to play again option.
        setTimeout(playAgain, 5000);
    };
};

//-----------------------------------------------------
// Assigns each square with the number of surrounding
// mines
//-----------------------------------------------------
function assignSurrounding(){
    // Loop through array assigning the amount of
    // surrounding mines
    for (let id = 0; id < squareArray.length; id++){
        // -------NOT INCLUDING CORNERS------
        // Top Row
        if ((id > 0) && (id < 9)){
            if (squareArray[id-1].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+1].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+9].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+10].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+11].mine === true) 
                squareArray[id].surroundingMines += 1;
        } 
        // Bottom Row
        else if ((id > 90) && (id < 99)){
            if (squareArray[id-11].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id-10].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id-9].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id-1].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+1].mine === true) 
                squareArray[id].surroundingMines += 1;
        } 
        // Left Row
        else if ((id !== 0) && (id !== 90) && (id % 10 === 0)){
            if (squareArray[id-10].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id-9].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+1].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+10].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+11].mine === true) 
                squareArray[id].surroundingMines += 1;
        } 
        // Right Row
        else if ((id !== 9) && (id !== 99) && (id % 10 === 9)){
            if (squareArray[id-11].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id-10].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id-1].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+9].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+10].mine === true) 
                squareArray[id].surroundingMines += 1;
        } 
        // -----------CORNERS-----------
        // Top Left
        else if (id === 0){
            if (squareArray[1].mine === true) 
                squareArray[0].surroundingMines += 1;
            if (squareArray[10].mine === true) 
                squareArray[0].surroundingMines += 1;
            if (squareArray[11].mine === true) 
                squareArray[0].surroundingMines += 1;
        } 
        // Top Right
        else if (id === 9){
            if (squareArray[8].mine === true) 
                squareArray[9].surroundingMines += 1;
            if (squareArray[19].mine === true) 
                squareArray[9].surroundingMines += 1;
            if (squareArray[18].mine === true) 
                squareArray[9].surroundingMines += 1;
        } 
        // Bottom Left
        else if (id === 90){
            if (squareArray[80].mine === true) 
                squareArray[90].surroundingMines += 1;
            if (squareArray[81].mine === true) 
                squareArray[90].surroundingMines += 1;
            if (squareArray[91].mine === true) 
                squareArray[90].surroundingMines += 1;
        } 
        // Bottom Right
        else if (id === 99){
            if (squareArray[98].mine === true) 
                squareArray[99].surroundingMines += 1;
            if (squareArray[88].mine === true) 
                squareArray[99].surroundingMines += 1;
            if (squareArray[89].mine === true) 
                squareArray[99].surroundingMines += 1;
        } 
        // Middle of grid
        else{
            if (squareArray[id-11].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id-10].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id-9].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id-1].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+1].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+9].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+10].mine === true) 
                squareArray[id].surroundingMines += 1;
            if (squareArray[id+11].mine === true) 
                squareArray[id].surroundingMines += 1;
        };
    };
};

//---------------------------------------------------
// Change game mode (Casual/Survivor)
//---------------------------------------------------
function changeMode(){
    // If Casual mode, change to SURVIVOR
    if (modeSelectEl.innerText === 'CASUAL'){
        modeSelectEl.innerText = 'SURVIVOR';
        modeSelectEl.style.backgroundImage = 'radial-gradient(circle, #f2d1d7, #f2d1d7, #f2d1d7, #f2d1d7, #f2d1d7, #f5c7d0, #f8bdc9, #fab3c3, #fd9cb5, #ff83a9, #ff679d, #ff4593)';
        timerEl.innerText = '01 : 00';
        minutes = 1;
        seconds = 0;
        startMines = 5;
    } // If SURVIVOR mode, change to CASUAL
    else {
        modeSelectEl.innerText = 'CASUAL';
        modeSelectEl.style.backgroundImage = 'radial-gradient(circle, #ebe8dd, #ebe8dd, #ebe8dd, #ebe8dd, #ebe8dd, #eae6d7, #eae4d1, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
        timerEl.innerText = '00 : 00';
        minutes = 0;
        seconds = 0;
        startMines = 20;
    };
    // Update mine count
    remainingMinesEl.innerText = `Mines: ${startMines}`
};

//-----------------------------------------------------
//         Calculate score (SURVIVOR mode)
//-----------------------------------------------------
function calculateScore(){
    score = 0;
    // 200 points for every level advance
    score += (level * 200);
    // add all the total mines cleared, subtracting the mines
    // that weren't cleared yet for that level
    score += totalMineCount - mineCount();
    // Divide by 10 to make it more readable.
    score = score / 10;
    // Let it be known that the user lost.
    lose = true;
};

//----------------------------------------------------
//      Determines correct path for Reset
// (Casual reset, Survivor reset, Survivor next level)
//----------------------------------------------------
function resetSelect(){
    //
    //      Sets the next level for SURVIVOR mode
    //
    if ((modeSelectEl.innerText === 'SURVIVOR') && (lose === false)){
        // adjusts time for new round
        minutes += Math.floor(level/2);
        if ((level%2) === 1) seconds += 30;
        if (seconds >= 60){
            minutes++;
            seconds -= 60;
        };

        // adjust time display based on digits
        if (seconds >= 10) {
            timerEl.innerText = `0${minutes} : ${seconds}`;
        } else{
            timerEl.innerText = `0${minutes} : 0${seconds}`;
        };
        // increase level
        level++;
        // increase minecount
        totalMineCount += startMines;
        startMines += 5;
        // Display message
        dispMessageEl.innerText = 'Clock starts when you clear!';
        playerMusic.volume = 0.2;
    }
    //   
    //      resets all the settings for SURVIVOR mode
    //
    else if ((modeSelectEl.innerText === 'SURVIVOR') && (lose === true)){
        seconds = 30;
        startMines = 5;
        timerEl.innerText = '01 : 00';
        dispMessageEl.innerText = 'Choose the game mode below, the click on the grid to begin!';
        resetLikeVariables();
    }
    //
    //         resets all the settings for CASUAL mode
    //
    else{
        seconds = 0;
        startMines = 20;
        timerEl.innerText = '00 : 00';
        dispMessageEl.innerText = 'Choose the game mode below, the click on the grid to begin!';
        resetLikeVariables();
    };
};

//--------------------------------------------------
//  Resets some common like variables in game modes
//--------------------------------------------------
function resetLikeVariables(){
    minutes = 0;
    lose = false;
    totalMineCount = 0
    level = 1;
    remainingMines = startMines;
    modeSelectEl.addEventListener('click', changeMode);
    playerMusic.src = 'audio/Gustav_Holst_-_the_planets,_op._32_-_i._mars,_the_bringer_of_war-[AudioTrimmer.com].mp3';
    playerMusic.volume = 0.2;
};

//---------------------------------------------------
// Toggle between Clearing blocks and Marking blocks
//---------------------------------------------------
function toggleButton(e){
    
    if ((tutorial === true) && (repeatTutorial === true)){
        repeatTutorial = false;
        casualTeachThree();
    };
    
    if (toggleEl.innerText === 'START'){
        toggleEl.innerText = 'YES';
        timerEl.innerText = 'NO';
        dispMessageEl.innerText = 'Welcome to MEGA Minesweeper! Do you need a tutorial?'
        
        modeSelectEl.removeEventListener('click', changeMode);
        toggleEl.addEventListener('click', yesTutorial);
        timerEl.addEventListener('click', noTutorial);

    } else if (toggleEl.innerText === 'CLEAR'){
        toggleEl.innerText = 'FLAG';
        toggleEl.style.backgroundImage = 'radial-gradient(circle, #f2d1d7, #f2d1d7, #f2d1d7, #f2d1d7, #f2d1d7, #f5c7d0, #f8bdc9, #fab3c3, #fd9cb5, #ff83a9, #ff679d, #ff4593)';
    } else {
        toggleEl.innerText = 'CLEAR';
        toggleEl.style.backgroundImage = 'radial-gradient(circle, #ebe8dd, #ebe8dd, #ebe8dd, #ebe8dd, #ebe8dd, #eae6d7, #eae4d1, #e9e2cb, #e7debd, #e6d9af, #e4d5a2, #e2d094)';
    };
};

//-------------------------------------------------
//                  NO TUTORIAL
//-------------------------------------------------
function noTutorial(){
    resetButtons();
    dispMessageEl.innerText = 'Choose your game mode at the bottom, then click anywhere on the grid to start!';
};

//-------------------------------------------------
// Resets values after Tutorial selection
//-------------------------------------------------
function resetButtons(){
    toggleEl.removeEventListener('click', yesTutorial);
    timerEl.removeEventListener('click', noTutorial);
    modeSelectEl.addEventListener('click', changeMode);
    boardEl.addEventListener('click', render);
    tutorial = false;

    toggleEl.innerText = 'CLEAR';
    if (modeSelectEl.innerText === 'CASUAL'){
        timerEl.innerText = '00 : 00'
    } else {
        timerEl.innerText = '01 : 00'
    };
};

//-----------------------------------------------------
//                  YES TUTORIAL
//-----------------------------------------------------
function yesTutorial(){
    timerEl.removeEventListener('click', noTutorial);
    boardEl.addEventListener('click', render);
    toggleEl.removeEventListener('click', yesTutorial);
    toggleEl.removeEventListener('click', toggleButton);

    toggleEl.innerText = 'CLEAR';
    modeSelectEl.innerText = 'CASUAL';
    timerEl.innerText = '00 : 00';
    
    tutorial = true;
    dispMessageEl.innerText = 'The grid below represents a minefield. Go ahead and click anywhere on the grid to start.';
    
};
//----------------TUTORIAL--------------------------------
function casualTeachOne(){
    dispMessageEl.innerText = 'The first square will never be a mine. In CASUAL mode, the clock ticks up, so no rush!';
    setTimeout(casualTeachTwo, 5000);
};

function casualTeachTwo(){
    dispMessageEl.innerText = 'You can click on the CLEAR button to toggle between CLEAR and FLAG.';
    toggleEl.addEventListener('click', toggleButton);
};

function casualTeachThree(){
    dispMessageEl.innerText = 'Each number represent how many mines surround that square.';
    setTimeout(casualTeachFour, 5000);
};

function casualTeachFour(){
    dispMessageEl.innerText = 'Try to CLEAR the squares without mines, and FLAG the squares with mines!';
    playerMusic.play();
};

function survivorTeachOne(){
    changeMode();
    dispMessageEl.innerText = `In SURVIVOR mode, you race against time to clear the squares.`;
    setTimeout(survivorTeachTwo, 5000);
};

function survivorTeachTwo(){
    dispMessageEl.innerText = `You only start with 1 minute, but with each level you get time bonuses!`;
    setTimeout(survivorTeachThree, 5000);
};

function survivorTeachThree(){
    dispMessageEl.innerText = `The higher the level, the more the score! Click a square to start!`;
    tutorial = false;
};
