/** Indonesian DANA PIN verification popup — 1:1 mobile recreation */

const DANA_BLUE = "#008CEB";
const DANA_BLUE_DARK = "#0070C9";

/** Official DANA wordmark (Wikimedia Commons Logo_dana_blue.svg), inlined as data URI */
const DANA_LOGO_DATA_URI =
  "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODIgMTA5LjIyIj48ZGVmcz48c3R5bGU+LmNscy0xLC5jbHMtMntmaWxsOiMwMDhjZWI7fS5jbHMtMXtmaWxsLXJ1bGU6ZXZlbm9kZDt9LmNscy0ze2ZpbGw6I2ZlZmVmZTt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPkxvZ29fZGFuYV9ibHVlPC90aXRsZT48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNTEsODIuODRjNy4yNi41MiwxNS43Mi01LjEyLDE4LjctOC4zNCwxMC4zNi0xMS4yMSwxMC42MS0yNy40Mi4xOC0zOS4xNi0zLjg4LTQuMzctMTMtOS4yLTE4Ljc3LTguNTJIMTMwLjIyVjgyLjc3bDIwLjgzLjA3Wk0xNDIsNzAuNzJWMzguODdhNzUsNzUsMCwwLDEsOS44MiwwLDE1LjIyLDE1LjIyLDAsMCwxLDcuMTMsMi43NmMxMiw4LjIsNywyNy43NS03LjMzLDI5LjA2QTcxLjc3LDcxLjc3LDAsMCwxLDE0Miw3MC43MloiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0zMzQuMzksODIuOTRIMzQ2LjNWNzAuODhoMjMuNjNsLjA3LDEyaDExLjkxVjYzYzAtNiwuNS0xMy40OC0xLTE4LjkxYTIzLjYyLDIzLjYyLDAsMCwwLTQ1LjQ5LS4yNWMtMS42LDUuMzYtMS4wNiwxMy4wNS0xLjA2LDE5LDAsNi43Mi0uMDcsMTMuNDgsMCwyMC4yWm0xMS45Mi0yNC4xOWMtLjA3LTUtLjYtMTAuMzUsMS43NS0xNC4yYTExLjYxLDExLjYxLDAsMCwxLDEwLjE1LTUuNzcsMTEuNzksMTEuNzksMCwwLDEsMTAuMDgsNS44MmMyLjMyLDQsMS43Nyw5LDEuNzEsMTQuMTZaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTk4LjE5LDgyLjkzaDExLjg3YzAtMi41Mi0uMzItMTAuMjMuMTEtMTIuMDZoMjMuNTRsLjA4LDEyLjA1aDExLjg5Yy0uMDYtNi42OCwwLTEzLjM1LDAtMjAsMC01LjcuNTMtMTMuODYtMS0xOC45MmEyMy42MywyMy42MywwLDAsMC00NS40OS0uMjNjLTEuNTksNS4yLTEuMDUsMTMuMTUtMS4wNSwxOC45NCwwLDYuNjgtLjE1LDEzLjUzLDAsMjAuMTlabTExLjg4LTI0LjE4Yy0uMDgtNS0uNTktMTAuNDIsMS43Ni0xNC4xOWExMS43MSwxMS43MSwwLDAsMSwyMC4yMywwYzIuMzMsNCwxLjc3LDkuMDgsMS43MywxNC4xN1oiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNjYuNTcsNDguNjcsMjY2LjQsNTdjMCw3LS4zNCwyMC4wNywwLDI1Ljc2aDExLjY0Yy4yNy00LS40Mi0zMi40MS4zMS0zMy4zMiwwLTUuNTIsNS43Ny0xMC42NiwxMS41OS0xMC42OEExMS42MiwxMS42MiwwLDAsMSwyOTguMDYsNDJjMS40OCwxLjM1LDMuNzUsNC40MywzLjcxLDcuNTQuNTQuMzEuMTEsMzAsLjI4LDMzLjI5SDMxMy43bC0uMDktMzMuOTVjLjI5LTIuNjYtMS4zMS02Ljc3LTIuMzQtOC44NUEyMy41NiwyMy41NiwwLDAsMCwyNjksMzkuNjdDMjY4LDQxLjcyLDI2Ni4zMiw0NS45NCwyNjYuNTcsNDguNjdaIi8+PGNpcmNsZSBjbGFzcz0iY2xzLTIiIGN4PSI1NC42MSIgY3k9IjU0LjYxIiByPSI1NC42MSIvPjxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTg2LjQzLDU0Ljg0VjcwLjIxYzAsMS0uNDMsMS4yMS0xLjI3LjcyYTI4LjA4LDI4LjA4LDAsMCwwLTMuNS0xLjc4LDIzLjczLDIzLjczLDAsMCwwLTExLjQ5LTEuNTMsNTUuMDYsNTUuMDYsMCwwLDAtMTIuNDQsMy4xMmMtNCwxLjM1LTcuOTIsMi44MS0xMiwzLjk0YTMzLjQxLDMzLjQxLDAsMCwxLTEwLjQyLDEuMzcsMjIuMTIsMjIuMTIsMCwwLDEtMTEtMy40M0EyLjcxLDIuNzEsMCwwLDEsMjMsNzAuMlEyMyw1NS4xLDIzLDQwYzAtLjQ5LDAtMS4wNy40NC0xLjMycy44OS4xNiwxLjI3LjQxYTIxLDIxLDAsMCwwLDEyLjE1LDMuNkEzMi40LDMyLjQsMCwwLDAsNDUuOTQsNDFjNC4xNi0xLjI5LDguMTgtMywxMi4yNy00LjQ1YTc0LjE0LDc0LjE0LDAsMCwxLDkuNzctMywyMS4yMSwyMS4yMSwwLDAsMSwxNi43MywzLjA5LDMuNjcsMy42NywwLDAsMSwxLjc1LDMuMjdjMCw1LDAsMTAsMCwxNVoiLz48L3N2Zz4=";

