"""Builds the Word process log from docs/CHANGELOG.md.

Usage (from the project root):  python3 docs/build_docx.py
Output: docs/Portfolio-V2-Process-Log.docx

CHANGELOG.md is the source of truth: edit it, then run this script again.
"""

import re
from datetime import date
from pathlib import Path

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "docs" / "CHANGELOG.md"
OUTPUT = ROOT / "docs" / "Portfolio-V2-Process-Log.docx"

SPACE_BLUE = RGBColor(0x00, 0x30, 0x49)
FLAG_RED = RGBColor(0xC1, 0x12, 0x1F)
MUTED = RGBColor(0x4D, 0x6B, 0x7D)
FIELDS = ["Area", "Feedback", "Change", "Why", "Files", "Before", "After", "Status"]


def parse(text: str) -> list[dict]:
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    entries = []
    for block in re.split(r"^## ", text, flags=re.M)[1:]:
        lines = block.strip().splitlines()
        entry_id, _, title = lines[0].partition(" · ")
        entry = {"id": entry_id.strip(), "title": title.strip()}
        for line in lines[1:]:
            match = re.match(r"- \*\*(\w[\w ]*):\*\* ?(.*)", line)
            if match:
                entry[match.group(1)] = match.group(2).strip()
        entries.append(entry)
    return entries


def add_inline(paragraph, text: str):
    """Adds text, rendering `code` spans in a monospace font."""
    for i, part in enumerate(re.split(r"`([^`]*)`", text)):
        if not part:
            continue
        run = paragraph.add_run(part)
        if i % 2 == 1:
            run.font.name = "Menlo"
            run.font.size = Pt(9)


def shade(cell, hex_colour: str):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hex_colour)
    tc_pr.append(shd)


def images(value: str) -> list[Path]:
    paths = [ROOT / p.strip() for p in value.split(",") if p.strip().endswith(".png")]
    return [p for p in paths if p.exists()]


def status_colour(status: str) -> str:
    if status.startswith("Done"):
        return "DCEFD9"
    if status.startswith("Waiting"):
        return "FBE3C2"
    return "DCE8F2"


def build():
    entries = parse(SOURCE.read_text(encoding="utf-8"))
    doc = Document()

    section = doc.sections[0]
    section.left_margin = section.right_margin = Cm(2.2)
    section.top_margin = section.bottom_margin = Cm(2)

    styles = doc.styles
    styles["Normal"].font.name = "Calibri"
    styles["Normal"].font.size = Pt(10.5)
    for name, size in (("Heading 1", 20), ("Heading 2", 14), ("Heading 3", 11)):
        styles[name].font.color.rgb = SPACE_BLUE
        styles[name].font.size = Pt(size)

    # Title page
    for _ in range(6):
        doc.add_paragraph()
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run("Showcase Portfolio V2")
    run.bold, run.font.size, run.font.color.rgb = True, Pt(32), SPACE_BLUE
    subtitle = doc.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = subtitle.add_run("Process log: feedback, changes and reasoning")
    run.font.size, run.font.color.rgb = Pt(15), FLAG_RED
    meta = doc.add_paragraph()
    meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = meta.add_run(f"Eugene Chivurayise · Fontys ICT · Front-End Development\n{date.today():%d %B %Y}")
    run.font.color.rgb = MUTED
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)

    # Introduction and summary table
    doc.add_heading("Overview", level=1)
    doc.add_paragraph(
        "After the V1 review of the folder portfolio I received feedback on the home page, navigation, "
        "the About page, scrolling, the structure of the content and the typography. This log records "
        "every point of feedback, what I changed, why, which files were touched and, where useful, "
        "before and after screenshots. Points that depend on content I still have to write are marked "
        "as waiting on content."
    )
    done = sum(e.get("Status", "").startswith("Done") for e in entries)
    doc.add_paragraph(f"{len(entries)} items · {done} done · {len(entries) - done} open")

    table = doc.add_table(rows=1, cols=4)
    table.style = "Table Grid"
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for cell, label in zip(table.rows[0].cells, ["#", "Change", "Area", "Status"]):
        cell.text = ""
        run = cell.paragraphs[0].add_run(label)
        run.bold, run.font.color.rgb = True, RGBColor(0xFD, 0xF0, 0xD5)
        shade(cell, "003049")
    for e in entries:
        row = table.add_row().cells
        row[0].text, row[1].text, row[2].text = e["id"], e["title"], e.get("Area", "")
        row[3].text = e.get("Status", "").split(":")[0].split(" (")[0]
        shade(row[3], status_colour(e.get("Status", "")))
    for row in table.rows:
        for width, cell in zip((Cm(1.2), Cm(7.5), Cm(4.6), Cm(3.3)), row.cells):
            cell.width = width

    # One section per area, one entry per change
    current_area = None
    for e in entries:
        area = e.get("Area", "Other")
        if area != current_area:
            doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)
            doc.add_heading(area, level=1)
            current_area = area

        doc.add_heading(f"{e['id']}  {e['title']}", level=2)
        for field in ("Feedback", "Change", "Why", "Files", "Status"):
            value = e.get(field, "")
            if not value or value == "–":
                continue
            p = doc.add_paragraph()
            p.paragraph_format.space_after = Pt(4)
            label = p.add_run(f"{field}: ")
            label.bold = True
            label.font.color.rgb = FLAG_RED if field == "Feedback" else SPACE_BLUE
            add_inline(p, value)

        for field in ("Before", "After"):
            pics = images(e.get(field, ""))
            if not pics:
                continue
            doc.add_heading(field, level=3)
            for pic in pics:
                mobile = "mobile" in pic.name
                doc.add_picture(str(pic), width=Cm(6) if mobile else Cm(15.5))
                doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
                caption = doc.add_paragraph(pic.name)
                caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
                caption.runs[0].font.size = Pt(8)
                caption.runs[0].font.color.rgb = MUTED

    doc.save(OUTPUT)
    print(f"Wrote {OUTPUT.relative_to(ROOT)} ({len(entries)} entries)")


if __name__ == "__main__":
    build()
