$ErrorActionPreference = 'Stop'
# Anade los ganchos semanticos del movimiento al marcado.
# No cambia composicion, textos ni clases de estilo: solo anade clases
# od-* que build/motion.css utilizara como activadores.
# Es idempotente: si la clase ya esta, no se vuelve a anadir.
#
# Objetivos: index.html y los parciales de build/sections/*.html.
# Los ganchos son marcado, asi que viven en el origen (los parciales);
# index.html los recibe igual porque es donde se ensambla todo.
#
# Orden de trabajo correcto:
#   1. powershell -File build\ganchos-scroll.ps1     (pone los ganchos)
#   2. powershell -File build\actualizar-portada.ps1 (ensambla)
#   3. powershell -File build\ganchos-scroll.ps1     (no-op: 0 aplicados)
#
# Actualizado el 2026-11-12: anade el bloque $exactos (contacto) y aplica
# tambien sobre los parciales, para que el ensamblador no borre los ganchos.

$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)

# Cada par: fragmento exacto del class actual -> fragmento con el gancho.
# Se busca el fragmento seguido de un espacio y se le anade la clase al final.
$pares = @(
  # Cabecera
  @('sticky top-0 z-50 w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-3 pb-3', 'od-header'),
  # Hero
  @('bg-surface sticker-border sticker-shadow-lg p-6 sm:p-10 lg:p-12 relative overflow-hidden', 'od-hero'),
  @('lg:col-span-7 space-y-6', 'od-hero__body'),
  @('lg:col-span-5 flex justify-center', 'od-hero__media-col'),
  @('inline-block bg-soft tx-ink px-3.5 py-1 text-xs font-black uppercase tracking-wider badge-pill', 'od-hero__claim'),
  @('font-display text-4xl sm:text-5xl lg:text-[62px] leading-[1.08] tx-ink tracking-tight', 'od-hero__title'),
  @('tx-ink text-base sm:text-lg leading-relaxed max-w-xl font-semibold opacity-95', 'od-hero__lead'),
  @('pt-2 flex flex-wrap items-center gap-4', 'od-hero__ctas'),
  @('pt-2 flex items-center gap-2 text-xs tx-muted', 'od-hero__note'),
  @('w-full h-full bg-surface sticker-border sticker-shadow-lg p-2.5 sm:p-3 flex flex-col', 'od-hero__media'),
  @('absolute -top-10 -right-10 w-24 h-24 bg-awning opacity-60 rotate-45 pointer-events-none', 'od-hero__deco'),
  @('absolute -top-4 -right-3 sm:-right-4 z-20 bg-awning tx-awningink px-4 py-1.5 font-body text-[.72rem] font-extrabold uppercase tracking-[0.14em] border bd-ink rounded-full select-none flex items-center gap-1.5', 'od-hero__tape'),
  @('inline-flex items-center gap-2.5 bg-awning tx-awningink px-4 py-2 sticker-tag text-xs sm:text-sm font-extrabold uppercase tracking-wide', 'od-parallax'),
  # Beneficios
  @('swipe grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5', 'od-stagger od-stagger-2'),
  @('bg-surface sticker-border sticker-shadow-md p-5 flex items-center gap-4 hover:translate-y-[-2px] transition-transform', 'od-fade'),
  # Catalogo
  @('bg-surface ink-border-thick rounded-sticker shadow-offset p-5 flex flex-col justify-between group hover:translate-y-[-2px] transition-transform', 'od-reveal'),
  @('bg-surface ink-border rounded-sticker shadow-offset-sm p-2 flex gap-2 overflow-x-auto', 'od-tablist'),
  # Proceso
  @('swipe grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative', 'od-steps od-stagger od-stagger-2'),
  @('bg-soft ink-border rounded-sticker shadow-offset-sm p-5 flex flex-col justify-between relative group hover-bg-soft2 transition-colors', 'od-step'),
  # Compromisos
  @('reviews-grid swipe', 'od-stagger'),
  # Pie
  @('class="site-footer"', 'class="site-footer od-reveal-soft"')
)

# Reemplazos exactos de fragmento completo (no de clase). Se usan cuando el gancho no va al final
# de un class="" sino en un atributo con id, para que el anclaje sea inequivoco.
$exactos = @(
  # Contacto: titulo y entradilla. El formulario NO se toca: nunca se oculta.
  @('<h2 id="contact-heading" class="section-title">', '<h2 id="contact-heading" class="section-title od-reveal-soft">'),
  @('<p class="section-subtitle">Respondemos en el mismo', '<p class="section-subtitle od-reveal-soft">Respondemos en el mismo')
)

# --- Objetivos: index.html + parciales ---
$objetivos = @(Join-Path $root 'index.html')
$carpetaSecciones = Join-Path $PSScriptRoot 'sections'
if (Test-Path $carpetaSecciones) {
  $objetivos += (Get-ChildItem $carpetaSecciones -Filter '*.html' | ForEach-Object { $_.FullName })
}

# Cargar textos
$textos = @{}
foreach ($f in $objetivos) { $textos[$f] = [IO.File]::ReadAllText($f, [Text.Encoding]::UTF8) }
$originales = @{}
foreach ($f in $objetivos) { $originales[$f] = $textos[$f] }

$total = 0
$sinAncla = @()

# 1. Reemplazos exactos
foreach ($par in $exactos) {
  $tocado = $false
  foreach ($f in $objetivos) {
    $t = $textos[$f]
    if ($t.Contains($par[1])) { $tocado = $true; continue }
    if (-not $t.Contains($par[0])) { continue }
    $textos[$f] = $t.Replace($par[0], $par[1])
    $total++
    $tocado = $true
  }
  if (-not $tocado) { $sinAncla += $par[0].Substring(0, [Math]::Min(60, $par[0].Length)) }
}

# 2. Pares de clase
foreach ($par in $pares) {
  $find = $par[0]
  $clase = $par[1]
  $tocado = $false
  foreach ($f in $objetivos) {
    $t = $textos[$f]
    if ($clase.StartsWith('class=')) {
      if ($t.Contains($clase)) { $tocado = $true; continue }
      if (-not $t.Contains($find)) { continue }
      $textos[$f] = $t.Replace($find, $clase)
      $total++
      $tocado = $true
      continue
    }
    if ($t.Contains($find + ' ' + $clase)) { $tocado = $true; continue }
    $patron = [regex]::Escape($find) + '(?! od-)'
    $n = ([regex]::Matches($t, $patron)).Count
    if ($n -eq 0) { continue }
    $textos[$f] = [regex]::Replace($t, $patron, ($find + ' ' + $clase))
    $total += $n
    $tocado = $true
  }
  if (-not $tocado) { $sinAncla += $find.Substring(0, [Math]::Min(60, $find.Length)) }
}

# Escribir solo los que cambiaron
foreach ($f in $objetivos) {
  if ($textos[$f] -ne $originales[$f]) {
    [IO.File]::WriteAllText($f, $textos[$f], $utf8)
    Write-Output ('  escrito: ' + $f.Replace($root + '\', ''))
  }
}

Write-Output ('Ganchos aplicados: ' + $total)
if ($sinAncla.Count) {
  Write-Output ('Anclas no encontradas en ningun fichero (' + $sinAncla.Count + '):')
  foreach ($x in $sinAncla) { Write-Output ('  - ' + $x) }
}
