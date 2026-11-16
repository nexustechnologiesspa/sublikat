$ErrorActionPreference = 'Stop'
# Aplica sobre index.html las correcciones de contenido de build/contenido-inicio.json.
# Es idempotente: los reemplazos ya aplicados no vuelven a encontrarse y se omiten.
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$index = Join-Path $root 'index.html'

$t = ([IO.File]::ReadAllText($index, [Text.Encoding]::UTF8)) -replace "`r`n", "`n"
$cfg = ([IO.File]::ReadAllText((Join-Path $PSScriptRoot 'contenido-inicio.json'), [Text.Encoding]::UTF8) | ConvertFrom-Json)

$aplicados = 0
$fallos = @()
foreach ($r in $cfg.reemplazos) {
  $find = [string]$r.find
  $rep = [string]$r.replace
  if ($find -eq $find.Trim() -and $find.Length -lt 3) { continue }
  if ($out -eq $null) { }
  if ($t.Contains($find)) {
    $t = $t.Replace($find, $rep)
    $aplicados++
    continue
  }
  $partes = [regex]::Split($find.Trim(), '\s+')
  $patron = ($partes | ForEach-Object { [regex]::Escape($_) }) -join '\s+'
  $m = [regex]::Match($t, $patron)
  if ($m.Success) {
    $t = $t.Remove($m.Index, $m.Length).Insert($m.Index, $rep)
    $aplicados++
  } else {
    $fallos += $find.Substring(0, [Math]::Min(72, $find.Length))
  }
}
$t = $t.Replace('{{FICHA_POLERONES}}', $cfg.bloques.ficha_polerones)
$t = $t.Replace('{{FORMULARIO_EXTRA}}', $cfg.bloques.formulario_extra)

[IO.File]::WriteAllText($index, $t, $utf8)
Write-Output ("Reemplazos aplicados: " + $aplicados + " | no encontrados: " + $fallos.Count)
foreach ($f in $fallos) { Write-Output ("  - " + $f) }
