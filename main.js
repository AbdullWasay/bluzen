(function () {
  var DEFAULT_MSG = "Hi Bluzen, I'd like to book a home water test.";
  var ENTERPRISE_MSG =
    "Hi Bluzen, I'm interested in the Enterprise system and would like to get a quote.";

  function waUrl(text) {
    return "https://wa.me/+252613558822?text=" + encodeURIComponent(text);
  }

  document.querySelectorAll("[data-wa-default]").forEach(function (el) {
    el.setAttribute("href", waUrl(DEFAULT_MSG));
  });

  var productTemplate =
    "Hi Bluzen, I'm interested in the MODEL and would like to book a home water test.";
  document.querySelectorAll("[data-wa-product]").forEach(function (el) {
    var model = el.getAttribute("data-wa-product") || "";
    if (model.toLowerCase() === "enterprise") {
      el.setAttribute("href", waUrl(ENTERPRISE_MSG));
      return;
    }
    el.setAttribute("href", waUrl(productTemplate.replace("MODEL", model)));
  });

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNavOpen(open) {
    document.body.classList.toggle("nav-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(!document.body.classList.contains("nav-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });
  }

  document.addEventListener("click", function (e) {
    if (!document.body.classList.contains("nav-open")) return;
    var t = e.target;
    if (toggle && nav && !nav.contains(t) && !toggle.contains(t)) {
      setNavOpen(false);
    }
  });

  document.querySelectorAll("a").forEach(function (a) {
    if (a.hasAttribute("data-wa-default")) return;
    if (a.hasAttribute("data-wa-product")) return;
    var raw = a.getAttribute("href");
    if (!raw || raw === "#" || raw.charAt(0) !== "#") return;
    var target = document.querySelector(raw);
    if (!target) return;
    a.addEventListener("click", function (e) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  var siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    function syncHeaderSolid() {
      siteHeader.classList.toggle("site-header--scrolled", window.scrollY > 20);
    }
    syncHeaderSolid();
    window.addEventListener("scroll", syncHeaderSolid, { passive: true });
  }

  var problemOverview = document.querySelector(".section-problem__overview");
  var problemAside = document.querySelector(".section-problem__aside");
  if (problemOverview && problemAside) {
    var problemDesktopMq = window.matchMedia("(min-width: 961px)");
    function syncProblemAsideHeight() {
      if (!problemDesktopMq.matches) {
        problemAside.style.height = "";
        return;
      }
      problemAside.style.height = problemOverview.getBoundingClientRect().height + "px";
    }
    syncProblemAsideHeight();
    window.addEventListener("resize", syncProblemAsideHeight, { passive: true });
    if (problemDesktopMq.addEventListener) {
      problemDesktopMq.addEventListener("change", syncProblemAsideHeight);
    } else if (problemDesktopMq.addListener) {
      problemDesktopMq.addListener(syncProblemAsideHeight);
    }
    if (window.ResizeObserver) {
      new ResizeObserver(syncProblemAsideHeight).observe(problemOverview);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncProblemAsideHeight);
    }
    window.addEventListener("load", syncProblemAsideHeight);
  }
})();
