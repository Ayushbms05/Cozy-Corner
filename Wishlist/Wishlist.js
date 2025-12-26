const BASE_URL = "https://cozycorner-backend-peay.onrender.com";
function getAmenitiesHTML(amenities) {
  if (!amenities) return "";

  const icons = {
    wifi: "fa-wifi",
    ac: "fa-snowflake",
    food: "fa-utensils",
    laundry: "fa-soap",
    power: "fa-bolt",
    cctv: "fa-video",
  };

  let html = "";
  let count = 0;

  for (let key in amenities) {
    if (amenities[key] && count < 4) {
      html += `
        <div class="feature">
          <i class="fas ${icons[key]}"></i>
          ${key.charAt(0).toUpperCase() + key.slice(1)}
        </div>
      `;
      count++;
    }
  }

  return html;
}

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "student") {
    window.location.href = "../StudentLogin/StudentLogin.html";
    return;
  }

  loadWishlist();
});

async function loadWishlist() {
  try {
    const res = await fetch(`${BASE_URL}/api/wishlist`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const wishlist = await res.json();
    renderWishlist(wishlist);
  } catch (err) {
    console.error("Failed to load wishlist", err);
  }
}

function renderWishlist(properties) {
  const grid = document.getElementById("wishlistGrid");
  const emptyState = document.getElementById("emptyState");
  const countText = document.getElementById("countText");

  grid.innerHTML = "";

  if (!properties || properties.length === 0) {
    emptyState.style.display = "block";
    countText.innerText = "0 Items";
    return;
  }

  emptyState.style.display = "none";
  countText.innerText = properties.length + " Items";

  properties.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
  <div class="card-image">
    <img src="${p.images?.[0] || "../images/default.jpg"}" />

    <div class="verified-badge">
      <i class="fas fa-check-circle"></i> Verified
    </div>

    <button class="remove-btn">
      <i class="fas fa-trash-alt"></i>
    </button>
  </div>

  <div class="card-details">
    <div class="card-price">
      ₹${p.rent} <span>/ month</span>
    </div>

    <div class="card-title">${p.title}</div>

    <div class="card-location">
      <i class="fas fa-map-marker-alt"></i>
      ${p.address}, ${p.city}
    </div>

    <div class="card-features">
      ${getAmenitiesHTML(p.amenities)}
    </div>
  </div>
  `;
    // Card click → Property Details
    card.addEventListener("click", () => {
      window.location.href = `../PropertyDetails/PropertyDetail.html?id=${p._id}`;
    });

    // remove from wishlist (backend)
    card.querySelector(".remove-btn").addEventListener("click", async (e) => {
      e.stopPropagation(); // 🔥 IMPORTANT

      await fetch(`${BASE_URL}/api/wishlist/${p._id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      loadWishlist();
    });

    grid.appendChild(card);
  });
}

//load student info
async function loadStudentInfo() {
  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch student info");

    const user = await res.json();

    // Update name
    document.getElementById("studentName").innerText = `Hello, ${user.name}`;

    // Update avatar letter
    document.getElementById("studentAvatar").innerText = user.name
      .charAt(0)
      .toUpperCase();
  } catch (err) {
    console.error("Failed to load student info", err);
  }
}

//PROFILE MENU
function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}

// handle logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user"); // if you ever store it
  localStorage.clear(); // safest for now

  window.location.href = "../StudentLogin/StudentLogin.html";
}

document.getElementById("logo").addEventListener("click", () => {
  window.location.href = "../StudentHome/StudentHome.html";
});

document.addEventListener("click", function (e) {
  const menu = document.getElementById("menu");
  const profileWrapper = document.querySelector(".profile-wrapper");

  if (!profileWrapper.contains(e.target)) {
    menu.classList.remove("show");
  }
});

loadStudentInfo();
