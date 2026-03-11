const fileInput = document.querySelector("#file-input");
const addMoreInput = document.querySelector("#add-more-input");
const dropzone = document.querySelector("#dropzone");
const previewGrid = document.querySelector("#preview-grid");
const previewCount = document.querySelector("#preview-count");
const clearButton = document.querySelector("#clear-files");
const generateButton = document.querySelector("#generate-pdf");
const statusMessage = document.querySelector("#status-message");
const yearTarget = document.querySelector("#current-year");

const pageSizeSelect = document.querySelector("#page-size");
const orientationSelect = document.querySelector("#page-orientation");
const marginSelect = document.querySelector("#page-margin");
const fitSelect = document.querySelector("#page-fit");
const mobileCta = document.querySelector(".mobile-cta");
const primaryUploadButton = document.querySelector('.upload-button[for="file-input"]');

const items = [];
let dragIndex = null;

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

function syncMobileCtaVisibility() {
  if (!mobileCta || !primaryUploadButton) return;
  const rect = primaryUploadButton.getBoundingClientRect();
  const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
  mobileCta.classList.toggle("is-hidden", fullyVisible);
}

if (mobileCta && primaryUploadButton) {
  syncMobileCtaVisibility();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      const rect = entry.boundingClientRect;
      const fullyVisible = entry.intersectionRatio > 0.92 && rect.top >= 0 && rect.bottom <= window.innerHeight;
      mobileCta.classList.toggle("is-hidden", fullyVisible);
    }, {
      threshold: [0, 0.5, 0.92, 1],
    });
    observer.observe(primaryUploadButton);
  } else {
    window.addEventListener("scroll", syncMobileCtaVisibility, { passive: true });
    window.addEventListener("resize", syncMobileCtaVisibility);
  }
}

const pageSizes = {
  a4: [210, 297],
  letter: [215.9, 279.4],
  f4: [210, 330],
};

const marginSizes = {
  none: 0,
  narrow: 8,
  normal: 14,
  wide: 20,
};

function setStatus(message, type = "") {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.className = "status";
  if (type) {
    statusMessage.classList.add(`is-${type}`);
  }
}

