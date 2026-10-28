"""Render the professional resume from data/cv.json as Markdown (for pandoc → .docx).

Mirrors cv/resume.typ: same "resume" tag filter, same language fallback rules.

    python3 scripts/to_markdown.py --lang en [--private] | pandoc -o resume.docx
"""

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

LABELS = {
    "summary": {"en": "Summary", "pt": "Resumo"},
    "experience": {"en": "Professional Experience", "pt": "Experiência Profissional"},
    "other": {"en": "Part-time, Affiliate, and Internship Experience", "pt": "Outras Experiências"},
    "consulting": {"en": "Consulting Experience", "pt": "Experiência em Consultoria"},
    "education": {"en": "Education", "pt": "Formação Acadêmica"},
    "publications": {"en": "Selected Publications", "pt": "Publicações Selecionadas"},
    "awards": {"en": "Awards, Grants, and Fellowships", "pt": "Prêmios, Bolsas e Financiamentos"},
    "skills": {"en": "Skills", "pt": "Competências"},
    "languages": {"en": "Languages", "pt": "Idiomas"},
    "updated": {"en": "Last updated", "pt": "Última atualização"},
    "present": {"en": "Present", "pt": "Atual"},
}
MONTHS = {
    "en": "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(),
    "pt": "jan. fev. mar. abr. mai. jun. jul. ago. set. out. nov. dez.".split(),
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--lang", default="en", choices=["en", "pt"])
    parser.add_argument("--private", action="store_true", help="merge data/private.json")
    args = parser.parse_args()
    lang = args.lang

    data = json.loads((ROOT / "data" / "cv.json").read_text(encoding="utf-8"))
    private = json.loads((ROOT / "data" / "private.json").read_text(encoding="utf-8")) if args.private else {}

    def t(x):
        if isinstance(x, dict):
            return x.get(lang, x.get("en", ""))
        return x or ""

    def t_strict(x):
        if lang == "en":
            return t(x)
        return x.get(lang) if isinstance(x, dict) else None

    def label(key):
        return LABELS[key][lang]

    def only(items):
        return [i for i in items if "tags" not in i or "resume" in i["tags"]]

    def fmt_date(d):
        if d is None:
            return label("present")
        parts = str(d).split("-")
        return parts[0] if len(parts) == 1 else f"{MONTHS[lang][int(parts[1]) - 1]} {parts[0]}"

    def period(start, end):
        return fmt_date(start) if start == end else f"{fmt_date(start)} – {fmt_date(end)}"

    def org(w):
        return w.get("organizationLocal", {}).get(lang, t(w["organization"]))

    def author_list(authors):
        names = [f"**{a}**" if a.startswith("Andre Assump") else a for a in authors]
        if len(names) <= 2:
            return " and ".join(names)
        return ", ".join(names[:-1]) + ", and " + names[-1]

    b = data["basics"]
    out = []
    w = out.append

    # Header
    w(f"# {b['name']}, {b['credential']}\n")
    w(f"{t(b['label'])}\n")
    contact = [b["email"]]
    if "phone" in private:
        contact.append(private["phone"])
    contact += [b["url"].replace("https://", "")] + [p["url"].replace("https://", "").replace("www.", "") for p in b["profiles"]]
    w(" · ".join(contact) + "\n")

    summary = t_strict(b.get("summary"))
    if summary:
        w(f"## {label('summary')}\n\n{summary}\n")

    def job(item):
        w(f"**{org(item)}** ({period(item['start'], item['end'])})  ")
        for p in item["positions"]:
            dates = f" ({period(p['start'], p['end'])})" if len(item["positions"]) > 1 else ""
            w(f"*{t(p['title'])}*{dates}  ")
        w("")
        for h in only(item.get("highlights", [])):
            text = t_strict(h["text"])
            if text:
                w(f"- {text}")
        w("")

    work = only(data["work"])
    w(f"## {label('experience')}\n")
    for item in (x for x in work if x["category"] == "main"):
        job(item)
    others = [x for x in work if x["category"] == "other"]
    if others:
        w(f"## {label('other')}\n")
        for item in others:
            job(item)

    w(f"## {label('consulting')}\n")
    for c in only(data["consulting"]):
        links = ", ".join(f"[{l['label']}]({l['url']})" for l in c["links"])
        w(f"**{t(c['client'])}** ({period(c['start'], c['end'])})  \n{t(c['description'])} {links}\n")

    w(f"## {label('education')}\n")
    for e in only(data["education"]):
        joiner = " em " if lang == "pt" else " "
        w(f"- **{t(e['studyType'])}{joiner}{t(e['area'])}**, {t(e['institution'])} ({e['end']})")
    w("")

    w(f"## {label('publications')}\n")
    for p in only(data["publications"]):
        details = "".join([
            f" {p['volume']}" if "volume" in p else "",
            f"({p['issue']})" if "issue" in p else "",
            f", {p['pages']}" if "pages" in p else "",
        ])
        doi = f" <https://doi.org/{p['doi']}>" if "doi" in p else ""
        w(f"- {author_list(p['authors'])}. \"{p['title']}.\" *{p['venue']}*{details} ({p['year']}).{doi}")
    w("")

    w(f"## {label('awards')}\n")
    for a in only(data["awards"]):
        w(f"- {a['year']} — {a['title']}")
    w("")

    w(f"## {label('skills')}\n")
    for s in data["skills"]:
        w(f"- **{t(s['name'])}:** {', '.join(s['keywords'])}")
    langs = ", ".join(f"{t(l['language'])} ({t(l['fluency'])})" for l in data["languages"])
    w(f"- **{label('languages')}:** {langs}\n")

    w(f"*{label('updated')}: {fmt_date(data['meta']['lastUpdated'])}*")
    print("\n".join(out))


if __name__ == "__main__":
    main()
