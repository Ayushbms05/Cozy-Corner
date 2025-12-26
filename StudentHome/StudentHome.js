document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "student") {
    window.location.href = "../StudentLogin/StudentLogin.html";
    return;
  }

  // INIT
  fetchProperties();
  loadStudentInfo();
});

const listingsGrid = document.getElementById("listingsGrid");
let allProperties = [];

//function to get amenities
function getAmenitiesHTML(amenities) {
  if (!amenities) return "";

  const icons = {
    wifi: "fa-wifi",
    ac: "fa-snowflake",
    food: "fa-utensils",
    laundry: "fa-tshirt",
    power: "fa-bolt",
    cctv: "fa-shield-alt",
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

//FETCH PROPERTIES
async function fetchProperties() {
  try {
    const res = await fetch("http://localhost:5000/api/properties");
    const data = await res.json();
    allProperties = data;
    renderProperties(allProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    listingsGrid.innerHTML = "<p>Failed to load properties</p>";
  }
}

//load studnet info
async function loadStudentInfo() {
  try {
    const res = await fetch("http://localhost:5000/users/me", {
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

//RENDER CARDS
function renderProperties(properties) {
  listingsGrid.innerHTML = "";

  if (properties.length === 0) {
    listingsGrid.innerHTML = "<p>No properties found</p>";
    return;
  }

  properties.forEach((property) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = property._id;

    card.className = "card";

    const locationText = `${property.address || ""}, ${property.city || ""}`;

    //card click logic to fetch property
    card.addEventListener("click", () => {
      window.location.href = `../PropertyDetails/PropertyDetail.html?id=${property._id}`;
    });

    card.innerHTML = `
      <div class="card-image">
        <img src="${property.images?.[0] || "../images/default.jpg"}" />
        <div class="verified-badge">
          <i class="fas fa-check-circle"></i> Verified
        </div>
        <div class="card-heart"><i class="fas fa-heart"></i></div>
      </div>

      <div class="card-details">
        <div class="card-price">
          ₹${property.rent ?? "N/A"} <span>/ month</span>
        </div>

        <div class="card-title">
          ${property.title || "Untitled Property"}
        </div>

        <div class="card-location">
          <i class="fas fa-map-marker-alt"></i>
          ${locationText || "Location not specified"}
        </div>

        <div class="card-features">
          ${getAmenitiesHTML(property.amenities)}
        </div>

      </div>
    `;
    listingsGrid.appendChild(card);
  });

  attachHeartLogic();
}

//FILTER LOGIC
const pills = document.querySelectorAll(".filter-pill");

pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");

    const filter = pill.dataset.filter;

    const filtered =
      filter === "all"
        ? allProperties
        : allProperties.filter((p) =>
            filter === "metro" ? p.nearMetro : p.term === filter
          );

    renderProperties(filtered);
  });
});

//heart logic
async function attachHeartLogic() {
  const token = localStorage.getItem("token");
  let wishlistIds = [];

  if (token) {
    const res = await fetch("http://localhost:5000/api/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const wishlist = await res.json();
    wishlistIds = wishlist.map((p) => p._id);
  }

  document.querySelectorAll(".card").forEach((card) => {
    const heartWrapper = card.querySelector(".card-heart");
    const heartIcon = heartWrapper.querySelector("i");
    const propertyId = card.dataset.id;

    // pre-fill heart
    if (wishlistIds.includes(propertyId)) {
      heartIcon.classList.toggle("active");
    }

    heartWrapper.addEventListener("click", async (e) => {
      e.stopPropagation();

      if (!token) {
        window.location.href = "../StudentLogin/StudentLogin.html";
        return;
      }

      await fetch(`http://localhost:5000/api/wishlist/${propertyId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      heartIcon.classList.toggle("active");
    });
  });
}


//SEARCH LOGIC
function performSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allProperties.filter(
    (p) =>
      p.city?.toLowerCase().includes(query) ||
      p.address?.toLowerCase().includes(query) ||
      p.nearestCollege?.toLowerCase().includes(query)
  );

  renderProperties(filtered);
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
  window.location.href = "StudentHome.html";
});

document.addEventListener("click", function (e) {
  const menu = document.getElementById("menu");
  const profileWrapper = document.querySelector(".profile-wrapper");

  if (!profileWrapper.contains(e.target)) {
    menu.classList.remove("show");
  }
});
