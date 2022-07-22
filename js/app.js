console.log("Javascript works")

//-----------------------------------------------------
// Cache my DOM elements
//-----------------------------------------------------
let blockEl = document.querySelectorAll('.block');
let boardEl = document.getElementById('board');
let toggleEl = document.getElementById('toggle');
let dispMessageEl = document.querySelector('h2');
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
function init(){
    blockEl.forEach(function(el){
        el.style.border = '5px groove #FFEFCA';
        el.style.padding = '15px';
        el.style.backgroundImage = 'radial-gradient(circle, #5c4a0a, #65510d, #6d5710, #765e13, #7f6516, #81681b, #846a20, #866d25, #826c2c, #7e6b33, #7b6939, #77683f)';
    });
};

// Render changes
function render(e){
    console.log(e.target);
};

// Toggle between Clearing blocks and Marking blocks
function clearMark(e){
    if (toggleEl.innerText === 'CLEAR'){
        toggleEl.innerText = 'MARK';
        toggleEl.style.backgroundImage = 'radial-gradient(circle, #f2d1d7, #f2d1d7, #f2d1d7, #f2d1d7, #f2d1d7, #f5c7d0, #f8bdc9, #fab3c3, #fd9cb5, #ff83a9, #ff679d, #ff4593)';
    } else {
        toggleEl.innerText = 'CLEAR';
        toggleEl.style.backgroundImage = 'none';
    };
};
