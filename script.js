// Toast controller
const showToast = (message, isError = false) => {
  const toast = document.getElementById("toast");
  toast.className = isError ? "toast-error" : "toast-success";
  toast.textContent = message;
  toast.classList.add("toast-visible");

  setTimeout(() => {
    toast.classList.remove("toast-visible");
  }, 3000);
};

// Form validation

const formValidation = (form) => {
  const errors = [];
  const fields = [
    { name: "name", label: "Full name" },
    { name: "email", label: "Email" },
    { name: "message", label: "Message" },
  ];

  // If a field is missing, create a relevant error
  fields.forEach((field) => {
    if (!form.elements[field.name].value.trim()) {
      errors.push(`${field.label} is required`);
    }
  });

  // Basic email validation
  const email = form.elements.email.value;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please provide a valid email!");
  }

  return errors;
};

// Form submission
const form = document.getElementById("nodemailerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const loadingGif = document.querySelector(".loading-gif");
  loadingGif.classList.remove("d-none");

  // Verify the Turnstile token
  const turnstileToken = document.querySelector(
    '[name="cf-turnstile-response"]'
  )?.value;

  if (!turnstileToken) {
    showToast("Please complete the CAPTCHA verification!", true);
    return;
  }

  // Validation
  const errors = formValidation(form);
  if (errors.length > 0) {
    showToast(errors.join(", "), true);
    loadingGif.classList.add("d-none");
    return;
  }

  // Prepare the JSON data

  const jsonData = {
    name: form.elements.name.value,
    email: form.elements.email.value,
    message: form.elements.message.value,
    "cf-turnstile-response": turnstileToken,
  };

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }

    showToast("Your message was sent successfully!");
    form.reset();
    loadingGif.classList.add("d-none");
    setTimeout(() => {
      window.location.href = "/thank-you.html";
    }, 1500);
  } catch (error) {
    console.error("Sending error", error);
    showToast(error.message || "Failed to send email", true);
    loadingGif.classList.add("d-none");
  }
});
