# Generate Grade 5 and Grade 6 initialization code for trimmedBlocksDataService.ts

# Grade 5 normal initialization (pages 10-150)
Write-Output "`n    // Initialize Grade 5 English Book pages (10-150)"
10..150 | ForEach-Object {
    Write-Output "    this.grade5DataMap.set($_, page$($_)G5TrimmedBlocks as any);"
}

# Grade 6 normal initialization (pages 14-135)
Write-Output "`n    // Initialize Grade 6 English Book pages (14-135)"
14..135 | ForEach-Object {
    Write-Output "    this.grade6DataMap.set($_, page$($_)G6TrimmedBlocks as any);"
}

# Grade 5 slow initialization (pages 10-150)
Write-Output "`n    // Initialize Grade 5 English Book SLOW pages (10-150)"
10..150 | ForEach-Object {
    Write-Output "    this.grade5SlowDataMap.set($_, page$($_)G5SlowTrimmedBlocks as any);"
}

# Grade 6 slow initialization (pages 14-135)
Write-Output "`n    // Initialize Grade 6 English Book SLOW pages (14-135)"
14..135 | ForEach-Object {
    Write-Output "    this.grade6SlowDataMap.set($_, page$($_)G6SlowTrimmedBlocks as any);"
}
