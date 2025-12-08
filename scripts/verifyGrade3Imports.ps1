# Script to check and verify all Grade 3 English Book imports
# This script validates that all required files exist and generates import statements

Write-Host "Grade 3 English Book Import Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$grade3Path = "c:\rtr\data\grade_3_english_book"
$pages = 10..136
$missingFiles = @()
$existingPages = @()

Write-Host "Checking file existence for pages 10-136..." -ForegroundColor Yellow
Write-Host ""

foreach ($page in $pages) {
    $pageDir = "$grade3Path\grade_3_english_book_page_$page"
    
    # Check required files
    $blocksFile = "$pageDir\grade_3_english_book.pdf_page_$($page)_blocks.json"
    $trimmedBlocksFile = "$pageDir\grade_3_english_book.pdf_page_$($page)_trimmed_blocks.json"
    $trimmedBlocksSlowFile = "$pageDir\grade_3_english_book.pdf_page_$($page)_trimmed_blocks_slow.json"
    
    # Check if files exist
    $hasBlocks = Test-Path $blocksFile
    $hasTrimmed = Test-Path $trimmedBlocksFile
    $hasTrimmedSlow = Test-Path $trimmedBlocksSlowFile
    
    # Track missing files
    if (-not $hasBlocks) {
        $missingFiles += "Page ${page}: blocks.json MISSING"
    }
    if (-not $hasTrimmed) {
        $missingFiles += "Page ${page}: trimmed_blocks.json MISSING"
    }
    if (-not $hasTrimmedSlow) {
        $missingFiles += "Page ${page}: trimmed_blocks_slow.json MISSING"
    }
    
    if ($hasBlocks -and $hasTrimmed -and $hasTrimmedSlow) {
        $existingPages += $page
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICATION RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Total pages checked: $($pages.Count)" -ForegroundColor White
Write-Host "Pages with complete data: $($existingPages.Count)" -ForegroundColor Green
Write-Host "Missing files: $($missingFiles.Count)" -ForegroundColor $(if ($missingFiles.Count -eq 0) { "Green" } else { "Red" })

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "MISSING FILES:" -ForegroundColor Red
    foreach ($missing in $missingFiles) {
        Write-Host "  - $missing" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GENERATING IMPORT STATEMENTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Generate output file paths
$outputDir = "c:\rtr\scripts\grade3_verification"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$blocksImportsFile = "$outputDir\grade3_blocks_imports.txt"
$trimmedBlocksImportsFile = "$outputDir\grade3_trimmed_blocks_imports.txt"
$trimmedBlocksSlowImportsFile = "$outputDir\grade3_trimmed_blocks_slow_imports.txt"

# Generate blocks imports (for bookDataService.ts)
Write-Host "Generating blocks imports..." -ForegroundColor Yellow
$blocksImports = @()
$blocksImports += "// Grade 3 English Book - blocks.json imports (pages 10-136)"
foreach ($page in $existingPages) {
    if ($page -lt 100) {
        $varName = "page${page}BlocksData"
    } else {
        $varName = "page${page}G3BlocksData"
    }
    $blocksImports += "import $varName from '@/data/grade_3_english_book/grade_3_english_book_page_$page/grade_3_english_book.pdf_page_${page}_blocks.json';"
}
$blocksImports | Out-File -FilePath $blocksImportsFile -Encoding utf8

# Generate trimmed blocks imports (for trimmedBlocksDataService.ts)
Write-Host "Generating trimmed blocks imports..." -ForegroundColor Yellow
$trimmedImports = @()
$trimmedImports += "// Grade 3 English Book - trimmed_blocks.json imports (pages 10-136)"
foreach ($page in $existingPages) {
    if ($page -lt 100) {
        $varName = "page${page}TrimmedBlocks"
    } else {
        $varName = "page${page}G3TrimmedBlocks"
    }
    $trimmedImports += "import $varName from '@/data/grade_3_english_book/grade_3_english_book_page_$page/grade_3_english_book.pdf_page_${page}_trimmed_blocks.json';"
}
$trimmedImports | Out-File -FilePath $trimmedBlocksImportsFile -Encoding utf8

# Generate trimmed blocks slow imports
Write-Host "Generating trimmed blocks SLOW imports..." -ForegroundColor Yellow
$trimmedSlowImports = @()
$trimmedSlowImports += "// Grade 3 English Book - trimmed_blocks_slow.json imports (pages 10-136)"
foreach ($page in $existingPages) {
    if ($page -lt 100) {
        $varName = "page${page}SlowTrimmedBlocks"
    } else {
        $varName = "page${page}G3SlowTrimmedBlocks"
    }
    $trimmedSlowImports += "import $varName from '@/data/grade_3_english_book/grade_3_english_book_page_$page/grade_3_english_book.pdf_page_${page}_trimmed_blocks_slow.json';"
}
$trimmedSlowImports | Out-File -FilePath $trimmedBlocksSlowImportsFile -Encoding utf8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FILES GENERATED" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Output directory: $outputDir" -ForegroundColor White
Write-Host "  1. grade3_blocks_imports.txt" -ForegroundColor Green
Write-Host "  2. grade3_trimmed_blocks_imports.txt" -ForegroundColor Green
Write-Host "  3. grade3_trimmed_blocks_slow_imports.txt" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Verified $($existingPages.Count) pages" -ForegroundColor Green
Write-Host "Generated import statements for:" -ForegroundColor Green
Write-Host "  - Blocks data: $($existingPages.Count) imports" -ForegroundColor White
Write-Host "  - Trimmed blocks: $($existingPages.Count) imports" -ForegroundColor White
Write-Host "  - Trimmed blocks slow: $($existingPages.Count) imports" -ForegroundColor White

if ($missingFiles.Count -eq 0) {
    Write-Host ""
    Write-Host "ALL FILES COMPLETE - No missing files!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "WARNING: $($missingFiles.Count) files missing" -ForegroundColor Yellow
    Write-Host "Review the missing files list above" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Verification complete!" -ForegroundColor Cyan
