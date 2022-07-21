console.log("Javascript works")

let block = document.querySelectorAll('.block');
let board = document.getElementById('board');

block.forEach(function(el){
    el.style.border = '5px groove silver';
    el.style.padding = '10px'
    el.style.backgroundImage = 'radial-gradient(circle, #5c4a0a, #65510d, #6d5710, #765e13, #7f6516, #81681b, #846a20, #866d25, #826c2c, #7e6b33, #7b6939, #77683f)';
});

board.addEventListener('click', render);

function render(e){
    console.log(e.target);
};