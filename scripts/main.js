document.addEventListener("DOMContentLoaded", () => {

  // ─── 1. GSAP setup (no ScrollTrigger — single-page sections don't scroll) ───
  // ScrollTrigger is not needed; all animations fire on page-enter.

  // ─── 2. Preloader ───────────────────────────────────────────────────────────
  const preloaderTl = gsap.timeline();

  preloaderTl
    .to("#preloader .preloader__logo", {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    })
    .to("#preloader", {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.0,
      ease: "power4.inOut",
      delay: 0.4,
    })
    .set("#preloader", { display: "none" })
    .add(() => {
      // After preloader: run home page entrance animations
      animateHome();
    });

  // ─── 3. Countdown Timer ─────────────────────────────────────────────────────
  const eventDate = new Date("2026-05-21T18:00:00");
  const elDays = document.getElementById("cd-days");
  const elHrs  = document.getElementById("cd-hrs");
  const elMin  = document.getElementById("cd-min");
  const elSec  = document.getElementById("cd-sec");

  function updateCountdown() {
    const now  = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      elDays.textContent = "00";
      elHrs.textContent  = "00";
      elMin.textContent  = "00";
      elSec.textContent  = "00";
      return;
    }

    elDays.textContent = Math.floor(diff / 86400000).toString().padStart(2, "0");
    elHrs.textContent  = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, "0");
    elMin.textContent  = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
    elSec.textContent  = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ─── 4. Custom Cursor ───────────────────────────────────────────────────────
  (function initCursor() {
    if ("ontouchstart" in window) return; // disable on touch devices

    document.body.classList.add("has-custom-cursor");
    const cursor = document.getElementById("cursor");
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX - 24);
      yTo(e.clientY - 24);
    });

    function bindCursorTargets() {
      document.querySelectorAll("a, button, .nav__logo").forEach((el) => {
        // avoid duplicate listeners
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = "1";
        el.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
      });
    }
    bindCursorTargets();
    // Re-bind whenever a new page is shown (new links become active)
    document.addEventListener("page:entered", bindCursorTargets);
  })();

  // ─── 5. Mobile Menu ─────────────────────────────────────────────────────────
  const hamburger     = document.querySelector(".nav__hamburger");
  const mobileOverlay = document.querySelector(".nav-mobile-overlay");
  const closeMenu     = document.querySelector(".nav-mobile__close");

  hamburger.addEventListener("click", () => {
    mobileOverlay.classList.add("is-active");
  });

  closeMenu.addEventListener("click", () => {
    mobileOverlay.classList.remove("is-active");
  });

  // ─── 6. Client-side Router ──────────────────────────────────────────────────

  const routes = {
    "/":         "page-home",
    "/venue":    "page-venue",
    "/schedule": "page-schedule",
    "/theme":    "page-theme",
    "/rsvp":     "page-rsvp",
    "/travel":   "page-travel",
    "/hotels":   "page-hotels",
  };

  // Map page-id → path (reverse lookup for nav highlighting)
  const pageToPath = Object.fromEntries(
    Object.entries(routes).map(([path, id]) => [id, path])
  );

  function getPageIdFromPath(pathname) {
    return routes[pathname] || routes["/"];
  }

  function navigate(path, pushState = true) {
    const targetId   = getPageIdFromPath(path);
    const currentPage = document.querySelector(".page--active");
    const targetPage  = document.getElementById(targetId);

    if (!targetPage || currentPage === targetPage) return;

    // Close mobile menu if open
    mobileOverlay.classList.remove("is-active");

    // Fade out current page
    gsap.to(currentPage, {
      opacity: 0,
      y: -12,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        // Swap pages
        currentPage.classList.remove("page--active");
        gsap.set(currentPage, { opacity: 1, y: 0 }); // reset for next time

        targetPage.classList.add("page--active");
        window.scrollTo(0, 0);

        // Fade in new page
        gsap.fromTo(
          targetPage,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        );

        // Update URL
        if (pushState) {
          history.pushState({ path }, "", path);
        }

        // Update active nav link
        updateActiveNavLink(targetId);

        // Run page animations
        runPageAnimations(targetId);

        // Dispatch event so cursor etc. can re-bind
        document.dispatchEvent(new CustomEvent("page:entered", { detail: { pageId: targetId } }));
      },
    });
  }

  // Intercept all data-page link clicks
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-page]");
    if (!link) return;
    e.preventDefault();
    const pageId = link.dataset.page;
    const path   = pageToPath[pageId] || "/";
    navigate(path);
  });

  // Handle browser back / forward
  window.addEventListener("popstate", (e) => {
    const path = e.state?.path || location.pathname;
    navigate(path, false);
  });

  // Update active highlight on nav links
  function updateActiveNavLink(activePageId) {
    document.querySelectorAll("[data-page]").forEach((el) => {
      el.classList.toggle("nav-link--active", el.dataset.page === activePageId);
    });
  }

  // On first load: show the correct page based on the URL path
  (function initRoute() {
    const path     = location.pathname;
    const pageId   = getPageIdFromPath(path);
    const allPages = document.querySelectorAll(".page");

    allPages.forEach((p) => p.classList.remove("page--active"));
    document.getElementById(pageId).classList.add("page--active");

    updateActiveNavLink(pageId);
    history.replaceState({ path }, "", path);
  })();

  // ─── 7. Page Entrance Animations ────────────────────────────────────────────

  function animateHome() {
    // Hero curtain wipe
    gsap.from(".hero", {
      clipPath: "inset(8% 4% 8% 4% round 24px)",
      duration: 1.4,
      ease: "power4.inOut",
      clearProps: "clipPath",
    });

    gsap.from(".hero__video", {
      scale: 1.08,
      duration: 1.6,
      ease: "power3.out",
    });

    // Split hero heading
    const split = new SplitType(".hero__name", { types: "lines" });
    split.lines.forEach((line) => {
      const wrap = document.createElement("div");
      wrap.classList.add("line-wrap");
      line.classList.add("line-inner");
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
    });

    gsap.to(split.lines, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.3,
    });

    gsap.from(
      [".hero__overline", ".hero__rule", ".hero__date", ".hero__address"],
      { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.5 }
    );

    gsap.from(".countdown-block", {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)",
      delay: 0.9,
    });
  }

  function animateVenue() {
    gsap.from(".venue__photo", {
      x: -60,
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
      delay: 0.1,
    });

    const split = new SplitType(".venue__heading", { types: "lines" });
    split.lines.forEach((line) => {
      const wrap = document.createElement("div");
      wrap.classList.add("line-wrap");
      line.classList.add("line-inner");
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
    });

    gsap.to(split.lines, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.2,
    });

    gsap.from(".venue__index, .venue__details, .venue__description, .btn-outline, .venue__map", {
      y: 40,
      opacity: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.3,
    });
  }

  function animateSchedule() {
    const split = new SplitType(".schedule__heading", { types: "lines" });
    split.lines.forEach((line) => {
      const wrap = document.createElement("div");
      wrap.classList.add("line-wrap");
      line.classList.add("line-inner");
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
    });

    gsap.to(split.lines, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.2,
    });

    gsap.from(".schedule__header .section-index", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      delay: 0.1,
    });

    // Draw the timeline line
    gsap.fromTo(
      ".timeline__line",
      { scaleY: 0 },
      { scaleY: 1, duration: 1.2, ease: "power2.inOut", delay: 0.4 }
    );

    // Alternate cards left / right
    document.querySelectorAll(".schedule-card--left").forEach((card, i) => {
      gsap.from(card, {
        x: -80,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5 + i * 0.15,
      });
    });

    document.querySelectorAll(".schedule-card--right").forEach((card, i) => {
      gsap.from(card, {
        x: 80,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.6 + i * 0.15,
      });
    });

    gsap.from(".schedule__note", {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 1.0,
    });
  }

  function animateTheme() {
    gsap.from(".theme__statement .section-index", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      delay: 0.1,
    });

    gsap.to(".theme__big-type .line-inner", {
      y: 0,
      duration: 1.0,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.2,
    });

    gsap.from(".theme__rule", {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.2,
      ease: "power3.out",
      delay: 0.5,
    });

    gsap.from(".dresscode-event", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out",
      delay: 0.4,
    });

    gsap.from(".swatches__label", {
      y: 20,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      delay: 0.7,
    });

    gsap.from(".swatches__row .swatch", {
      scale: 0.7,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "back.out(1.7)",
      delay: 0.8,
    });
  }

  function animateRsvp() {
    const split = new SplitType(".rsvp__heading", { types: "lines" });
    split.lines.forEach((line) => {
      const wrap = document.createElement("div");
      wrap.classList.add("line-wrap");
      line.classList.add("line-inner");
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
    });

    gsap.to(split.lines, {
      y: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.2,
    });

    gsap.from(".rsvp .section-index, .rsvp__rule, .rsvp__deadline", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.1,
    });

    gsap.from(".rsvp__form-wrap", {
      y: 60,
      opacity: 0,
      duration: 0.9,
      ease: "power2.out",
      delay: 0.4,
    });
  }

  function animateTravel() {
    const split = new SplitType(".travel__heading", { types: "lines" });
    split.lines.forEach((line) => {
      const wrap = document.createElement("div");
      wrap.classList.add("line-wrap");
      line.classList.add("line-inner");
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
    });

    gsap.to(split.lines, {
      y: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.2,
    });

    gsap.from(".travel .section-index, .travel__subtitle", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.1,
    });

    gsap.from(".travel-card", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power2.out",
      delay: 0.4,
    });
  }

  function animateHotels() {
    const split = new SplitType(".hotels__heading", { types: "lines" });
    split.lines.forEach((line) => {
      const wrap = document.createElement("div");
      wrap.classList.add("line-wrap");
      line.classList.add("line-inner");
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
    });

    gsap.to(split.lines, {
      y: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.2,
    });

    gsap.from(".hotels .section-index, .hotels__sub", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.1,
    });

    gsap.from(".hotel-card", {
      y: 50,
      scale: 0.96,
      opacity: 0,
      duration: 0.85,
      stagger: 0.15,
      ease: "power2.out",
      delay: 0.4,
    });
  }

  // Dispatcher — called every time a page becomes active
  function runPageAnimations(pageId) {
    switch (pageId) {
      case "page-home":     animateHome();     break;
      case "page-venue":    animateVenue();    break;
      case "page-schedule": animateSchedule(); break;
      case "page-theme":    animateTheme();    break;
      case "page-rsvp":     animateRsvp();     break;
      case "page-travel":   animateTravel();   break;
      case "page-hotels":   animateHotels();   break;
    }
  }

  // ─── 8. RSVP Form ───────────────────────────────────────────────────────────

  // Toggle buttons (attendance, adire, plus-one)
  // Each group is independent — group is identified by data-group attribute.
  // Buttons without data-group belong to the main attendance group.
  const attendanceInput = document.getElementById("rsvp-attendance");
  const adireInput      = document.getElementById("rsvp-adire");
  const plusOneInput    = document.getElementById("rsvp-plus-one");

  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.dataset.group || "attendance";

      // Deactivate sibling buttons in the same group
      document.querySelectorAll(
        group === "attendance"
          ? `.toggle-btn:not([data-group])`
          : `.toggle-btn[data-group="${group}"]`
      ).forEach((b) => b.classList.remove("is-active"));

      btn.classList.add("is-active");

      // Store value in the correct hidden input
      if (group === "attendance") {
        attendanceInput.value = btn.dataset.value;
        clearFieldError("group-attendance", "error-attendance");
      } else if (group === "adire") {
        adireInput.value = btn.dataset.value;
        // Show WhatsApp hint when "Yes" selected
        const hint = document.getElementById("adire-hint");
        hint.style.display = btn.dataset.value === "adire-yes" ? "block" : "none";
      } else if (group === "plus-one") {
        plusOneInput.value = btn.dataset.value;
      }
    });
  });

  // Validation helpers
  function setFieldError(groupId, errorId, message) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);
    if (group) group.classList.add("is-invalid");
    if (error) error.textContent = message;
  }

  function clearFieldError(groupId, errorId) {
    const group = document.getElementById(groupId);
    const error = document.getElementById(errorId);
    if (group) group.classList.remove("is-invalid");
    if (error) error.textContent = "";
  }

  function validateRsvpForm() {
    let valid = true;

    const firstName = document.getElementById("rsvp-firstname").value.trim();
    if (firstName.length < 2) {
      setFieldError("group-firstname", "error-firstname", "Please enter your first name.");
      valid = false;
    } else { clearFieldError("group-firstname", "error-firstname"); }

    const lastName = document.getElementById("rsvp-lastname").value.trim();
    if (lastName.length < 2) {
      setFieldError("group-lastname", "error-lastname", "Please enter your last name.");
      valid = false;
    } else { clearFieldError("group-lastname", "error-lastname"); }

    const title = document.getElementById("rsvp-title").value;
    if (!title) {
      setFieldError("group-title", "error-title", "Please select your title.");
      valid = false;
    } else { clearFieldError("group-title", "error-title"); }

    const phone = document.getElementById("rsvp-phone").value.trim();
    if (phone.length < 7 || !/^[0-9\s+\-()]+$/.test(phone)) {
      setFieldError("group-phone", "error-phone", "Please enter a valid phone number.");
      valid = false;
    } else { clearFieldError("group-phone", "error-phone"); }

    const email = document.getElementById("rsvp-email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("group-email", "error-email", "Please enter a valid email address.");
      valid = false;
    } else { clearFieldError("group-email", "error-email"); }

    if (!attendanceInput.value) {
      setFieldError("group-attendance", "error-attendance", "Please let us know if you'll be attending.");
      valid = false;
    } else { clearFieldError("group-attendance", "error-attendance"); }

    // If attending, at least one event must be ticked
    if (attendanceInput.value === "attending") {
      const checked = document.querySelectorAll('.form__checkbox:checked');
      if (checked.length === 0) {
        setFieldError("group-events", "error-events", "Please select at least one event.");
        valid = false;
      } else { clearFieldError("group-events", "error-events"); }
    }

    return valid;
  }

  // Success reveal
  // ── Toast notification ──────────────────────────────────────────────────────
  const toast      = document.getElementById("rsvp-toast");
  const toastClose = document.getElementById("rsvp-toast-close");
  let   toastTimer = null;

  function showToast() {
    // Reset SVG animations by removing and re-adding the class
    toast.classList.remove("is-visible");
    void toast.offsetWidth; // force reflow so the animation restarts cleanly

    toast.classList.add("is-visible");

    // Slide down from above
    gsap.fromTo(
      toast,
      { y: "-110%" },
      { y: "0%", duration: 0.55, ease: "power3.out" }
    );

    // Auto-dismiss after 5 seconds
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 5000);
  }

  function hideToast() {
    clearTimeout(toastTimer);
    gsap.to(toast, {
      y: "-110%",
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => toast.classList.remove("is-visible"),
    });
  }

  toastClose.addEventListener("click", hideToast);

  // ── RSVP success (form hides, toast fires) ───────────────────────────────
  function showRsvpSuccess() {
    const formEl    = document.getElementById("rsvp-form");
    const successEl = document.getElementById("rsvp-success");

    // Fade out the form
    gsap.to(formEl, {
      autoAlpha: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        // Reveal the in-page thank-you message
        gsap.fromTo(
          successEl,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
      },
    });

    // Fire the top-bar toast
    showToast();
  }

  // ── Form submission ──────────────────────────────────────────────────────
  const rsvpForm      = document.getElementById("rsvp-form");
  const submitBtn     = document.getElementById("rsvp-submit");
  const submitErrorEl = document.getElementById("error-submit");
  const submitGroup   = document.getElementById("group-submit");

  // TODO: Paste your Google Apps Script Web App URL here after deploying it.
  // It looks like: https://script.google.com/macros/s/XXXXXXXXXXXX/exec
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxHm0TZBeBFooKXX3jwpoZbHeW2NYFgrT40trmcWXdBiU5kJrXiF1SBxho7JX4rFG-S/exec";

  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateRsvpForm()) return;

    submitBtn.disabled    = true;
    submitBtn.textContent = "Sending\u2026";
    submitGroup.classList.remove("is-invalid");
    submitErrorEl.textContent = "";

    // Gather checked events
    const checkedEvents = [...document.querySelectorAll(".form__checkbox:checked")]
      .map((cb) => cb.value);

    const payload = {
      first_name:               document.getElementById("rsvp-firstname").value.trim(),
      last_name:                document.getElementById("rsvp-lastname").value.trim(),
      title:                    document.getElementById("rsvp-title").value,
      phone:                    document.getElementById("rsvp-phone").value.trim(),
      email:                    document.getElementById("rsvp-email").value.trim(),
      attendance:               attendanceInput.value,
      events:                   checkedEvents.join(", "),
      adire_interest:           adireInput.value,
      attending_with_someone:   plusOneInput.value,
    };

    try {
      // Google Apps Script requires no-cors mode because it returns an opaque response.
      // We treat the fetch completing without a network error as success.
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // no-cors gives an opaque response — we can't read .ok, so reaching here = success
      showRsvpSuccess();

    } catch {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Confirm My Attendance";
      submitGroup.classList.add("is-invalid");
      submitErrorEl.textContent = "Something went wrong. Please check your connection and try again.";
    }
  });

});
