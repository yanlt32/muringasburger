(function () {
  "use strict";

  /* ========================================================================
     CONFIG — edite aqui os dados reais do negócio
     ======================================================================== */
  var CONFIG = {
    // Número de WhatsApp em formato internacional, só dígitos (55 + DDD + número)
    whatsapp: "5511900000000",
    whatsappMessage: "Olá! Vim pelo site e gostaria de fazer um pedido 🍔",
    // Horário: abre e fecha (formato 24h). Mesmo horário todos os dias, ajuste se variar.
    hours: { open: 19, close: 23.5 } // 23.5 = 23h30
  };

  var whatsappLink = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(CONFIG.whatsappMessage);
  document.querySelectorAll("#mobileWhatsapp, #deliveryWhatsapp, #locationWhatsapp, #footerWhatsapp, #fabWhatsapp")
    .forEach(function (el) { if (el) el.setAttribute("href", whatsappLink); });

  /* ========================================================================
     Header: scroll state + mobile nav
     ======================================================================== */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");

    var topBtn = document.getElementById("fabTop");
    if (window.scrollY > 600) topBtn.classList.add("is-visible");
    else topBtn.classList.remove("is-visible");
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  navToggle.addEventListener("click", function () {
    var isOpen = mobileNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });
  mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      mobileNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });

  document.getElementById("fabTop").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ========================================================================
     Scrollspy — destaca o link ativo no menu
     ======================================================================== */
  var sections = ["sobre", "cardapio", "pedir", "galeria", "localizacao"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ========================================================================
     Cardápio: tabs
     ======================================================================== */
  var tabs = document.querySelectorAll(".menu-tab");
  var panels = document.querySelectorAll(".menu-panel");

  function activateTab(target) {
    tabs.forEach(function (t) {
      var active = t.dataset.target === target;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
    });
    panels.forEach(function (p) {
      var active = p.id === target;
      p.classList.toggle("is-active", active);
      if (active) p.removeAttribute("hidden");
      else p.setAttribute("hidden", "");
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { activateTab(tab.dataset.target); });
  });

  /* ========================================================================
     FAQ accordion
     ======================================================================== */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach(function (open) {
        if (open !== item) {
          open.classList.remove("is-open");
          open.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          open.querySelector(".faq-answer").style.maxHeight = null;
        }
      });
      item.classList.toggle("is-open", !isOpen);
      question.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + "px" : null;
    });
  });

  /* ========================================================================
     Status aberto/fechado + horário de hoje em destaque
     ======================================================================== */
  function updateStatus() {
    var now = new Date();
    var hour = now.getHours() + now.getMinutes() / 60;
    var isOpen = hour >= CONFIG.hours.open && hour < CONFIG.hours.close;

    var pill = document.getElementById("statusPill");
    var text = document.getElementById("statusText");
    if (pill && text) {
      pill.classList.toggle("is-open", isOpen);
      pill.classList.toggle("is-closed", !isOpen);
      if (isOpen) {
        text.textContent = "Aberto agora";
      } else if (hour < CONFIG.hours.open) {
        text.textContent = "Abre hoje às " + CONFIG.hours.open + "h";
      } else {
        text.textContent = "Fechado · abre amanhã às " + CONFIG.hours.open + "h";
      }
    }

    var todayIndex = now.getDay();
    document.querySelectorAll("#hoursList li").forEach(function (li) {
      li.classList.toggle("is-today", Number(li.dataset.day) === todayIndex);
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ========================================================================
     Marquee: duplica os itens para loop contínuo
     ======================================================================== */
  var track = document.getElementById("marqueeTrack");
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* ========================================================================
     Reveal on scroll
     ======================================================================== */
  var revealTargets = document.querySelectorAll(
    ".about, .featured-card, .delivery-card, .gallery-item, .faq-item, .info-card"
  );
  if ("IntersectionObserver" in window) {
    revealTargets.forEach(function (el) { el.style.setProperty("--reveal", "0"); });
    var reveal = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { reveal.observe(el); });
  }

  /* ========================================================================
     Footer year
     ======================================================================== */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
