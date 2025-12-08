# Generate Grade 5 page images object (pages 10-150, excluding page 16)
Write-Output "`n// Static imports for Grade 5 English Book pages (pages 10-150, excluding 16)"
Write-Output "const grade5PageImages = {"

# Pages 10-15
10..15 | ForEach-Object {
    Write-Output "  $_`: require('@/data/grade_5_english_book/grade_5_english_book_page_$_/grade_5_english_book.pdf_page_$_.png'),"
}

# Skip page 16, continue from 17-150
17..150 | ForEach-Object {
    Write-Output "  $_`: require('@/data/grade_5_english_book/grade_5_english_book_page_$_/grade_5_english_book.pdf_page_$_.png'),"
}

Write-Output "};"

# Generate Grade 6 page images object (pages 14-135)
Write-Output "`n// Static imports for Grade 6 English Book pages (pages 14-135)"
Write-Output "const grade6PageImages = {"

14..135 | ForEach-Object {
    Write-Output "  $_`: require('@/data/grade_6_english_book/grade_6_english_book_page_$_/grade_6_english_book.pdf_page_$_.png'),"
}

Write-Output "};"

# Generate Grade 5 pages function
Write-Output "`n// Generate pages for Grade 5 English Book using static imports with dynamic blocks"
Write-Output "const generateGrade5Pages = () => {"
Write-Output "  const availablePages = Object.keys(grade5PageImages).map(Number).sort((a, b) => a - b);"
Write-Output "  return availablePages.map(pageNumber => ({"
Write-Output "    pageNumber,"
Write-Output "    image: grade5PageImages[pageNumber as keyof typeof grade5PageImages],"
Write-Output "    blocks: generateBlocksForPage(pageNumber, 'Grade 5 English Book')"
Write-Output "  }));"
Write-Output "};"

# Generate Grade 6 pages function
Write-Output "`n// Generate pages for Grade 6 English Book using static imports with dynamic blocks"
Write-Output "const generateGrade6Pages = () => {"
Write-Output "  const availablePages = Object.keys(grade6PageImages).map(Number).sort((a, b) => a - b);"
Write-Output "  return availablePages.map(pageNumber => ({"
Write-Output "    pageNumber,"
Write-Output "    image: grade6PageImages[pageNumber as keyof typeof grade6PageImages],"
Write-Output "    blocks: generateBlocksForPage(pageNumber, 'Grade 6 English Book')"
Write-Output "  }));"
Write-Output "};"
