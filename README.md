# LLH — Developer & Builder

A bilingual personal portfolio for LLH, focused on software engineering, AI agent systems, backend engineering, and product building.

## Design and interaction

- Hybrid visual identity: editorial typography and calm surfaces with a dark, animated systems illustration.
- Chinese / English language toggle and light / dark theme toggle (both persisted locally).
- Responsive navigation, project category filters, and bilingual case-study dialogs.
- Scroll progress, active section navigation, reveal transitions, and reduced-motion support.
- Static HTML, CSS, and JavaScript; no framework or build step required.

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## GitHub Pages deployment

1. Open **Settings → Pages** in this repository.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main`, or run **Deploy personal website to GitHub Pages** manually from the Actions tab.

Expected URL: <https://rainhotel.github.io/LLH_Personal_WebSite/>.

The workflow uses the official Pages deployment actions and least-privilege job permissions.

Deployment was verified on 2026-11-20. The published site returned a successful GitHub Pages deployment at the expected URL above; subsequent pushes to `main` are configured to trigger deployment automatically.

## Content accuracy and privacy

- CampusBites is described from its project documentation and current product work. Private repositories are not linked.
- WeChatOAM's stack is based on its `pom.xml`; the repository is private, so implementation details are summarized.
- Xpert contributions link directly to selected merged pull requests.
- SIEM Agent and Browser Agent are professional-experience summaries only. No employer source code, internal architecture, credentials, or sensitive operational data is published.
- Studio work is described at a category level; client names and private deployments are not exposed.

## Structure

```text
.
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── favicon.svg
│   └── og-cover.svg
├── .github/workflows/deploy.yml
├── robots.txt
├── sitemap.xml
└── .nojekyll
```
