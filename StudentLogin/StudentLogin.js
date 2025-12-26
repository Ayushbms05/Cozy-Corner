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
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role: "student"
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showNotification(data.message || "Login failed");
      return;
    }

    // ✅ SAVE TOKEN FIRST
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    // ✅ THEN redirect
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

  try {
    const res = await fetch("http://localhost:5000/auth/signup", {
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


