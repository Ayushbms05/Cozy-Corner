const BASE_URL = "https://cozycorner-backend-peay.onrender.com";
let originalProfile = {};
async function loadProfile() {
  const res = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const user = await res.json();

  // Sidebar
  document.querySelector(".user-name").innerText = user.name;
  document.querySelector(".avatar").innerText = user.name[0].toUpperCase();

  // Fill inputs
  document.getElementById("fullName").value = user.name || "";
  document.getElementById("phone").value = user.phone || "";
  document.getElementById("collegeName").value = user.college || "";
  document.getElementById("email").value = user.email;
  
  //  Save original values
  originalProfile = {
    name: user.name || "",
    phone: user.phone || "",
    college: user.college || "",
  };

  // Disable save initially
  document.getElementById("saveBtn").disabled = true;
}

const nameInput = document.getElementById("fullName");
const phoneInput = document.getElementById("phone");
const collegeInput = document.getElementById("collegeName");
const saveBtn = document.getElementById("saveBtn");

document.getElementById("bookingHistoryBtn").addEventListener("click", () => {
  window.location.href = "../MyBooking/MyBooking.html";
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user"); // if you ever store it
  localStorage.clear(); // safest for now

  window.location.href = "../StudentLogin/StudentLogin.html";
}

function isPhoneValid(phone) {
  return /^\d{10}$/.test(phone);
}

function checkForChanges() {
  const current = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    college: collegeInput.value.trim(),
  };

  const hasChanges =
    current.name !== originalProfile.name ||
    current.phone !== originalProfile.phone ||
    current.college !== originalProfile.college;

  const phoneOk = isPhoneValid(current.phone);

  // Enable only if changed AND phone valid
  saveBtn.disabled = !(hasChanges && phoneOk);

  // Optional visual hint
  phoneInput.style.borderColor =
    current.phone && !phoneOk ? "#ff6b6b" : "#ddd";
}

// Attach listeners
[nameInput, phoneInput, collegeInput].forEach((input) => {
  input.addEventListener("input", checkForChanges);
});


async function saveProfile(e) {
  e.preventDefault();

  const payload = {
    name: document.getElementById("fullName").value,
    phone: document.getElementById("phone").value,
    college: document.getElementById("collegeName").value,
  };

  const res = await fetch(`${BASE_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    showSuccessPopup("Failed", "Profile update failed", "StudentProfile.html");
    return;
  }

  showSuccessPopup(
    "Profile Updated!",
    "Your profile details have been saved successfully.",
    "StudentProfile.html"

  );
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

document.getElementById("logo").addEventListener("click", () => {
  window.location.href = "StudentHome.html";
});

loadProfile();
