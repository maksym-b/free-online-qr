/* =========================
   helpers (GLOBAL)
   ========================= */

const COUNTRY_OPTIONS = [
  "",
  "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda",
  "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
  "British Indian Ocean Territory", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
  "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island",
  "Cocos Islands", "Colombia", "Comoros", "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Curacao", "Cyprus", "Czech Republic",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland",
  "France", "French Polynesia", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada",
  "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jersey",
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
  "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
  "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles",
  "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "North Korea", "Northern Mariana Islands", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland",
  "Portugal", "Puerto Rico", "Qatar", "Republic of the Congo", "Reunion", "Romania", "Russia", "Rwanda", "Saint Barthelemy",
  "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Sint Maarten", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
  "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands",
  "Tuvalu", "U.S. Virgin Islands", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican", "Venezuela", "Vietnam", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe",
];

function encodeRFC3986(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

function clampLat(lat) {
  const n = Number(lat);
  if (!Number.isFinite(n)) return null;
  return Math.max(-90, Math.min(90, n));
}

function clampLon(lon) {
  const n = Number(lon);
  if (!Number.isFinite(n)) return null;
  return Math.max(-180, Math.min(180, n));
}

function normalizePhoneForTel(input) {
  const raw = String(input || "").trim();
  if (!raw) return "";
  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  return (hasPlus ? "+" : "") + digits;
}

function normalizePhoneForWhatsApp(input) {
  const raw = String(input || "").trim();
  if (!raw) return "";
  return raw.replace(/[^\d]/g, "");
}

function normalizeUrl(input) {
  let s = String(input || "").trim();
  if (!s) return "";
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s)) return s;
  if (s.startsWith("//")) return "https:" + s;
  return "https://" + s;
}

function clampHex(v) {
  let s = String(v || "").trim();
  if (!s) return "#000000";
  if (!s.startsWith("#")) s = "#" + s;
  const ok = /^#[0-9a-fA-F]{6}$/.test(s);
  return ok ? s.toUpperCase() : "#000000";
}

function clampHexWithDefault(v, fallback) {
  let s = String(v || "").trim();
  if (!s) return fallback;
  if (!s.startsWith("#")) s = "#" + s;
  const ok = /^#[0-9a-fA-F]{6}$/.test(s);
  return ok ? s.toUpperCase() : fallback;
}

/* =========================
   CAPTION HELPERS (GLOBAL)
   ========================= */

function getCaptionSettings() {
  const text = document.getElementById("captionText")?.value?.trim() || "";

  const colorPickerEl = document.getElementById("captionColorPicker");
  const colorHexEl = document.getElementById("captionColor");
  const colorRaw = (colorHexEl?.value || colorPickerEl?.value || "#000000").trim();

  const bgPickerEl = document.getElementById("captionBgPicker");
  const bgHexEl = document.getElementById("captionBgColor");
  const bgRaw = (bgHexEl?.value || bgPickerEl?.value || "#FFFFFF").trim();

  return {
    text,
    color: clampHexWithDefault(colorRaw, "#000000"),
    font: document.getElementById("captionFont")?.value || "sans",
    bg: clampHexWithDefault(bgRaw, "#FFFFFF"),
  };
}

function captionFontFamily(key) {
  if (key === "serif") return "Georgia, serif";
  if (key === "mono") return "ui-monospace, SFMono-Regular, Menlo, monospace";
  return "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
}

