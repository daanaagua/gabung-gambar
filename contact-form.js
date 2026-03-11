const contactEmbed = document.querySelector("[data-tally-embed]");

if (contactEmbed) {
  const rawUrl = contactEmbed.getAttribute("data-tally-embed") || "";

  function normalizeTallyUrl(value) {
    if (!value || value.includes("REPLACE_WITH_TALLY_SHARE_URL")) return "";
    let url = value.trim();
    url = url.replace("https://tally.so/r/", "https://tally.so/embed/");
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;
  }

  const embedUrl = normalizeTallyUrl(rawUrl);

  if (embedUrl) {
    contactEmbed.innerHTML = `<iframe src="${embedUrl}" loading="lazy" title="Kontak GabungGambar via Tally"></iframe>`;
  }
}
