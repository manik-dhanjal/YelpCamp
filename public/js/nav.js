var hamburger =document.querySelector(".hamburger");
var collapse  =document.querySelector(".collapse");

hamburger.addEventListener("click",()=>{
    collapse.classList.toggle("open");
})