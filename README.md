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

The repository includes `.github/workflows/deploy.yml`. The workflow enables GitHub Pages and deploys the static site when changes are pushed to `main`; it can also be run manually from the Actions tab.

Expected URL: <https://rainhotel.github.io/LLH_Personal_WebSite/>.

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