document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("damage-form");
  const fileInput = document.getElementById("image-upload");
  const previewImg = document.getElementById("preview-img");
  const placeholderText = document.getElementById("placeholder-text");
  const alertContainer = document.getElementById("alert-container");
  const resetBtn = document.getElementById("reset-btn");

  let base64Image = "";

  // Set default date to today
  document.getElementById("incident-date").value = new Date().toISOString().split("T")[0];

  // FileReader Image Upload & Validation
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) {
      clearPreview();
      return;
    }

    // Format Validation
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedFormats.includes(file.type)) {
      showAlert("Only JPG, JPEG, and PNG images are supported.", "error");
      this.value = "";
      clearPreview();
      return;
    }

    // Size Validation (Max 2MB to ensure safe LocalStorage persistence)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showAlert("Image file exceeds 2MB. Please select a smaller photo.", "error");
      this.value = "";
      clearPreview();
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      base64Image = e.target.result;
      previewImg.src = base64Image;
      previewImg.style.display = "block";
      placeholderText.style.display = "none";
      alertContainer.innerHTML = "";
    };
    reader.onerror = function () {
      showAlert("Error reading file from disk.", "error");
      clearPreview();
    };
    reader.readAsDataURL(file);
  });

  function clearPreview() {
    base64Image = "";
    previewImg.src = "";
    previewImg.style.display = "none";
    placeholderText.style.display = "block";
  }

  resetBtn.addEventListener("click", () => {
    clearPreview();
    alertContainer.innerHTML = "";
  });

  function showAlert(msg, type) {
    alertContainer.innerHTML = `<div class="alert-box ${type}">${msg}</div>`;
  }

  // Form Submission Handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("reporter-name").value.trim();
    const phone = document.getElementById("reporter-phone").value.trim();
    const email = document.getElementById("reporter-email").value.trim();
    const issueType = document.getElementById("issue-type").value;
    const date = document.getElementById("incident-date").value;
    const location = document.getElementById("incident-location").value.trim();
    const description = document.getElementById("incident-desc").value.trim();

    // Required Fields Validation
    if (!name || !phone || !email || !issueType || !date || !location || !description) {
      showAlert("Please complete all required fields.", "error");
      return;
    }

    // Email Pattern Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert("Please provide a valid email address.", "error");
      return;
    }

    // Phone Pattern Check (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      showAlert("Please enter a valid 10-digit phone number.", "error");
      return;
    }

    // Image Presence Check
    if (!base64Image) {
      showAlert("Visual photographic evidence is mandatory.", "error");
      return;
    }

    // Assemble Model
    const newId = generateReportId();
    const newReport = {
      id: newId,
      name,
      phone,
      email,
      issueType,
      date,
      location,
      description,
      image: base64Image,
      status: "Reported"
    };

    const success = addReport(newReport);

    if (success) {
      showAlert(`Complaint logged successfully! Your Tracking ID is <strong>${newId}</strong>. <a href="details.html?id=${newId}" style="color: inherit; text-decoration: underline; margin-left: 8px;">View Status &rarr;</a>`, "success");
      form.reset();
      clearPreview();
      document.getElementById("incident-date").value = new Date().toISOString().split("T")[0];
    } else {
      showAlert("Browser storage quota reached. Clear older reports or upload a smaller image.", "error");
    }
  });
});