// Professional resume: items tagged "resume" (or untagged), sans-serif, compact.
//   typst compile --root . --font-path fonts cv/resume.typ build/resume.pdf

#import "lib.typ": *

#let b = data.basics

#set document(title: b.name + " — Resume", author: b.name)
#set page(paper: "us-letter", margin: (x: 0.6in, y: 0.5in))
#set text(font: "Lato", size: 9.5pt, lang: lang, fill: ink)
#set par(justify: false, leading: 0.55em)
#set list(indent: 0.6em, body-indent: 0.5em, spacing: 0.5em, marker: text(fill: teal-500)[•])
#show link: set text(fill: link-color)

#let section(title) = {
  block(above: 1.3em, below: 0.6em, sticky: true)[
    #text(size: 10.5pt, weight: "bold", fill: accent, tracking: 0.06em, upper(title))
    #v(-0.6em)
    #line(length: 100%, stroke: (paint: rule-gradient, thickness: 0.8pt))
  ]
}

// Bold left text, muted right-aligned dates.
#let row(left, right) = grid(
  columns: (1fr, auto),
  column-gutter: 1em,
  left, text(fill: muted, right),
)

// --- header ------------------------------------------------------------------

#align(center)[
  #text(size: 22pt, weight: "bold", b.name + ", " + b.credential)
  #v(-0.4em)
  #text(size: 11pt, fill: muted, t(b.label))
  #v(-0.2em)
  #text(size: 8.5pt, contact-items().join(h(0.5em) + "·" + h(0.5em)))
]

// --- body --------------------------------------------------------------------

#let summary = t-strict(b.summary)
#if summary != none [
  #section(label("summary"))
  #summary
]

#let job(w) = block(breakable: true, above: 0.9em, below: 0.9em)[
  #row(strong(org(w)), period(w.start, w.end))
  #for p in w.positions {
    v(-0.45em)
    row(emph(t(p.title)), if w.positions.len() > 1 { period(p.start, p.end) })
  }
  #let bullets = only(w.at("highlights", default: ()), "resume").map(h => t-strict(h.text)).filter(x => x != none)
  #if bullets.len() > 0 { v(-0.2em); list(..bullets) }
]

#section(label("experience"))
#for w in only(data.work, "resume").filter(w => w.category == "main") { job(w) }

#let others = only(data.work, "resume").filter(w => w.category == "other")
#if others.len() > 0 {
  section(label("other"))
  for w in others { job(w) }
}

#section(label("consulting"))
#for c in only(data.consulting, "resume") {
  block(below: 0.7em)[
    #row(strong(t(c.client)), period(c.start, c.end))
    #v(-0.3em)
    #t(c.description)
    #c.links.map(l => link(l.url, l.label)).join(", ")
  ]
}

#section(label("education"))
#for e in only(data.education, "resume") {
  row([*#degree(e)*, #t(e.institution)], str(e.end))
  v(-0.3em)
}

#section(label("selected-publications"))
#for p in only(data.publications, "resume") {
  block(below: 0.6em, citation(p))
}

#section(label("awards"))
#for a in only(data.awards, "resume") {
  row(a.title, a.year)
  v(-0.3em)
}

#section(label("skills"))
#for s in data.skills [
  *#t(s.name):* #s.keywords.join(", ") \
]
*#label("languages"):* #data.languages.map(l => t(l.language) + " (" + t(l.fluency) + ")").join(", ")

#v(1fr)
#align(right, text(size: 8pt, fill: muted)[#label("updated"): #fmt-date(data.meta.lastUpdated)])