function wrapCanvasText(ctx, text, maxWidth) {
  const words = String(text || "").split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function escapeXml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* =========================
   CAPTION STYLE SYNC (PREVIEW <-> EXPORT)
   =========================
*/

const CAPTION_PREVIEW_FONT_PX = 14;
const CAPTION_PREVIEW_LINE_H = 1.3;
const CAPTION_PREVIEW_PAD_Y = 10;
const CAPTION_PREVIEW_PAD_X = 0;

const CAPTION_EXPORT_MIN_PAD_X = 0;

const PREVIEW_BASE_PX = 280;

function captionLayoutFor(sizePx) {
  const scale = sizePx / PREVIEW_BASE_PX;

  const fontSize = Math.max(10, Math.round(CAPTION_PREVIEW_FONT_PX * scale));
  const lineHeight = Math.round(fontSize * CAPTION_PREVIEW_LINE_H);

  const padY = Math.max(4, Math.round(CAPTION_PREVIEW_PAD_Y * scale));
  const padX = Math.max(CAPTION_EXPORT_MIN_PAD_X, Math.round(CAPTION_PREVIEW_PAD_X * scale));

  const baseline = Math.round(fontSize * 0.82);

  return { fontSize, lineHeight, padY, padX, baseline };
}

function buildCaptionedSvg(svgText, sizePx, cap) {
  const text = String(cap?.text || "").trim();
  if (!text) return { svgText, width: sizePx, height: sizePx };

  const { fontSize, lineHeight, padY, padX, baseline } = captionLayoutFor(sizePx);

  const maxTextWidth = Math.max(10, sizePx - padX * 2);

  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  ctx.font = `${fontSize}px ${captionFontFamily(cap.font)}`;

  const lines = wrapCanvasText(ctx, text, maxTextWidth);

  const capHeight = padY * 2 + lineHeight * lines.length;
  const totalH = sizePx + capHeight;

  const textBlockHeight = lineHeight * lines.length;
  const textStartY = sizePx + (capHeight - textBlockHeight) / 2 + baseline;

  const inner = String(svgText || "")
    .replace(/^[\s\S]*?<svg[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "");

  const bgRect = cap.bg
    ? `<rect x="0" y="${sizePx}" width="${sizePx}" height="${capHeight}" rx="0" fill="${escapeXml(cap.bg)}" />`
    : "";

  const textEls = lines.map((ln, i) => {
    const y = Math.round(textStartY + lineHeight * i);
    return `<text x="${Math.round(sizePx / 2)}"
      y="${y}"
      text-anchor="middle"
      fill="${escapeXml(cap.color)}"
      font-size="${fontSize}"
      font-family="${escapeXml(captionFontFamily(cap.font))}">${escapeXml(ln)}</text>`;
  }).join("");

  const wrapped =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${sizePx}" height="${totalH}" viewBox="0 0 ${sizePx} ${totalH}">
  <g>${inner}</g>
  ${bgRect}
  ${textEls}
</svg>`;

  return { svgText: wrapped, width: sizePx, height: totalH };
}

/* =========================
   types.js (inlined)
   ========================= */

const QR_TYPES = [
  {
    id: "website",
    title: "Website",
    desc: "Link to any website URL",
    icon: "🔗",
    fields: () => ([{ id: "url", label: "Website URL", type: "text", placeholder: "https://www.example.com", required: true }]),
    buildPayload: (values) => (values.url || "").trim(),
  },
  {
    id: "text",
    title: "Text",
    desc: "Encode plain text",
    icon: "📜",
    fields: () => ([{ id: "text", label: "Text", type: "textarea", placeholder: "Type your text here…", required: true }]),
    buildPayload: (values) => values.text || "",
  },
  {
    id: "wifi",
    title: "WiFi",
    desc: "Connect to a Wi-Fi network",
    icon: "🛜",
    fields: () => ([
      { id: "ssid", label: "SSID", type: "text", placeholder: "Network name", required: true },
      { id: "security", label: "Security", type: "select", options: ["", "WPA", "WEP", "nopass"], required: true },
      { id: "password", label: "Password", type: "text", placeholder: "Wi-Fi password", required: false },
    ]),
    buildPayload: (v) => {
      const ssid = (v.ssid || "").replaceAll("\\", "\\\\").replaceAll(";", "\\;");
      const sec = (v.security || "").trim();

      if (!sec) return "";
      if (sec === "nopass") {
        return `WIFI:T:nopass;S:${ssid};;`;
      }
      const pwdRaw = (v.password || "").trim();
      if (!pwdRaw) return "";

      const pwd = pwdRaw.replaceAll("\\", "\\\\").replaceAll(";", "\\;");
      return `WIFI:T:${sec};S:${ssid};P:${pwd};;`;
    },
  },
  {
    id: "email",
    title: "Email",
    desc: "Compose an email message",
    icon: "📩",
    fields: () => ([
      { id: "to", label: "Email recipient", type: "text", placeholder: "person@example.com", required: true },
      { id: "subject", label: "Subject", type: "text", placeholder: "Subject", required: false },
      { id: "body", label: "Body text", type: "textarea", placeholder: "Email text…", required: false },
    ]),
    buildPayload: (v) => {
      const to = String(v.to || "").trim();
      if (!to) return "";
      const subject = String(v.subject || "");
      const body = String(v.body || "");

      const params = [];
      if (subject) params.push("subject=" + encodeRFC3986(subject));
      if (body) params.push("body=" + encodeRFC3986(body));

      return "mailto:" + to + (params.length ? "?" + params.join("&") : "");
    },
  },
  {
    id: "phone",
    title: "Phone call",
    desc: "Call a phone number",
    icon: "📞",
    fields: () => ([{ id: "number", label: "Phone number", type: "text", placeholder: "+31 6 000 0000", required: true }]),
    buildPayload: (v) => {
      const tel = normalizePhoneForTel(v.number);
      return tel ? `tel:${tel}` : "";
    },
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    desc: "Start a WhatsApp chat",
    icon: "💬",
    fields: () => ([{ id: "number", label: "Phone number", type: "text", placeholder: "+31 6 000 0000", required: true }]),
    buildPayload: (v) => {
      const wa = normalizePhoneForWhatsApp(v.number);
      return wa ? `https://wa.me/${wa}` : "";
    },
  },
  {
    id: "location",
    title: "Location",
    desc: "Share a place",
    icon: "📍",
    fields: () => ([
      { id: "search", label: "Search", type: "text", placeholder: "E.g. Dam Square Amsterdam", required: false },
      { id: "lat", label: "Latitude", type: "text", placeholder: "52.3731", required: false },
      { id: "lon", label: "Longitude", type: "text", placeholder: "4.8922", required: false },
    ]),
    buildPayload: (v) => {
      const lat = clampLat((v.lat || "").trim());
      const lon = clampLon((v.lon || "").trim());
      const q = String(v.search || "").trim();

      if (lat !== null && lon !== null) return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
      if (q) return `https://www.openstreetmap.org/search?query=${encodeRFC3986(q)}`;
      return "";
    },
  },
  {
    id: "vcard",
    title: "vCard",
    desc: "Share a digital business card",
    icon: "👨🏻‍💼",
    fields: () => ([
      { id: "name", label: "Full name", type: "text", placeholder: "Jane Doe", required: true },
      { id: "org", label: "Company", type: "text", placeholder: "Company Inc.", required: false },
      { id: "dept", label: "Department", type: "text", placeholder: "Sales", required: false },
      { id: "title", label: "Job title", type: "text", placeholder: "Marketing Manager", required: false },
      { id: "phone", label: "Phone", type: "text", placeholder: "+31 6 000 0000", required: false },
      { id: "email", label: "Email", type: "text", placeholder: "jane@example.com", required: false },
      { id: "url", label: "Website", type: "text", placeholder: "https://www.example.com", required: false },
      { id: "street", label: "Street address", type: "text", placeholder: "123 Main St", required: false },
      { id: "city", label: "City", type: "text", placeholder: "Amsterdam", required: false },
      { id: "region", label: "State/Province", type: "text", placeholder: "Noord-Holland", required: false },
      { id: "postal", label: "Postal code", type: "text", placeholder: "1011AB", required: false },
      { id: "country", label: "Country", type: "select", options: COUNTRY_OPTIONS, required: false },
    ]),
    buildPayload: (v) => {
      const esc = (s = "") =>
        String(s).replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(";", "\\;").replaceAll(",", "\\,");

      const full = String(v.name || "").trim();
      const parts = full.split(/\s+/).filter(Boolean);
      const given = parts.slice(0, 1).join(" ");
      const family = parts.slice(1).join(" ");

      const hasAdr =
        (v.street || "").trim() ||
        (v.city || "").trim() ||
        (v.region || "").trim() ||
        (v.postal || "").trim() ||
        (v.country || "").trim();

      const adrLine = hasAdr
        ? `ADR;TYPE=WORK:;;${esc(v.street)};${esc(v.city)};${esc(v.region)};${esc(v.postal)};${esc(v.country)}`
        : "";

      const orgLine = (v.org || v.dept) ? `ORG:${esc(v.org)}${v.dept ? `;${esc(v.dept)}` : ""}` : "";

      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${esc(v.name)}`,
        `N:${esc(family)};${esc(given)};;;`,
        orgLine,
        v.dept ? `X-DEPARTMENT:${esc(v.dept)}` : "",
        v.title ? `TITLE:${esc(v.title)}` : "",
        v.phone ? `TEL;TYPE=CELL:${esc(v.phone)}` : "",
        v.email ? `EMAIL:${esc(v.email)}` : "",
        v.url ? `URL:${esc(v.url)}` : "",
        adrLine,
        "END:VCARD",
      ].filter(Boolean).join("\n");
    },
  },
];

/* =========================
   export.js (inlined)
   ========================= */

async function svgToPngDataUrl(svgText, widthPx = 320, heightPx = widthPx, background = "transparent") {
  const svg = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svg);

  const img = new Image();
  img.decoding = "async";

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });

  const canvas = document.createElement("canvas");
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, widthPx, heightPx);
  ctx.drawImage(img, 0, 0, widthPx, heightPx);

  if (background !== "transparent") {
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, widthPx, heightPx);
    ctx.globalCompositeOperation = "source-over";
  }

  URL.revokeObjectURL(url);
  return canvas.toDataURL("image/png");
}

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function pngToJpgDataUrl(pngDataUrl, widthPx = 320, heightPx = widthPx, background = "#ffffff", quality = 0.92) {
  const img = new Image();
  img.decoding = "async";
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = pngDataUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = widthPx;
  canvas.height = heightPx;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, widthPx, heightPx);
  ctx.drawImage(img, 0, 0, widthPx, heightPx);

  return canvas.toDataURL("image/jpeg", quality);
}

async function pngToPdf(pngDataUrl, widthPx = 320, heightPx = widthPx, filename = "qr.pdf") {
  const { jsPDF } = window.jspdf;
  const ptW = widthPx * 0.75;
  const ptH = heightPx * 0.75;
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [ptW, ptH] });
  pdf.addImage(pngDataUrl, "PNG", 0, 0, ptW, ptH);
  pdf.save(filename);
}

/* =========================
   app.js (inlined)
   ========================= */

(function main() {
  const start = () => {
    const typeGrid = document.getElementById("typeGrid");
    const typeFields = document.getElementById("typeFields");
    const activeTypeTitle = document.getElementById("activeTypeTitle");
    const activeTypeDesc = document.getElementById("activeTypeDesc");
    const encodedSummary = document.getElementById("encodedSummary");
    const qrMount = document.getElementById("qrMount");

    const colorPicker = document.getElementById("colorPicker");
    const colorHex = document.getElementById("colorHex");
    const bgColorPicker = document.getElementById("bgColorPicker");
    const bgColorHex = document.getElementById("bgColorHex");
    const size = document.getElementById("size");
    const sizeLabel = document.getElementById("sizeLabel");

    const btnReset = document.getElementById("btnReset");
    const dlPng = document.getElementById("dlPng");
    const dlJpg = document.getElementById("dlJpg");
    const dlSvg = document.getElementById("dlSvg");
    const dlPdf = document.getElementById("dlPdf");

    if (!typeGrid || !typeFields || !activeTypeTitle || !activeTypeDesc || !qrMount) {
      console.error("Missing required DOM nodes. Ensure bundle.js is loaded after HTML.");
      return;
    }

    const qrWrap = qrMount.parentElement || qrMount;
    /* =========================
       PREVIEW PLACEHOLDER (ANIMATION)
       ========================= */
    const qrPlaceholder = document.createElement("div");
    qrPlaceholder.className = "qrPlaceholder";
    qrPlaceholder.setAttribute("aria-hidden", "true");
    qrPlaceholder.innerHTML = `
      <div class="sparkles" aria-hidden="true">
        <span class="sparkle"></span>
        <span class="sparkle"></span>
        <span class="sparkle"></span>
        <span class="sparkle"></span>
        <span class="sparkle"></span>
        <span class="sparkle"></span>
      </div>
      <div class="qrFrame" aria-hidden="true">
        <div class="qrGrid"></div>
        <div class="scanGlow"></div>
        <div class="scanLine"></div>
      </div>
    `;

    qrWrap.style.position = "relative";
    qrMount.style.position = "relative";
    qrMount.style.zIndex = "2";

    qrPlaceholder.style.position = "absolute";
    qrPlaceholder.style.inset = "0";
    qrPlaceholder.style.display = "grid";
    qrPlaceholder.style.placeItems = "center";
    qrPlaceholder.style.pointerEvents = "none";
    qrPlaceholder.style.zIndex = "1";

    qrWrap.insertBefore(qrPlaceholder, qrMount);


    function getVisibleRequiredEls() {
      const root = typeFields || document;
      const els = Array.from(root.querySelectorAll("input[required], textarea[required]"));
      return els.filter(el => !el.disabled && el.offsetParent !== null);
    }


    function hidePreview() {
      qrMount.style.visibility = "hidden";
      if (typeof qrPlaceholder !== "undefined") qrPlaceholder.style.visibility = "visible";
      qrWrap.querySelector(".qr-caption-wrap")?.remove();
      lastState = null;
      setEncodedSummary("");
    }

    function showPreview() {
      qrMount.style.visibility = "visible";
      if (typeof qrPlaceholder !== "undefined") qrPlaceholder.style.visibility = "hidden";
    }


    function validateRequiredOnDownload() {
      const requiredEls = getVisibleRequiredEls();
      let ok = true;

      for (const el of requiredEls) {
        const v = String(el.value || "").trim();
        if (!v) {
          el.classList.add("input-error");
          el.value = "";
          el.placeholder = "Required";
          ok = false;
        } else {
          el.classList.remove("input-error");
        }
      }

      if (!ok) hidePreview();
      return ok;
    }

    document.addEventListener("input", (ev) => {
      const el = ev.target;
      if (el && el.classList && el.classList.contains("input-error")) {
        el.classList.remove("input-error");
      }
    });

    let activeTypeId = "website";
    const PREVIEW_PX = PREVIEW_BASE_PX;

    function getExportMarginPx(sizePx) {
      return Math.max(16, Math.min(120, Math.round(sizePx * 0.05)));
    }

    function getBgHex() {
      return clampHexWithDefault(bgColorHex?.value, "#FFFFFF");
    }

    let lastState = {
      data: "",
      hex: (colorHex?.value || "#000000"),
    };

    function getTypeFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get("type");
    }

    function makeHiddenMount() {
      const m = document.createElement("div");
      m.style.position = "fixed";
      m.style.left = "-100000px";
      m.style.top = "0";
      m.style.width = "1px";
      m.style.height = "1px";
      m.style.overflow = "hidden";
      document.body.appendChild(m);
      return m;
    }

    function buildTempQr(sizePx) {
      return new window.QRCodeStyling({
        width: sizePx,
        height: sizePx,
        type: "svg",
        data: lastState.data,
        margin: getExportMarginPx(sizePx),
        qrOptions: { errorCorrectionLevel: "M" },
        dotsOptions: { type: "square", color: lastState.hex },
        backgroundOptions: { color: getBgHex() },
      });
    }

    async function withTempQr(sizePx, fn) {
      const mount = makeHiddenMount();
      const tmp = buildTempQr(sizePx);
      tmp.append(mount);
      try {
        return await fn(tmp);
      } finally {
        mount.remove();
      }
    }

    // Preview QR
    const qr = new window.QRCodeStyling({
      width: PREVIEW_PX,
      height: PREVIEW_PX,
      type: "svg",
      data: "",
      margin: 0,
      qrOptions: { errorCorrectionLevel: "M" },
      dotsOptions: { type: "square", color: (colorHex?.value || "#000000") },
      backgroundOptions: { color: getBgHex() },
    });

    qr.append(qrMount);
    qrMount.style.backgroundColor = getBgHex();
    hidePreview();

    /* =========================
       CAPTION PREVIEW (FULL-WIDTH, MATCH EXPORT)
       ========================= */

    function renderCaptionPreview() {
      qrWrap.querySelector(".qr-caption-wrap")?.remove();

      const cap = getCaptionSettings();
      if (!cap.text) return;

      const wrap = document.createElement("div");
      wrap.className = "qr-caption-wrap";
      wrap.style.width = qrMount.clientWidth + "px";
      wrap.style.boxSizing = "border-box";
      wrap.style.margin = "0 auto";
      wrap.style.textAlign = "center";

      // Caption itself
      const el = document.createElement("div");
      el.className = "qr-caption";
      el.style.width = "100%";
      el.style.boxSizing = "border-box";
      el.style.textAlign = "center";
      el.style.color = cap.color;
      el.style.fontFamily = captionFontFamily(cap.font);
      el.style.fontSize = CAPTION_PREVIEW_FONT_PX + "px";
      el.style.lineHeight = String(CAPTION_PREVIEW_LINE_H);

      if (cap.bg) {
        el.style.background = cap.bg;
        el.style.padding = `${CAPTION_PREVIEW_PAD_Y}px ${CAPTION_PREVIEW_PAD_X}px`;
        el.style.borderRadius = "0";
      } else {
        el.style.padding = "0";
      }

      el.textContent = cap.text;

      wrap.appendChild(el);
      qrWrap.appendChild(wrap);
    }

    function setEncodedSummary(data) {
      if (!encodedSummary) return;
      const s = (data || "").toString();
      encodedSummary.textContent = s.length > 46 ? (s.slice(0, 46) + "…") : s;
    }

    // --- Location search + map preview ---
    let nominatimAbort = null;
    let nominatimTimer = null;

    function setLocationUiStatus(msg, isError) {
      const el = document.getElementById("locationStatus");
      if (!el) return;
      el.textContent = msg || "";
      el.style.color = isError ? "#ff4d4f" : "";
    }

    function renderLocationResults(items) {
      const box = document.getElementById("locationResults");
      if (!box) return;

      if (!items || !items.length) {
        box.innerHTML = "";
        return;
      }

      box.innerHTML = items.map((it, idx) => {
        const name = (it.display_name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const lat = it.lat;
        const lon = it.lon;
        return `
          <button type="button" class="prefooter__link" data-idx="${idx}" style="justify-content:flex-start;">
            ${name}
            <span class="muted small" style="margin-left:0px;">(${lat}, ${lon})</span>
          </button>
        `;
      }).join("");

      box.querySelectorAll("button[data-idx]").forEach(btn => {
        btn.addEventListener("click", () => {
          const i = Number(btn.getAttribute("data-idx"));
          const it = items[i];
          if (!it) return;

          const latEl = document.getElementById("field_lat");
          const lonEl = document.getElementById("field_lon");
          const searchEl = document.getElementById("field_search");

          if (latEl) latEl.value = String(it.lat || "").trim();
          if (lonEl) lonEl.value = String(it.lon || "").trim();
          if (searchEl && it.display_name) searchEl.value = String(it.display_name).trim();

          setLocationUiStatus("");
          updateQr(true);
        });
      });
    }

    async function nominatimSearch(query) {
      const q = String(query || "").trim();
      if (q.length < 3) {
        setLocationUiStatus("Type at least 3 characters to search.", true);
        renderLocationResults([]);
        return;
      }

      if (nominatimAbort) {
        try { nominatimAbort.abort(); } catch { }
      }
      nominatimAbort = new AbortController();

      setLocationUiStatus("Searching…", false);

      const url =
        "https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=" +
        encodeRFC3986(q);

      try {
        const res = await fetch(url, { signal: nominatimAbort.signal, headers: { "Accept": "application/json" } });
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        renderLocationResults(data || []);
        if (!data || !data.length) setLocationUiStatus("No results found. Try a different query.", true);
        else setLocationUiStatus("Select a result to fill coordinates.", false);
      } catch (e) {
        if (e && e.name === "AbortError") return;
        setLocationUiStatus("Search is temporarily unavailable.", true);
        renderLocationResults([]);
      }
    }

    function updateLocationPreview(values) {
      const preview = document.getElementById("locationPreview");
      if (!preview) return;

      const lat = clampLat((values.lat || "").trim());
      const lon = clampLon((values.lon || "").trim());

      if (lat === null || lon === null) {
        preview.innerHTML = `<div class="hint">Search and select a result, or enter Latitude and Longitude to preview the map.</div>`;
        return;
      }

      const bbox = [lon - 0.01, lat - 0.01, lon + 0.01, lat + 0.01]
        .map(n => Number(n).toFixed(6))
        .join("%2C");

      const embedUrl =
        `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

      preview.innerHTML = `
        <iframe
          title="OpenStreetMap preview"
          src="${embedUrl}"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          style="width:100%;height:260px;border:1px solid rgba(255,255,255,0.12);border-radius:16px;background:rgba(255,255,255,0.04);"
        ></iframe>
        <div class="hint" style="margin-top:8px;">
          Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>
        </div>
      `;
    }

    const typeFromUrl = getTypeFromUrl();
    if (typeFromUrl && QR_TYPES.some(t => t.id === typeFromUrl)) {
      activeTypeId = typeFromUrl;
    }

    function renderMenu() {
      typeGrid.innerHTML = "";
      for (const t of QR_TYPES) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "card";
        card.setAttribute("aria-selected", String(t.id === activeTypeId));

        card.innerHTML = `
          <div class="icon" aria-hidden="true">${t.icon}</div>
          <div>
            <div class="card__title">${t.title}</div>
            <div class="card__desc">${t.desc}</div>
          </div>
        `;

        card.addEventListener("click", () => {
          activeTypeId = t.id;
          renderMenu();
          renderFields();
          updateQr(true);
          document.getElementById("generator")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        typeGrid.appendChild(card);
      }
    }

    function readValues() {
      const t = QR_TYPES.find(x => x.id === activeTypeId);
      const values = {};
      for (const f of (t?.fields() || [])) {
        const el = document.getElementById(`field_${f.id}`);
        values[f.id] = el ? el.value : "";
      }

      if (activeTypeId === "website") {
        values.url = document.getElementById("websiteUrl")?.value || values.url || "";
      }

      return values;
    }

    function renderFields() {
      const t = QR_TYPES.find(x => x.id === activeTypeId) || QR_TYPES[0];
      activeTypeTitle.textContent = t.title;
      activeTypeDesc.textContent = t.desc;

      const fields = t.fields();
      typeFields.innerHTML = "";

      const grid = document.createElement("div");
      grid.className = (activeTypeId === "vcard") ? "formGrid" : "formStack";
      typeFields.appendChild(grid);

      for (const f of fields) {
        const wrap = document.createElement("div");
        wrap.className = "field";

        const label = document.createElement("label");
        label.textContent = f.label + (f.required ? " *" : "");
        wrap.appendChild(label);

        let input;
        if (f.type === "textarea") {
          input = document.createElement("textarea");
          input.placeholder = f.placeholder || "";
        } else if (f.type === "select") {
          input = document.createElement("select");
          for (const opt of (f.options || [])) {
            const o = document.createElement("option");
            o.value = opt;
            o.textContent = opt || (f.id === "country" ? "Select country" : "Select");
            if (!opt) o.disabled = true;
            input.appendChild(o);
          }
        } else {
          input = document.createElement("input");
          input.type = f.type || "text";
          input.placeholder = f.placeholder || "";
        }

        input.id = `field_${f.id}`;
        if (f.required) input.required = true;

        input.addEventListener("input", () => updateQr(false));
        wrap.appendChild(input);
        grid.appendChild(wrap);
      }

      if (activeTypeId === "location") {
        const searchEl = document.getElementById("field_search");
        if (searchEl) {
          const actions = document.createElement("div");
          actions.className = "actions";
          actions.style.marginTop = "6px";

          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "btn btn--small";
          btn.textContent = "Search";
          btn.addEventListener("click", () => nominatimSearch(searchEl.value));

          const hint = document.createElement("span");
          hint.className = "hint";
          hint.id = "locationStatus";
          hint.style.marginLeft = "8px";

          actions.appendChild(btn);
          actions.appendChild(hint);

          const fieldWrap = searchEl.closest(".field");
          if (fieldWrap) fieldWrap.appendChild(actions);

          searchEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              nominatimSearch(searchEl.value);
            }
          });

          searchEl.addEventListener("input", () => {
            clearTimeout(nominatimTimer);
            nominatimTimer = setTimeout(() => {
              const q = String(searchEl.value || "").trim();
              if (q.length >= 3) nominatimSearch(q);
              else {
                setLocationUiStatus("");
                renderLocationResults([]);
              }
            }, 500);
          });
        }

        const results = document.createElement("div");
        results.id = "locationResults";
        results.style.display = "grid";
        results.style.gap = "10px";
        results.style.marginTop = "10px";
        typeFields.appendChild(results);

        const mapWrap = document.createElement("div");
        mapWrap.className = "locationMap";
        mapWrap.style.marginTop = "12px";
        mapWrap.innerHTML = `<div id="locationPreview"></div>`;
        typeFields.appendChild(mapWrap);
      }

      // defaults
      const preset = {
        website: { url: "" },
        text: { text: "" },
        wifi: { ssid: "", security: "", password: "" },
        email: { to: "", subject: "", body: "" },
        phone: { number: "" },
        whatsapp: { number: "" },
        location: { search: "", lat: "", lon: "" },
        vcard: {
          name: "",
          org: "",
          dept: "",
          title: "",
          phone: "",
          email: "",
          url: "",
          street: "",
          city: "",
          region: "",
          postal: "",
          country: "",
        },
      };

      const defaults = preset[activeTypeId];
      if (defaults) {
        for (const [k, v] of Object.entries(defaults)) {
          const el = document.getElementById(`field_${k}`);
          if (el) el.value = v;
        }
        if (activeTypeId === "website") {
          const w = document.getElementById("websiteUrl");
          if (w && defaults.url) w.value = defaults.url;
        }
      }

      if (activeTypeId === "location") {
        setLocationUiStatus("Select a result to fill coordinates.", false);
        updateLocationPreview(readValues());
      }
    }

    function updateQr(force = false) {
      const t = QR_TYPES.find(x => x.id === activeTypeId);
      if (!t) return;

      const hex = clampHex(colorHex?.value);
      if (colorHex) colorHex.value = hex;
      if (colorPicker) colorPicker.value = hex;

      const bgHex = getBgHex();
      if (bgColorHex) bgColorHex.value = bgHex;
      if (bgColorPicker) bgColorPicker.value = bgHex;

      qrMount.style.backgroundColor = bgHex;

      const px = Number(size?.value || 320);
      if (sizeLabel) sizeLabel.textContent = `${px}`;

      const values = readValues();
      let built = t.buildPayload(values);

      if (activeTypeId === "website" && built) {
        const normalized = normalizeUrl(built);
        built = normalized;
        if (force) {
          const urlEl = document.getElementById("websiteUrl");
          if (urlEl) urlEl.value = normalized;
        }
      }

      if (activeTypeId === "location") updateLocationPreview(values);

      const requiredEls = getVisibleRequiredEls();
      const allRequiredFilled = requiredEls.every(el => String(el.value || "").trim());
      if (!allRequiredFilled) {
        hidePreview();
        return;
      }

      if (activeTypeId === "location") {
        const root = typeFields || document;
        const valueEls = Array.from(root.querySelectorAll("input, textarea, select"))
          .filter(el => !el.disabled && el.offsetParent !== null);
        const hasAnyValue = valueEls.some(el => String(el.value || "").trim());
        if (!hasAnyValue) {
          hidePreview();
          return;
        }
      }
      showPreview();

      const data = built || lastState?.data || "";
      if (!data) return;

      lastState = { data, hex };

      qr.update({
        data,
        margin: 0,
        dotsOptions: { type: "square", color: lastState.hex },
        backgroundOptions: { color: bgHex },
      });

      setEncodedSummary(built || "");
      renderCaptionPreview();
    }

    function resetAll() {
      if (colorHex) colorHex.value = "#000000";
      if (colorPicker) colorPicker.value = "#000000";
      if (bgColorHex) bgColorHex.value = "#FFFFFF";
      if (bgColorPicker) bgColorPicker.value = "#FFFFFF";
      if (size) size.value = "2000";

      const ct = document.getElementById("captionText");
      const cf = document.getElementById("captionFont");
      const ccPick = document.getElementById("captionColorPicker");
      const ccHex = document.getElementById("captionColor");
      const cbPick = document.getElementById("captionBgPicker");
      const cbHex = document.getElementById("captionBgColor");

      if (ct) ct.value = "";
      if (cf) cf.value = "sans";
      if (ccPick) ccPick.value = "#000000";
      if (ccHex) ccHex.value = "#000000";
      if (cbPick) cbPick.value = "#FFFFFF";
      if (cbHex) cbHex.value = "#FFFFFF";

      qrWrap.querySelector(".qr-caption-wrap")?.remove();

      renderMenu();
      renderFields();
      updateQr(true);
    }

    function safeName() {
      const t = QR_TYPES.find(x => x.id === activeTypeId);
      return (t?.id || "qr") + "-" + Date.now();
    }

    window.LoadPreview = function LoadPreview() {
      updateQr(true);
    };

    /* =========================
       LISTENERS
       ========================= */

    // QR color
    colorPicker?.addEventListener("input", () => {
      if (colorHex) colorHex.value = colorPicker.value.toUpperCase();
      updateQr(false);
    });

    colorHex?.addEventListener("input", () => {
      if (colorHex) colorHex.value = clampHex(colorHex.value);
      if (colorPicker) colorPicker.value = colorHex.value;
      updateQr(false);
    });

    // Background color
    bgColorPicker?.addEventListener("input", () => {
      const bg = clampHexWithDefault(bgColorPicker?.value, "#FFFFFF");
      if (bgColorHex) bgColorHex.value = bg;
      updateQr(false);
    });

    bgColorHex?.addEventListener("input", () => {
      const bg = clampHexWithDefault(bgColorHex?.value, "#FFFFFF");
      if (bgColorHex) bgColorHex.value = bg;
      if (bgColorPicker) bgColorPicker.value = bg;
      updateQr(false);
    });

    size?.addEventListener("input", () => updateQr(false));

    // Website URL static field
    document.getElementById("websiteUrl")?.addEventListener("input", () => updateQr(false));
    document.getElementById("websiteUrl")?.addEventListener("change", () => updateQr(true));

    // Caption listeners
    document.getElementById("captionText")?.addEventListener("input", () => updateQr(false));
    document.getElementById("captionFont")?.addEventListener("change", () => updateQr(false));

    const capColorPicker = document.getElementById("captionColorPicker");
    const capColorHex = document.getElementById("captionColor");

    capColorPicker?.addEventListener("input", () => {
      const v = clampHexWithDefault(capColorPicker.value, "#000000");
      capColorPicker.value = v;
      if (capColorHex) capColorHex.value = v;
      updateQr(false);
    });

    capColorHex?.addEventListener("input", () => {
      const v = clampHexWithDefault(capColorHex.value, "#000000");
      capColorHex.value = v;
      if (capColorPicker) capColorPicker.value = v;
      updateQr(false);
    });

    const capBgPicker = document.getElementById("captionBgPicker");
    const capBgHex = document.getElementById("captionBgColor");

    capBgPicker?.addEventListener("input", () => {
      const v = clampHexWithDefault(capBgPicker.value, "#FFFFFF");
      capBgPicker.value = v;
      if (capBgHex) capBgHex.value = v;
      updateQr(false);
    });

    capBgHex?.addEventListener("input", () => {
      const v = clampHexWithDefault(capBgHex.value, "#FFFFFF");
      capBgHex.value = v;
      if (capBgPicker) capBgPicker.value = v;
      updateQr(false);
    });

    btnReset?.addEventListener("click", resetAll);

    /* =========================
       DOWNLOADS
       ========================= */

    dlPng?.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!validateRequiredOnDownload()) return;
      updateQr(true);
      const px = Number(size?.value || 320);

      const mount = makeHiddenMount();
      const tmp = new window.QRCodeStyling({
        width: px,
        height: px,
        type: "svg",
        data: lastState.data,
        margin: getExportMarginPx(px),
        qrOptions: { errorCorrectionLevel: "M" },
        dotsOptions: { type: "square", color: lastState.hex },
        backgroundOptions: { color: "transparent" },
      });

      tmp.append(mount);
      try {
        const svgBlob = await new Promise((resolve) => tmp.getRawData("svg").then(resolve));
        const svgText = await svgBlob.text();

        const cap = getCaptionSettings();
        const wrapped = buildCaptionedSvg(svgText, px, cap);

        const pngDataUrl = await svgToPngDataUrl(wrapped.svgText, wrapped.width, wrapped.height, "transparent");
        downloadDataUrl(pngDataUrl, `${safeName()}.png`);
      } finally {
        mount.remove();
      }
    });

    dlSvg?.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!validateRequiredOnDownload()) return;
      updateQr(true);
      const px = Number(size?.value || 320);

      const svgBlob = await withTempQr(px, async (tmp) =>
        new Promise((resolve) => tmp.getRawData("svg").then(resolve))
      );
      const svgText = await svgBlob.text();

      const cap = getCaptionSettings();
      const wrapped = buildCaptionedSvg(svgText, px, cap);

      downloadDataUrl(
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(wrapped.svgText),
        `${safeName()}.svg`
      );
    });

    dlJpg?.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!validateRequiredOnDownload()) return;
      updateQr(true);
      const px = Number(size?.value || 320);

      const svgBlob = await withTempQr(px, async (tmp) =>
        new Promise((resolve) => tmp.getRawData("svg").then(resolve))
      );
      const svgText = await svgBlob.text();

      const cap = getCaptionSettings();
      const wrapped = buildCaptionedSvg(svgText, px, cap);

      const pngDataUrl = await svgToPngDataUrl(wrapped.svgText, wrapped.width, wrapped.height, "transparent");
      const jpgDataUrl = await pngToJpgDataUrl(pngDataUrl, wrapped.width, wrapped.height, getBgHex());

      downloadDataUrl(jpgDataUrl, `${safeName()}.jpg`);
    });

    dlPdf?.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!validateRequiredOnDownload()) return;
      updateQr(true);

      const desiredPx = Number(size?.value || 320);

      const genPx = Math.min(desiredPx, 384);
      const scaleUp = desiredPx / genPx;

      const svgBlob = await withTempQr(genPx, async (tmp) =>
        new Promise((resolve) => tmp.getRawData("svg").then(resolve))
      );
      const svgText = await svgBlob.text();

      const cap = getCaptionSettings();
      const wrapped = buildCaptionedSvg(svgText, genPx, cap);

      try {
        const { jsPDF } = window.jspdf || {};
        if (!jsPDF) throw new Error("jsPDF not available on window.jspdf");

        const svg2pdfFn =
          (window.svg2pdf && window.svg2pdf.svg2pdf) ||
          window.svg2pdf;

        if (typeof svg2pdfFn !== "function") {
          throw new Error("svg2pdf.js not loaded");
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(wrapped.svgText, "image/svg+xml");
        const svgEl = doc.documentElement;
        if (!svgEl.getAttribute("xmlns")) {
          svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        }

        const pxToPt = 72 / 96; // 0.75
        const pdfScale = pxToPt * scaleUp;

        const ptW = wrapped.width * pdfScale;
        const ptH = wrapped.height * pdfScale;

        const pdf = new jsPDF({
          orientation: ptW >= ptH ? "landscape" : "portrait",
          unit: "pt",
          format: [ptW, ptH],
          compress: true,
        });

        await svg2pdfFn(svgEl, pdf, {
          xOffset: 0,
          yOffset: 0,
          scale: pdfScale,
        });

        pdf.save(`${safeName()}.pdf`);
        return;
      } catch (err) {
        console.warn("Vector PDF export failed; using raster fallback:", err);
      }

      const pngDataUrl = await svgToPngDataUrl(
        wrapped.svgText,
        wrapped.width,
        wrapped.height,
        getBgHex()
      );
      await pngToPdf(
        pngDataUrl,
        wrapped.width * scaleUp,
        wrapped.height * scaleUp,
        `${safeName()}.pdf`
      );
    });

    // init
    if (typeFromUrl) {
      history.replaceState(null, "", "./index.html#generator");
    }

    renderMenu();
    renderFields();
    updateQr(true);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();