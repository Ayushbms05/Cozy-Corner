const BASE_URL = "https://cozycorner-backend-peay.onrender.com";
//protect host dashboard
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "host") {
  window.location.href = "../HostLogin/HostLogin.html";
}

//load properties of the host
async function loadMyProperties() {
  try {
    const res = await fetch(`${BASE_URL}/api/properties/my`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const properties = await res.json();

    // 🔥 UPDATE ACTIVE LISTINGS COUNT
    document.getElementById("activeListings").innerText = properties.length;

    const container = document.getElementById("myProperties");
    container.innerHTML = "";

    if (properties.length === 0) {
      container.innerHTML = "<p>No properties added yet.</p>";
      return;
    }

    properties.forEach((p) => {
      const card = document.createElement("div");
      card.className = "property-card";

      card.innerHTML = `
        <div class="prop-img">
          <img src="${p.images?.[0] || "../images/default.jpg"}" />
        </div>

        <div class="prop-info">
          <div class="prop-title">${p.title}</div>
          <div class="prop-loc">${p.address}, ${p.city}</div>
          <span class="status-badge status-active">Active</span>
        </div>

        <div class="prop-actions">
          <button class="action-btn" onclick="editProperty('${p._id}')">
  <i class="fas fa-edit"></i> Edit
</button>
          <button class="action-btn" onclick="deleteProperty('${p._id}')">
  <i class="fas fa-trash"></i> Delete
</button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load properties", err);
  }
}

loadMyProperties();

//fetch booking request
async function loadBookingRequests() {
  try {
    const res = await fetch(`${BASE_URL}/api/bookings/host`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const bookings = await res.json();

    const container = document.querySelector(".requests-container");
    container.innerHTML = "";

    if (bookings.length === 0) {
      container.innerHTML = "<p>No booking requests yet.</p>";
      return;
    }

    bookings.forEach((b) => {
      const item = document.createElement("div");
      item.className = "request-item";
      item.id = b._id;

      const studentName = b.student?.name || "Student";
      const propertyTitle = b.property?.title || "Property";

      item.innerHTML = `
        <div class="req-header">
          <div class="req-avatar">${studentName[0]}</div>
          <div>
            <div style="font-weight:bold;">${studentName}</div>
            <small>Status: ${
              b.status.charAt(0).toUpperCase() + b.status.slice(1)
            }</small>

          </div>
        </div>

        <div class="req-details">
          <p>Requested: <strong>${propertyTitle}</strong></p>
          <small>
            <i class="fas fa-calendar"></i>
            Move in: ${new Date(b.moveInDate).toDateString()}
            (${b.durationMonths} months)
          </small>
        </div>

        <div class="req-actions">
          ${
            b.status === "pending"
              ? `
              <button class="btn-accept" onclick="updateBookingStatus('${b._id}', 'approved')">Accept</button>
              <button class="btn-decline" onclick="updateBookingStatus('${b._id}', 'rejected')">Decline</button>
            `
              : `<span class="status-badge status-${b.status}">
                     ${b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                 </span>
`
          }
        </div>
      `;

      container.appendChild(item);
    });
  } catch (err) {
    console.error("Failed to load booking requests", err);
  }
}

//updateBookingStatus
async function updateBookingStatus(id, status) {
  try {
    const res = await fetch(`${BASE_URL}/api/bookings/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Status update failed");

    loadBookingRequests(); // 🔥 refresh bookings
  } catch (err) {
    showSuccessPopup(
      "Failed!",
      "Failed to update property.",
      "../HostDashboard/HostDashboard.html"
    );
  }
}

//edit property
function editProperty(id) {
  window.location.href = `../AddListing/AddListing.html?edit=${id}`;
}

function deleteProperty(id) {
  showConfirmPopup(async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/properties/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      showSuccessPopup(
        "Deleted Successfully!",
        "Property deleted successfully.",
        "HostDashboard.html"
      );

      loadMyProperties(); // 🔥 refresh dashboard
    } catch (err) {
      showSuccessPopup(
        "Failed!",
        "Failed to delete property."
      );
    }
  });
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

function handleRequest(id, status) {
  const element = document.getElementById(id);
  if (status === "accepted") {
    element.innerHTML = `<div style="text-align:center; padding:20px; color:var(--success); font-weight:bold;"><i class="fas fa-check-circle"></i> Booking Accepted!</div>`;
    // Add logic to update database
  } else {
    element.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-light);"><i class="fas fa-times-circle"></i> Request Declined</div>`;
    setTimeout(() => {
      element.style.display = "none";
    }, 1500);
  }
}

//show Success popup
function showSuccessPopup(title, message, redirectUrl) {
  document.getElementById("successTitle").innerText = title;
  document.getElementById("successMessage").innerText = message;

  const btn = document.getElementById("successBtn");

  btn.onclick = () => {
    closeSuccessPopup();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  document.getElementById("successOverlay").style.display = "flex";
}

function closeSuccessPopup() {
  document.getElementById("successOverlay").style.display = "none";
}

let confirmCallback = null;

function showConfirmPopup(onYes) {
  confirmCallback = onYes;
  document.getElementById("confirmOverlay").style.display = "flex";
}

function confirmYes() {
  document.getElementById("confirmOverlay").style.display = "none";
  if (confirmCallback) confirmCallback();
  confirmCallback = null;
}

function confirmNo() {
  document.getElementById("confirmOverlay").style.display = "none";
  confirmCallback = null;
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
  window.location.href = "HostDashboard.html";
});


loadBookingRequests();
