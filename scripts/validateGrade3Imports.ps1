# Grade 3 Import Validation and Update Script
# Compares current imports against expected imports and shows differences

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Grade 3 Import Validation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load generated imports
$verificationDir = "c:\rtr\scripts\grade3_verification"
$expectedTrimmedImports = Get-Content "$verificationDir\grade3_trimmed_blocks_imports.txt"
$expectedSlowImports = Get-Content "$verificationDir\grade3_trimmed_blocks_slow_imports.txt"
$expectedBlocksImports = Get-Content "$verificationDir\grade3_blocks_imports.txt"

# Read current files
$trimmedBlocksFile = "c:\rtr\services\trimmedBlocksDataService.ts"
$bookDataFile = "c:\rtr\services\bookDataService.ts"

Write-Host "Analyzing trimmedBlocksDataService.ts..." -ForegroundColor Yellow

# Extract Grade 3 normal imports from trimmedBlocksDataService.ts
$trimmedContent = Get-Content $trimmedBlocksFile
$currentTrimmedImports = $trimmedContent | Where-Object { 
    $_ -match "^import.*grade_3_english_book.*trimmed_blocks\.json" -and 
    $_ -notmatch "_slow\.json"
}

# Extract Grade 3 slow imports
$currentSlowImports = $trimmedContent | Where-Object { 
    $_ -match "^import.*grade_3_english_book.*trimmed_blocks_slow\.json"
}

Write-Host "Analyzing bookDataService.ts..." -ForegroundColor Yellow

# Extract Grade 3 blocks imports from bookDataService.ts
$bookDataContent = Get-Content $bookDataFile
$currentBlocksImports = $bookDataContent | Where-Object { 
    $_ -match "^import.*grade_3_english_book.*_blocks\.json" -and
    $_ -notmatch "trimmed_blocks"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COMPARISON RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Compare trimmed blocks
$trimmedExpected = ($expectedTrimmedImports | Where-Object { $_ -match "^import" }).Count
$trimmedActual = $currentTrimmedImports.Count
Write-Host "Trimmed Blocks Imports:" -ForegroundColor White
Write-Host "  Expected: $trimmedExpected" -ForegroundColor $(if ($trimmedExpected -eq $trimmedActual) { "Green" } else { "Yellow" })
Write-Host "  Actual:   $trimmedActual" -ForegroundColor $(if ($trimmedExpected -eq $trimmedActual) { "Green" } else { "Red" })

# Compare slow imports
$slowExpected = ($expectedSlowImports | Where-Object { $_ -match "^import" }).Count
$slowActual = $currentSlowImports.Count
Write-Host ""
Write-Host "Slow Mode Imports:" -ForegroundColor White
Write-Host "  Expected: $slowExpected" -ForegroundColor $(if ($slowExpected -eq $slowActual) { "Green" } else { "Yellow" })
Write-Host "  Actual:   $slowActual" -ForegroundColor $(if ($slowExpected -eq $slowActual) { "Green" } else { "Red" })

# Compare blocks imports
$blocksExpected = ($expectedBlocksImports | Where-Object { $_ -match "^import" }).Count
$blocksActual = $currentBlocksImports.Count
Write-Host ""
Write-Host "Blocks Data Imports:" -ForegroundColor White
Write-Host "  Expected: $blocksExpected" -ForegroundColor $(if ($blocksExpected -eq $blocksActual) { "Green" } else { "Yellow" })
Write-Host "  Actual:   $blocksActual" -ForegroundColor $(if ($blocksExpected -eq $blocksActual) { "Green" } else { "Red" })

Write-Host ""

# Find missing imports
$expectedTrimmedImportLines = $expectedTrimmedImports | Where-Object { $_ -match "^import" }
$missingTrimmed = $expectedTrimmedImportLines | Where-Object { $currentTrimmedImports -notcontains $_ }

$expectedSlowImportLines = $expectedSlowImports | Where-Object { $_ -match "^import" }
$missingSlow = $expectedSlowImportLines | Where-Object { $currentSlowImports -notcontains $_ }

$expectedBlocksImportLines = $expectedBlocksImports | Where-Object { $_ -match "^import" }
$missingBlocks = $expectedBlocksImportLines | Where-Object { $currentBlocksImports -notcontains $_ }

if ($missingTrimmed.Count -gt 0) {
    Write-Host "MISSING TRIMMED BLOCKS IMPORTS: $($missingTrimmed.Count)" -ForegroundColor Red
    $missingTrimmed | Select-Object -First 5 | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Yellow
    }
    if ($missingTrimmed.Count -gt 5) {
        Write-Host "  ... and $($missingTrimmed.Count - 5) more" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($missingSlow.Count -gt 0) {
    Write-Host "MISSING SLOW MODE IMPORTS: $($missingSlow.Count)" -ForegroundColor Red
    $missingSlow | Select-Object -First 5 | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Yellow
    }
    if ($missingSlow.Count -gt 5) {
        Write-Host "  ... and $($missingSlow.Count - 5) more" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($missingBlocks.Count -gt 0) {
    Write-Host "MISSING BLOCKS IMPORTS: $($missingBlocks.Count)" -ForegroundColor Red
    $missingBlocks | Select-Object -First 5 | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Yellow
    }
    if ($missingBlocks.Count -gt 5) {
        Write-Host "  ... and $($missingBlocks.Count - 5) more" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OVERALL STATUS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allMatch = ($trimmedExpected -eq $trimmedActual) -and 
            ($slowExpected -eq $slowActual) -and 
            ($blocksExpected -eq $blocksActual)

if ($allMatch) {
    Write-Host "SUCCESS: All Grade 3 imports are complete!" -ForegroundColor Green
    Write-Host "  - Trimmed blocks: $trimmedActual/$trimmedExpected" -ForegroundColor Green
    Write-Host "  - Slow mode: $slowActual/$slowExpected" -ForegroundColor Green
    Write-Host "  - Blocks data: $blocksActual/$blocksExpected" -ForegroundColor Green
} else {
    Write-Host "ISSUES DETECTED:" -ForegroundColor Yellow
    if ($trimmedExpected -ne $trimmedActual) {
        Write-Host "  - Trimmed blocks: Missing $($trimmedExpected - $trimmedActual) imports" -ForegroundColor Red
    }
    if ($slowExpected -ne $slowActual) {
        Write-Host "  - Slow mode: Missing $($slowExpected - $slowActual) imports" -ForegroundColor Red
    }
    if ($blocksExpected -ne $blocksActual) {
        Write-Host "  - Blocks data: Missing $($blocksExpected - $blocksActual) imports" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Generated import files are available in:" -ForegroundColor White
    Write-Host "  $verificationDir" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Validation complete!" -ForegroundColor Cyan
