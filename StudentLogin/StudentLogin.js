const BASE_URL = "https://cozycorner-backend-peay.onrender.com";
// Function to switch between Login and Signup forms
function switchForm(formType) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  if (formType === "login") {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    loginBtn.classList.add("active");
    signupBtn.classList.remove("active");
  } else {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
    loginBtn.classList.remove("active");
    signupBtn.classList.add("active");
  }
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return password.length >= 8;
}


// Show a custom notification message
function showNotification(message) {
  const notify = document.getElementById("notification");
  const text = document.getElementById("notifyText");
  text.innerText = message;

  notify.classList.add("show");

  // Hide after 3 seconds
  setTimeout(() => {
    notify.classList.remove("show");
  }, 3000);
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role: "student",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showNotification(data.message || "Login failed");
      return;
    }

    // SAVE TOKEN FIRST
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    // THEN redirect
    window.location.href = "../StudentHome/StudentHome.html";
  } catch (err) {
    showNotification("Server error");
  }
}

async function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById("signupName").value;
  const phone = document.getElementById("signupPhone").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  //  VALIDATIONS
  if (!isValidPhone(phone)) {
    showNotification("Phone number must be exactly 10 digits");
    return;
  }

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address");
    return;
  }
  if (!isValidPassword(password)) {
    showNotification("Password must be at least 8 characters long");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        email,
        password,
        role: "student",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      showNotification(data.message || "Signup failed");
      return;
    }

    showNotification("Account created! Please login.");

    switchForm("login");
  } catch (err) {
    showNotification("Server error. Try again.");
  }
}
