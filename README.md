# LLH — Developer & Builder

A bilingual, evidence-first personal portfolio for LLH, focused on agent engineering, backend systems, and products built for real-world use.

## V2 direction

The portfolio is organized around engineering evidence rather than a technology checklist:

- **Project cases** explain the problem, engineering role, design decisions, and verification boundary.
- **Engineering notes** unpack concrete system flows from CampusBites QQBot, the AI Meal Agent, Xpert plugin architecture, and WeChatOAM file processing.
- **Open source** links to 8 verified merged Xpert pull requests.
- **Professional experience** summarizes SIEM Agent and Browser Agent work without publishing employer source code or confidential implementation.
- **Evidence and privacy** are explicit: private repositories are summarized without credentials, user data, client information, or invented performance metrics.

## Design and interaction

- Hybrid visual identity: editorial typography, technical diagrams, calm surfaces, and a dark animated systems illustration.
- Chinese / English language toggle and light / dark theme toggle (both persisted locally).
- Responsive navigation, project category filters, and bilingual case-study dialogs.
- Scroll progress, active section navigation, reveal transitions, and reduced-motion support.
- Static HTML, CSS, and JavaScript; no framework, package install, or bundler required.

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Validation and deployment

GitHub Actions runs the static-site validator and JavaScript syntax check before deploying to GitHub Pages. The workflow uses the official Pages deployment actions and least-privilege job permissions.

Expected URL: <https://rainhotel.github.io/LLH_Personal_WebSite/>.

## Content accuracy and privacy

- CampusBites and WeChatOAM details are based on connected repository code, module documentation, and implementation records. The repositories are private, so no private source links are exposed.
- Xpert contributions link directly to original pull requests. The page counts only PRs verified as merged.
- SIEM Agent and Browser Agent are professional-experience summaries only. No employer source code, internal architecture, credentials, or sensitive operational data is published.
- Studio work is described at a category level; client names and private deployments are not exposed.
- No performance, user-scale, accuracy, or latency metrics are claimed without a verifiable source.

## Structure

```text
.
├── index.html
├── styles.css
├── script.js
├── scripts/
│   └── validate_site.py
├── assets/
│   ├── favicon.svg
│   └── og-cover.svg
└── .github/workflows/deploy.yml
```
