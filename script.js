// Mobile Navigation
const navbar = document.querySelector(".navbar");
const nav = document.querySelector("nav");

const menuBtn = document.createElement("button");
menuBtn.className = "menu-btn";
menuBtn.innerHTML = "☰";
navbar.appendChild(menuBtn);

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("show-nav");
  menuBtn.innerHTML = nav.classList.contains("show-nav") ? "✕" : "☰";
});

// Active Navigation Link
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll("nav a").forEach((link) => {
  const linkPage = link.getAttribute("href");

  if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

// Project Filter Tabs
const filterButtons = document.querySelectorAll(".filter-tabs button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active-tab"));
    button.classList.add("active-tab");

    const filter = button.textContent.toLowerCase();

    projectCards.forEach((card) => {
      const category = card.querySelector("p")?.textContent.toLowerCase() || "";

      if (filter === "all projects" || category.includes(filter.replace("s", ""))) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Contact Form Validation
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = contactForm.querySelectorAll("input, textarea");
    let isValid = true;

    inputs.forEach((input) => {
      if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("input-error");
        isValid = false;
      } else {
        input.classList.remove("input-error");
      }
    });

    if (!isValid) {
      showToast("Please fill in all required fields.");
      return;
    }

    showToast("Message sent successfully!");
    contactForm.reset();
  });
}

// Toast Notification
function showToast(message) {
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show-toast");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show-toast");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Smooth Scroll Animation
const animatedElements = document.querySelectorAll(
  ".hero-text, .hero-video, .service-card, .wide-service-card, .project-card, .contact-info, .contact-form, .cta-strip"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show-element");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

animatedElements.forEach((element) => {
  element.classList.add("hidden-element");
  observer.observe(element);
});

// Play Button Interaction
document.querySelectorAll(".play-btn, .project-overlay button").forEach((button) => {
  button.addEventListener("click", () => {
    showToast("Video preview coming soon.");
  });
});

// Auto-fill project type from service page booking button
const projectTypeInput = document.querySelector("#projectType");

if (projectTypeInput) {
  const params = new URLSearchParams(window.location.search);
  const selectedService = params.get("service");

  if (selectedService) {
    projectTypeInput.value = selectedService;
  }
}