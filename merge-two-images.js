const mergeRoot = document.querySelector("[data-merge-two-images]");

if (mergeRoot) {
  const inputOne = document.querySelector("#merge-image-one");
  const inputTwo = document.querySelector("#merge-image-two");
  const layoutSelect = document.querySelector("#merge-layout");
  const backgroundSelect = document.querySelector("#merge-background");
  const gapSelect = document.querySelector("#merge-gap");
  const canvas = document.querySelector("#merge-canvas");
  const emptyState = document.querySelector("#merge-empty");
  const status = document.querySelector("#merge-status");
  const downloadButton = document.querySelector("#download-merged-image");
  const swapButton = document.querySelector("#swap-images");
  const clearButton = document.querySelector("#clear-merge-images");
  const labelOne = document.querySelector("#merge-label-one");
  const labelTwo = document.querySelector("#merge-label-two");

  const mergeItems = [null, null];

  function setMergeStatus(message, type = "") {
    if (!status) return;
    status.textContent = message;
    status.className = "status";
    if (type) status.classList.add(`is-${type}`);
  }

  function updateLabels() {
    if (labelOne) labelOne.textContent = mergeItems[0]?.name || "Pilih gambar pertama";
    if (labelTwo) labelTwo.textContent = mergeItems[1]?.name || "Pilih gambar kedua";
  }

  function drawMerged() {
    if (!canvas || !mergeItems[0] || !mergeItems[1]) {
      if (canvas) canvas.hidden = true;
      if (emptyState) emptyState.hidden = false;
      if (downloadButton) downloadButton.disabled = true;
      return;
    }

    const layout = layoutSelect?.value || "horizontal";
    const background = backgroundSelect?.value || "white";
    const gap = Number(gapSelect?.value || 24);
    const [first, second] = mergeItems;
    const maxSide = 1600;

    const imageA = new Image();
    const imageB = new Image();

    imageA.onload = () => {
      imageB.onload = () => {
        let width;
        let height;
        const ratioA = first.width / first.height;
        const ratioB = second.width / second.height;

        if (layout === "horizontal") {
          const targetHeight = Math.min(maxSide / 2, Math.max(first.height, second.height));
          const aWidth = targetHeight * ratioA;
          const bWidth = targetHeight * ratioB;
          width = Math.round(aWidth + bWidth + gap);
          height = Math.round(targetHeight);
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(imageA, 0, 0, Math.round(aWidth), height);
          ctx.drawImage(imageB, Math.round(aWidth + gap), 0, Math.round(bWidth), height);
        } else {
          const targetWidth = Math.min(maxSide / 2, Math.max(first.width, second.width));
          const aHeight = targetWidth / ratioA;
          const bHeight = targetWidth / ratioB;
          width = Math.round(targetWidth);
          height = Math.round(aHeight + bHeight + gap);
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = background;
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(imageA, 0, 0, width, Math.round(aHeight));
          ctx.drawImage(imageB, 0, Math.round(aHeight + gap), width, Math.round(bHeight));
        }

        canvas.hidden = false;
        if (emptyState) emptyState.hidden = true;
        if (downloadButton) downloadButton.disabled = false;
        setMergeStatus("Pratinjau gabungan sudah siap diunduh.", "success");
      };
      imageB.src = second.preview;
    };
    imageA.src = first.preview;
  }

  function readMergeImage(file, index) {
    if (!file || !file.type.startsWith("image/")) {
      setMergeStatus("Silakan pilih file gambar yang valid.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        mergeItems[index] = {
          name: file.name,
          preview: reader.result,
          width: image.naturalWidth,
          height: image.naturalHeight,
        };
        updateLabels();
        drawMerged();
      };
      image.onerror = () => setMergeStatus("Gagal membaca gambar.", "error");
      image.src = reader.result;
    };
    reader.onerror = () => setMergeStatus("Gagal memuat file gambar.", "error");
    reader.readAsDataURL(file);
  }

  inputOne?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) readMergeImage(file, 0);
    inputOne.value = "";
  });

  inputTwo?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (file) readMergeImage(file, 1);
    inputTwo.value = "";
  });

  [layoutSelect, backgroundSelect, gapSelect].forEach((element) => {
    element?.addEventListener("change", drawMerged);
  });

  swapButton?.addEventListener("click", () => {
    [mergeItems[0], mergeItems[1]] = [mergeItems[1], mergeItems[0]];
    updateLabels();
    drawMerged();
  });

  clearButton?.addEventListener("click", () => {
    mergeItems[0] = null;
    mergeItems[1] = null;
    updateLabels();
    drawMerged();
    setMergeStatus("Dua gambar dibersihkan. Pilih ulang untuk mulai lagi.", "success");
  });

  downloadButton?.addEventListener("click", () => {
    if (!canvas || downloadButton.disabled) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "gabung-2-gambar.png";
    link.click();
    setMergeStatus("Gambar gabungan berhasil diunduh.", "success");
  });

  updateLabels();
  drawMerged();
}
