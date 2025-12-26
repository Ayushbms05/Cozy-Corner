const params = new URLSearchParams(window.location.search);
const editId = params.get("edit");

// LOAD DATA IN EDIT MODE

document.addEventListener("DOMContentLoaded", async () => {
  if (!editId) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/properties/${editId}`
    );
    const data = await res.json();

    document.getElementById("title").value = data.title;
    document.getElementById("propertyType").value = data.propertyType;
    document.getElementById("occupancyType").value = data.occupancyType;
    document.getElementById("description").value = data.description;
    document.getElementById("address").value = data.address;
    document.getElementById("city").value = data.city;
    document.getElementById("nearestCollege").value = data.nearestCollege;
    document.getElementById("rent").value = data.rent;
    document.getElementById("deposit").value = data.deposit;
    document.getElementById("rules").value = data.rules;

    document.getElementById("wifi").checked = data.amenities?.wifi;
    document.getElementById("ac").checked = data.amenities?.ac;
    document.getElementById("food").checked = data.amenities?.food;
    document.getElementById("laundry").checked = data.amenities?.laundry;
    document.getElementById("power").checked = data.amenities?.power;
    document.getElementById("cctv").checked = data.amenities?.cctv;

    document.querySelector(".btn-submit").innerText = "Update Property";
  } catch (err) {
    console.error("Failed to load property for edit", err);
  }
});

// SUBMIT (ADD / EDIT)
async function handleSubmit(e) {
  e.preventDefault();

  const btn = document.querySelector(".btn-submit");
  btn.innerText = editId ? "Updating..." : "Publishing...";
  btn.style.opacity = "0.7";

  const formData = new FormData();

  formData.append("title", document.getElementById("title").value);
  formData.append("propertyType", document.getElementById("propertyType").value);
  formData.append("occupancyType", document.getElementById("occupancyType").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("address", document.getElementById("address").value);
  formData.append("city", document.getElementById("city").value);
  formData.append("nearestCollege", document.getElementById("nearestCollege").value);
  formData.append("rent", document.getElementById("rent").value);
  formData.append("deposit", document.getElementById("deposit").value);
  formData.append("rules", document.getElementById("rules").value);

  formData.append("amenities[wifi]", document.getElementById("wifi").checked);
  formData.append("amenities[ac]", document.getElementById("ac").checked);
  formData.append("amenities[food]", document.getElementById("food").checked);
  formData.append("amenities[laundry]", document.getElementById("laundry").checked);
  formData.append("amenities[power]", document.getElementById("power").checked);
  formData.append("amenities[cctv]", document.getElementById("cctv").checked);

  const files = document.getElementById("fileInput").files;
  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }

  try {
    const token = localStorage.getItem("token");

    const url = editId
      ? `http://localhost:5000/api/properties/${editId}`
      : "http://localhost:5000/api/properties";

    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    alert(editId ? "Property updated successfully!" : "Property listed successfully!");
    window.location.href = "../HostDashboard/HostDashboard.html";
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}
