let activeTab = "pending"; 
const BASE_URL = "https://cozycorner-backend-peay.onrender.com";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "host") {
  window.location.href = "../HostLogin/HostLogin.html";
}

function formatAmount(amount) {
  return `₹${(amount || 0).toLocaleString()}`;
}

document.querySelectorAll(".tab-btn").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    activeTab = index === 0 ? "pending" : "history";
    loadBookingRequests();
  });
});

async function loadBookingRequests() {
  try {
    const res = await fetch(`${BASE_URL}/api/bookings/host/requests`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const bookings = await res.json();

    renderBookings(bookings);
  } catch (err) {
    console.error("Failed to load booking requests", err);
  }
}

function renderBookings(bookings) {
  const list = document.getElementById("requestList");
  const emptyState = document.getElementById("emptyState");
  const badge = document.getElementById("pendingCount");

  list.innerHTML = "";

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const historyBookings = bookings.filter((b) => b.status !== "pending");

  badge.innerText = pendingBookings.length;
  badge.style.display = pendingBookings.length ? "inline-block" : "none";

  if (pendingBookings.length === 0 && historyBookings.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  list.innerHTML = "";
  emptyState.style.display = "none";

  if (activeTab === "pending") {
    badge.innerText = pendingBookings.length;
    badge.style.display = pendingBookings.length ? "inline-block" : "none";

    if (pendingBookings.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    pendingBookings.forEach(renderPendingCard);
  } else {
    badge.style.display = "none";

    if (historyBookings.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    historyBookings.forEach(renderHistoryCard);
  }
}

function renderPendingCard(b) {
  const list = document.getElementById("requestList");

  const student = b.student || {};
  const property = b.property || {};

  const studentName = student.name || "Student";
  const college = student.college || "College";
  const avatarLetter = studentName.charAt(0).toUpperCase();

  const card = document.createElement("div");
  card.className = "request-card";

  card.innerHTML = `
    <div class="req-profile">
      <div class="student-img avatar-letter">
        ${avatarLetter}
      </div>

      <div class="student-details">
        <h3>${studentName}</h3>

        <div class="student-tags">
          <span class="tag">
            <i class="fas fa-graduation-cap"></i> ${college}
          </span>
        </div>

        <button class="btn-msg">
          Message ${studentName.split(" ")[0]}
        </button>
      </div>
    </div>

    <div class="req-booking">
      <div class="booking-property">
        ${property.title || "Property"}
      </div>

      <div class="booking-meta">
  <span>
    <i class="far fa-calendar-alt"></i>
    Move-in:
    <strong>${new Date(b.moveInDate).toDateString()}</strong>
  </span>

  <span>
    <i class="fas fa-history"></i>
    Duration:
    <strong>${b.durationMonths} Months</strong>
  </span>

  <span>
    <i class="fas fa-user-friends"></i>
    Occupancy:
    <strong>${property.occupancyType || "—"}</strong>
  </span>

  <span>
    <i class="fas fa-wallet"></i>
    Amount:
    <strong>${formatAmount(b.amount)}</strong>
  </span>
</div>

    </div>

    <div class="req-actions">
      <button class="btn-accept"
        onclick="updateBookingStatus('${b._id}', 'approved')">
        <i class="fas fa-check"></i> Accept
      </button>

      <button class="btn-decline"
        onclick="updateBookingStatus('${b._id}', 'rejected')">
        <i class="fas fa-times"></i> Decline
      </button>

      <span class="payment-badge payment-${b.paymentStatus}">
        ${b.paymentStatus?.toUpperCase() || "UNPAID"}
     </span>
    </div>
  `;

  list.appendChild(card);
}

function renderHistoryCard(b) {
  const list = document.getElementById("requestList");

  const student = b.student || {};
  const property = b.property || {};

  const studentName = student.name || "Student";
  const college = student.college || "College";
  const avatarLetter = studentName.charAt(0).toUpperCase();

  const card = document.createElement("div");
  card.className = "request-card";

  card.innerHTML = `
    <div class="req-profile">
      <div class="student-img avatar-letter">
        ${avatarLetter}
      </div>

      <div class="student-details">
        <h3>${studentName}</h3>

        <div class="student-tags">
          <span class="tag">
            <i class="fas fa-graduation-cap"></i> ${college}
          </span>
        </div>
      </div>
    </div>

    <div class="req-booking">
      <div class="booking-property">
        ${property.title || "Property"}
      </div>

      <div class="booking-meta">
  <span>
    <i class="far fa-calendar-alt"></i>
    Move-in:
    <strong>${new Date(b.moveInDate).toDateString()}</strong>
  </span>

  <span>
    <i class="fas fa-history"></i>
    Duration:
    <strong>${b.durationMonths} Months</strong>
  </span>

  <span>
    <i class="fas fa-user-friends"></i>
    Occupancy:
    <strong>${property.occupancyType || "—"}</strong>
  </span>

  <span>
    <i class="fas fa-wallet"></i>
    Amount:
    <strong>${formatAmount(b.amount)}</strong>
  </span>

</div>

    </div>

    <div class="req-actions">
  <span class="status-badge status-${b.status}">
    ${b.status.toUpperCase()}
  </span>

  <span class="payment-badge payment-${b.paymentStatus}">
    ${b.paymentStatus?.toUpperCase() || "UNPAID"}
  </span>
</div>

  `;

  list.appendChild(card);
}

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

    loadBookingRequests(); // 🔥 refresh UI
  } catch (err) {
    console.error("Failed to update booking", err);
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

    // WALLET / TOTAL EARNINGS (THIS WAS MISSING)
    document.getElementById("totalEarnings").innerText = `₹${(
      user.walletBalance || 0
    ).toLocaleString()}`;
  } catch (err) {
    console.error("Failed to load host info", err);
  }
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

loadHostInfo();
loadBookingRequests();
