const token = localStorage.getItem("token");

if (!token) {
  alert("Session expired. Please login again.");
  window.location.href = "../StudentLogin/StudentLogin.html";
}

const params = new URLSearchParams(window.location.search);
const bookingId = params.get("bookingId");

if (!bookingId) {
  alert("Invalid payment link");
}

//fetch booking details
let bookingData = null;

async function loadBookingDetails() {
  try {
    const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔥 ADD THIS BLOCK HERE
    if (res.status === 401) {
      alert("Login expired. Please login again.");
      localStorage.clear();
      window.location.href = "../StudentLogin/StudentLogin.html";
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to fetch booking");
    }

    bookingData = await res.json();
    updateOrderSummary(bookingData);
  } catch (err) {
    console.error(err);
    alert("Unable to load booking details");
  }
}

//dynamic payment page
function updateOrderSummary(b) {
  document.getElementById("propertyTitle").innerText =
    b.property?.title || "Property";

  document.getElementById("propertyLocation").innerText = `${
    b.property?.address || ""
  }, ${b.property?.city || ""}`;

  // Image

  // Move-in date
  const moveInDate = b.moveInDate ? new Date(b.moveInDate).toDateString() : "";

  document.getElementById("stayDuration").innerText = moveInDate;

  const imgEl = document.getElementById("propertyImage");
  if (b.property?.images?.length > 0) {
    imgEl.src = b.property.images[0];
  } else {
    imgEl.src = "../images/default.jpg";
  }

  const rent = b.property?.rent || 0;
  const deposit = b.property?.deposit || 0;
  const serviceFee = 500;
  const discount = 200;

  const total = rent + deposit + serviceFee - discount;

  document.getElementById("rentAmount").innerText = `₹${rent}`;
  document.getElementById("depositAmount").innerText = `₹${deposit}`;
  document.getElementById("serviceFee").innerText = `₹${serviceFee}`;
  document.getElementById("discountAmount").innerText = `- ₹${discount}`;
  document.getElementById("totalAmount").innerText = `₹${total}`;

  document.querySelector(".pay-btn").innerText = `Pay ₹${total}`;

  document.getElementById("successPropertyName").innerText =
    b.property?.title || "Property";
}
//load studen info
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

function switchTab(tabId) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  // Reset buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Show selected
  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");
}

async function processPayment(e) {
  if (e) e.preventDefault();

  const btn = document.querySelector(".pay-btn");
  btn.innerText = "Processing...";
  btn.disabled = true;

  try {
    const res = await fetch(`http://localhost:5000/api/bookings/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookingId: bookingId,
      }),
    });

    if (!res.ok) throw new Error("Payment failed");

    // ✅ Show success
    setTimeout(() => {
      document.getElementById("successOverlay").style.display = "flex";
    }, 1000);
  } catch (err) {
    alert("Payment failed. Try again.");
    btn.innerText = "Pay";
    btn.disabled = false;
  }
}

loadBookingDetails();
loadStudentInfo();