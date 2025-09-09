// ====== Dark Mode Toggle ======
let toggleBtn;
let body;

// ====== Mobile Navigation ======
let mobileMenuToggle;
let mobileNav;

// Initialize theme based on user preference or saved preference
function initializeTheme() {
  if (!body || !toggleBtn) return;

  const savedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    body.classList.remove("light");
    body.classList.add("dark");
    toggleBtn.textContent = "";
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    toggleBtn.textContent = "";
  }
}

// Initialize elements when DOM is ready
function initializeElements() {
  toggleBtn = document.getElementById("toggle-dark");
  body = document.body;
  mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  mobileNav = document.getElementById("mobile-nav");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (!body) return;
      body.classList.toggle("dark");
      body.classList.toggle("light");

      // Save theme preference
      const currentTheme = body.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("theme", currentTheme);

      // Update button icon
      toggleBtn.textContent = "";
    });
  }

  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
      const icon = mobileMenuToggle.querySelector("i");
      if (mobileNav.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".mobile-nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileNav && mobileMenuToggle) {
        mobileNav.classList.remove("active");
        const icon = mobileMenuToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      mobileMenuToggle &&
      mobileNav &&
      !mobileMenuToggle.contains(e.target) &&
      !mobileNav.contains(e.target)
    ) {
      mobileNav.classList.remove("active");
      const icon = mobileMenuToggle.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });
}

// ====== Page Navigation ======
function showPage(pageId) {
  if (!pageId) return;

  // Hide all sections
  const allSections = document.querySelectorAll("main, section");
  allSections.forEach((section) => {
    section.style.display = "none";
  });

  // Show the selected page
  const targetPage = document.querySelector(pageId);
  if (targetPage) {
    targetPage.style.display = "block";
  }

  // Update browser history with hash (only if supported)
  if (window.history && window.history.pushState) {
    try {
      window.history.pushState({ page: pageId }, "", pageId);
    } catch (e) {
      // Fallback for older browsers
      window.location.hash = pageId;
    }
  }

  // Scroll to top
  if (window.scrollTo) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// ====== Navigation Links ======
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    showPage(targetId);
  });
});

// ====== Browser Back/Forward Support ======
window.addEventListener("popstate", function (event) {
  if (event.state && event.state.page) {
    // Show the page without updating history (to avoid infinite loop)
    const pageId = event.state.page;
    const allSections = document.querySelectorAll("main, section");
    allSections.forEach((section) => {
      section.style.display = "none";
    });

    const targetPage = document.querySelector(pageId);
    if (targetPage) {
      targetPage.style.display = "block";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    // Check current hash and show corresponding page
    const currentHash = window.location.hash;
    if (currentHash && document.querySelector(currentHash)) {
      showPage(currentHash);
    } else {
      showPage("#home-content");
    }
  }
});

// ====== Active Navigation Link Highlighting ======
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

// ====== Intersection Observer for Animations ======
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(
    ".project-card, .timeline-item, .skill-category, .contact-item"
  );
  animateElements.forEach((el) => {
    observer.observe(el);
  });
});

// ====== Scroll Event Listeners ======
window.addEventListener("scroll", () => {
  updateActiveNavLink();

  // Add scroll effect to navbar
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ====== Skill Tags Animation ======
function animateSkillTags() {
  const skillTags = document.querySelectorAll(".skill-tag");
  skillTags.forEach((tag, index) => {
    setTimeout(() => {
      tag.style.opacity = "0";
      tag.style.transform = "translateY(20px)";
      tag.style.transition = "all 0.3s ease";

      setTimeout(() => {
        tag.style.opacity = "1";
        tag.style.transform = "translateY(0)";
      }, 100);
    }, index * 50);
  });
}

// ====== Project Cards Hover Effect ======
document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
    });
  });
});

// ====== Contact Form Enhancement ======
function enhanceContactForm() {
  const contactItems = document.querySelectorAll(".contact-item");

  contactItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Add click effect
      item.style.transform = "scale(0.98)";
      setTimeout(() => {
        item.style.transform = "scale(1)";
      }, 150);
    });
  });
}

// ====== Performance Optimization ======
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounced scroll handler
const debouncedScrollHandler = debounce(() => {
  updateActiveNavLink();
}, 10);

window.addEventListener("scroll", debouncedScrollHandler);

// ====== Initialize all features ======
document.addEventListener("DOMContentLoaded", () => {
  // Initialize elements first
  initializeElements();

  // Initialize theme
  initializeTheme();

  // Check if there's a hash in the URL and show corresponding page
  const currentHash = window.location.hash;
  if (currentHash && document.querySelector(currentHash)) {
    showPage(currentHash);
  } else {
    // Show home page by default
    showPage("#home-content");
  }

  // Enhance contact items
  enhanceContactForm();

  // Add loading animation
  document.body.classList.add("loaded");

  // Animate skill tags when skills section comes into view
  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkillTags();
            skillsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    skillsObserver.observe(skillsSection);
  }
});

// ====== Add CSS for animations ======
function addDynamicStyles() {
  try {
    const style = document.createElement("style");
    style.textContent = `
      .nav-links a.active {
        background: var(--bg-secondary);
        color: var(--primary-color);
      }
      
      .navbar.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
      }
      
      body.dark .navbar.scrolled {
        background: rgba(15, 23, 42, 0.95);
      }
      
      .project-card, .timeline-item, .skill-category, .contact-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
      }
      
      .project-card.animate-in, .timeline-item.animate-in, 
      .skill-category.animate-in, .contact-item.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      
      body.loaded {
        animation: fadeIn 0.5s ease-in;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  } catch (e) {
    console.warn("Could not add dynamic styles:", e);
  }
}

// Initialize dynamic styles
addDynamicStyles();