export interface DanaPinPopupOptions {
  /** Absolute or path URL for the DANA logo image. Defaults to embedded data URI. */
  logoUrl?: string;
  /** PIN length (DANA uses 6). */
  pinLength?: number;
}

export function renderDanaPinPopup(options: DanaPinPopupOptions = {}): string {
  const logoUrl = options.logoUrl ?? DANA_LOGO_DATA_URI;
  const pinLength = options.pinLength ?? 6;
  const slots = Array.from({ length: pinLength }, (_, i) => i);

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
  <title>Proses Verifikasi — DANA</title>
  <style>
    :root {
      --dana: ${DANA_BLUE};
      --dana-dark: ${DANA_BLUE_DARK};
      --bg: #f2f3f7;
      --text: #343434;
      --muted: #8b8b8b;
      --key-bg: #e8e9ed;
      --key-face: #ffffff;
      --safe-top: env(safe-area-inset-top, 0px);
      --safe-bottom: env(safe-area-inset-bottom, 0px);
    }
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body {
      margin: 0;
      height: 100%;
      background: #000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .phone {
      width: min(100%, 420px);
      margin: 0 auto;
      min-height: 100%;
      min-height: 100dvh;
      background: var(--bg);
      color: var(--text);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    /* Top DANA webview chrome */
    .chrome {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: calc(8px + var(--safe-top)) 14px 8px;
      background: #0b3d66;
      color: #7fd0ff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .chrome-left, .chrome-right {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .chrome svg { width: 14px; height: 14px; fill: currentColor; }

    /* Blue verification header */
    .header {
      display: grid;
      grid-template-columns: 44px 1fr 44px;
      align-items: center;
      background: linear-gradient(180deg, var(--dana) 0%, var(--dana-dark) 100%);
      color: #fff;
      min-height: 52px;
      padding: 0 4px;
    }
    .header .back {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border: 0;
      background: transparent;
      color: #fff;
      cursor: pointer;
      padding: 0;
    }
    .header .back svg { width: 22px; height: 22px; stroke: currentColor; fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
    .header h1 {
      margin: 0;
      text-align: center;
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 0.01em;
    }

    .brand {
      display: flex;
      justify-content: center;
      padding: 18px 16px 6px;
    }
    .brand img {
      height: 28px;
      width: auto;
      display: block;
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10px 24px 12px;
    }
    .prompt {
      margin: 18px 0 28px;
      font-size: 16px;
      font-weight: 600;
      color: #3a3a3a;
      text-align: center;
    }
    .pins {
      display: flex;
      gap: 14px;
      justify-content: center;
      margin-bottom: 28px;
      min-height: 28px;
    }
    .pin-slot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid #c5c7ce;
      background: transparent;
      transition: background .12s ease, border-color .12s ease;
    }
    .pin-slot.filled {
      background: var(--dana);
      border-color: var(--dana);
    }
    .pin-slot.active {
      border-color: var(--dana);
    }
    /* Underscore style matching screenshot dash */
    .pins.dashes .pin-slot {
      width: 22px;
      height: 3px;
      border: 0;
      border-radius: 2px;
      background: #c5c7ce;
      align-self: center;
      box-shadow: none;
    }
    .pins.dashes .pin-slot.active {
      background: var(--dana);
      opacity: 0.55;
    }
    .pins.dashes .pin-slot.filled {
      background: var(--dana);
      opacity: 1;
      height: 3px;
      width: 22px;
      border-radius: 2px;
      position: relative;
    }
    .pins.dashes .pin-slot.filled::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 10px;
      height: 10px;
      margin: -14px 0 0 -5px;
      border-radius: 50%;
      background: var(--dana);
    }
    .forgot {
      border: 0;
      background: transparent;
      color: var(--dana);
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.04em;
      cursor: pointer;
      padding: 8px 12px;
    }

    .keyboard-wrap {
      background: var(--key-bg);
      padding: 6px 6px calc(8px + var(--safe-bottom));
      margin-top: auto;
    }
    .suggest {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px 8px;
      color: #5b5b5b;
      font-size: 13px;
    }
    .suggest .globe {
      width: 18px;
      height: 18px;
      color: #3b82f6;
      flex-shrink: 0;
    }
    .suggest .key-icon {
      margin-left: auto;
      width: 18px;
      height: 18px;
      color: #6b7280;
    }
    .keys {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 7px;
      padding: 0 4px;
    }
    .key {
      height: 48px;
      border: 0;
      border-radius: 8px;
      background: var(--key-face);
      box-shadow: 0 1px 0 rgba(0,0,0,0.08);
      font-size: 22px;
      font-weight: 500;
      color: #111;
      cursor: pointer;
      display: grid;
      place-items: center;
      user-select: none;
    }
    .key:active { background: #dfe1e6; }
    .key.muted {
      background: transparent;
      box-shadow: none;
      color: #444;
      font-size: 16px;
    }
    .key.backspace svg {
      width: 26px;
      height: 26px;
      fill: #333;
    }
    .toast {
      position: absolute;
      left: 50%;
      bottom: 220px;
      transform: translateX(-50%) translateY(8px);
      background: rgba(20,20,20,0.88);
      color: #fff;
      padding: 10px 16px;
      border-radius: 10px;
      font-size: 13px;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s ease, transform .2s ease;
      white-space: nowrap;
      z-index: 20;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  </style>
</head>
<body>
  <div class="phone" id="app">
    <div class="chrome">
      <div class="chrome-left">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z"/></svg>
        DANA PROTECTION
      </div>
      <div class="chrome-right">
        PAY
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9zM5 9h14v2H5V9z"/></svg>
      </div>
    </div>

    <header class="header">
      <button type="button" class="back" id="back-btn" aria-label="Kembali">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <h1>Proses Verifikasi</h1>
      <div></div>
    </header>

    <div class="brand">
      <img src="${logoUrl}" alt="DANA" />
    </div>

    <main class="main">
      <p class="prompt">Masukkan kode PIN</p>
      <div class="pins dashes" id="pins" aria-label="PIN">
        ${slots.map((i) => `<span class="pin-slot${i === 0 ? " active" : ""}" data-i="${i}"></span>`).join("")}
      </div>
      <button type="button" class="forgot" id="forgot-btn">LUPA PIN?</button>
    </main>

    <div class="keyboard-wrap">
      <div class="suggest">
        <svg class="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>
        <span>Sarankan sandi kuat</span>
        <svg class="key-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm5 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-7 4h14v2H5v-2zm14.7-9.3-1.4-1.4L16 9.6V6h-2v4.6l-2.3-2.3-1.4 1.4L14.6 14H7v2h12v-2h-2.6l3.3-3.3z"/></svg>
      </div>
      <div class="keys" id="keys">
        <button type="button" class="key" data-key="1">1</button>
        <button type="button" class="key" data-key="2">2</button>
        <button type="button" class="key" data-key="3">3</button>
        <button type="button" class="key" data-key="4">4</button>
        <button type="button" class="key" data-key="5">5</button>
        <button type="button" class="key" data-key="6">6</button>
        <button type="button" class="key" data-key="7">7</button>
        <button type="button" class="key" data-key="8">8</button>
        <button type="button" class="key" data-key="9">9</button>
        <button type="button" class="key muted" data-key="">* #</button>
        <button type="button" class="key" data-key="0">0</button>
        <button type="button" class="key muted backspace" data-key="back" aria-label="Hapus">
          <svg viewBox="0 0 24 24"><path d="M22 3H7c-.6 0-1.1.3-1.4.8l-5 7.2c-.2.3-.2.7 0 1l5 7.2c.3.5.8.8 1.4.8h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3.7 11.3-1.4 1.4-2.9-2.9-2.9 2.9-1.4-1.4 2.9-2.9-2.9-2.9 1.4-1.4 2.9 2.9 2.9-2.9 1.4 1.4-2.9 2.9 2.9 2.9z"/></svg>
        </button>
      </div>
    </div>

    <div class="toast" id="toast" role="status"></div>
  </div>

  <script>
    (function () {
      const PIN_LEN = ${pinLength};
      const pinsEl = document.getElementById("pins");
      const slots = Array.from(pinsEl.querySelectorAll(".pin-slot"));
      const toast = document.getElementById("toast");
      let value = "";

      function showToast(msg) {
        toast.textContent = msg;
        toast.classList.add("show");
        clearTimeout(showToast._t);
        showToast._t = setTimeout(function () { toast.classList.remove("show"); }, 1800);
      }

      function render() {
        slots.forEach(function (slot, i) {
          slot.classList.toggle("filled", i < value.length);
          slot.classList.toggle("active", i === value.length || (value.length === PIN_LEN && i === PIN_LEN - 1));
        });
      }

      function pushDigit(d) {
        if (value.length >= PIN_LEN) return;
        value += d;
        render();
        if (value.length === PIN_LEN) {
          showToast("PIN diterima");
        }
      }

      function backspace() {
        if (!value.length) return;
        value = value.slice(0, -1);
        render();
      }

      document.getElementById("keys").addEventListener("click", function (e) {
        const btn = e.target.closest("[data-key]");
        if (!btn) return;
        const key = btn.getAttribute("data-key");
        if (key === "back") backspace();
        else if (/^[0-9]$/.test(key)) pushDigit(key);
      });

      document.getElementById("forgot-btn").addEventListener("click", function () {
        showToast("Pulihkan PIN melalui aplikasi DANA");
      });

      document.getElementById("back-btn").addEventListener("click", function () {
        if (window.history.length > 1) window.history.back();
        else showToast("Kembali");
      });

      window.addEventListener("keydown", function (e) {
        if (/^[0-9]$/.test(e.key)) pushDigit(e.key);
        else if (e.key === "Backspace") backspace();
      });

      render();
    })();
  </script>
</body>
</html>`;
}
