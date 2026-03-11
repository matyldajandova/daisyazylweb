/* Enhance Webflow gallery slider with WAI-ARIA semantics. */
(function () {
  function initCarousel(root) {
    var sliders = (root || document).querySelectorAll(
      ".gallery15_slider.w-slider",
    );
    if (!sliders.length) return;

    sliders.forEach(function (slider) {
      if (!slider.hasAttribute("role")) {
        slider.setAttribute("role", "region");
      }
      if (!slider.hasAttribute("aria-roledescription")) {
        slider.setAttribute("aria-roledescription", "carousel");
      }
      if (!slider.hasAttribute("aria-label")) {
        slider.setAttribute("aria-label", "Galerie fotografií zvířete");
      }

      var slides = Array.prototype.slice.call(
        slider.querySelectorAll(".gallery15_slide.w-slide"),
      );
      var total = slides.length || 0;

      slides.forEach(function (slide, index) {
        if (!slide.hasAttribute("role")) {
          slide.setAttribute("role", "group");
        }
        slide.setAttribute(
          "aria-label",
          "Obrázek " + (index + 1) + " z " + total,
        );
      });

      var prev = slider.querySelector(".w-slider-arrow-left");
      var next = slider.querySelector(".w-slider-arrow-right");

      if (prev) {
        prev.setAttribute("role", "button");
        if (!prev.hasAttribute("tabindex")) {
          prev.setAttribute("tabindex", "0");
        }
        if (!prev.hasAttribute("aria-label")) {
          prev.setAttribute("aria-label", "Předchozí obrázek");
        }
      }

      if (next) {
        next.setAttribute("role", "button");
        if (!next.hasAttribute("tabindex")) {
          next.setAttribute("tabindex", "0");
        }
        if (!next.hasAttribute("aria-label")) {
          next.setAttribute("aria-label", "Další obrázek");
        }
      }

      var dots = Array.prototype.slice.call(
        slider.querySelectorAll(".w-slider-nav .w-slider-dot"),
      );
      if (dots.length) {
        dots.forEach(function (dot, index) {
          dot.setAttribute(
            "aria-label",
            "Přejít na obrázek " + (index + 1) + " z " + total,
          );
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initCarousel(document);
    });
  } else {
    initCarousel(document);
  }
})();

