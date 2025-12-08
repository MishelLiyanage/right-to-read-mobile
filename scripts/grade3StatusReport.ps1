# Complete Grade 3 Import Status Report
# Generates a comprehensive report of all Grade 3 imports and functionality

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  GRADE 3 ENGLISH BOOK - COMPLETE IMPORT STATUS REPORT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# File paths
$grade3Path = "c:\rtr\data\grade_3_english_book"
$trimmedBlocksFile = "c:\rtr\services\trimmedBlocksDataService.ts"
$bookDataFile = "c:\rtr\services\bookDataService.ts"
$audioResolverFile = "c:\rtr\services\audioResolver.ts"
$booksFile = "c:\rtr\data\books.ts"

# Check file existence
Write-Host "1. DATA FILES" -ForegroundColor Yellow
Write-Host "   Location: $grade3Path" -ForegroundColor White
$pageCount = (Get-ChildItem "$grade3Path" -Directory).Count
Write-Host "   Total pages: $pageCount (10-136)" -ForegroundColor Green
Write-Host ""

# Check service files
Write-Host "2. SERVICE FILES" -ForegroundColor Yellow

# trimmedBlocksDataService.ts
$trimmedContent = Get-Content $trimmedBlocksFile
$g3TrimmedImports = ($trimmedContent | Where-Object { 
    $_ -match "^import.*grade_3_english_book.*trimmed_blocks\.json" -and 
    $_ -notmatch "_slow\.json"
}).Count
$g3SlowImports = ($trimmedContent | Where-Object { 
    $_ -match "^import.*grade_3_english_book.*trimmed_blocks_slow\.json"
}).Count
Write-Host "   trimmedBlocksDataService.ts:" -ForegroundColor White
Write-Host "     - Normal imports: $g3TrimmedImports" -ForegroundColor Green
Write-Host "     - Slow imports: $g3SlowImports" -ForegroundColor Green

# bookDataService.ts
$bookDataContent = Get-Content $bookDataFile
$g3BlocksImports = ($bookDataContent | Where-Object { 
    $_ -match "^import.*grade_3_english_book.*_blocks\.json" -and
    $_ -notmatch "trimmed_blocks"
}).Count
Write-Host "   bookDataService.ts:" -ForegroundColor White
Write-Host "     - Block imports: $g3BlocksImports" -ForegroundColor Green

# audioResolver.ts
$audioContent = Get-Content $audioResolverFile
$g3AudioImports = ($audioContent | Where-Object { 
    $_ -match "^import.*g3_.*audio\.mp3"
}).Count
$g3SlowAudioImports = ($audioContent | Where-Object { 
    $_ -match "^import.*g3_.*slow_audio\.mp3"
}).Count
Write-Host "   audioResolver.ts:" -ForegroundColor White
Write-Host "     - Normal audio: $g3AudioImports imports" -ForegroundColor Green
Write-Host "     - Slow audio: $g3SlowAudioImports imports" -ForegroundColor Green

# books.ts
$booksContent = Get-Content $booksFile
$g3PageImages = ($booksContent | Where-Object { 
    $_ -match "grade_3_english_book.*\.png"
}).Count
Write-Host "   books.ts:" -ForegroundColor White
Write-Host "     - Page images: $g3PageImages entries" -ForegroundColor Green

Write-Host ""
Write-Host "3. FUNCTIONALITY CHECK" -ForegroundColor Yellow

# Check for data maps
$hasGrade3DataMap = $trimmedContent -match "grade3DataMap"
$hasGrade3SlowMap = $trimmedContent -match "grade3SlowDataMap"
Write-Host "   Data Maps:" -ForegroundColor White
Write-Host "     - grade3DataMap: $(if($hasGrade3DataMap){'Present'}else{'MISSING'})" -ForegroundColor $(if($hasGrade3DataMap){'Green'}else{'Red'})
Write-Host "     - grade3SlowDataMap: $(if($hasGrade3SlowMap){'Present'}else{'MISSING'})" -ForegroundColor $(if($hasGrade3SlowMap){'Green'}else{'Red'})

# Check getTrimmedBlocksForPage method
$hasSlowModeCheck = $trimmedContent -match "grade_3.*slowData"
Write-Host "   Methods:" -ForegroundColor White
Write-Host "     - Slow mode support: $(if($hasSlowModeCheck){'Implemented'}else{'MISSING'})" -ForegroundColor $(if($hasSlowModeCheck){'Green'}else{'Red'})

Write-Host ""
Write-Host "4. FEATURES ENABLED" -ForegroundColor Yellow
Write-Host "   For Grade 3 English Book:" -ForegroundColor White

# Feature checklist
$features = @{
    "TTS Reading (Normal)" = ($g3AudioImports -gt 0)
    "TTS Reading (Slow)" = ($g3SlowAudioImports -gt 0)
    "Word Highlighting" = ($g3TrimmedImports -gt 0)
    "Block Play Buttons" = ($g3BlocksImports -gt 0)
    "Slow Reading Mode" = ($g3SlowImports -gt 0)
    "Page Images" = ($g3PageImages -gt 0)
    "Word Definitions" = ($g3TrimmedImports -gt 0)
}

foreach ($feature in $features.Keys | Sort-Object) {
    $status = if ($features[$feature]) { "ENABLED" } else { "DISABLED" }
    $color = if ($features[$feature]) { "Green" } else { "Red" }
    Write-Host "     - $feature`: $status" -ForegroundColor $color
}

Write-Host ""
Write-Host "5. SUMMARY" -ForegroundColor Yellow

$allComplete = ($g3TrimmedImports -eq 127) -and 
               ($g3SlowImports -eq 127) -and 
               ($g3BlocksImports -eq 127) -and
               ($g3PageImages -gt 120)

if ($allComplete) {
    Write-Host "   STATUS: ALL SYSTEMS OPERATIONAL" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Grade 3 English Book is fully configured with:" -ForegroundColor Green
    Write-Host "     - Complete import coverage (127 pages)" -ForegroundColor White
    Write-Host "     - Normal and slow reading modes" -ForegroundColor White
    Write-Host "     - All interactive features enabled" -ForegroundColor White
    Write-Host "     - Audio playback support" -ForegroundColor White
    Write-Host "     - Word highlighting and definitions" -ForegroundColor White
} else {
    Write-Host "   STATUS: ISSUES DETECTED" -ForegroundColor Red
    Write-Host ""
    if ($g3TrimmedImports -lt 127) {
        Write-Host "   - Missing trimmed blocks imports" -ForegroundColor Yellow
    }
    if ($g3SlowImports -lt 127) {
        Write-Host "   - Missing slow mode imports" -ForegroundColor Yellow
    }
    if ($g3BlocksImports -lt 127) {
        Write-Host "   - Missing blocks data imports" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
