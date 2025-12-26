const BASE_URL = "https://cozycorner-backend-peay.onrender.com";
function filterBookings(type, btn) {
  // Update Tab UI
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  // Filter Logic
  const cards = document.querySelectorAll(".booking-card");
  let hasVisible = false;

  cards.forEach((card) => {
    if (card.getAttribute("data-type") === type) {
      card.style.display = "flex";
      hasVisible = true;
    } else {
      card.style.display = "none";
    }
  });

  // Toggle Empty State
  const emptyState = document.getElementById("emptyState");
  if (!hasVisible) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
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
  localStorage.removeItem("user");
  localStorage.clear();
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
async function loadMyBookings() {
  try {
    const res = await fetch(`${BASE_URL}/api/bookings/student`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const bookings = await res.json();
    const container = document.getElementById("bookingList");
    container.innerHTML = "";

    if (bookings.length === 0) {
      document.getElementById("emptyState").style.display = "block";
      return;
    }

    document.getElementById("emptyState").style.display = "none";

    bookings.forEach((b) => {
      //  MAP BACKEND STATUS → UI TYPE
      let type = "upcoming";

      if (b.status === "rejected") {
        type = "cancelled";
      }

      if (b.status === "approved" && b.paymentStatus === "paid") {
        type = "past"; // 👈 Completed tab
      }

      if (b.status === "approved" && b.paymentStatus === "unpaid") {
        type = "upcoming";
      }

      const statusClass =
        b.status === "approved"
          ? "status-confirmed"
          : b.status === "pending"
          ? "status-pending"
          : "status-cancelled";

      const statusText =
        b.status === "approved"
          ? "Confirmed"
          : b.status === "pending"
          ? "Pending Approval"
          : "Cancelled";

      const card = document.createElement("div");
      card.className = "booking-card";
      card.setAttribute("data-type", type);

      card.innerHTML = `
        <div class="booking-img">
          ${
            b.property?.images?.[0]
              ? `<img src="${b.property.images[0]}" />`
              : `<i class="fas fa-home"></i>`
          }
        </div>

        <div class="booking-info">
          <div class="b-header">
            <div>
              <div class="b-title">${b.property?.title || "Property"}</div>
              <div class="b-id">Booking ID: #CC-${b._id.slice(-5)}</div>
            </div>
            <div class="status-badge ${statusClass}">
              ${statusText}
            </div>
          </div>

          <div class="b-details">
            <div class="b-row">
              <i class="fas fa-map-marker-alt"></i>
              ${b.property?.address || ""}, ${b.property?.city || ""}
            </div>

            <div class="b-row">
              <i class="fas fa-calendar-alt"></i>
              <strong>Move In:</strong>
              ${new Date(b.moveInDate).toDateString()}
            </div>

            <div class="b-row">
              <i class="fas fa-clock"></i>
              <strong>Duration:</strong>
              ${b.durationMonths} Months
            </div>
          </div>

          <div class="action-btns">
            ${
              b.status === "approved" && b.paymentStatus === "unpaid"
                ? `
              <button class="btn btn-primary" onclick="event.stopPropagation()">
              Get Directions
              </button>

             <button class="btn btn-pay" onclick="payNow(event, '${b._id}')">
              Pay
            </button>
            `
                : b.status === "approved" && b.paymentStatus === "paid"
                ? `
              <button class="btn btn-primary" onclick="event.stopPropagation()">
            Get Directions
            </button>

            <button class="btn btn-paid" disabled>
            ✔ Paid
            </button>
    `
                : ""
            }


            ${
              b.status === "pending"
                ? `<button class="btn btn-outline" onclick="event.stopPropagation()">Contact Host</button>`
                : ""
            }
            </div>

        </div>
      `;
      card.addEventListener("click", () => {
        const propertyId =
          typeof b.property === "string" ? b.property : b.property?._id;

        if (!propertyId) return;

        window.location.href = `../PropertyDetails/PropertyDetail.html?id=${propertyId}`;
      });

      container.appendChild(card);
    });

    // Default filter = Upcoming
    filterBookings("upcoming", document.querySelector(".tab-btn.active"));
  } catch (err) {
    console.error("Failed to load bookings", err);
  }
}

function payNow(event, bookingId) {
  event.stopPropagation();

  window.location.href = `../Payment/Payment.html?bookingId=${bookingId}`;
}

loadMyBookings();
loadStudentInfo();
