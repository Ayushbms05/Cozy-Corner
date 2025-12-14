function calculateTotal() {
  // Simple mock calculation logic
  const baseRent = 8500;
  const deposit = 8500;
  const fee = 500;
  const duration = document.getElementById("durationSelect").value;

  // Logic just for visual feedback, normally complex
  const totalFirstPayment = baseRent + deposit + fee;
  document.getElementById("totalPrice").innerText =
    "₹" + totalFirstPayment.toLocaleString();
}

function requestBooking() {
  alert("Booking Request Sent to Host! They will contact you shortly.");
}

function changeImage(type) {
  const main = document.getElementById("mainImage");
  // Mock image switching using icons and colors
  if (type === "bedroom") {
    main.style.backgroundColor = "#fab1a0";
    main.innerHTML = '<i class="fas fa-bed"></i>';
  } else if (type === "bathroom") {
    main.style.backgroundColor = "#81ecec";
    main.innerHTML = '<i class="fas fa-bath"></i>';
  }
}
