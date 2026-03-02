/* Enhance Webflow tabs with WAI-ARIA roles and keyboard support. */
(function () {
  function initTabs(root) {
    var tabContainers = (root || document).querySelectorAll(".layout507_tabs.w-tabs");
    if (!tabContainers.length) return;

    tabContainers.forEach(function (container) {
      var tablist = container.querySelector(".layout507_tabs-menu[role='tablist']");
      if (!tablist) return;

      var tabs = Array.prototype.slice.call(
        tablist.querySelectorAll("[role='tab']"),
      );
      var panels = Array.prototype.slice.call(
        container.querySelectorAll("[role='tabpanel']"),
      );

      if (!tabs.length || !panels.length) return;

      function syncFromDom() {
        tabs.forEach(function (tab) {
          var isActive = tab.classList.contains("w--current");
          tab.setAttribute("aria-selected", isActive ? "true" : "false");
          tab.setAttribute("tabindex", isActive ? "0" : "-1");
        });

        panels.forEach(function (panel) {
          var isActive = panel.classList.contains("w--tab-active");
          if (isActive) {
            panel.removeAttribute("hidden");
          } else {
            panel.setAttribute("hidden", "hidden");
          }
        });
      }

      syncFromDom();

      tablist.addEventListener("click", function (event) {
        var target = event.target;
        while (target && target !== tablist && target.getAttribute) {
          if (target.getAttribute("role") === "tab") break;
          target = target.parentNode;
        }
        if (!target || target === tablist) return;

        // Let Webflow handle the actual tab switch, then sync ARIA state.
        setTimeout(syncFromDom, 0);
      });

      tablist.addEventListener("keydown", function (event) {
        var key = event.key;
        if (
          key !== "ArrowRight" &&
          key !== "ArrowLeft" &&
          key !== "Home" &&
          key !== "End"
        ) {
          return;
        }

        var current = document.activeElement;
        var currentIndex = tabs.indexOf(current);
        if (currentIndex === -1) return;

        event.preventDefault();

        var nextIndex = currentIndex;
        if (key === "ArrowRight") {
          nextIndex = (currentIndex + 1) % tabs.length;
        } else if (key === "ArrowLeft") {
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (key === "Home") {
          nextIndex = 0;
        } else if (key === "End") {
          nextIndex = tabs.length - 1;
        }

        var nextTab = tabs[nextIndex];
        if (!nextTab) return;

        nextTab.focus();
        nextTab.click();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initTabs(document);
    });
  } else {
    initTabs(document);
  }
})();

