# aassumpcao.github.io

One data file, three outputs:

| Output | Source | Command |
|---|---|---|
| Professional resume (PDF, EN + PT) | `cv/resume.typ` | `make pdf` |
| Academic CV (PDF) | `cv/academic-cv.typ` | `make pdf` |
| Word resume (DOCX, EN + PT) | `scripts/to_markdown.py` + pandoc | `make docx` |
| Website | `site/` (Hugo) | `make site` / `make serve` |

Everything reads **`data/cv.json`**. Edit that file, then rebuild.

The PDFs don't depend on the website. `make pdf` needs only Typst, and the files land in `build/`. Run `make release` to copy dated copies to `../output/` for sending out.

## Changing content

1. **Edit `data/cv.json`.** Each section of the resume, CV and website has its own key:

   | To change… | Edit |
   |---|---|
   | Name, headline, tagline, summary, email, links | `basics` (`label`, `tagline`, `summary`, `profiles`) |
   | Jobs and their bullets | `work` |
   | Consulting projects | `consulting` |
   | Degrees | `education` |
   | Papers | `publications` |
   | Talks | `presentations` |
   | Awards, teaching, software, skills, languages | `awards`, `teaching`, `software`, `skills`, `languages` |
   | Phone number (local builds only) | `data/private.json` |

   To add an item, copy an existing entry in the same list and change its fields. Keep the JSON valid: watch the commas between entries.

2. **Preview.**
   - `make pdf` writes the resume (EN, PT) and the academic CV to `build/`.
   - `make docx` writes the Word resumes to `build/`.
   - `make serve` builds the site and serves it at http://localhost:1313.

3. **Save copies to send out.** `make release` puts dated PDF and DOCX files in `../output/`.

4. **Publish the website.** Run `make deploy`, or `make deploy MSG="Add 2026 talk"` to write your own commit message. It builds everything (same as `make release` plus `make site`), commits all changes, and pushes to `main`. GitHub Actions then rebuilds the site and the public PDFs. If any build step fails, nothing is committed or pushed.

To change how things look rather than what they say:
- PDF layouts: `cv/resume.typ`, `cv/academic-cv.typ`, and `cv/lib.typ` (shared colors and helpers).
- Word styles: `cv/reference.docx`. Open it in Word, change the styles, and save.
- Website: `site/layouts/home.html` (structure) and `site/assets/style.css` (styling).
- Photos: `site/static/images/headshot.jpg` and `site/static/images/background.jpg`.

## Editing `data/cv.json`

- **Translations:** any text can be `"plain string"` or `{"en": "...", "pt": "..."}`. The PT resume skips bullets that have no `pt` text, so it never mixes languages.
- **Tags:** add `"tags": ["cv", "web"]` (any of `resume`, `cv`, `web`) to an entry or bullet to limit where it appears. Untagged items appear everywhere.
- **Private fields:** `data/private.json` (gitignored) holds the phone number. Local `make pdf` / `make docx` include it. CI and `make site` never do.
- **Dates:** `"2022-09"` or `"2022"`, and `"end": null` means Present.

## Setup

```sh
brew install typst hugo pandoc
```

Fonts are bundled in `fonts/` (Lato, OFL) and the CV uses Typst's built-in Libertinus Serif, so local and CI builds look the same.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the public PDFs and the site and deploys them to GitHub Pages. In the repo settings, set Pages → Source to **GitHub Actions**.
