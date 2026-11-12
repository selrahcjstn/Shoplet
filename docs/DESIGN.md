# Shoplet – Design System & UI Guidelines

Version: 1.0  
Status: Initial Design Standard  
Platform: React + TypeScript + Tailwind CSS

---

# 1. Design Philosophy

Shoplet is a lightweight storefront platform designed for small business owners.

The visual identity should communicate:

- Simplicity
- Trustworthiness
- Professionalism
- Approachability
- Modern commerce

## Design Direction

Use a modern, minimal, warm-neutral aesthetic.

Design inspiration:
- Clean SaaS dashboards
- Modern independent online stores
- Minimal editorial layouts
- Contemporary commerce platforms

Avoid:
- Excessive gradients
- Excessive shadows
- Overly rounded components
- Unnecessary animations
- Cluttered dashboards
- Excessive colors
- Generic template-looking interfaces

The interface should prioritize usability and content over decoration.

# 2. Color Palette

## Primary Colors

| Token | Hex | Usage |
|---|---|---|
| Primary | #176B5B | Primary buttons, links, active states |
| Primary Hover | #14594D | Button hover |
| Primary Dark | #124F45 | Strong emphasis |
| Primary Light | #E8F2EC | Soft backgrounds |
| Brand Ink | #183B35 | Main brand headings |

## Neutral Colors

| Token | Hex | Usage |
|---|---|---|
| Background | #F7F7F2 | Main application background |
| Surface | #FFFFFF | Cards, modals, panels |
| Surface Muted | #F1F3EE | Secondary sections |
| Border | #E5E9E3 | Borders and dividers |
| Border Strong | #D5DDD5 | Input borders |
| Text Primary | #24332E | Main text |
| Text Secondary | #66736D | Secondary text |
| Text Muted | #929D96 | Placeholder and muted text |
| Text Inverse | #FFFFFF | Text on dark backgrounds |

## Accent Colors

| Token | Hex | Usage |
|---|---|---|
| Accent Amber | #E9A23B | Highlights and promotional elements |
| Accent Light | #FFF2D9 | Promotional backgrounds |

Use amber sparingly. Green remains the primary brand color.

## Semantic Colors

| Status | Foreground | Background |
|---|---|---|
| Success | #237A50 | #E8F4EC |
| Warning | #956014 | #FFF2D9 |
| Error | #B94A45 | #FCE8E7 |
| Info | #356A9A | #EAF2FA |

Product availability colors:
- Available: Success
- Out of Stock: Error
- Made to Order: Warning
- Coming Soon: Info

Never rely on color alone to communicate a status. Always include a label.

# 3. Typography

Primary font: Inter

Fallback:
- system-ui
- sans-serif

## Type Scale

| Element | Size | Weight | Line Height |
|---|---:|---:|---:|
| Display | 48px | 700 | 56px |
| H1 | 36px | 700 | 44px |
| H2 | 30px | 600 | 38px |
| H3 | 24px | 600 | 32px |
| H4 | 20px | 600 | 28px |
| Body Large | 18px | 400 | 28px |
| Body | 16px | 400 | 24px |
| Body Small | 14px | 400 | 20px |
| Caption | 12px | 400 | 16px |

Guidelines:
- Use 600–700 weight for headings.
- Use 400 weight for normal body text.
- Avoid excessively large headings in dashboard interfaces.
- Maintain readable line lengths.
- Use consistent typography across all pages.

# 4. Spacing System – 8px Rule

Use an 8px-based spacing system.

| Token | Value | Usage |
|---|---:|---|
| 0 | 0px | No spacing |
| 1 | 4px | Tiny adjustments |
| 2 | 8px | Tight spacing |
| 3 | 12px | Compact spacing |
| 4 | 16px | Standard spacing |
| 5 | 24px | Component spacing |
| 6 | 32px | Section spacing |
| 7 | 40px | Large spacing |
| 8 | 48px | Major spacing |
| 9 | 64px | Page section spacing |
| 10 | 80px | Large page separation |
| 11 | 96px | Hero and major sections |

Guidelines:
- Prefer multiples of 8px.
- Use 4px only for small adjustments.
- Card internal padding: 24px.
- Form field spacing: 16px.
- Section spacing: 32px–48px.
- Page section spacing: 48px–80px.

# 5. Layout Dimensions

## Application Container

| Property | Desktop | Tablet | Mobile |
|---|---:|---:|---:|
| Maximum content width | 1280px | 100% | 100% |
| Horizontal padding | 32px | 24px | 16px |
| Main sidebar | 256px | Collapsible | Hidden |
| Header height | 64px | 64px | 56px |

Use a centered container with a maximum width of 1280px for dashboard content.

## Responsive Breakpoints

| Breakpoint | Width | Description |
|---|---:|---|
| Mobile | 0–639px | Phones |
| Small Tablet | 640–767px | Large phones |
| Tablet | 768–1023px | Tablets |
| Desktop | 1024–1279px | Standard desktops |
| Large Desktop | 1280px+ | Wide screens |

Mobile-first implementation is required.

## Grid System

Product listing:
- Mobile: 2 columns when product cards remain readable; otherwise 1.
- Tablet: 3 columns.
- Desktop: 3–4 columns.

Dashboard:
- Mobile: 1 column.
- Tablet: 2 columns.
- Desktop: 3–4 columns for summary cards.

Use consistent 16px–24px grid gaps.

# 6. Component Dimensions

## Buttons

| Property | Value |
|---|---:|
| Small height | 32px |
| Medium height | 40px |
| Large height | 48px |
| Horizontal padding | 16px–24px |
| Border radius | 8px |

