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

  // Per-project workflow tracker: browser-local checklist and progress.
  const workflowPlans = {
    security: {name:"Hack With Rudra", tasks:["Prepare the next IT support lesson","Add a practical networking exercise","Review safety and authorization notes","Test every learning link on mobile"]},
    services: {name:"Working With Rudra", tasks:["Add verified service area and contact details","Prepare service request intake fields","Add computer and CCTV service checklists","Test the enquiry journey on mobile"]},
    baby: {name:"Baby With Ved", tasks:["Finalize Episode 002 lyrics and storyboard","Generate consistent Ved and Pip character references","Create original vocals and music","Edit, caption, and upload the finished episode"]},
    freelance: {name:"Freelance Work", tasks:["Prepare two spreadsheet sample projects","Add a desktop support case study","Add verified freelancer profile links","Create a client-ready delivery checklist"]},
    social: {name:"Social Media Management", tasks:["Choose the first channel and audience","Prepare seven days of original content","Review captions, rights, and thumbnails","Record post links and weekly performance"]},
    hub: {name:"RUDRA AI HUB", tasks:["Verify selected-agent routing","Test Research, Content, Creative, Media, Builder and Review agents","Add timeout and friendly error handling","Run a mobile production smoke test"]}
  };
  if (project !== "hub") {
    const plan = workflowPlans[project];
    const hero = document.querySelector("main .hero");
    if (plan && hero && !document.getElementById("project-workflow")) {
      const panel = document.createElement("section");
      panel.id = "project-workflow";
      panel.className = "section project-workflow";
      panel.setAttribute("aria-labelledby", "project-workflow-title");
      const eyebrow = document.createElement("p"); eyebrow.className = "eyebrow"; eyebrow.textContent = "YOUR PROJECT · LOCAL PROGRESS";
      const heading = document.createElement("h2"); heading.id = "project-workflow-title"; heading.textContent = "Next actions — " + plan.name;
      const intro = document.createElement("p"); intro.className = "workflow-intro"; intro.textContent = "Tick off each milestone as you work. Progress is saved in this browser on this device.";
      const progressWrap = document.createElement("div"); progressWrap.className = "project-progress";
      const progress = document.createElement("div"); progress.className = "project-progress-fill";
      const progressLabel = document.createElement("span"); progressLabel.className = "project-progress-label";
      const items = document.createElement("div"); items.className = "project-checklist";
      const key = "rudra-project-progress-v1-" + project;
      let done = [];
      try { const saved = JSON.parse(localStorage.getItem(key) || "[]"); if (Array.isArray(saved)) done = saved.filter(n => Number.isInteger(n) && n >= 0 && n < plan.tasks.length); } catch (_) {}
      const renderProgress = () => {
        const pct = Math.round(done.length / plan.tasks.length * 100);
        progress.style.width = pct + "%";
        progressWrap.setAttribute("aria-valuenow", String(pct));
        progressLabel.textContent = done.length + " of " + plan.tasks.length + " milestones complete · " + pct + "%";
      };
      progressWrap.setAttribute("role", "progressbar"); progressWrap.setAttribute("aria-valuemin", "0"); progressWrap.setAttribute("aria-valuemax", "100"); progressWrap.append(progress);
      plan.tasks.forEach((task, index) => {
        const label = document.createElement("label"); label.className = "project-check-item";
        const input = document.createElement("input"); input.type = "checkbox"; input.checked = done.includes(index);
        const text = document.createElement("span"); text.textContent = task;
        if (input.checked) label.classList.add("is-done");
        input.addEventListener("change", () => {
          done = input.checked ? [...new Set([...done, index])] : done.filter(n => n !== index);
          label.classList.toggle("is-done", input.checked);
          try { localStorage.setItem(key, JSON.stringify(done)); } catch (_) { progressLabel.textContent = "Browser storage unavailable"; }
          renderProgress();
        });
        label.append(input, text); items.append(label);
      });
      panel.append(eyebrow, heading, intro, progressWrap, progressLabel, items);
      hero.insertAdjacentElement("afterend", panel);
      renderProgress();
    }
  }

  // Private, browser-local task list. No task data is sent to a server.
  const list = document.getElementById("task-list");
  if (!list) return;
  const title = document.getElementById("task-title");
  const projectSelect = document.getElementById("task-project");
  const prioritySelect = document.getElementById("task-priority");
  const dueInput = document.getElementById("task-due");
  const filter = document.getElementById("task-filter");
  const count = document.getElementById("task-count");
  const feedback = document.getElementById("task-feedback");
  const exportButton = document.getElementById("task-export");
  const importInput = document.getElementById("task-import");
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
      meta.textContent = task.project + " · " + (task.priority || "Normal") + (task.due ? " · Due " + task.due : "");
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
    tasks.unshift({id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), title: value, project: projectSelect.value, priority: prioritySelect?.value || "Normal", due: dueInput?.value || "", done: false});
    title.value = "";
    save();
    render();
    title.focus();
  });
  title.addEventListener("input", () => title.removeAttribute("aria-invalid"));
  title.addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("task-add").click(); });
  filter.addEventListener("change", render);

  // Export/import a portable JSON backup. Imported data is validated before replacing local tasks.
  exportButton?.addEventListener("click", () => {
    const backup = {format:"rudra-task-backup", version:1, exportedAt:new Date().toISOString(), tasks};
    const blob = new Blob([JSON.stringify(backup, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rudra-project-tasks-backup.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    feedback.textContent = "Backup exported. Keep the JSON file somewhere safe.";
  });

  importInput?.addEventListener("change", async () => {
    const file = importInput.files && importInput.files[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error("Backup file is too large (maximum 1 MB).");
      const parsed = JSON.parse(await file.text());
      if (!parsed || parsed.format !== "rudra-task-backup" || parsed.version !== 1 || !Array.isArray(parsed.tasks)) {
        throw new Error("This file is not a supported RUDRA task backup.");
      }
      const valid = parsed.tasks.every(t =>
        t && typeof t.id === "string" && typeof t.title === "string" && t.title.length <= 120 &&
        typeof t.project === "string" && ["RUDRA AI HUB","Hack With Rudra","Working With Rudra","Baby With Ved","Freelance Work","Social Media Management"].includes(t.project) &&
        typeof t.done === "boolean"
      );
      if (!valid || parsed.tasks.length > 500) throw new Error("Backup contains invalid task data.");
      if (!window.confirm("Import " + parsed.tasks.length + " tasks? This replaces the tasks currently saved in this browser.")) return;
      tasks = parsed.tasks.map(t => ({...t, priority:t.priority || "Normal", due:t.due || ""}));
      save();
      render();
      feedback.textContent = "Backup imported successfully.";
    } catch (error) {
      feedback.textContent = error && error.message ? error.message : "Could not import this backup.";
    } finally {
      importInput.value = "";
    }
  });
  render();
})();
