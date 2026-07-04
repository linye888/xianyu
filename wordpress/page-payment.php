<?php
/**
 * Template Name: Payment Form
 * Description: Mobile payment and withdrawal form (PHP, GCash, Maya).
 *
 * Install: copy this file to your (child) theme folder, e.g.
 * wp-content/themes/your-child-theme/page-payment.php
 * Then create a Page in WP admin and select template "Payment Form".
 */

if (!defined('ABSPATH')) {
  exit;
}

$payment_back_url = 'https://linbury.kinsta.cloud/shop/';
?>
<!doctype html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php wp_head(); ?>
    <style>
      body.payment-form-page {
        margin: 0 !important;
        min-height: 100vh;
        background: #1a1613 !important;
      }

      body.payment-form-page #page,
      body.payment-form-page .site-content,
      body.payment-form-page .content-area,
      body.payment-form-page .entry-content {
        margin: 0 !important;
        padding: 0 !important;
        max-width: none !important;
      }

      .payment-page {
        --bg: #1a1613;
        --input-bg: #3d3630;
        --input-text: #d8d2cb;
        --label: #f5f0ea;
        --accent: #e6d5b8;
        --accent-dark: #5c4a32;
        --accent-gradient: linear-gradient(180deg, #f0e2c8 0%, #d9c4a0 100%);
        --success: #4caf50;
        --muted: #a39a92;
        --radius-pill: 999px;
        box-sizing: border-box;
        min-height: 100vh;
        background: var(--bg);
        color: var(--label);
        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      .payment-page *,
      .payment-page *::before,
      .payment-page *::after {
        box-sizing: border-box;
      }

      .payment-page .page {
        width: min(100%, 420px);
        margin: 0 auto;
        min-height: 100vh;
        padding: 16px 20px 40px;
      }

      .payment-page .topbar {
        display: flex;
        align-items: center;
        margin-bottom: 18px;
      }

      .payment-page .back-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px 8px 8px;
        border: none;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--label);
        font: inherit;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .payment-page .back-btn:hover {
        background: rgba(255, 255, 255, 0.14);
      }

      .payment-page .back-btn svg {
        width: 18px;
        height: 18px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .payment-page .section-label {
        margin: 0 0 22px;
        font-size: 14px;
        font-weight: 500;
        color: var(--label);
      }

      .payment-page .form {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .payment-page .field {
        position: relative;
      }

      .payment-page .field input,
      .payment-page .field select {
        width: 100%;
        height: 52px;
        padding: 0 44px 0 18px;
        border: none;
        border-radius: var(--radius-pill);
        background: var(--input-bg);
        color: var(--input-text);
        font: inherit;
        font-size: 14px;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
      }

      .payment-page .field input::placeholder {
        color: #9a928a;
      }

      .payment-page .field input:focus,
      .payment-page .field select:focus {
        box-shadow: 0 0 0 2px rgba(230, 213, 184, 0.35);
      }

      .payment-page .field select {
        cursor: pointer;
      }

      .payment-page .field-icon {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        color: #b8afa6;
        pointer-events: none;
      }

      .payment-page .field-icon.clickable {
        pointer-events: auto;
        cursor: pointer;
        border: none;
        background: transparent;
        padding: 0;
        width: 24px;
        height: 24px;
      }

      .payment-page .field-icon.clickable svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .payment-page .field-icon.clickable svg.is-hidden {
        display: none;
      }

      .payment-page .field-icon svg {
        width: 18px;
        height: 18px;
        stroke: currentColor;
        fill: none;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .payment-page .stepper {
        display: flex;
        flex-direction: column;
        gap: 1px;
        width: 14px;
      }

      .payment-page .stepper span {
        display: block;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
      }

      .payment-page .stepper .up {
        border-bottom: 6px solid #b8afa6;
      }

      .payment-page .stepper .down {
        border-top: 6px solid #b8afa6;
      }

      .payment-page .summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 6px;
        padding: 0 4px;
        font-size: 14px;
      }

      .payment-page .summary-label {
        color: var(--muted);
      }

      .payment-page .summary-value {
        color: var(--success);
        font-weight: 700;
      }

      .payment-page .submit {
        width: 100%;
        height: 54px;
        margin-top: 18px;
        border: none;
        border-radius: 16px;
        background: var(--accent-gradient);
        color: var(--accent-dark);
        font: inherit;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }

      .payment-page .submit:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
      }

      .payment-page .submit:active {
        transform: translateY(0);
      }

      .payment-page .toast {
        position: fixed;
        left: 50%;
        bottom: 32px;
        transform: translateX(-50%) translateY(16px);
        min-width: min(100% - 40px, 360px);
        padding: 14px 18px;
        border-radius: 14px;
        background: rgba(76, 175, 80, 0.95);
        color: #fff;
        font-size: 15px;
        font-weight: 600;
        text-align: center;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
        z-index: 100000;
      }

      .payment-page .toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    </style>
  </head>
  <body <?php body_class('payment-form-page'); ?>>
    <?php wp_body_open(); ?>

    <div class="payment-page">
      <main class="page">
        <div class="topbar">
          <button type="button" class="back-btn" id="back-btn" aria-label="Go back">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </button>
        </div>

        <h1 class="section-label">Payment method</h1>

        <form class="form" id="payment-form" action="#" method="post">
          <div class="field">
            <input
              type="number"
              name="amount"
              placeholder="Withdrawal limit range 400-200000"
              min="400"
              max="200000"
              step="1"
            />
            <span class="field-icon" aria-hidden="true">
              <span class="stepper">
                <span class="up"></span>
                <span class="down"></span>
              </span>
            </span>
          </div>

          <div class="field">
            <select name="provider" aria-label="Payment provider">
              <option value="gcash" selected>GCash</option>
              <option value="maya">Maya</option>
            </select>
            <span class="field-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </div>

          <div class="field">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value=""
              autocomplete="off"
            />
          </div>

          <div class="field">
            <input
              type="text"
              name="wallet_number"
              placeholder="Wallet number"
              value=""
              inputmode="numeric"
              autocomplete="off"
            />
          </div>

          <div class="field">
            <input
              id="security-password"
              type="password"
              name="security_password"
              placeholder="Security password"
            />
            <button
              type="button"
              class="field-icon clickable"
              id="toggle-password"
              aria-label="Show password"
            >
              <svg id="eye-open" viewBox="0 0 24 24">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg id="eye-closed" class="is-hidden" viewBox="0 0 24 24">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>

          <div class="summary">
            <span class="summary-label">Received</span>
            <span class="summary-value" id="received-amount">0 PHP</span>
          </div>

          <button type="submit" class="submit">Confirm</button>
        </form>
      </main>

      <div class="toast" id="success-toast" role="status" aria-live="polite">Withdrawal successful</div>
    </div>

    <script>
      (function () {
        const backUrl = <?php echo wp_json_encode($payment_back_url); ?>;
        const backBtn = document.getElementById("back-btn");
        const paymentForm = document.getElementById("payment-form");
        const successToast = document.getElementById("success-toast");
        const passwordInput = document.getElementById("security-password");
        const toggleButton = document.getElementById("toggle-password");
        const eyeOpen = document.getElementById("eye-open");
        const eyeClosed = document.getElementById("eye-closed");
        const amountInput = document.querySelector('input[name="amount"]');
        const receivedAmount = document.getElementById("received-amount");

        backBtn.addEventListener("click", function () {
          window.location.href = backUrl;
        });

        toggleButton.addEventListener("click", function () {
          const isHidden = passwordInput.type === "password";
          passwordInput.type = isHidden ? "text" : "password";
          eyeOpen.classList.toggle("is-hidden", !isHidden);
          eyeClosed.classList.toggle("is-hidden", isHidden);
          toggleButton.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
        });

        amountInput.addEventListener("input", function () {
          const value = Number(amountInput.value);
          receivedAmount.textContent = Number.isFinite(value) && value > 0 ? value + " PHP" : "0 PHP";
        });

        paymentForm.addEventListener("submit", function (event) {
          event.preventDefault();
          successToast.classList.add("show");
          window.setTimeout(function () {
            successToast.classList.remove("show");
          }, 2500);
        });
      })();
    </script>

    <?php wp_footer(); ?>
  </body>
</html>
