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

function handleLogin(e) {
  e.preventDefault();
  window.location.href="../StudentHome/StudentHome.html";
  // In a real app, you would send data to a server here
  // showNotification("Welcome back! Logging you in...");
  // Simulate redirection
  // console.log("Login submitted");
}

function handleSignup(e) {
  e.preventDefault();
  window.location.href="../StudentHome/StudentHome.html";
  // In a real app, verify the file upload and send data
  // showNotification("Documents uploaded! Verification pending.");
  // Simulate account creation
  // console.log("Signup submitted with verification documents");
}

function HostLogin(){
  window.location.href="../HostLogin/HostLogin.html";
}
