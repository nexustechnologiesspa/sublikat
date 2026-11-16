$ErrorActionPreference = 'Stop'
# Reconstruye el cuerpo de index.html (portada aprobada) conservando el diseno original
# y aplicando las decisiones confirmadas por el cliente. Fuente de verdad del contenido:
# build/contenido-inicio.json + build/meta-inicio.json.
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$index = Join-Path $root 'index.html'

$raw = [IO.File]::ReadAllText($index, [Text.Encoding]::UTF8)
$t = $raw -replace "`r`n", "`n"

$cfg = ([IO.File]::ReadAllText((Join-Path $PSScriptRoot 'contenido-inicio.json'), [Text.Encoding]::UTF8) | ConvertFrom-Json)
$meta = ([IO.File]::ReadAllText((Join-Path $PSScriptRoot 'meta-inicio.json'), [Text.Encoding]::UTF8) | ConvertFrom-Json)

function Slice([string]$text, [string]$start, [string]$end) {
  $i = $text.IndexOf($start)
  if ($i -lt 0) { throw ("START not found: " + $start) }
  $j = $text.IndexOf($end, $i + $start.Length)
  if ($j -lt 0) { throw ("END not found: " + $end) }
  return $text.Substring($i, $j - $i)
}

$head = $t.Substring(0, $t.IndexOf('<body class='))
$hero       = Slice $t '    <!-- CINTA DECORATIVA / TOLDO DE TALLER' '    <!-- FRANJA DE CUATRO ICONOS SVG Y TEXTO CORTO'
$beneficios = Slice $t '    <!-- FRANJA DE CUATRO ICONOS SVG Y TEXTO CORTO' '  </main>'
$catalogo   = Slice $t '    <section aria-labelledby="heading-catalogo"' '    <section aria-labelledby="heading-proceso"'
$proceso    = Slice $t '    <section aria-labelledby="heading-proceso"' '    <footer class="pt-4 border-t-2'
$compromisos = Slice $t '    <section class="reviews-section"' '    <section class="contact-section"'
$contacto   = Slice $t '    <section class="contact-section"' '  </main>'

$plantilla = @"
<body class="min-h-screen pb-16">

{{AVISO}}

  <!-- OD:CABECERA -->
  <!-- /OD:CABECERA -->

  <main id="contenido" class="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pb-16">

{{HERO}}
{{BENEFICIOS}}
{{POLERONES}}
{{ENVIOS}}
{{CATALOGO}}
{{PROCESO}}
{{COMPROMISOS}}
{{CONTACTO}}

  </main>

  <!-- OD:PIE -->
  <!-- /OD:PIE -->

  <!-- OD:WIDGET -->
  <!-- /OD:WIDGET -->

</body>
</html>
"@

$out = $plantilla
$out = $out.Replace('{{AVISO}}', $cfg.bloques.aviso)
$out = $out.Replace('{{HERO}}', $hero)
$out = $out.Replace('{{BENEFICIOS}}', $beneficios)
$out = $out.Replace('{{POLERONES}}', $cfg.bloques.polerones)
$out = $out.Replace('{{ENVIOS}}', $cfg.bloques.envios)
$out = $out.Replace('{{CATALOGO}}', $catalogo)
$out = $out.Replace('{{PROCESO}}', $proceso)
$out = $out.Replace('{{COMPROMISOS}}', $compromisos)
$out = $out.Replace('{{CONTACTO}}', $contacto)

$fallos = @()
foreach ($r in $cfg.reemplazos) {
  $find = [string]$r.find
  $rep = [string]$r.replace
  if ($find -eq $find.Trim() -and $find.Length -lt 3) { continue }
  if ($out.Contains($find)) {
    $out = $out.Replace($find, $rep)
  } else {
    # Segundo intento tolerante a saltos de linea y espacios.
    $partes = [regex]::Split($find.Trim(), '\s+')
    $patron = ($partes | ForEach-Object { [regex]::Escape($_) }) -join '\s+'
    $m = [regex]::Match($out, $patron)
    if ($m.Success) {
      $out = $out.Remove($m.Index, $m.Length).Insert($m.Index, $rep)
    } else {
      $fallos += $find.Substring(0, [Math]::Min(72, $find.Length))
    }
  }
}
$out = $out.Replace('{{FICHA_POLERONES}}', $cfg.bloques.ficha_polerones)
$out = $out.Replace('{{FORMULARIO_EXTRA}}', $cfg.bloques.formulario_extra)

# titulo y descripcion
$m = [regex]::Match($head, '<title>.*?</title>')
if ($m.Success) { $head = $head.Remove($m.Index, $m.Length).Insert($m.Index, '<title>' + $meta.titulo + '</title>') }
$m = [regex]::Match($head, '<meta name="description" content="[^"]*"')
if ($m.Success) { $head = $head.Remove($m.Index, $m.Length).Insert($m.Index, '<meta name="description" content="' + $meta.descripcion + '"') }
$m = [regex]::Match($head, '<meta property="og:title" content="[^"]*"')
if ($m.Success) { $head = $head.Remove($m.Index, $m.Length).Insert($m.Index, '<meta property="og:title" content="' + $meta.titulo + '"') }
$m = [regex]::Match($head, '<meta property="og:description" content="[^"]*"')
if ($m.Success) { $head = $head.Remove($m.Index, $m.Length).Insert($m.Index, '<meta property="og:description" content="' + $meta.descripcion + '"') }

[IO.File]::WriteAllText($index, $head + $out, $utf8)

Write-Output ("index.html reconstruido: " + ($head.Length + $out.Length) + " caracteres")
if ($fallos.Count) {
  Write-Output ("Reemplazos no aplicados (" + $fallos.Count + "):")
  foreach ($f in $fallos) { Write-Output ("  - " + $f) }
} else {
  Write-Output "Todos los reemplazos se aplicaron."
}
