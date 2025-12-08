# Script to check for missing audio files in Grade 3 English Book

$missingFiles = @()
$bookPath = "c:\rtr\data\grade_3_english_book"

# Get all page directories
$pageDirectories = Get-ChildItem $bookPath -Directory | Where-Object { $_.Name -match '_page_\d+$' }

foreach ($pageDir in $pageDirectories) {
    $pageName = $pageDir.Name
    $pageMatch = $pageName -match '_page_(\d+)$'
    if ($pageMatch) {
        $pageNum = $matches[1]
        
        # Read blocks.json to see what blocks exist
        $blocksJsonPath = Join-Path $pageDir.FullName "grade_3_english_book.pdf_page_$($pageNum)_blocks.json"
        
        if (Test-Path $blocksJsonPath) {
            try {
                $blocksData = Get-Content $blocksJsonPath -Raw | ConvertFrom-Json
                $blockIds = $blocksData.PSObject.Properties.Name | Sort-Object
                
                foreach ($blockId in $blockIds) {
                    # Check for normal audio file
                    $normalAudioFile = Join-Path $pageDir.FullName "block_$($pageNum)_$($blockId)_audio.mp3"
                    if (-not (Test-Path $normalAudioFile)) {
                        $missingFiles += @{
                            Page = $pageNum
                            Block = $blockId
                            Type = "normal"
                            File = "block_$($pageNum)_$($blockId)_audio.mp3"
                        }
                    }
                    
                    # Check for slow audio file
                    $slowAudioFile = Join-Path $pageDir.FullName "block_$($pageNum)_$($blockId)_slow_audio.mp3"
                    if (-not (Test-Path $slowAudioFile)) {
                        $missingFiles += @{
                            Page = $pageNum
                            Block = $blockId
                            Type = "slow"
                            File = "block_$($pageNum)_$($blockId)_slow_audio.mp3"
                        }
                    }
                }
            }
            catch {
                Write-Host "Error reading blocks.json for page $pageNum`: $_"
            }
        }
    }
}

Write-Host "`nMissing Audio Files Summary:"
Write-Host "============================"
Write-Host "Total missing files: $($missingFiles.Count)"

if ($missingFiles.Count -gt 0) {
    Write-Host "`nNormal Audio Files Missing:"
    $normalMissing = $missingFiles | Where-Object { $_.Type -eq "normal" }
    foreach ($missing in $normalMissing) {
        Write-Host "  Page $($missing.Page), Block $($missing.Block): $($missing.File)"
    }
    
    Write-Host "`nSlow Audio Files Missing:"
    $slowMissing = $missingFiles | Where-Object { $_.Type -eq "slow" }
    foreach ($missing in $slowMissing) {
        Write-Host "  Page $($missing.Page), Block $($missing.Block): $($missing.File)"
    }
}
