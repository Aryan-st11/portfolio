// REVEAL ON SCROLL
function reveal() {
  document.querySelectorAll(".reveal").forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", reveal);
reveal();


// SKILL BAR ANIMATION (run once)
let skillsAnimated = false;

window.addEventListener("scroll", () => {
  if (!skillsAnimated) {
    document.querySelectorAll(".bar div").forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
    skillsAnimated = true;
  }
});


// TYPING EFFECT (FIXED)
const typingElement = document.getElementById("typing");

const text = "Frontend Developer | JavaScript Enthusiast";
let i = 0;

function type() {
  if (typingElement && i < text.length) {
    typingElement.textContent += text[i];
    i++;
    setTimeout(type, 50);
  }
}
type();


// PROJECT MODAL (UPDATED FOR project-card)
const projects = document.querySelectorAll(".project-card");
const modal = document.getElementById("projectModal");
const title = document.getElementById("modalTitle");
const closeModal = document.getElementById("closeModal");

projects.forEach(p => {
  p.addEventListener("click", () => {
    const projectTitle = p.querySelector("h3").innerText;
    title.innerText = projectTitle;
    modal.style.display = "flex";
  });
});

if (closeModal) {
  closeModal.onclick = () => modal.style.display = "none";
}

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};


// CURSOR GLOW
const glow = document.querySelector(".cursor-glow");

window.addEventListener("mousemove", e => {
  if (glow) {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  }
});


// RESET SCROLL ON LOAD
window.onload = function () {
  window.scrollTo(0, 0);
};
