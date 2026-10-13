/* VERITY/STORY — interactive archive. No trackers, cookies or runtime dependencies. */
(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // Scroll progress and section highlights.
  const progress = $("#progress");
  const railLinks = $$(".side-rail a[data-section]");
  let scrollPending = false;
  function onScroll() {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (distance > 0 ? window.scrollY / distance * 100 : 0) + "%";
      scrollPending = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    const sections = $$("main section[id]");
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const sectionId = entry.target.id;
        railLinks.forEach(link => {
          const active = link.dataset.section === sectionId;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-24% 0px -57% 0px" });
    sections.forEach(el => navObserver.observe(el));
  }

  // Mobile drawer.
  const menuButton = $("#menu-toggle");
  const mobileNav = $("#mobile-nav");
  function setMenu(open) {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    mobileNav.classList.toggle("open", open);
    mobileNav.inert = !open;
  }
  if (menuButton) menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  $$("#mobile-nav a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("pointerdown", event => {
    if (mobileNav?.classList.contains("open") && !mobileNav.contains(event.target) && !menuButton?.contains(event.target)) setMenu(false);
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 850) setMenu(false); });

  // Actual accessible tabs; keep hidden panel completely out of keyboard navigation.
  const tabs = $$("[data-tab]");
  const panels = { story: $("#timeline-story"), release: $("#timeline-release") };
  function selectTab(value, moveFocus = false) {
    tabs.forEach(tab => {
      const selected = tab.dataset.tab === value;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) tab.focus();
    });
    Object.entries(panels).forEach(([key, panel]) => { if (panel) panel.hidden = key !== value; });
  }
  tabs.forEach(tab => {
    tab.addEventListener("click", () => selectTab(tab.dataset.tab));
    tab.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const index = tabs.indexOf(tab);
        selectTab(tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length].dataset.tab, true);
      }
    });
  });
  selectTab("story");

  // Filters reflect real results and update accessibility state.
  function installFilters(buttonSelector, cardSelector, attr) {
    const buttons = $$(buttonSelector), cards = $$(cardSelector);
    buttons.forEach(button => button.addEventListener("click", () => {
      const value = button.dataset[attr];
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      cards.forEach(card => { card.classList.toggle("is-filtered", value !== "all" && card.dataset[attr === "evidenceFilter" ? "evidence" : "theory"] !== value); });
    }));
  }
  installFilters("[data-evidence-filter]", ".evidence-card", "evidenceFilter");
  installFilters("[data-theory-filter]", ".theory-card", "theoryFilter");

  // Keyboard searchable source index based on actual page text, not fake results.
  const searchDialog = $("#search-modal");
  const searchOpen = $("#search-open");
  const searchInput = $("#global-search");
  const searchResults = $("#search-results");
  let previousFocus = null;
  const entries = [];
  function addEntry(element, type, explicitTitle) {
    if (!element?.id) return;
    const heading = $("h1,h2,h3,.theory-name", element);
    const title = explicitTitle || heading?.textContent?.trim().replace(/\s+/g, " ") || element.id;
    const content = element.textContent.replace(/\s+/g, " ").trim();
    entries.push({ id: element.id, type, title, content: content.toLowerCase() });
  }
  $$("main section[id]").forEach(el => {
    const header = $("h1,h2", el);
    if (header) entries.push({ id: el.id, title: header.textContent.trim().replace(/\s+/g," "), type: "SECTION", content: header.textContent.toLowerCase() });
  });
  $$(".chapter[id]").forEach(el => addEntry(el, "DOSSIER"));
  $$(".evidence-card[id]").forEach(el => addEntry(el, "EVIDENCE"));
  $$(".theory-card[id]").forEach(el => addEntry(el, "THEORY"));
  $$(".timeline-item").forEach((el, index) => {
    const title = $("h3", el)?.textContent || "Timeline event";
    const id = "timeline-event-" + index;
    el.id = id;
    entries.push({ id, title, type: "TIMELINE", content: el.textContent.toLowerCase() });
  });
  $$(".episode-card").forEach((el, index) => {
    const id = "episode-" + (index + 1);
    el.id = id;
    addEntry(el, "EPISODE");
  });

  function renderResults(query) {
    if (!searchResults) return;
    searchResults.replaceChildren();
    const q = query.trim().toLowerCase();
    if (!q) {
      const intro = document.createElement("p");
      intro.textContent = "Explore the archive. Search a character, scene, clue, idea or theory.";
      searchResults.append(intro);
      return;
    }
    const terms = q.split(/\s+/).filter(Boolean);
    const matches = entries
      .filter(entry => terms.every(term => entry.content.includes(term) || entry.title.toLowerCase().includes(term)))
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(q) ? 1 : 0;
        const bTitle = b.title.toLowerCase().includes(q) ? 1 : 0;
        return bTitle - aTitle;
      })
      .slice(0, 15);
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.textContent = "No matches for “" + query + "”. Try a different term.";
      searchResults.append(empty);
      return;
    }
    matches.forEach(entry => {
      const link = document.createElement("a");
      link.href = "#" + entry.id;
      const label = document.createElement("span");
      label.textContent = entry.title;
      const type = document.createElement("small");
      type.textContent = entry.type + " ↗";
      link.append(label, type);
      link.addEventListener("click", () => {
        closeSearch();
        const target = document.getElementById(entry.id);
        if (target?.matches("details")) target.open = true;
        if (target?.closest("[hidden]")?.id === "timeline-release") selectTab("release");
        if (target?.closest("[hidden]")?.id === "timeline-story") selectTab("story");
        // Ensure filtered cards can be reached from global search.
        if (target?.classList.contains("is-filtered")) {
          const parent = target.closest("#evidence") ? "evidence" : "theory";
          const reset = $('[data-' + parent + '-filter="all"]');
          reset?.click();
        }
      });
      searchResults.append(link);
    });
  }
  function openSearch() {
    if (!searchDialog) return;
    setMenu(false);
    previousFocus = document.activeElement;
    searchDialog.hidden = false;
    document.body.style.overflow = "hidden";
    searchInput.value = "";
    renderResults("");
    searchInput.focus();
  }
  function closeSearch() {
    if (!searchDialog || searchDialog.hidden) return;
    searchDialog.hidden = true;
    document.body.style.overflow = "";
    previousFocus?.focus?.();
  }
  searchOpen?.addEventListener("click", openSearch);
  searchInput?.addEventListener("input", event => renderResults(event.target.value));
  $$("[data-close-search]").forEach(el => el.addEventListener("click", closeSearch));
  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (searchDialog?.hidden) openSearch(); else closeSearch();
    }
    if (event.key === "Escape") { closeSearch(); setMenu(false); }
    if (searchDialog && !searchDialog.hidden && event.key === "Tab") {
      const focusables = $$("button,input,a[href]", searchDialog).filter(el => el.getClientRects().length > 0);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Local Easter egg, no secret API calls or tracking.
  const toast = $("#toast");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2700);
  }
  let buffer = "";
  document.addEventListener("keydown", event => {
    if (event.target instanceof HTMLInputElement || event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
    buffer = (buffer + event.key.toLowerCase()).slice(-6);
    if (buffer.endsWith("verity")) {
      showToast("HELLOOOOO! I'M VERITY. ASK ME ANYTHING.");
      buffer = "";
    }
  });
})();
