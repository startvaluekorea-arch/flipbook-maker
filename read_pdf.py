import PyPDF2

try:
    with open("out.txt", "w", encoding="utf-8") as f:
        reader = PyPDF2.PdfReader("../nrf.pdf")
        pages_to_check = [3, 4, 5, 27, 28, 29, 30, 31, 32]
        for p in pages_to_check:
            if p < len(reader.pages):
                text = reader.pages[p].extract_text()
                f.write(f"--- PHYSICAL PAGE {p+1} ---\n")
                f.write(text[:200].replace('\n', ' ') + "\n")
except Exception as e:
    with open("out.txt", "a", encoding="utf-8") as f:
        f.write(f"Error: {e}\n")
