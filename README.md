# LLH — Developer & Builder

A bilingual personal portfolio for LLH, focused on software engineering, AI agent systems, backend engineering, and product building.

## Design direction

- Hybrid visual identity: editorial typography and calm surfaces with a dark, animated systems illustration.
- Chinese / English language toggle.
- Light / dark theme toggle, persisted locally.
- Responsive navigation and project cards.
- Project category filters and accessible case-study dialogs.
- Scroll progress, active section navigation, reveal transitions, and reduced-motion support.
- No framework or build step; the site is static HTML, CSS, and JavaScript.

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Deploy with GitHub Pages

The repository includes `.github/workflows/deploy.yml`.

1. Open **Settings → Pages** in this repository.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main`, or run **Deploy personal website to GitHub Pages** manually from the Actions tab.
4. The expected site URL is <https://rainhotel.github.io/LLH_Personal_WebSite/>.

## Content accuracy and privacy

- CampusBites is described from its project documentation and current product work. Private repositories are not linked.
- WeChatOAM's stack is based on its `pom.xml`; the repository is private, so implementation details are summarized.
- Xpert contributions link directly to selected merged pull requests.
- SIEM Agent and Browser Agent are professional-experience summaries only. No employer source code, internal architecture, credentials, or sensitive operational data is published.
- Studio work is described at a category level; client names and private deployments are not exposed.
