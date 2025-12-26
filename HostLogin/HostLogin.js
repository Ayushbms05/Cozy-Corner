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

function showNotification(message) {
  const notify = document.getElementById("notification");
  document.getElementById("notifyText").innerText = message;
  notify.classList.add("show");
  setTimeout(() => notify.classList.remove("show"), 3000);
}

// 🔐 HOST LOGIN
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
        role: "host"
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showNotification(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    window.location.href = "../HostDashboard/HostDashboard.html";
  } catch {
    showNotification("Server error");
  }
}

// 📝 HOST SIGNUP
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
        role: "host"
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showNotification(data.message || "Signup failed");
      return;
    }

    showNotification("Host account created! Please login.");
    switchForm("login");
  } catch {
    showNotification("Server error");
  }
}
