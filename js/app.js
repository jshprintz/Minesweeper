console.log("Javascript works")

let block = document.querySelectorAll('.block');

block.forEach(function(el){
    el.style.height = '30px';
    el.style.width = '30px';
})