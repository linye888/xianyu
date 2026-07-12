# WordPress Payment Form Template

## Files

- `page-payment.php` — WordPress page template (Payment Form)

## Install

1. Copy `page-payment.php` to your **child theme** folder:

   ```
   wp-content/themes/your-child-theme/page-payment.php
   ```

2. WordPress admin → **Pages → Add New**

3. Set title (e.g. `Payment` or `Withdraw`)

4. In the right sidebar → **Template** → select **Payment Form**

5. Click **Publish**

6. Visit the page, e.g. `https://yoursite.com/payment/`

## Features

- Mexican Spanish (es-MX) UI, MXN currency, BBVA / HSBC / Santander / Banorte banks
- Back button (top left): returns to `https://linbury.kinsta.cloud/shop/`
- Confirm shows **Retiro realizado con éxito** toast
- Styles scoped under `.payment-page` to reduce theme conflicts
- Full-page layout (no theme header/footer on this template)

## Notes

- Use a **child theme** so theme updates do not remove the file.
- **Important:** assign the page template **Payment Form** in Page attributes. Do not paste HTML into the page editor, or theme styles will override the dark background.
- Styles load **after** `wp_head()` so they override theme CSS.
- If background is still white, re-upload the latest `page-payment.php` and clear Kinsta/cache plugins.
