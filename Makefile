# Everything is generated from data/cv.json.
#
#   make pdf        resume (EN, PT) + academic CV  → build/   (no Hugo needed)
#   make docx       Word resume (EN, PT)           → build/   (needs pandoc)
#   make all        pdf + docx
#   make release    copy dated PDFs/DOCX to ../output/ for sending out
#   make site       PDFs (public, no phone) + Hugo site → public/
#   make serve      live-preview the website at http://localhost:1313
#   make deploy     release + site, then commit everything and push to main
#                   (CI publishes the site). Optional: MSG="what changed"
#   make clean
#
# Local builds include data/private.json (phone) when it exists. CI and
# `make site` never do, so the phone number stays off the web.

TYPST  := typst compile --root . --font-path fonts --ignore-system-fonts
DATE   := $(shell date +%Y-%m)
PRIV   := $(if $(wildcard data/private.json),--input private=1,)
DEPS   := data/cv.json cv/lib.typ $(wildcard data/private.json)

.PHONY: all pdf docx release site serve deploy clean

all: pdf docx

pdf: build/resume.pdf build/resume-pt.pdf build/academic-cv.pdf

build/resume.pdf: cv/resume.typ $(DEPS) | build
	$(TYPST) $(PRIV) $< $@

build/resume-pt.pdf: cv/resume.typ $(DEPS) | build
	$(TYPST) $(PRIV) --input lang=pt $< $@

build/academic-cv.pdf: cv/academic-cv.typ $(DEPS) | build
	$(TYPST) $(PRIV) $< $@

docx: build/resume.docx build/resume-pt.docx

build/resume.docx: scripts/to_markdown.py cv/reference.docx $(DEPS) | build
	python3 -I scripts/to_markdown.py --lang en $(if $(PRIV),--private) | pandoc -f markdown --reference-doc=cv/reference.docx -o $@

build/resume-pt.docx: scripts/to_markdown.py cv/reference.docx $(DEPS) | build
	python3 -I scripts/to_markdown.py --lang pt $(if $(PRIV),--private) | pandoc -f markdown --reference-doc=cv/reference.docx -o $@

release: all
	mkdir -p ../output
	cp build/resume.pdf      "../output/Assumpcao-Resume-$(DATE).pdf"
	cp build/resume-pt.pdf   "../output/Assumpcao-Curriculo-$(DATE).pdf"
	cp build/academic-cv.pdf "../output/Assumpcao-CV-$(DATE).pdf"
	cp build/resume.docx     "../output/Assumpcao-Resume-$(DATE).docx"
	cp build/resume-pt.docx  "../output/Assumpcao-Curriculo-$(DATE).docx"
	@echo "Copied to ../output/"

# Public PDFs (no private data) go straight into the site's static files.
site:
	mkdir -p site/static/files
	$(TYPST) cv/resume.typ site/static/files/assumpcao-resume.pdf
	$(TYPST) cv/academic-cv.typ site/static/files/assumpcao-cv.pdf
	cd site && hugo --minify

serve: site
	cd site && hugo server

# Build everything first so a broken cv.json never reaches GitHub. Build
# outputs and private.json are gitignored, so only sources are committed.
MSG ?= Update CV $(DATE)

deploy: release site
	@test "$$(git branch --show-current)" = main || { echo "Not on main; switch with: git checkout main"; exit 1; }
	git add -A
	git diff --cached --quiet || git commit -m "$(MSG)"
	git push -u origin main

build:
	mkdir -p build

clean:
	rm -rf build public site/public site/static/files site/resources
