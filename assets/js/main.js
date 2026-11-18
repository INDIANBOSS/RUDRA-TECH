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

  // Private, browser-local task list. No task data is sent to a server.
  const list = document.getElementById("task-list");
  if (!list) return;
  const title = document.getElementById("task-title");
  const projectSelect = document.getElementById("task-project");
  const filter = document.getElementById("task-filter");
  const count = document.getElementById("task-count");
  const storageKey = "rudra-tech-project-tasks-v1";
  let tasks = [];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved)) tasks = saved.filter(t => t && typeof t.id === "string" && typeof t.title === "string");
  } catch (_) { tasks = []; }

  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(tasks)); }
    catch (_) { count.textContent = "Storage unavailable in this browser"; }
  };

  const render = () => {
    const visible = tasks.filter(t => filter.value === "all" || (filter.value === "done" ? t.done : !t.done));
    count.textContent = tasks.length + " tasks · " + tasks.filter(t => t.done).length + " completed";
    list.replaceChildren();
    if (!visible.length) {
      const empty = document.createElement("p");
      empty.className = "task-empty";
      empty.textContent = tasks.length ? "No tasks match this filter." : "No tasks yet. Add your first task above.";
      list.append(empty);
      return;
    }
    visible.forEach(task => {
      const row = document.createElement("div");
      row.className = "task-item" + (task.done ? " is-done" : "");
      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = !!task.done;
      check.setAttribute("aria-label", "Mark " + task.title + " complete");
      check.addEventListener("change", () => { task.done = check.checked; save(); render(); });
      const info = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = task.title;
      const meta = document.createElement("small");
      meta.textContent = task.project;
      info.append(name, meta);
      const del = document.createElement("button");
      del.type = "button";
      del.className = "task-delete";
      del.textContent = "Delete";
      del.addEventListener("click", () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); });
      row.append(check, info, del);
      list.append(row);
    });
  };

  document.getElementById("task-add").addEventListener("click", () => {
    const value = title.value.trim();
    if (!value) { title.focus(); title.setAttribute("aria-invalid", "true"); return; }
    title.removeAttribute("aria-invalid");
    tasks.unshift({id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), title: value, project: projectSelect.value, done: false});
    title.value = "";
    save();
    render();
    title.focus();
  });
  title.addEventListener("input", () => title.removeAttribute("aria-invalid"));
  title.addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("task-add").click(); });
  filter.addEventListener("change", render);
  render();
})();
