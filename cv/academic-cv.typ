// Academic CV: every item tagged "cv" (or untagged), serif, full detail.
//   typst compile --root . --font-path fonts cv/academic-cv.typ build/cv.pdf

#import "lib.typ": *

#let b = data.basics

#set document(title: b.name + " — Curriculum Vitae", author: b.name)
#set page(
  paper: "us-letter",
  margin: (x: 1in, top: 0.9in, bottom: 0.9in),
  footer: context {
    set text(size: 8.5pt, fill: muted)
    grid(
      columns: (1fr, auto),
      [#b.name — Curriculum Vitae],
      [#counter(page).display() / #counter(page).final().first()],
    )
  },
)
#set text(font: "Libertinus Serif", size: 11pt, lang: lang, fill: ink)
#set par(justify: true, leading: 0.6em)
#set list(indent: 0.6em, body-indent: 0.5em, spacing: 0.55em)
#show link: set text(fill: link-color)

#let section(title) = {
  v(1.3em, weak: true)
  block(below: 0.8em, sticky: true, text(size: 12.5pt, weight: "bold", fill: accent, smallcaps(title)))
}

// Hanging layout: dates in a narrow left column, content on the right.
#let entry(when, body) = grid(
  columns: (5.5em, 1fr),
  column-gutter: 1em,
  row-gutter: 0.5em,
  text(fill: muted, size: 10pt, when), body,
)
#let entries(items) = {
  for (when, body) in items { entry(when, body); v(0.45em, weak: true) }
}

// --- header ------------------------------------------------------------------

#text(size: 24pt, weight: "bold", b.name)
#v(-0.6em)
#text(size: 11pt, fill: muted, t(b.label))
#v(-0.3em)
#text(size: 9.5pt, contact-items().join(h(0.4em) + "|" + h(0.4em)))
#line(length: 100%, stroke: (paint: rule-gradient, thickness: 0.6pt))

// --- body --------------------------------------------------------------------

#section(label("education"))
#entries(only(data.education, "cv").map(e => (
  year-period(none, e.end),
  [#degree(e) \ #emph(t(e.institution))],
)))

#section(label("positions"))
#entries(by-recency(only(data.work, "cv")).map(w => (
  year-period(w.start, w.end),
  {
    strong(org(w))
    for p in w.positions [ \ #t(p.title) #if w.positions.len() > 1 { text(fill: muted, size: 10pt)[(#period(p.start, p.end))] }]
    let bullets = only(w.at("highlights", default: ()), "cv").map(h => t-strict(h.text)).filter(x => x != none)
    if bullets.len() > 0 { v(-0.2em); set text(size: 10pt); list(..bullets) }
  },
)))

#section(label("publications"))
#let pubs = only(data.publications, "cv")
#entries(pubs.map(p => (p.year, citation(p))))

#section(label("consulting"))
#entries(only(data.consulting, "cv").map(c => (
  year-period(c.start, c.end),
  [*#t(c.client)*. #t(c.description) #c.links.map(l => link(l.url, l.label)).join(", ")],
)))

#section(label("teaching"))
#entries(only(data.teaching, "cv").map(c => (
  if "start" in c { year-period(c.start, c.end) } else { "" },
  [#emph(c.course) (#lower(c.level)), #c.institution — #c.role],
)))

#section(label("awards"))
#entries(only(data.awards, "cv").map(a => (a.year, a.title)))

#section(label("presentations"))
// Group talks by year so each year label appears once.
#let years = only(data.presentations, "cv").map(p => p.year).dedup()
#entries(years.map(y => (
  y,
  only(data.presentations, "cv").filter(p => p.year == y).map(p => p.event).join("; ") + ".",
)))

#section(label("software"))
#entries(only(data.software, "cv").map(s => (
  s.language,
  [#link(s.url, strong(s.name)). #s.description],
)))

#section(label("skills"))
#entries(data.skills.map(s => (t(s.name), s.keywords.join(", "))))
#entry(label("languages"), data.languages.map(l => t(l.language) + " (" + lower(t(l.fluency)) + ")").join(", "))

#v(1.5em)
#align(right, text(size: 9pt, fill: muted)[#label("updated"): #fmt-date(data.meta.lastUpdated)])
