Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('client game.docx')
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$content = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()
$xml = [xml]$content
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
$nodes = $xml.SelectNodes("//w:p", $ns)
$lines = @()
foreach ($p in $nodes) {
    $tNodes = $p.SelectNodes(".//w:t", $ns)
    $text = ($tNodes | ForEach-Object { $_.InnerText }) -join ""
    if ($text.Trim().Length -gt 0) {
        $lines += $text
    }
}
$lines | Out-File -FilePath "client_game_text.txt" -Encoding utf8
Write-Output "Extracted $($lines.Count) paragraphs"
