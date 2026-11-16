$ErrorActionPreference = 'Stop'
# Limpia los hexadecimales literales que quedan fuera del bloque :root en las capas
# CSS y los traduce a tokens, para que el linter no marque raw-hex.
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)

$mapa = [ordered]@{
  '#413f4b' = 'var(--ink)'
  '#2f4a4e' = 'var(--ink)'
  '#ffffff' = 'var(--surface)'
  '#fffaf1' = 'var(--surface)'
  '#f5df2b' = 'var(--awning)'
  '#f7c948' = 'var(--awning)'
  '#e6e3f6' = 'var(--soft-2)'
  '#8a6200' = 'var(--star)'
  '#241811' = 'var(--footer-bg)'
  '#2c2019' = 'var(--footer-bg)'
  '#63432e' = 'var(--line)'
  '#f4e6c8' = 'var(--footer-text)'
  '#d9c7a7' = 'var(--footer-muted)'
  '#f52c93' = 'var(--accent)'
  '#c04a33' = 'var(--accent)'
  '#b8462f' = 'var(--accent-hover)'
  '#d6f4f9' = 'var(--accent-soft)'
  '#7a7448' = 'var(--success)'
  '#6fa96b' = 'var(--success)'
  '#467a49' = 'var(--success-text)'
  '#c98b5e' = 'var(--support)'
  '#f8f5f8' = 'var(--soft)'
  '#5a4130' = 'var(--line)'
  '#c9ad80' = 'var(--line-soft)'
  '#efedf9' = 'var(--soft)'
  '#cfcbde' = 'var(--line-soft)'
  '#757150' = 'var(--success)'
  '#fff0ef' = 'var(--field-bg-error)'
  '#f1efe1' = 'var(--assurance-bg)'
  '#2b5528' = 'var(--assurance-ink)'
  '#39271c' = 'var(--footer-bg)'
  '#382419' = 'var(--footer-bg)'
}

# Ajustes de valor de token (paleta oficial: grafito en el pie, oliva legible)
$tokens = Join-Path $root 'build\tokens.css'
$t = [IO.File]::ReadAllText($tokens, [Text.Encoding]::UTF8)
$valores = @(
  @('--footer-bg: #241811;', '--footer-bg: #413f4b;'),
  @('--footer-text: #f4e6c8;', '--footer-text: #ffffff;'),
  @('--footer-muted: #d9c7a7;', '--footer-muted: #d9d4ea;'),
  @('--star: #a87400;', '--star: #8a6200;')
)
foreach ($v in $valores) {
  if ($t.Contains($v[0])) { $t = $t.Replace($v[0], $v[1]) }
}

function Traducir([string]$texto) {
  $lineas = $texto -split "`n"
  for ($i = 0; $i -lt $lineas.Count; $i++) {
    $l = $lineas[$i]
    # no tocar las lineas que definen una variable CSS
    if ($l -match '^\s*--[a-z0-9-]+\s*:') { continue }
    foreach ($k in $mapa.Keys) {
      if ($l.Contains($k)) { $l = $l.Replace($k, $mapa[$k]) }
    }
    $lineas[$i] = $l
  }
  return ($lineas -join "`n")
}

$t = Traducir $t
[IO.File]::WriteAllText($tokens, $t, $utf8)

$base = Join-Path $root 'build\base.css'
$b = [IO.File]::ReadAllText($base, [Text.Encoding]::UTF8)
$b = Traducir $b
[IO.File]::WriteAllText($base, $b, $utf8)

# informe de hexadecimales que quedan fuera de :root
foreach ($f in @($base, $tokens)) {
  $restantes = @()
  foreach ($l in (([IO.File]::ReadAllText($f, [Text.Encoding]::UTF8)) -split "`n")) {
    if ($l -match '^\s*--[a-z0-9-]+\s*:') { continue }
    foreach ($m in [regex]::Matches($l, '#[0-9a-fA-F]{6}\b')) {
      if ($restantes -notcontains $m.Value) { $restantes += $m.Value }
    }
  }
  Write-Output ("  " + [IO.Path]::GetFileName($f) + " hex fuera de :root -> " + ($(if ($restantes.Count) { $restantes -join ' ' } else { 'ninguno' })))
}
Write-Output 'Limpieza de hexadecimales terminada.'
