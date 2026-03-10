# Sugarush Premium UI/UX Style Guide

This document serves as the single source of truth for the Sugarush premium design system. The goal of this design language is to build a sleek, human-crafted SaaS application that feels professional, data-centric, and on par with top-tier products like Notion or Stripe.

---

## 🎨 1. Core Principles

1. **Light Theme First:** The default state is a crisp, off-white UI emphasizing data legibility.
2. **Minimalism:** Remove unnecessary graphics, gradients, and chaotic colors. Focus entirely on content and data.
3. **Structured Hierarchy:** Use typography (size, weight, letter-spacing) instead of varying colors to establish importance.
4. **Subtle Depth:** Avoid flat harsh lines where possible. Rely on faint borders and extremely soft drop shadows.

---

## 🖋️ 2. Typography

We exclusively use the **Inter** font family to provide a neutral, universally readable aesthetic.

### Font Weights
- **Regular (400):** Long-form medical text, descriptions, paragraph text.
- **Medium (500):** Default for buttons, list items, card text, sub-labels.
- **Bold (700) / Black (900):** Used strictly for major headers, primary data numerals (`text-[80px]`), and critical alerts.

### System Classes
- **Page Titles:** `text-3xl md:text-5xl font-heading font-black tracking-tight text-slate-900`
- **Card Titles:** `text-lg md:text-xl font-bold text-slate-900`
- **Overlines (Tiny Labels):** `text-[11px] font-bold uppercase tracking-widest text-slate-400`
  *Note: Always use uppercase with heavy letter spacing for these meta-labels.*
- **Body / Descriptions:** `text-[14px] md:text-[15px] font-medium text-slate-500 leading-relaxed`

---

## 🌈 3. Color Palette

Say goodbye to the chaotic teal and gradient scheme. We strictly employ a monochromatic "Slate" foundation for layout, saving semantic colors exclusively for data status.

### The Foundation (Slate)
- **Backgrounds:** 
  - Entire Page Canvas: `bg-slate-50`
  - Cards & Containers: `bg-white`
- **Borders & Dividers:** `border-slate-200`
- **Text:**
  - Primary Headers / Main Metrics: `text-slate-900`
  - Secondary Data / Descriptions / Icons: `text-slate-500`
  - Disabled / Placeholder: `text-slate-300` or `text-slate-400`

### Semantic Feedback (Data Status)
Use these exclusively when data implies a state (e.g., Blood Glucose severity).
- **Good / Safe (Green):** `text-green-600`, `bg-green-50`
- **Warning / Moderate (Orange/Amber):** `text-orange-600`, `bg-orange-50`
- **Critical / Danger (Red):** `text-red-600`, `bg-red-50`
- **Active State / Primary CTA (Black):** `bg-slate-900 text-white`

---

## 📏 4. Spacing & Layout Structure

We adhere to an **8px (0.5rem) grid system**.
All paddings, margins, and gaps should generally fall into multiples of 4 or 8 (e.g., 4px, 8px, 12px, 16px, 24px, 32px, etc).

- **Page Padding:** `p-4 md:p-8`
- **Card Padding:** `p-5 md:p-6`
- **Internal Spacing (Gaps):** `space-y-6` for larger structural gaps, `space-y-2` for tight text locks.

---

## 🧱 5. Component Standards

### Cards
Every widget or data module is a bounded card.
```tsx
<div className="bg-white border border-slate-200 rounded-[20px] shadow-sm p-6">
  {/* Content */}
</div>
```
- **Radius:** Standardize on `rounded-[16px]` or `rounded-[20px]`. Avoid extremely sharp (`rounded-sm`) or extremely round (`rounded-full` for containers bigger than a button).
- **Shadow:** Use `shadow-sm`. Do not use heavy `shadow-lg` unless creating a floating overlay/modal.

### Buttons (`Button.tsx`)
Always use the central `Button` component instead of creating raw `<button>` HTML elements to ensure consistency.

1. **Primary Action:** (Saving logs, Major CTAs)
   - `bg-slate-900 text-white hover:bg-slate-800`
2. **Secondary / Outline:** (Cancel, Filters)
   - `bg-white border border-slate-200 text-slate-600 hover:bg-slate-50`
3. **Ghost:** (Subtle actions, Icon buttons)
   - `text-slate-500 hover:bg-slate-100`
- **Radius:** Standardize button radii to `rounded-[12px]`. Always ensure horizontal padding is generous (`px-5 py-2.5`).

### Inputs & Forms
```tsx
<input 
  className="w-full bg-slate-50 border border-slate-200 rounded-[12px] py-3.5 px-4 focus:bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all font-medium placeholder:text-slate-400"
/>
```
- Inputs should be large and tap-friendly (`py-3.5` or `py-4`).
- Use `bg-slate-50` when idle, and transition to `bg-white` on focus to simulate an elevation/active state.

---

## 💡 6. Future Development Checklist

When adding a new page or feature, ask yourself:
1. **Is there a gradient?** Remove it.
2. **Is it using a custom color?** Convert it to a Tailwind `slate-*` equivalent.
3. **Is the text hard to read?** Ensure it uses `Inter` font, increase font-weight to `Medium` or `Bold`, and verify color contrast against the white background.
4. **Is it floating?** Wrap it in a `bg-white border-slate-200 shadow-sm` card.
5. **Does it feel "AI Generated"?** Introduce whitespace. Add tracking to small label text. Use a softer shadow. Reduce the border opacity.
