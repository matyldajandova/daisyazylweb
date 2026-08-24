/**
 * Resize and convert CMS image picks to WebP before Decap reads the file.
 * Decap then previews a blob URL of the optimized File — no broken thumbnail.
 */
(function () {
  var MAX_EDGE = 1920;
  var WEBP_QUALITY = 0.8;
  var JPEG_QUALITY = 0.85;
  var SKIP_WEBP_BYTES = 500 * 1024;

  function isImageInput(input) {
    if (!input || input.tagName !== "INPUT" || input.type !== "file") return false;
    var accept = (input.getAttribute("accept") || "").toLowerCase();
    if (!accept) return false;
    if (accept.indexOf("pdf") !== -1 || accept.indexOf(".doc") !== -1) return false;
    return (
      accept.indexOf("image") !== -1 ||
      accept.indexOf("jpeg") !== -1 ||
      accept.indexOf("jpg") !== -1 ||
      accept.indexOf("png") !== -1 ||
      accept.indexOf("webp") !== -1 ||
      accept.indexOf("gif") !== -1
    );
  }

  function isImageFile(file) {
    if (!file) return false;
    if (file.type && file.type.indexOf("image/") === 0) return true;
    return /\.(jpe?g|png|webp|gif|jfif|avif)$/i.test(file.name || "");
  }

  function notify(message) {
    var el = document.createElement("div");
    el.setAttribute("role", "status");
    el.style.cssText =
      "position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);background:#16382c;color:#fffcf3;padding:0.75rem 1.1rem;border-radius:4px;z-index:99999;font:14px/1.4 system-ui,sans-serif;max-width:90vw;box-shadow:0 4px 16px rgba(0,0,0,.25);";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, 5000);
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) {
        resolve(blob || null);
      }, type, quality);
    });
  }

  function outputName(originalName, ext) {
    var base = String(originalName || "foto").replace(/\.[^.]+$/, "");
    if (!base) base = "foto";
    return base + "." + ext;
  }

  function encodeCanvas(canvas) {
    return canvasToBlob(canvas, "image/webp", WEBP_QUALITY).then(function (blob) {
      if (blob && blob.size > 0) return blob;
      return canvasToBlob(canvas, "image/jpeg", JPEG_QUALITY);
    });
  }

  function optimizeImageFile(file) {
    if (!isImageFile(file) || file.size === 0) {
      return Promise.resolve(file);
    }
    if (typeof createImageBitmap !== "function") {
      return Promise.resolve(file);
    }

    return createImageBitmap(file)
      .then(function (bitmap) {
        var width = bitmap.width;
        var height = bitmap.height;
        var scale = Math.min(1, MAX_EDGE / Math.max(width, height));
        var alreadyWebp =
          file.type === "image/webp" || /\.webp$/i.test(file.name || "");
        if (alreadyWebp && scale === 1 && file.size <= SKIP_WEBP_BYTES) {
          bitmap.close();
          return file;
        }

        var outW = Math.max(1, Math.round(width * scale));
        var outH = Math.max(1, Math.round(height * scale));
        var canvas = document.createElement("canvas");
        canvas.width = outW;
        canvas.height = outH;
        var ctx = canvas.getContext("2d");
        if (!ctx) {
          bitmap.close();
          return file;
        }
        ctx.drawImage(bitmap, 0, 0, outW, outH);
        bitmap.close();

        return encodeCanvas(canvas).then(function (blob) {
          if (!blob) return file;
          var ext = blob.type === "image/webp" ? "webp" : "jpg";
          return new File([blob], outputName(file.name, ext), {
            type: blob.type,
            lastModified: Date.now(),
          });
        });
      })
      .catch(function () {
        notify("Tuto fotku se nepodařilo zmenšit. Zkuste JPG nebo PNG.");
        return file;
      });
  }

  function replaceFiles(input, files) {
    if (typeof DataTransfer === "undefined") return false;
    var dt = new DataTransfer();
    files.forEach(function (file) {
      dt.items.add(file);
    });
    input.files = dt.files;
    return true;
  }

  document.addEventListener(
    "change",
    function (event) {
      var input = event.target;
      if (!isImageInput(input)) return;
      if (input.dataset.cmsOptimized === "1") {
        delete input.dataset.cmsOptimized;
        return;
      }
      if (!input.files || input.files.length === 0) return;

      event.stopImmediatePropagation();
      event.preventDefault();

      var originalFiles = Array.prototype.slice.call(input.files);
      Promise.all(originalFiles.map(optimizeImageFile)).then(function (optimized) {
        if (!replaceFiles(input, optimized)) {
          input.dataset.cmsOptimized = "1";
          return;
        }
        input.dataset.cmsOptimized = "1";
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
    },
    true,
  );
})();
