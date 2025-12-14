function handleSubmit(e) {
  e.preventDefault();
  // Simulation of form submission
  const btn = document.querySelector(".btn-submit");
  const originalText = btn.innerText;

  btn.innerText = "Publishing...";
  btn.style.opacity = "0.7";

  setTimeout(() => {
    alert("Property Listed Successfully! Redirecting to Dashboard...");
    window.location.href = "host_home.html";
  }, 1500);
}
