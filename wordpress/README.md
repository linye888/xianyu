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

- English UI, PHP currency, GCash / Maya wallets
- Back button (top left): returns to `https://linbury.kinsta.cloud/shop/`
- Confirm shows **Withdrawal successful** toast
- Styles scoped under `.payment-page` to reduce theme conflicts
- Full-page layout (no theme header/footer on this template)

## Notes

- Use a **child theme** so theme updates do not remove the file.
- If your theme still shows header/footer, switch to a blank/full-width page template in theme settings, or hide header via theme options.
