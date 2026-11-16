$ErrorActionPreference = 'Stop'
  $root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
  $src  = Join-Path $root 'src'
$utf8 = New-Object System.Text.UTF8Encoding($false)

# 1. index.html vive en la raiz: sus rutas no llevan ".."
$index = Join-Path $root 'index.html'
$t = [IO.File]::ReadAllText($index)
$t = $t.Replace('../assets/stock/', 'assets/stock/')
[IO.File]::WriteAllText($index, $t, $utf8)

# 2. los ficheros que viven en src/ necesitan el prefijo "../"
foreach ($nombre in @('04-modo-oscuro.html','05-movil.html','06-portada-oscuro.html','07-portada-movil.html','01-hero.html','02-productos-proceso.html','03-resenas-contacto.html')) {
  $p = Join-Path $src $nombre
  if (-not (Test-Path -LiteralPath $p)) { continue }
  $c = [IO.File]::ReadAllText($p)
  $n = $c.Replace('src="assets/stock/', 'src="../assets/stock/')
  if ($n -ne $c) { [IO.File]::WriteAllText($p, $n, $utf8) }
}

# 3. comprobacion: toda referencia a imagen debe existir desde su propio fichero
$htmls = @()
$htmls += (Get-ChildItem -LiteralPath $root -Filter '*.html' -File)
$htmls += (Get-ChildItem -LiteralPath $src  -Filter '*.html' -File)
"--- resolucion de imagenes ---"
$rotas = 0
$uso = @{}
foreach ($f in $htmls) {
  $dir = $f.DirectoryName
  $c = [IO.File]::ReadAllText($f.FullName)
  foreach ($m in [regex]::Matches($c, '<img[^>]*src="([^"]+)"')) {
    $rel = $m.Groups[1].Value
    $destino = [IO.Path]::GetFullPath((Join-Path $dir $rel))
    $ok = Test-Path -LiteralPath $destino
    if (-not $ok) { $rotas++ }
    $nombre = [IO.Path]::GetFileName($rel)
    $rel2 = $f.FullName.Substring($root.Length + 1).Replace('\', '/')
    if (-not $uso.ContainsKey($nombre)) { $uso[$nombre] = @() }
    if ($uso[$nombre] -notcontains $rel2) { $uso[$nombre] += $rel2 }
    "{0,-34} {1,-30} {2}" -f $rel2, $rel, $(if ($ok) { 'OK' } else { 'ROTA' })
  }
}
"referencias rotas: $rotas"

# 4. credits.json: actualizar donde se usa cada imagen
$creditsPath = Join-Path $root 'assets\stock\credits.json'
$c = [IO.File]::ReadAllText($creditsPath) | ConvertFrom-Json
foreach ($img in $c.imagenes) {
  $nombre = $img.archivo
  if ($uso.ContainsKey($nombre)) {
    $img.usado_en = @($uso[$nombre] | Sort-Object)
  } else {
    $img.usado_en = @()
  }
}
$c.fecha_descarga = (Get-Date -Format 'yyyy-MM-dd')
$json = $c | ConvertTo-Json -Depth 8
[IO.File]::WriteAllText($creditsPath, $json, $utf8)

"--- creditos actualizados ---"
foreach ($img in $c.imagenes) { "{0,-22} -> {1}" -f $img.archivo, ($img.usado_en -join ', ') }