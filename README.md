# LLH — Developer & Builder

A bilingual, evidence-first personal portfolio for LLH, focused on founder-led products, agent engineering, backend systems, and software delivery.

## V2 / founder case direction

The portfolio distinguishes product ownership from professional project contributions:

- **CampusBites** has a dedicated founder case study covering the venture thesis, three-sided value model, student / merchant / operations surfaces, business model hypotheses, architecture, and the founder's product + engineering role.
- **Engineering notes** unpack concrete system flows from CampusBites QQBot, the AI Meal Agent, Xpert plugin architecture, and WeChatOAM file processing.
- **Open source** links to 8 verified merged Xpert pull requests.
- **Professional experience** summarizes SIEM Agent and Browser Agent work without publishing employer source code or confidential implementation.
- **Evidence and privacy** are explicit: private repositories are summarized without credentials, user data, client information, or invented performance metrics.

## Design and interaction

- Hybrid visual identity: editorial typography, technical diagrams, calm surfaces, and a dark animated systems illustration.
- Chinese / English language toggle and light / dark theme toggle (both persisted locally).
- Responsive navigation, project category filters, bilingual project dialogs, and a dedicated CampusBites case-study page.
- Scroll progress, reveal transitions, and reduced-motion support.
- Static HTML, CSS, and JavaScript; no framework, package install, or bundler required.

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>.

## Validation and deployment

GitHub Actions validates the home page and CampusBites case page, checks JavaScript syntax and whitespace, then deploys the static site to GitHub Pages.

Expected URL: <https://rainhotel.github.io/LLH_Personal_WebSite/>.

## Content accuracy and privacy

- CampusBites and WeChatOAM details are based on connected repository code, module documentation, and implementation records. The repositories are private, so no private source links are exposed.
- CampusBites GitHub activity counts are explicitly scoped to four core repositories and dated; PR merge status is not presented as a production deployment metric.
- CampusBites business-plan prices and revenue forecasts are treated as hypotheses, not realized commercial results. No DAU, GMV, paid-merchant, revenue, retention, signed-campus-contract, or uptime claims are made without verifiable evidence.
- Agent benchmark cases use reproducible synthetic data, not production user data. Test coverage is not represented as online accuracy.
- Xpert contributions link directly to original pull requests. The page counts only PRs verified as merged.
- SIEM Agent and Browser Agent are professional-experience summaries only. No employer source code, internal architecture, credentials, or sensitive operational data is published.
- Studio work is described at a category level; client names and private deployments are not exposed.

## Structure

```text
.
├── index.html
├── campusbites.html
├── styles.css
├── campusbites.css
├── script.js
├── scripts/
│   └── validate_site.py
├── assets/
│   ├── favicon.svg
│   └── og-cover.svg
└── .github/workflows/deploy.yml
```
