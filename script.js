(() => {
  const body = document.body;
  window.requestAnimationFrame(() => body.classList.add("loaded"));

  const ensureWipBanner = () => {
    if (document.querySelector(".site-banner")) return;
    const banner = document.createElement("div");
    banner.className = "site-banner";
    banner.textContent = "Website is still in work.";
    document.body.prepend(banner);
  };
  ensureWipBanner();

  const nav = document.querySelector(".floating-nav");
  const currentPage = body.dataset.page;
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const indicator = document.querySelector(".nav-indicator");

  const activeLink = navLinks.find((link) => link.dataset.page === currentPage);
  if (activeLink) activeLink.classList.add("active");

  const moveIndicator = (target, emphasize = false) => {
    if (!indicator || !target) return;
    const label = target.querySelector(".nav-label") || target;
    const labelRect = label.getBoundingClientRect();
    const parentRect = target.parentElement.getBoundingClientRect();
    const horizontalPadding = 18;
    const x = labelRect.left - parentRect.left - horizontalPadding / 2;
    const width = labelRect.width + horizontalPadding;
    indicator.style.width = `${width}px`;
    indicator.style.transform = `translate(${x}px, -50%)`;
    indicator.classList.toggle("bounce", emphasize);
  };

  const updateIndicator = () => moveIndicator(activeLink, false);

  updateIndicator();
  window.addEventListener("resize", updateIndicator);

  if (indicator) {
    navLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => moveIndicator(link, true));
      link.addEventListener("mouseleave", () => indicator.classList.remove("bounce"));
      link.addEventListener("focus", () => moveIndicator(link, true));
      link.addEventListener("blur", () => moveIndicator(activeLink, false));
    });
    const navLinksWrap = document.querySelector(".nav-links");
    if (navLinksWrap) {
      navLinksWrap.addEventListener("mouseleave", () => moveIndicator(activeLink, false));
    }
  }

  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    if (!nav) return;
    const y = window.scrollY;
    nav.classList.toggle("compact", y > 40 || y > lastScroll);
    lastScroll = y;
  });

  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
  revealEls.forEach((el) => io.observe(el));

  const cursor = document.querySelector(".cursor-label");
  const projectCards = document.querySelectorAll(".project-card");
  const typingName = document.querySelector(".typing-name");

  if (typingName) {
    const fullText = typingName.dataset.text || "";
    typingName.textContent = "";
    let i = 0;
    const typeNext = () => {
      if (i < fullText.length) {
        typingName.textContent += fullText.charAt(i);
        i += 1;
        setTimeout(typeNext, 95);
      }
    };
    setTimeout(typeNext, 320);
  }

  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 4;
      const rotateX = (0.5 - y / rect.height) * 4;
      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
      card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    });

    card.addEventListener("mouseenter", () => {
      if (cursor) cursor.classList.add("show");
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      if (cursor) cursor.classList.remove("show");
    });
  });

  document.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) return;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      body.classList.add("page-exit");
      setTimeout(() => {
        window.location.href = href;
      }, 280);
    });
  });
})();
