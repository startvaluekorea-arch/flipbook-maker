import fitz
doc = fitz.open("../nrf.pdf")
with open("page_info.txt", "w", encoding="utf-8") as f:
    for i in range(12):
        text = doc[i].get_text("text")[:80].replace("\n", " ")
        f.write(f"Physical index {i} (page {i+1}): {text}\n")
    # Also check specific pages
    for i in [60, 61, 62, 63, 64, 172, 173, 174]:
        text = doc[i].get_text("text")[:80].replace("\n", " ")
        f.write(f"Physical index {i} (page {i+1}): {text}\n")
print("Done. Check page_info.txt")
