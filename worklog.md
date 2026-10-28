# Worklog

## 2026-10-27

The repo has no commits yet. Everything below is either staged or sitting in the working tree.

### Initial setup (staged)

- One data file, [data/cv.json](data/cv.json), is the source for every output. The phone number lives in [data/private.json](data/private.json), which is gitignored.
- Typst templates: [cv/resume.typ](cv/resume.typ) for the professional resume (EN + PT), [cv/academic-cv.typ](cv/academic-cv.typ) for the academic CV, and [cv/lib.typ](cv/lib.typ) for shared helpers.
- [scripts/to_markdown.py](scripts/to_markdown.py) feeds pandoc to build the Word resumes (EN + PT).
- Hugo site in [site/](site/): `hugo.toml`, `layouts/home.html`, partials `t.html` (translation) and `period.html` (date ranges), plus `assets/style.css`.
- [Makefile](Makefile) targets: `pdf`, `docx`, `all`, `release` (dated copies to `../output/`), `site`, `serve`, `clean`.
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds the public PDFs and the site and deploys them to GitHub Pages on every push to `main`.
- Lato fonts bundled in [fonts/lato/](fonts/lato/) (OFL) so local and CI builds look the same.
- Old LaTeX, Word, LinkedIn and blogdown versions were moved to `../archive/`.

### Content changes ([data/cv.json](data/cv.json))

- New rule: proper nouns are never translated. Non-Brazilian names stay in English and Brazilian names stay in Portuguese. The rule is written into `_conventions.text`.
- Headline now reads "Chief Data Strategist, National Center for State Courts (NCSC)". The PT version keeps the English organization name.
- Removed the Portuguese translations of UNC Chapel Hill (education entries).
- Removed `organizationLocal` (PT organization names) from NCSC, CJIL, Harvard Growth Lab, UNC Chapel Hill and the UK Foreign, Commonwealth & Development Office.
- Consulting: the IDB client is now plain English (the "BID" translation is gone). The Open Knowledge Foundation PT name is now "Open Knowledge Foundation (escritório no Brasil)".

### PDF styling ([cv/](cv/))

- [cv/lib.typ](cv/lib.typ) has a shared palette that matches the website: green `#116b45` / `#1f9d63`, teal `#0e6a85` / `#1a9bb8`, ink `#0a1712`, muted `#3c4a44`, and a green→teal gradient for rules.
- The resume and academic CV both use the shared palette now. Each used to define its own colors: navy for the resume, burgundy for the CV.
- Body text is set in `ink`, links are teal, and section rules plus the CV header line use the green→teal gradient. Resume bullet markers are teal.

### Word output

- Added [cv/reference.docx](cv/reference.docx) as a pandoc reference document so the Word resumes pick up its styles. The `docx` targets in the [Makefile](Makefile) use it and rebuild when it changes. (Not yet staged.)

### Website redesign ([site/](site/))

- Replaced the single-column serif layout with a fixed 300px sidebar. The sidebar has a green→teal gradient, name/ID, section navigation, action buttons and social links, and its gradient fades into the page.
- A faded greyscale background photo ([site/static/images/background.jpg](site/static/images/background.jpg)) sits behind the content. Added [headshot.jpg](site/static/images/headshot.jpg).
- Typography is IBM Plex Sans for body text and IBM Plex Mono for the "code" layer: nav, headings, dates and labels. Section headings are styled `.about`, `.experience`, and so on.
- Sections: about, experience (timeline), consulting, publications, software (cards), talks & awards, education, plus a "Let's talk data and courts." contact panel.
- Light and dark themes with a manual toggle (`data-theme`), on top of `prefers-color-scheme`.
- The sidebar link for the section currently in view is highlighted (IntersectionObserver).
- Public PDFs without the phone number are generated into [site/static/files/](site/static/files/). (Not yet staged.)

### Builds

- Latest local outputs are in `../output/`: `Assumpcao-Resume-2026-10` (PDF, DOCX), `Assumpcao-Curriculo-2026-10` (PDF, DOCX), `Assumpcao-CV-2026-10.pdf`.

### Open items

- Make the first commit. Stage `cv/reference.docx`, and decide whether `site/static/files/` belongs in git, since CI regenerates it.
- In GitHub repo settings, set Pages → Source to **GitHub Actions**.
