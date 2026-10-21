# bc-tec-prj-006-fitness-gym-template
Fitness, Gyms & Yoga Studios Unified Template

A responsive, configuration-driven single-page website for fitness businesses. The same code switches from a bold, dark, high-energy gym to a calm, minimalist yoga studio by changing `config.js` only.

| `businessType`      | Also accepted                          | Business                | Default theme                                   |
|---------------------|----------------------------------------|-------------------------|-------------------------------------------------|
| `gym`               | `bodybuilding`, `fitness-gym`          | Gym / bodybuilding      | Charcoal, white text, bold amber, condensed caps |
| `crossfit`          | `crossfit-box`, `crossfit-studio`      | CrossFit box            | Near-black, high-contrast red, sharp corners    |
| `yoga-studio`       | `yoga`                                 | Yoga studio             | Sage green, cream, soft serif, rounded          |
| `pilates`           | `pilates-studio`                       | Pilates studio          | Warm neutrals, soft beige, refined serif        |
| `personal-training` | `pt`, `personal-trainer`               | Personal training       | Professional neutrals, confident orange         |

Built with HTML5, CSS3 and vanilla JavaScript - no frameworks, no build step, no backend.

## Project Structure

```
index.html          Page skeleton (no business-specific content)
config.js           All business data + wording presets per business type
css/variables.css   Design tokens and the theme for each business type
css/base.css        Reset, typography, buttons, chips, focus and reduced-motion styles
css/style.css       Header, hero, timetable, trainers, pricing, FAQ, contact and modal layouts
js/main.js          Theme, dynamic rendering, timetable filters, FAQ accordion, mobile navigation
js/membership.js    Free-trial / membership / class inquiry form, validation, WhatsApp / email
```

## Run Locally

No installation needed.

- Open `index.html` directly in a browser, **or**
- Use the VS Code **Live Server** extension, **or**
- Run `npx serve .` in this folder and open the printed URL.

To view on a phone on the same Wi-Fi, run `npx serve -l 5500` and open `http://<your-PC-IP>:5500` on the phone.

## Configure a New Business

Edit **only** the `fitnessConfig` object in `config.js`:

1. **`businessType`** - one of the types above. Sets the theme, icon, headings and team wording (Trainers / Coaches / Instructors).
2. **Branding** - `brandName`, `tagline`, `description`, `logo` (optional image path/URL).
3. **`contact`** - `phone`, `whatsapp` (country code + number, digits only), `email`, `address`, `mapLink`.
4. **`social`** - `{ platform, url }` items. Empty URLs are hidden.
5. **`operatingHours`** - e.g. `{ day: "Saturday", hours: "8:00 AM - 1:00 PM" }`, or `{ day: "Sunday", closed: true }`.
6. **`hero`** - `headline`, `description`, optional `image` and `video`. The image is also the video poster. Video is skipped for visitors who prefer reduced motion.
7. **`schedule`** - `day`, `time`, `title`, and optional `category`, `duration`, `instructor`, `level`, `spots` (places left; `0` shows "Class full"). Day, class-type and instructor filters are generated automatically.
8. **`trainers`** - `name`, `role`, and optional `specialties`, `qualifications`, `experience`, `image`, `bio`.
9. **`pricingPlans`** - `name`, `price`, `billing`, `features`, optional `badge`, `highlighted: true`, `ctaLabel`.
10. **`about`** - title, paragraphs, `image`, and `differentiators`.
11. **`facilities`**, **`testimonials`** (genuine only - hidden while empty), **`faqs`**.
12. **`booking`** - `methods` (`["whatsapp"]`, `["email"]` or both), `freeTrial`, `requireEmail`, button labels and `pricingNote`.

### Optional overrides

- **`theme.preset`** - use another type's theme (e.g. a yoga studio using the `pilates` look).
- **`theme.colors`** - override `primary`, `primaryDark`, `background`, `surface`, `text`, `textMuted`, `border`.
- **`theme.headingFont` / `theme.bodyFont`** - custom font stacks.
- **`sections`** - custom headings for Classes, Trainers and Membership.

### Images

All image fields are empty by default and show a styled placeholder (trainers show their initials). To use real photos, add an image folder (e.g. `images/`) and set paths such as `"images/hero.jpg"`, or use full URLs. Keep hero videos short and compressed (ideally under ~5 MB).

### Missing data

Empty optional fields are hidden. Empty `schedule`, `trainers`, `pricingPlans`, `testimonials` or `faqs` hide their section and matching navigation links. Hero stats are calculated from the schedule and trainers - nothing is invented.

## Inquiries, Payments & Bookings

The form sends an **inquiry** only (free trial, membership or class request):

- **WhatsApp** - opens `wa.me` with a pre-filled message the visitor sends themselves.
- **Email** - opens the visitor's email app with a pre-filled message.

Opening the form from a plan or class card preselects that plan or class (and the next date for that class). All values are URL-encoded. The success screen states that no membership is purchased and no place is reserved until the business confirms.

**Online payments, live class availability and confirmed reservations require a backend or third-party booking/payment integration.** The `spots` value in `config.js` is static text, not live availability.

## Privacy

Nothing is stored in browser storage, cookies or logs by this template. Visitors are told that submitting sends their details through WhatsApp or email, which are external services.
