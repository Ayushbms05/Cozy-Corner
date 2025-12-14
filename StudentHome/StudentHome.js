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
        card.style.animation = "fadeIn 0.3s ease";
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
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
document.head.appendChild(styleSheet);

// --- PROFILE MENU TOGGLE ---
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("show");
}

document.addEventListener("click", function (e) {
  const menu = document.getElementById("menu");
  const profile = document.querySelector(".profile");

  if (!menu.contains(e.target) && !profile.contains(e.target)) {
    menu.classList.remove("show");
  }
});