Button types:
- Primary
- Secondary
- Outline
- Ghost
- Destructive

Primary buttons use the Primary color.

## Inputs

| Property | Value |
|---|---:|
| Height | 44px |
| Large input height | 48px |
| Horizontal padding | 12px–16px |
| Border radius | 8px |
| Border width | 1px |

Input guidelines:
- Always provide labels.
- Show clear validation messages.
- Use visible focus states.
- Use placeholders only as examples, not as replacements for labels.

## Cards

| Property | Value |
|---|---:|
| Padding | 24px |
| Border radius | 12px |
| Border | 1px solid Border |
| Background | Surface |

Cards should have subtle borders rather than heavy shadows.

## Modals

| Property | Value |
|---|---:|
| Small width | 400px |
| Medium width | 560px |
| Large width | 720px |
| Maximum width | calc(100vw - 32px) |
| Border radius | 16px |
| Padding | 24px |

## Product Images

| Context | Aspect Ratio |
|---|---|
| Product card | 1:1 |
| Product detail main image | 1:1 |
| Store cover | 16:5 |
| Store logo | 1:1 |
| Promotional banner | 16:9 |

Use object-fit: cover for product images unless the product requires full visibility. For products with white backgrounds or transparent assets, object-fit: contain may be more appropriate.

# 7. Border Radius

| Token | Value | Usage |
|---|---:|---|
| None | 0px | Square elements |
| Small | 4px | Small labels |
| Medium | 8px | Buttons and inputs |
| Large | 12px | Cards |
| XL | 16px | Modals and large panels |
| 2XL | 24px | Large promotional sections |
| Full | 9999px | Pills and avatars |

Avoid using excessive rounded corners everywhere.

# 8. Shadows and Elevation

Use shadows sparingly.

| Level | Shadow |
|---|---|
| None | none |
| Small | 0 1px 2px rgba(24,59,53,0.05) |
| Medium | 0 4px 12px rgba(24,59,53,0.08) |
| Large | 0 12px 32px rgba(24,59,53,0.12) |

Cards should primarily rely on borders and background contrast.

Use larger shadows only for:
- Dropdowns
- Floating menus
- Modals
- Popovers

# 9. Iconography

Use Lucide React icons.

Guidelines:
- Standard icon size: 20px.
- Small icon size: 16px.
- Large icon size: 24px.
- Use consistent stroke widths.
- Default stroke width: 1.75–2px.
- Avoid mixing icon libraries.
- Avoid emojis as interface icons.

# 10. Navigation

## Dashboard Navigation

Desktop:
- Fixed or persistent left sidebar.
- Sidebar width: 256px.
- Header height: 64px.
- Main content should use the remaining width.

Mobile:
- Use a compact header.
- Use a mobile navigation drawer or suitable bottom navigation.
- Keep important actions accessible.

## Public Storefront Navigation

- Minimal header.
- Visible store branding.
- Clear product categories.
- Prominent contact seller action.
- Responsive navigation.
- Avoid unnecessary dashboard-style elements.

# 11. Product and Storefront Design

Product cards should contain:
- Product image.
- Product name.
- Price.
- Availability status.
- Optional category.
- Optional featured indicator.

Storefront pages should prioritize:
1. Business branding.
2. Business description.
3. Contact information.
4. Product categories.
5. Product catalog.
6. Product details.

The public storefront should feel like an actual small business website, not an admin dashboard.

# 12. Interaction and States

Every interactive component must support:

- Default state.
- Hover state.
- Focus state.
- Active state.
- Disabled state.
- Loading state.
- Error state where applicable.

Forms must display:
- Field validation.
- Submission loading.
- Success feedback.
- Error feedback.

Use subtle transitions:
- Duration: 150ms–200ms.
- Prefer opacity, color, and transform transitions.
- Avoid excessive animations.

# 13. Accessibility

- Maintain sufficient text/background contrast.
- Use semantic HTML elements.
- Provide accessible labels for inputs.
- Provide keyboard navigation.
- Show visible keyboard focus.
- Add meaningful alt text to images.
- Do not use color alone for status indicators.
- Use buttons for actions and links for navigation.

# 14. Responsive Design Rules

- Design mobile-first.
- Avoid horizontal overflow.
- Use flexible widths.
- Use responsive grids.
- Keep buttons touch-friendly.
- Use a minimum recommended touch target of 44px.
- Ensure forms remain usable on small screens.
- Make product images responsive.
- Test at mobile, tablet, and desktop widths.

# 15. React and Tailwind Implementation Rules

- Use reusable React components.
- Use TypeScript.
- Use Tailwind CSS utility classes.
- Keep component styling consistent.
- Reuse shared UI components.
- Avoid unnecessary custom CSS.
- Avoid arbitrary spacing values when a design token exists.
- Keep feature-specific components inside their feature folders.
- Use Lucide React for icons.
- Use accessible component patterns.

# 16. AI Design and Development Instructions

When generating or modifying Shoplet UI:

1. Read this DESIGN_SYSTEM.md before implementing any UI.
2. Follow the established colors, typography, spacing, and dimensions.
3. Do not introduce new colors without a clear reason.
4. Do not randomly change the existing design language.
5. Maintain visual consistency between dashboard pages.
6. Maintain visual consistency between public storefront pages.
7. Design mobile-first.
8. Prioritize usability and clarity.
9. Reuse existing components before creating new ones.
10. Avoid unnecessary visual complexity.
11. Do not modify backend logic when the task is only about UI design.
12. If a design decision is not specified, follow the existing design patterns.

The design system is the primary visual reference for the entire Shoplet frontend.

---

End of Design System.