Design a web application called "Amplify Vantage" — an internal leadership dashboard
that sits on top of an executive search firm's existing delivery platform
("Amplify"), which staffs client projects from a shared pool of departmental
teams. The audience is firm leadership: partners and senior managers who check
this a few times a week to make staffing and resourcing decisions. It is not a
consumer product — favor clarity and density over decoration.

PRODUCT STRUCTURE
Build a persistent left sidebar with four sections, each a distinct module:
1. Control Center (icon: sliders/settings)
2. Projects (icon: folder or briefcase)
3. Utilization Intelligence (icon: activity/pulse)
4. Prediction (icon: radar or compass)

Sidebar behavior: collapsible to icon-only, current section highlighted with a
left accent bar (not a filled pill), each item shows its label at full width by
default. Below the four modules, a divider, then a compact user profile row
(avatar, name, role badge, "Full access" label — there is only one access tier
today, but design the badge so a second role could appear later without
redesigning it).

Top bar (persistent across all modules): a page title on the left that updates
per module, a period selector on the right (e.g. "This week ▾" showing week/
month/quarter options), a search icon, and a notification bell with a small
unread dot. Keep it one row, quiet, no heavy shadow.

DESIGN SYSTEM — DO NOT default to a generic SaaS look (no indigo-to-purple
gradients, no default Material blue, no rounded "friendly" bubble UI). This
product's visual metaphor is a precision instrument panel — the tool a chief
engineer uses to watch a system's vital signs — because leadership is watching
the firm's capacity and delivery health the same way. Carry that idea through
in these exact tokens:

Color — pulled directly from August Leadership's own brand photography (the
deep navy building facade, the "AL" monogram, and the ivory display type), not
an invented palette:
- Ink (primary text, primary buttons, dark surfaces): #16303F — sampled from
  the "AL" monogram, this is the firm's true brand navy
- Slate (secondary navy — secondary buttons, active nav states, chart bars):
  #3E5568 — the mid-tone from the hero photo's gradient
- Paper (app background): #FFFFFF — clean white, matching the site beneath
  the hero banner
- Mist (light surfaces, table stripes, subtle fills): #E4E9EC — a pale tint
  of Slate, not a neutral gray, so quiet surfaces still feel on-brand
- Graphite (secondary text, muted labels): #5B6472
- Hairline (borders, dividers, table rules): #DAD7CF
- Ivory (text and icons on dark Ink/Slate surfaces, e.g. the sidebar):
  #D9E2E8 — sampled from the headline text in the brand photo
- Signal Green (on-track / healthy): #3F7A5D
- Signal Amber (caution / at risk): #B8875A — this warm gold is sampled from
  the sunset glow in the brand photo's right edge, so even the one warm note
  in the product is drawn from the firm's own imagery, not a generic amber
- Signal Red (over capacity / behind plan): #B14A3D
There is deliberately no separate "accent" color for buttons and highlights —
Ink and Slate carry that role, the way the brand itself relies on navy, white,
and typography rather than a bright accent. Surfaces are mostly white/paper
with 1px hairline borders — avoid heavy drop shadows; reserve any shadow for
modals and dropdown menus only.

Typography — this is the signature move, apply it consistently: pair "IBM Plex
Sans" for all UI text, labels, and headings, with "IBM Plex Mono" for every
number that represents a metric (hours, percentages, counts, currency). Numbers
should visually read like instrument-panel readouts — tabular, slightly
technical — distinct from the surrounding sans-serif prose. Set a clear type
scale: page titles 24px/semibold, section headings 16px/semibold, body 14px,
captions/labels 12px/medium with slight letter-spacing and uppercase for
overline labels (e.g. "UTILIZATION THIS WEEK").

Shape & spacing: 8px corner radius on cards and inputs, sharp (0–2px) corners
on tables, 4px base spacing unit, generous internal card padding (20–24px) but
tight row height in dense tables (36–40px) so lots of rows are scannable
without scrolling.

Signature component — build this once, reuse everywhere a percentage or ratio
appears (utilization %, capacity %, project completion %): a circular arc
gauge, not a flat progress bar. Roughly 75% of a circle, stroked in Ink navy
by default, or the matching signal color (green/amber/red) when the number
represents a health status rather than a neutral count, with the number in
IBM Plex Mono centered inside and a small caption below. Use this gauge for
hero metrics; flat horizontal bars are fine for dense table cells where space
is tight.

STATES TO INCLUDE ON EVERY SCREEN YOU BUILD FROM NOW ON
- An empty state (first-use, no data yet) with a short plain-language
  explanation and a clear primary action — never just a blank table.
- A loading state using skeleton placeholders shaped like the real content,
  not a spinner.
- Visible keyboard focus states on every interactive element.

For this first screen, build the Control Center landing view only (we'll go
deeper into it next): a page header "Control Center", four summary tiles
(Projects, Partners, Team Members, Roles — each showing a count in IBM Plex
Mono and a "+ Add" quick action), and leave the rest of the canvas ready for
the detail screens to come.