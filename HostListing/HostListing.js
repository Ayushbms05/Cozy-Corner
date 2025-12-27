const BASE_URL = "https://cozycorner-backend-peay.onrender.com";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "host") {
  window.location.href = "../HostLogin/HostLogin.html";
}

//STATE
let listings = [];
let deleteTargetId = null;

//  LOAD LISTING
async function loadMyListings() {
  try {
    const res = await fetch(`${BASE_URL}/api/properties/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to load listings");

    listings = await res.json();
    renderListings(listings);
  } catch (err) {
    console.error(err);
  }
}

async function loadHostInfo() {
  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to load host info");

    const user = await res.json();

    // Navbar name
    document.querySelector(".user-profile span").innerText = user.name;

    // Avatar letter
    document.querySelector(".avatar").innerText = user.name[0].toUpperCase();

    // Welcome text
    document.querySelector(".welcome-text h1").innerText = `Welcome back, ${
      user.name.split(" ")[0]
    }!`;

    // 🔥 WALLET / TOTAL EARNINGS (THIS WAS MISSING)
    document.getElementById("totalEarnings").innerText = `₹${(
      user.walletBalance || 0
    ).toLocaleString()}`;
  } catch (err) {
    console.error("Failed to load host info", err);
  }
}

loadHostInfo();

// RENDER
function renderListings(data = listings) {
  const container = document.getElementById("listingsContainer");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No properties added yet.</p>";
    return;
  }

  data.forEach((item) => {
    const statusClass =
      item.isActive !== false ? "status-active" : "status-inactive";

    container.innerHTML += `
      <div class="listing-card">
        <div class="card-image">
          <span class="status-badge ${statusClass}">
            ${item.isActive !== false ? "Active" : "Inactive"}
          </span>
          <img src="${item.images?.[0] || "../images/default.jpg"}">
        </div>

        <div class="card-content">
          <div class="listing-title">${item.title}</div>

          <div class="listing-location">
            <i class="fas fa-map-marker-alt"></i>
            ${item.city || ""}
          </div>

          <div class="listing-price">
            ₹${item.rent?.toLocaleString()} <span>/ month</span>
          </div>

          <div class="card-details">
            <div class="detail-item">
              <i class="fas fa-user-friends"></i>
              ${item.occupancyType || "—"}
            </div>
            <div class="detail-item">
              <i class="fas fa-wifi"></i> Wifi
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn-action btn-edit"
            onclick="editProperty('${item._id}')">
            <i class="fas fa-edit"></i> Edit
          </button>

          <button class="btn-action btn-delete"
            onclick="openDeleteModal('${item._id}')">
            <i class="fas fa-trash-alt"></i> Delete
          </button>
        </div>
      </div>
    `;
  });
}

// SEARCh
function filterListings() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  const filtered = listings.filter(
    (l) =>
      l.title.toLowerCase().includes(query) ||
      (l.city && l.city.toLowerCase().includes(query))
  );

  renderListings(filtered);
}

// DELETE
function openDeleteModal(id) {
  deleteTargetId = id;
  document.getElementById("deleteModal").classList.add("active");
}

function closeDeleteModal() {
  document.getElementById("deleteModal").classList.remove("active");
  deleteTargetId = null;
}

async function confirmDelete() {
  if (!deleteTargetId) return;

  try {
    const res = await fetch(`${BASE_URL}/api/properties/${deleteTargetId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Delete failed");

    listings = listings.filter((p) => p._id !== deleteTargetId);
    renderListings();
    closeDeleteModal();
  } catch (err) {
    console.error(err);
  }
}

// EDIT
function editProperty(id) {
  window.location.href = `../AddListing/AddListing.html?edit=${id}`;
}

function AddListing() {
  window.location.href = "../AddListing/AddListing.html";
}

function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user"); // if you ever store it
  localStorage.clear(); // safest for now
  window.location.href = "../HostLogin/HostLogin.html";
}

document.addEventListener("click", function (e) {
  const menu = document.getElementById("menu");
  const profileWrapper = document.querySelector(".profile-wrapper");

  if (!profileWrapper.contains(e.target)) {
    menu.classList.remove("show");
  }
});

document.getElementById("logo").addEventListener("click", () => {
  window.location.href = "../HostDashboard/HostDashboard.html";
});
// INIT
loadMyListings();
