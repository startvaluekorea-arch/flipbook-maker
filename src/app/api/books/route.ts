import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface BookSummary {
  bookId: string;
  originalFileName: string;
  totalPages: number;
  createdAt: string;
  coverImage: string;
}

export async function GET() {
  try {
    const booksDir = path.join(process.cwd(), 'data', 'books');

    if (!fs.existsSync(booksDir)) {
      return NextResponse.json([]);
    }

    const dirs = fs.readdirSync(booksDir).filter((d) =>
      fs.statSync(path.join(booksDir, d)).isDirectory()
    );

    const books: BookSummary[] = [];

    for (const dir of dirs) {
      const metaPath = path.join(booksDir, dir, 'metadata.json');
      if (!fs.existsSync(metaPath)) continue;

      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
        // Get creation time from directory stat if createdAt not in metadata
        const stat = fs.statSync(metaPath);

        books.push({
          bookId: dir,
          originalFileName: meta.originalFileName || dir,
          totalPages: meta.totalPages || 0,
          createdAt: meta.createdAt || stat.birthtime.toISOString(),
          coverImage: `/api/images/${dir}/page_1.webp`,
        });
      } catch {
        // Skip corrupted metadata
      }
    }

    // Sort by newest first
    books.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error listing books:', error);
    return NextResponse.json({ error: 'Failed to list books' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const metadataString = formData.get('metadata') as string;
    
    if (!metadataString) {
      return NextResponse.json({ error: 'No metadata provided' }, { status: 400 });
    }

    const metadata = JSON.parse(metadataString);
    const bookId = metadata.bookId;

    // MVP: Save to local data directory (in Docker container this maps to /app/data)
    const baseDir = path.join(process.cwd(), 'data', 'books', bookId);
    const imagesDir = path.join(baseDir, 'images');

    // Create directories if they don't exist
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Save each image
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('page_') && value instanceof Blob) {
        const buffer = Buffer.from(await value.arrayBuffer());
        const filePath = path.join(imagesDir, `${key}.webp`);
        fs.writeFileSync(filePath, buffer);

        // Update metadata with the API path to the image
        const pageIndex = parseInt(key.split('_')[1]) - 1;
        if (metadata.pages[pageIndex]) {
          metadata.pages[pageIndex].imagePath = `/api/images/${bookId}/${key}.webp`;
        }
      }
    }

    // Save metadata.json
    fs.writeFileSync(
      path.join(baseDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    return NextResponse.json({ success: true, bookId });
  } catch (error) {
    console.error('Error saving book:', error);
    return NextResponse.json({ error: 'Failed to save book' }, { status: 500 });
  }
}
