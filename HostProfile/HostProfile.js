let originalProfile = {};
const BASE_URL = "https://cozycorner-backend-peay.onrender.com"; 
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "host") {
  window.location.href = "../HostLogin/HostLogin.html";
}
let nameInput;
let phoneInput;
let saveBtn;

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
    
  } catch (err) {
    console.error("Failed to load host info", err);
  }
}

loadHostInfo();

// ---------------- LOAD PROFILE ----------------
async function loadProfile() {
  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to load profile");

    const user = await res.json();

    // Navbar avatar
    document.getElementById("navAvatar").innerText = user.name
      .charAt(0)
      .toUpperCase();

    // Sidebar
    document.getElementById("sidebarName").innerText = user.name;

    // Form
    document.getElementById("fullName").value = user.name || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("email").value = user.email || "";
    originalProfile = {
      name: user.name || "",
      phone: user.phone || "",
    };
    
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  nameInput = document.getElementById("fullName");
  phoneInput = document.getElementById("phone");
  saveBtn = document.getElementById("saveBtn");
  const form = document.getElementById("profileForm");

  if (!nameInput || !phoneInput || !saveBtn || !form) {
    console.error("Profile form elements missing");
    return;
  }

  nameInput.addEventListener("input", checkForChanges);
  phoneInput.addEventListener("input", checkForChanges);
  form.addEventListener("submit", saveProfile);

  loadProfile();
});

function checkForChanges() {
  saveBtn.disabled = false;
}

// ---------------- SAVE PROFILE ----------------
async function saveProfile(e) {
  e.preventDefault();

  const phone = phoneInput.value.trim();

  if (phone !== "" && !/^\d{10}$/.test(phone)) {
    alert("Phone number must be exactly 10 digits");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: document.getElementById("fullName").value,
        phone: document.getElementById("phone").value,
      }),
    });

    if (!res.ok) throw new Error("Update failed");

    showSuccessPopup(
    "Profile Updated!",
    "Your profile details have been saved successfully.",
    "HostProfile.html"
  );
    loadProfile(); // refresh UI
  } catch (err) {
    console.error(err);
    alert("Failed to update profile");
  }
}

// ---------------- LOGOUT ----------------
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user"); // if you ever store it
  localStorage.clear(); // safest for now
  window.location.href = "../HostLogin/HostLogin.html";
}

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

document.getElementById("logo").addEventListener("click", () => {
  window.location.href = "../HostDashboard/HostDashboard.html";
});

