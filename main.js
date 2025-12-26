const BASE_URL = "https://cozycorner-backend-peay.onrender.com";
// Landing page must always be public
localStorage.removeItem("token");
localStorage.removeItem("role");

function requireStudentLogin(redirectUrl) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "student") {
    window.location.href = "StudentLogin/StudentLogin.html";
    return false;
  }

  if (redirectUrl) {
    window.location.href = redirectUrl;
  }

  return true;
}

const AMENITY_ICONS = {
  Wifi: "fa-wifi",
  Ac: "fa-snowflake",
  Food: "fa-utensils",
  Laundry: "fa-soap",
  Power: "fa-bolt",
  Cctv: "fa-video",
};
function normalizeAmenities(amenitiesObj) {
  if (!amenitiesObj || typeof amenitiesObj !== "object") return [];

  return Object.entries(amenitiesObj)
    .filter(([_, value]) => value === true)
    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
}

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

//fetch properties
async function loadLandingProperties() {
  try {
    const res = await fetch(`${BASE_URL}/api/properties`);
    const properties = await res.json();

    console.log("Fetched properties:", properties);

    const grid = document.getElementById("listingsGrid");
    grid.innerHTML = "";

    properties.forEach((p) => {
      const amenities = normalizeAmenities(p.amenities);

      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-category", "long"); // safe default

      card.innerHTML = `
        <div class="card-image">
          <img src="${p.images?.[0] || "./images/default.jpg"}" />
          <div class="verified-badge">
            <i class="fas fa-check-circle"></i> Verified
          </div>
          <div class="card-heart">
            <i class="fas fa-heart"></i>
          </div>
        </div>

        <div class="card-details">
          <div class="card-price">
            ₹${p.rent} <span>/month</span>
          </div>

          <div class="card-title">${p.title}</div>

          <div class="card-location">
            <i class="fas fa-map-marker-alt"></i>
            ${p.address || ""}${p.city ? ", " + p.city : ""}
          </div>


          <div class="card-features">
  ${amenities
    .slice(0, 3)
    .map(
      (a) => `
        <div class="feature">
          <i class="fas ${AMENITY_ICONS[a] || "fa-circle"}"></i> ${a}
        </div>
      `
    )
    .join("")}
    </div>

        </div>
      `;

      card.addEventListener("click", () => {
        requireStudentLogin(
          `../PropertyDetails/PropertyDetail.html?id=${p._id}`
        );
      });

      card.querySelector(".card-heart").addEventListener("click", (e) => {
        e.stopPropagation();

        const token = localStorage.getItem("token");

        if (!token) {
          localStorage.setItem("postLoginRedirect", window.location.pathname);
          window.location.href = "StudentLogin/StudentLogin.html";
          return;
        }

        e.currentTarget.classList.toggle("active");
      });

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load properties", err);
  }
}

// --- SEARCH LOGIC ---
function performSearch() {
  const input = document.getElementById("searchInput").value;
  if (input.trim() !== "") {
    alert("Searching for properties near: " + input);
  } else {
    alert("Please enter a location to search!");
  }
}

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
loadLandingProperties();
