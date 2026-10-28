// Shared helpers for the CV and resume. Reads /data/cv.json (paths are
// relative to --root, which the Makefile sets to the repo root).
//
// Inputs (typst compile --input key=value):
//   lang=en|pt     output language (default en)
//   private=1      merge /data/private.json (phone etc.) — local builds only

#let data = json("/data/cv.json")
#let lang = sys.inputs.at("lang", default: "en")
#let private = if sys.inputs.at("private", default: "0") == "1" {
  json("/data/private.json")
} else { (:) }

// --- palette (matches the website: site/assets/style.css) -------------------

#let green-700 = rgb("#116b45")
#let green-500 = rgb("#1f9d63")
#let teal-700 = rgb("#0e6a85")
#let teal-500 = rgb("#1a9bb8")
#let ink = rgb("#0a1712")
#let muted = rgb("#3c4a44")
#let accent = green-700
#let link-color = teal-700
#let rule-gradient = gradient.linear(green-500, teal-500)

// --- text ------------------------------------------------------------------

// Pick the current language from a {en, pt} object; fall back to English.
#let t(x) = {
  if x == none { "" }
  else if type(x) == dictionary { x.at(lang, default: x.at("en", default: "")) }
  else { x }
}

// Like t(), but returns none when the current language is missing, so
// untranslated bullets are skipped instead of mixing languages.
#let t-strict(x) = {
  if lang == "en" { t(x) }
  else if type(x) == dictionary and lang in x { x.at(lang) }
  else { none }
}

#let labels = (
  summary: (en: "Summary", pt: "Resumo"),
  education: (en: "Education", pt: "Formação Acadêmica"),
  experience: (en: "Professional Experience", pt: "Experiência Profissional"),
  positions: (en: "Academic and Professional Positions", pt: "Posições Acadêmicas e Profissionais"),
  other: (en: "Part-time, Affiliate, and Internship Experience", pt: "Outras Experiências"),
  consulting: (en: "Consulting Experience", pt: "Experiência em Consultoria"),
  publications: (en: "Publications", pt: "Publicações"),
  selected-publications: (en: "Selected Publications", pt: "Publicações Selecionadas"),
  teaching: (en: "Teaching", pt: "Docência"),
  presentations: (en: "Presentations and Speaking Engagements", pt: "Apresentações e Palestras"),
  awards: (en: "Awards, Grants, and Fellowships", pt: "Prêmios, Bolsas e Financiamentos"),
  software: (en: "Software", pt: "Software"),
  skills: (en: "Skills", pt: "Competências"),
  languages: (en: "Languages", pt: "Idiomas"),
  updated: (en: "Last updated", pt: "Última atualização"),
  present: (en: "Present", pt: "Atual"),
)
#let label(key) = t(labels.at(key))

// Organization name, using organizationLocal when it has the current language.
#let org(w) = {
  let local = w.at("organizationLocal", default: (:))
  local.at(lang, default: t(w.organization))
}

// "Ph.D. Public Policy" / "Doutorado em Políticas Públicas"
#let degree(e) = t(e.studyType) + (if lang == "pt" { " em " } else { " " }) + t(e.area)

// --- filtering ---------------------------------------------------------------

#let has-tag(item, tag) = {
  let tags = item.at("tags", default: none)
  tags == none or tag in tags
}
#let only(items, tag) = items.filter(i => has-tag(i, tag))

// Most recent first: by end date (Present sorts first), then by start date.
#let by-recency(items) = items.sorted(key: i => {
  let end = i.at("end", default: none)
  (if end == none { "9999" } else { end }) + "|" + i.start
}).rev()

// --- dates -------------------------------------------------------------------

#let months = (
  en: ("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"),
  pt: ("jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."),
)

#let fmt-date(d) = {
  if d == none { return label("present") }
  let parts = str(d).split("-")
  if parts.len() == 1 { return parts.at(0) }
  months.at(lang, default: months.en).at(int(parts.at(1)) - 1) + " " + parts.at(0)
}

#let period(start, end) = {
  if start == none { return "" }
  if end != none and str(start) == str(end) { return fmt-date(start) }
  fmt-date(start) + " – " + fmt-date(end)
}

// Years only, e.g. for the CV's education list.
#let year-period(start, end) = {
  let y(d) = if d == none { label("present") } else { str(d).split("-").at(0) }
  if start == none or y(start) == y(end) { y(end) } else { y(start) + "–" + y(end) }
}

// --- people & links ------------------------------------------------------------

#let is-me(author) = author.starts-with("Andre Assump")

#let author-list(authors) = {
  let names = authors.map(a => if is-me(a) { strong(a) } else { a })
  if names.len() <= 2 { names.join(" and ") } else { names.join(", ", last: ", and ") }
}

#let doi-link(doi) = link("https://doi.org/" + doi, "doi.org/" + doi)

#let citation(p) = {
  author-list(p.authors)
  [. "#p.title." ]
  emph(p.venue)
  if "volume" in p { [ #p.volume] }
  if "issue" in p { [(#p.issue)] }
  if "pages" in p { [, #p.pages] }
  [ (#p.year).]
  if "doi" in p { [ #doi-link(p.doi)] }
}

// Contact line: email · phone (private) · website · LinkedIn · GitHub
#let contact-items() = {
  let b = data.basics
  let items = (link("mailto:" + b.email, b.email),)
  if "phone" in private { items.push(private.phone) }
  items.push(link(b.url, b.url.replace("https://", "")))
  for p in b.profiles {
    items.push(link(p.url, p.url.replace("https://", "").replace("www.", "")))
  }
  items
}
