const params = new URLSearchParams(window.location.search);
const propertyId = params.get("id");

let rent = 0;
let deposit = 0;
const serviceFee = 500;
let images = [];

async function loadProperty() {
  try {
    const res = await fetch(
      `http://localhost:5000/api/properties/${propertyId}`
    );
    const property = await res.json();

    // BASIC INFO
    document.getElementById("propertyTitle").innerText = property.title;

    document.getElementById(
      "propertyLocation"
    ).innerHTML = `<i class="fas fa-map-marker-alt"></i> ${property.address}, ${property.city}`;

    document.getElementById("propertyDescription").innerText =
      property.description;

    document.getElementById(
      "propertyPrice"
    ).innerHTML = `₹${property.rent} <span>/ month</span>`;

    rent = property.rent;
    deposit = property.deposit;
    images = property.images || [];

    document.getElementById("depositAmount").innerText =
      "₹" + deposit.toLocaleString();

    renderTags(property);

    // IMAGES
    renderImages();

    // AMENITIES
    renderAmenities(property.amenities);

    calculateTotal();
  } catch (err) {
    console.error(err);
    showSuccessPopup(
      "Failed to load property!",
      "Property was not loaded",
      "../StudentHome/StudentHome.html"
    );
  }
}

//Images
function renderImages() {
  const main = document.getElementById("mainImage");
  const subs = document.querySelectorAll(".sub-img");

  if (images.length > 0) {
    main.innerHTML = `<img src="${images[0]}" style="width:100%;height:100%;object-fit:cover;">`;
  }

  subs.forEach((div, i) => {
    if (images[i + 1]) {
      div.innerHTML = `<img src="${
        images[i + 1]
      }" style="width:100%;height:100%;object-fit:cover;">`;
      div.onclick = () => {
        main.innerHTML = `<img src="${
          images[i + 1]
        }" style="width:100%;height:100%;object-fit:cover;">`;
      };
    }
  });
}

//Amenities
function renderAmenities(amenities) {
  const grid = document.getElementById("amenitiesGrid");
  grid.innerHTML = "";

  const icons = {
    wifi: "fa-wifi",
    ac: "fa-snowflake",
    food: "fa-utensils",
    laundry: "fa-tshirt",
    power: "fa-bolt",
    cctv: "fa-shield-alt",
  };

  for (let key in amenities) {
    if (amenities[key]) {
      grid.innerHTML += `
        <div class="amenity-item">
          <i class="fas ${icons[key]}"></i>
          ${key.toUpperCase()}
        </div>
      `;
    }
  }
}

// Price
function calculateTotal() {
  const total = rent + deposit + serviceFee;
  document.getElementById("totalPrice").innerText =
    "₹" + total.toLocaleString();
}

//Booking
async function requestBooking() {
  const token = localStorage.getItem("token");

  if (!token) {
    showSuccessPopup(
      "Login Required",
      "Please login to request booking.",
      "../StudentLogin/StudentLogin.html"
    );

    return;
  }

  const moveInDate = document.getElementById("moveInDate").value;
  const durationMonths = document.getElementById("durationSelect").value;

  if (!moveInDate) {
    showSuccessPopup(
      "Move-in date required!",
      "Please select move-in data.",
      "../PropertyDetails/PropertyDetail.html"
    );
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        propertyId: propertyId,
        moveInDate,
        durationMonths,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Booking failed");
      return;
    }

    showSuccessPopup(
      "Booking Request Sent!",
      "Your booking request has been sent to the host.",
      "../MyBooking/MyBooking.html"
    );
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
  const btn = document.querySelector(".book-btn");
  btn.innerText = "Requested";
  btn.disabled = true;
  btn.classList.add("btn-pending");
}

//function to check booking status
async function checkBookingStatus() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/bookings/my/${propertyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const booking = await res.json();

    const btn = document.querySelector(".book-btn");

    if (!booking) return; // no booking yet

    btn.disabled = true;

    if (booking.status === "pending") {
      btn.innerText = "Requested";
      btn.classList.add("btn-pending");
    } else if (booking.status === "approved") {
      btn.innerText = "Approved";
      btn.classList.add("btn-approved");
    } else if (booking.status === "rejected") {
      btn.innerText = "Rejected";
      btn.classList.add("btn-rejected");
    }
  } catch (err) {
    console.error("Failed to check booking status");
  }
}

function renderTags(property) {
  const tagsDiv = document.getElementById("propertyTags");
  tagsDiv.innerHTML = "";

  // Always verified (for now)
  tagsDiv.innerHTML += `<span class="tag">Verified</span>`;

  if (property.propertyType) {
    tagsDiv.innerHTML += `<span class="tag">${property.propertyType}</span>`;
  }

  if (property.occupancyType) {
    tagsDiv.innerHTML += `<span class="tag">${property.occupancyType}</span>`;
  }
}

//profile menu
function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}

document.addEventListener("click", function (e) {
  const menu = document.getElementById("menu");
  const profileWrapper = document.querySelector(".profile-wrapper");

  if (!profileWrapper.contains(e.target)) {
    menu.classList.remove("show");
  }
});

//load student info
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

document.getElementById("logo").addEventListener("click", () => {
  window.location.href = "../StudentHome/StudentHome.html";
});

//handle logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  localStorage.clear();
  window.location.href = "../StudentLogin/StudentLogin.html";
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

loadProperty();
checkBookingStatus();
loadStudentInfo();
