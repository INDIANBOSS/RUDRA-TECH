// RUDRA-TECH shared interactions — lightweight and mobile friendly
(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const path = location.pathname.toLowerCase();
  const project = path.includes("baby-with-ved") ? "baby" :
    path.includes("hackwithrudra") ? "security" :
    path.includes("working-with-rudra") ? "services" :
    path.includes("freelance") ? "freelance" :
    path.includes("social-media") ? "social" : "hub";
  document.body.dataset.project = project;

  document.querySelectorAll(".project-card, .project-grid article, .section, .hero").forEach(el => el.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.08});
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.setAttribute("tabindex", "-1");
    });
  });
})();
