# Generate Grade 5 and Grade 6 import statements for trimmedBlocksDataService.ts

# Grade 5 normal imports (pages 10-150)
Write-Output "`n// Grade 5 English Book (pages 10-150)"
10..150 | ForEach-Object {
    Write-Output "import page$($_)G5TrimmedBlocks from '@/data/grade_5_english_book/grade_5_english_book_page_$($_)/grade_5_english_book.pdf_page_$($_)_trimmed_blocks.json';"
}

# Grade 5 slow imports (pages 10-150)
Write-Output "`n// Grade 5 English Book - SLOW READING MODE (pages 10-150)"
10..150 | ForEach-Object {
    Write-Output "import page$($_)G5SlowTrimmedBlocks from '@/data/grade_5_english_book/grade_5_english_book_page_$($_)/grade_5_english_book.pdf_page_$($_)_trimmed_blocks_slow.json';"
}

# Grade 6 normal imports (pages 14-135)
Write-Output "`n// Grade 6 English Book (pages 14-135)"
14..135 | ForEach-Object {
    Write-Output "import page$($_)G6TrimmedBlocks from '@/data/grade_6_english_book/grade_6_english_book_page_$($_)/grade_6_english_book.pdf_page_$($_)_trimmed_blocks.json';"
}

# Grade 6 slow imports (pages 14-135)
Write-Output "`n// Grade 6 English Book - SLOW READING MODE (pages 14-135)"
14..135 | ForEach-Object {
    Write-Output "import page$($_)G6SlowTrimmedBlocks from '@/data/grade_6_english_book/grade_6_english_book_page_$($_)/grade_6_english_book.pdf_page_$($_)_trimmed_blocks_slow.json';"
}
