console.log("Javascript works")

let block = document.querySelectorAll('.block');
let board = document.getElementById('board');

block.forEach(function(el){
    el.style.height = '30px';
    el.style.width = '30px';
    el.style.border = '5px groove silver';
});

board.addEventListener('click', render);

function render(e){
    console.log(e.target)
}