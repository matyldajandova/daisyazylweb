(function () {
  var lb, lbImg, images, currentIndex;
  var touchStartX, touchStartY;

  function buildLightbox() {
    lb = document.createElement("div");
    lb.id = "gallery-lightbox";
    lb.className = "lightbox";
    lb.setAttribute("hidden", "");
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Prohlížeč fotografií");

    lb.innerHTML =
      '<button class="lightbox__close" aria-label="Zavřít">&times;</button>' +
      '<button class="lightbox__prev" aria-label="Předchozí fotografie">&#8249;</button>' +
      '<button class="lightbox__next" aria-label="Další fotografie">&#8250;</button>' +
      '<figure class="lightbox__figure">' +
      '  <img class="lightbox__image" src="" alt="">' +
      "</figure>";

    document.body.appendChild(lb);
    lbImg = lb.querySelector(".lightbox__image");

    lb.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
    lb.querySelector(".lightbox__prev").addEventListener("click", function () { navigate(-1); });
    lb.querySelector(".lightbox__next").addEventListener("click", function () { navigate(1); });

    /* click dark area outside image to close */
    lb.addEventListener("click", function (e) {
      if (e.target === lb) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (lb.hasAttribute("hidden")) return;
      if (e.key === "Escape") { closeLightbox(); return; }
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    });

    lb.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    lb.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        navigate(dx < 0 ? 1 : -1);
      } else if (Math.abs(dy) > 80) {
        closeLightbox();
      }
    }, { passive: true });
  }

  function collectImages(gallery) {
    return Array.prototype.slice.call(
      gallery.querySelectorAll(".gallery-masonry_item .gallery-masonry_image")
    ).map(function (img) {
      return {
        src: img.getAttribute("src") || img.getAttribute("data-src") || "",
        alt: img.getAttribute("alt") || ""
      };
    });
  }

  function openLightbox(idx) {
    currentIndex = idx;
    showImage();
    lb.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    lb.querySelector(".lightbox__close").focus();
  }

  function closeLightbox() {
    lb.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    showImage();
  }

  function showImage() {
    var item = images[currentIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    var prevBtn = lb.querySelector(".lightbox__prev");
    var nextBtn = lb.querySelector(".lightbox__next");
    prevBtn.hidden = images.length <= 1;
    nextBtn.hidden = images.length <= 1;
  }

  function init(root) {
    var gallery = (root || document).querySelector(".gallery-masonry");
    if (!gallery) return;

    buildLightbox();

    gallery.addEventListener("click", function (e) {
      /* Accept click on the img itself OR anywhere inside the item wrapper */
      var item = e.target.closest(".gallery-masonry_item");
      if (!item || item.hasAttribute("hidden")) return;
      var img = item.querySelector(".gallery-masonry_image");
      if (!img) return;

      images = collectImages(gallery);
      var allImgs = Array.prototype.slice.call(
        gallery.querySelectorAll(".gallery-masonry_item .gallery-masonry_image")
      );
      var idx = allImgs.indexOf(img);
      if (idx === -1) return;
      openLightbox(idx);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { init(document); });
  } else {
    init(document);
  }
})();
