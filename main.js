// --- FILTERING LOGIC ---
const pills = document.querySelectorAll(".filter-pill");
const cards = document.querySelectorAll(".card");

pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    // 1. Remove 'active' class from all pills
    pills.forEach((p) => p.classList.remove("active"));
    // 2. Add 'active' class to clicked pill
    pill.classList.add("active");

    const filterValue = pill.getAttribute("data-filter");

    // 3. Show/Hide cards based on data-category
    cards.forEach((card) => {
      const categories = card.getAttribute("data-category");

      if (filterValue === "all" || categories.includes(filterValue)) {
        card.style.display = "block";
        // Optional: Add simple fade-in animation
        card.style.animation = "fadeIn 0.5s";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// --- SEARCH LOGIC ---
function performSearch() {
  const input = document.getElementById("searchInput").value;
  if (input.trim() !== "") {
    alert("Searching for properties near: " + input);
  } else {
    alert("Please enter a location to search!");
  }
}

// --- HEART/LIKE LOGIC ---
const hearts = document.querySelectorAll(".card-heart");
hearts.forEach((heart) => {
  heart.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent card click
    heart.classList.toggle("active");
  });
});

// --- KEYFRAME ANIMATION FOR FILTERS ---
const styleSheet = document.createElement("style");
styleSheet.innerText = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
document.head.appendChild(styleSheet);

function goToHostLogin() {
  window.open("HostLogin/HostLogin.html", "_blank");
}

function goToStudentLogin() {
  window.open("StudentLogin/StudentLogin.html", "_blank");
}

function toggleMenu() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("show");
}

window.onclick = function (event) {
  if (!event.target.matches(".menu-btn")) {
    const dropdowns = document.getElementsByClassName("dropdown");
    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].classList.remove("show");
    }
  }
};

