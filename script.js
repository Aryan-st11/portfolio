function reveal(){
document.querySelectorAll(".reveal").forEach(el=>{
if(el.getBoundingClientRect().top < window.innerHeight-100){
el.classList.add("active");
}
});
}
window.addEventListener("scroll",reveal);
reveal();

window.addEventListener("scroll",()=>{
document.querySelectorAll(".bar div").forEach(bar=>{
bar.style.width=bar.dataset.width;
});
});

let text="AI & Web Developer";
let i=0;

function type(){
if(i<text.length){
typing.textContent+=text[i];
i++;
setTimeout(type,80);
}
}
type();

const projects = document.querySelectorAll(".project");
const modal = document.getElementById("projectModal");
const title = document.getElementById("modalTitle");

projects.forEach(p=>{
p.addEventListener("click",()=>{
title.innerText = p.querySelector(".overlay").innerText;
modal.style.display="flex";
});
});

closeModal.onclick = ()=> modal.style.display="none";

const glow = document.querySelector(".cursor-glow");
window.addEventListener("mousemove",e=>{
glow.style.left=e.clientX+"px";
glow.style.top=e.clientY+"px";
});
