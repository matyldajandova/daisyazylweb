(function () {
  function initGallery(root) {
    var gallery = (root || document).querySelector(".gallery-masonry");
    if (!gallery) return;

    var initial = parseInt(gallery.getAttribute("data-gallery-initial") || "2", 10);
    var batch = parseInt(gallery.getAttribute("data-gallery-batch") || "2", 10);
    var items = Array.prototype.slice.call(gallery.querySelectorAll(".gallery-masonry_item"));
    var button = document.querySelector(".gallery-masonry_load-more");

    if (items.length <= initial) return;

    items.forEach(function (item, i) {
      if (i >= initial) {
        item.hidden = true;
      }
    });

    if (button) {
      button.hidden = false;
      button.addEventListener("click", function () {
        var hidden = items.filter(function (item) { return item.hidden; });
        var toReveal = hidden.slice(0, batch);

        toReveal.forEach(function (item) {
          var img = item.querySelector("img");
          if (img) {
            var src = img.getAttribute("data-src");
            if (src) {
              img.setAttribute("src", src);
              img.removeAttribute("data-src");
              img.setAttribute("loading", "lazy");
            }
          }
          item.hidden = false;
        });

        var stillHidden = items.filter(function (item) { return item.hidden; });
        if (stillHidden.length === 0) {
          button.hidden = true;
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initGallery(document);
    });
  } else {
    initGallery(document);
  }
})();