function formatSize(bytes) {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const rounded = value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${rounded} ${units[unitIndex]}`;
}

function updatePreviewCount() {
  if (previewCount) {
    previewCount.textContent = `${items.length} gambar dipilih`;
  }
}

function moveItem(index, delta) {
  const target = index + delta;
  if (target < 0 || target >= items.length) return;
  const [item] = items.splice(index, 1);
  items.splice(target, 0, item);
  renderPreview();
}

function removeItem(index) {
  items.splice(index, 1);
  renderPreview();
}

function renderPreview() {
  if (!previewGrid) return;
  previewGrid.innerHTML = "";
  updatePreviewCount();

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "preview-empty";
    empty.textContent = "Belum ada gambar. Tambahkan JPG, PNG, atau WEBP untuk membuat PDF.";
    previewGrid.appendChild(empty);
    generateButton.disabled = true;
    return;
  }

  generateButton.disabled = false;

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "preview-card";
    card.draggable = true;
    card.dataset.index = String(index);

    card.addEventListener("dragstart", () => {
      dragIndex = index;
      card.classList.add("is-dragging");
    });

    card.addEventListener("dragend", () => {
      dragIndex = null;
      card.classList.remove("is-dragging");
    });

    card.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    card.addEventListener("drop", (event) => {
      event.preventDefault();
      if (dragIndex === null || dragIndex === index) return;
      const [dragged] = items.splice(dragIndex, 1);
      items.splice(index, 0, dragged);
      renderPreview();
    });

    const thumb = document.createElement("img");
    thumb.src = item.preview;
    thumb.alt = `Pratinjau ${item.name}`;

    const meta = document.createElement("div");
    meta.innerHTML = `
      <strong>${item.name}</strong>
      <span>${item.width} x ${item.height}px</span>
      <span>${formatSize(item.size)}</span>
    `;

    const actions = document.createElement("div");
    actions.className = "preview-actions";

    const upButton = document.createElement("button");
    upButton.type = "button";
    upButton.className = "mini-button";
    upButton.textContent = "Naik";
    upButton.addEventListener("click", () => moveItem(index, -1));

    const downButton = document.createElement("button");
    downButton.type = "button";
    downButton.className = "mini-button";
    downButton.textContent = "Turun";
    downButton.addEventListener("click", () => moveItem(index, 1));

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "mini-button";
    removeButton.textContent = "Hapus";
    removeButton.addEventListener("click", () => removeItem(index));

    actions.append(upButton, downButton, removeButton);
    card.append(thumb, meta, actions);
    previewGrid.appendChild(card);
  });
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        resolve({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      };

      image.onerror = () => reject(new Error(`Gagal membaca file ${file.name}`));
      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error(`Gagal memuat file ${file.name}`));
    reader.readAsDataURL(file);
  });
}

async function handleFiles(fileList) {
  const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

  if (!files.length) {
    setStatus("Pilih file gambar JPG, PNG, atau WEBP terlebih dahulu.", "error");
    return;
  }

  setStatus("Sedang menambahkan gambar...", "success");

  try {
    const newItems = await Promise.all(files.map((file) => readImage(file)));
    items.push(...newItems);
    renderPreview();
    setStatus(`${newItems.length} gambar siap diubah menjadi PDF.`, "success");
  } catch (error) {
    setStatus(error.message, "error");
  }
}

function attachInput(input) {
  if (!input) return;
  input.addEventListener("change", async (event) => {
    if (event.target.files?.length) {
      await handleFiles(event.target.files);
      input.value = "";
    }
  });
}

attachInput(fileInput);
attachInput(addMoreInput);

if (dropzone) {
  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("is-active");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      if (eventName === "drop") {
        handleFiles(event.dataTransfer?.files || []);
      }
      dropzone.classList.remove("is-active");
    });
  });
}

if (clearButton) {
  clearButton.addEventListener("click", () => {
    items.length = 0;
    renderPreview();
    setStatus("Daftar gambar dibersihkan.", "success");
  });
}

function getPageConfig() {
  const baseSize = pageSizes[pageSizeSelect?.value || "a4"] || pageSizes.a4;
  const orientation = orientationSelect?.value || "portrait";
  const margin = marginSizes[marginSelect?.value || "normal"] ?? marginSizes.normal;
  const fit = fitSelect?.value || "fit";

  return {
    pageWidth: orientation === "landscape" ? baseSize[1] : baseSize[0],
    pageHeight: orientation === "landscape" ? baseSize[0] : baseSize[1],
    orientation,
    margin,
    fit,
  };
}

function prepareImage(previewUrl, width, height) {
  const maxDimension = 2200;
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));

  const context = canvas.getContext("2d");
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.onload = () => {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve({
        dataUrl: canvas.toDataURL("image/jpeg", 0.9),
        width: canvas.width,
        height: canvas.height,
      });
    };

    image.onerror = () => reject(new Error("Gagal menyiapkan gambar untuk PDF."));
    image.src = previewUrl;
  });
}

async function generatePdf() {
  if (!items.length) {
    setStatus("Tambahkan minimal satu gambar sebelum membuat PDF.", "error");
    return;
  }

  if (!window.jspdf?.jsPDF) {
    setStatus("Library PDF belum siap. Muat ulang halaman lalu coba lagi.", "error");
    return;
  }

  const { pageWidth, pageHeight, orientation, margin, fit } = getPageConfig();
  const { jsPDF } = window.jspdf;

  generateButton.disabled = true;
  setStatus("Sedang membuat PDF...", "success");

  try {
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: [pageWidth, pageHeight],
      compress: true,
    });

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const prepared = await prepareImage(item.preview, item.width, item.height);

      if (index > 0) {
        pdf.addPage([pageWidth, pageHeight], orientation);
      }

      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      const widthRatio = availableWidth / prepared.width;
      const heightRatio = availableHeight / prepared.height;
      const ratio = fit === "fill" ? Math.max(widthRatio, heightRatio) : Math.min(widthRatio, heightRatio);

      const renderWidth = prepared.width * ratio;
      const renderHeight = prepared.height * ratio;
      const x = margin + (availableWidth - renderWidth) / 2;
      const y = margin + (availableHeight - renderHeight) / 2;

      pdf.addImage(prepared.dataUrl, "JPEG", x, y, renderWidth, renderHeight, undefined, "FAST");
    }

    const fileName = document.body.dataset.pdfName || "gabung-gambar.pdf";
    pdf.save(fileName);
    setStatus("PDF berhasil dibuat. File sedang diunduh.", "success");
  } catch (error) {
    setStatus(error.message || "Terjadi kesalahan saat membuat PDF.", "error");
  } finally {
    generateButton.disabled = items.length === 0;
  }
}

if (generateButton) {
  generateButton.addEventListener("click", generatePdf);
}

renderPreview();
