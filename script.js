// Config — fill these
const OWNER = {
  name: "AKASH TRIVEDI",
  email: "unfazedakash@gmail.com",
  resume: "https://drive.google.com/file/d/1v17woxNpAkO7hgUjCawQ-NPu-jkrpUjK/view", // link to your resume
  socials: {
    github: "https://github.com/Unfazed-Akash",
    linkedin: "https://linkedin.com/in/unfazed-akash",
    x: "https://x.com/unfazed_akash",
    reddit: "https://www.reddit.com/user/unfazed-akash/",
    discord: "https://discord.com/channels/@1429119620563865632"
  }
};

// Contact form mode
const USE_EMAILJS = false; // set true to use EmailJS (optional, no backend)

/* Optional EmailJS
   1) npm not needed; just add this before script.js in index.html:
      <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
      <script> (function(){ emailjs.init("YOUR_PUBLIC_KEY"); })(); </script>
   2) Set service, template, and public key below
*/
const EMAILJS = {
  serviceId: "SERVICE_ID",
  templateId: "TEMPLATE_ID",
  publicKey: "PUBLIC_KEY"
};

document.addEventListener("DOMContentLoaded", () => {
  // Dynamic year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Theme toggle
  const html = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) html.setAttribute("data-theme", savedTheme);
  themeToggle.textContent = html.dataset.theme === "light" ? "🌞" : "🌙";
  themeToggle.addEventListener("click", () => {
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeToggle.textContent = next === "light" ? "🌞" : "🌙";
  });

  // Mobile nav
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

  // Active nav link on scroll
  const sections = [...document.querySelectorAll("section[id]")];
  const navAnchors = [...document.querySelectorAll(".nav__link")];
  const setActive = () => {
    let idx = sections.findIndex(sec => sec.getBoundingClientRect().top - 120 > 0);
    idx = idx === -1 ? sections.length - 1 : Math.max(0, idx - 1);
    const id = sections[idx]?.id;
    navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  };
  document.addEventListener("scroll", setActive);
  setActive();

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add("show"));
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // Tilt effect
  document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -8; // rotateX
      const ry = ((x / r.width) - 0.5) * 8;   // rotateY
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(900px) rotateX(0) rotateY(0)`;
    });
  });

  // Project filters
  const filterBar = document.getElementById("projectFilters");
  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      filterBar.querySelectorAll(".chip").forEach(c => c.classList.remove("chip--active"));
      btn.classList.add("chip--active");
      const val = btn.dataset.filter;
      document.querySelectorAll(".project").forEach(card => {
        const tags = card.dataset.tags.split(" ");
        const show = val === "all" || tags.includes(val);
        card.style.display = show ? "" : "none";
      });
    });
  }

  // Back to top
  const toTop = document.getElementById("toTop");
  const onScroll = () => {
    toTop.style.display = window.scrollY > 500 ? "grid" : "none";
  };
  document.addEventListener("scroll", onScroll);
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Contact form
  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get("name");
    const email = fd.get("email");
    const message = fd.get("message");

    if (USE_EMAILJS) {
      try {
        if (!window.emailjs) throw new Error("EmailJS SDK not loaded");
        const res = await emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
          from_name: name,
          reply_to: email,
          message: message,
          to_email: OWNER.email
        }, EMAILJS.publicKey);
        alert("Thanks! Your message was sent.");
        form.reset();
      } catch (err) {
        console.error(err);
        fallbackMailto(name, email, message);
      }
    } else {
      fallbackMailto(name, email, message);
    }
  });

  // Open email app quick button
  const openMailApp = document.getElementById("openMailApp");
  if (openMailApp) {
    openMailApp.href = `mailto:${OWNER.email}`;
  }
});

function fallbackMailto(name, email, message) {
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
  window.location.href = `mailto:${OWNER.email}?subject=${subject}&body=${body}`;
}