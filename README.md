# PearlEdu Landing Page

Static preview of the **PearlEdu school management platform** landing page by
[VoxSign Technologies](https://voxsign.co.ug). Live site:
[pearledu.voxsign.co.ug](https://pearledu.voxsign.co.ug).

This repo holds a standalone static render of the real Blade views
(`landing.pearledu-home` + `layouts.pearledu-landing`) from the main
[VoxSign Institutions](https://github.com/VoxSign-Technologies/VoxSign-Institutions)
Laravel app, so the page can be previewed and hosted without PHP or a database.

## Preview it locally

Requires [Node.js](https://nodejs.org) only. No PHP, no database.

```bash
node preview-server.cjs 8090
# open http://localhost:8090
```

Any static server works too (`npx serve .`, `python -m http.server`, ...).

## Rebuild after editing the real app

`index.html` is generated from the Blade sources. After changing
`resources/views/landing/pearledu-home.blade.php` or
`resources/views/layouts/pearledu-landing.blade.php` in the main repo, run:

```bash
node build-preview.cjs
```

This re-renders the layout, hero, modules, pricing, FAQ, onboard form, and
footer into a fresh `index.html`. Sample pricing cards stand in for the
database-driven plans; forms are demo-only in this static build.

## Deploy (GitHub Pages)

1. Push to `main` (this repo's default branch).
2. Repo Settings > Pages > Deploy from branch > `main` > `/ (root)`.
3. `index.html` takes precedence, so the landing page is served directly.
4. The legacy Laravel `index.php` is kept for reference only and is ignored by
   static hosts.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Generated static landing page (entry point) |
| `images/hero-school-children.jpg` | Hero background photo |
| `images/`, `css/`, `js/`, `models/`, `vendor/` | Static assets copied from Laravel `public/` |
| `build-preview.cjs` | Blade-to-HTML renderer (Node, no deps) |
| `preview-server.cjs` | Tiny local static server (Node, no deps) |
| `index.php`, `.htaccess` | Legacy Laravel entry, kept for reference |

## Copy notes

Page copy uses colons, commas, and periods instead of em dashes.
Browser title: `PearlEdu | School Management Platform by VoxSign`.

## License

Copyright VoxSign Technologies, Uganda. All rights reserved.
