$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Read-Utf8([string]$ruta) { return [IO.File]::ReadAllText($ruta) }

function Reemplazar-Zona([string]$texto, [string]$marcador, [string]$contenido, [bool]$obligatorio) {
  $apertura = "<!-- OD:$marcador -->"
  $cierre = "<!-- /OD:$marcador -->"
  $ini = $texto.IndexOf($apertura)
  $fin = $texto.IndexOf($cierre)
  if ($ini -lt 0 -or $fin -lt 0 -or $fin -lt $ini) {
    if ($obligatorio) { throw "Falta el marcador OD:$marcador" }
    return $texto
  }
  $ini += $apertura.Length
  return $texto.Substring(0, $ini) + "`n" + $contenido + "`n" + $texto.Substring($fin)
}

# Inserta una zona OD: si el fichero restaurado no la trae, para que el
# regenerador sea idempotente y tolere una restauracion desde el historial.
function Asegurar-Zona([string]$texto, [string]$marcador, [string]$modo) {
  $apertura = "<!-- OD:$marcador -->"
  $cierre = "<!-- /OD:$marcador -->"
  if ($texto.Contains($apertura)) { return $texto }
  $bloque = "  " + $apertura + "`n  " + $cierre
  if ($modo -eq 'cuerpo') {
    $i = $texto.IndexOf('<body')
    if ($i -lt 0) { return $texto }
    $fin = $texto.IndexOf('>', $i)
    if ($fin -lt 0) { return $texto }
    $pos = $fin + 1
    return $texto.Substring(0, $pos) + "`n" + $bloque + $texto.Substring($pos)
  }
  $i = $texto.IndexOf('</body>')
  if ($i -lt 0) { return $texto }
  if ($modo -eq 'head') {
    $h = $texto.IndexOf('</head>')
    if ($h -lt 0) { return $texto }
    return $texto.Substring(0, $h) + $bloque + "`n" + $texto.Substring($h)
  }
  return $texto.Substring(0, $i) + $bloque + "`n" + $texto.Substring($i)
}

# Inserta una zona de seccion manteniendo el orden del documento: va justo
# despues del cierre de la zona anterior.
function Asegurar-Zona-Orden([string]$texto, [string]$marcador, [string]$anterior) {
  $apertura = "<!-- OD:$marcador -->"
  $cierre = "<!-- /OD:$marcador -->"
  if ($texto.Contains($apertura)) { return $texto }
  $bloque = "  $apertura`n  $cierre"
  if ($anterior) {
    $fin = $texto.IndexOf("<!-- /OD:$anterior -->")
    if ($fin -lt 0) { throw "Falta el marcador OD:$anterior para insertar OD:$marcador en orden" }
    $pos = $fin + "<!-- /OD:$anterior -->".Length
    return $texto.Substring(0, $pos) + "`n`n" + $bloque + $texto.Substring($pos)
  }
  $i = $texto.IndexOf('<body')
  if ($i -lt 0) { throw "No se encuentra <body>" }
  $fin = $texto.IndexOf('>', $i)
  $pos = $fin + 1
  return $texto.Substring(0, $pos) + "`n`n" + $bloque + $texto.Substring($pos)
}

$tokens    = (Read-Utf8 (Join-Path $PSScriptRoot 'tokens.css')).TrimEnd()
$app       = (Read-Utf8 (Join-Path $PSScriptRoot 'app.js')).TrimEnd()
$head      = (Read-Utf8 (Join-Path $PSScriptRoot 'head.html')).TrimEnd()
$htmlExito = (Read-Utf8 (Join-Path $PSScriptRoot 'exito-contacto.html')).TrimEnd()

# Orden de carga del CSS.
#   1. tokens.css        variables de diseno (una definicion por tema)
#   2. css/base.css      reset, tipografia y utilidades base
#   3. css/components.css componentes compartidos y utilidades de color
#   4. un archivo por seccion, en el orden en que aparecen en la pagina
$cssBase = (Read-Utf8 (Join-Path $PSScriptRoot 'css/base.css')).TrimEnd()
$ordenCss = @(
  'css/components.css',
  'css/header.css',
  'css/portada.css',
  'css/hero.css',
  'css/beneficios.css',
  'css/aviso.css',
  'css/catalogo.css',
  'css/proceso.css',
  'css/compromisos.css',
  'css/contacto.css',
  'css/footer.css',
  'css/widget.css'
)
$cssEstilos = (($ordenCss | ForEach-Object { (Read-Utf8 (Join-Path $PSScriptRoot $_)).TrimEnd() }) -join "`n`n")

# Movimiento: capa propia, despues de ESTILOS. Ver MOTION.md.
$cssMotion = (Read-Utf8 (Join-Path $PSScriptRoot 'motion.css')).TrimEnd()

# --------------------------------------------------- catalogo desde datos
# Las 5 pestanas, los 5 paneles con sus fichas y las opciones del desplegable
# del formulario se generan desde build/data/catalogo.json y las plantillas.
# Para anadir un producto basta con editar el JSON.
function Sustituye([string]$texto, [hashtable]$vars) {
  foreach ($clave in $vars.Keys) { $texto = $texto.Replace("{{$clave}}", [string]$vars[$clave]) }
  return $texto
}

$datos = (Read-Utf8 (Join-Path $PSScriptRoot 'data/catalogo.json')) | ConvertFrom-Json
$tplPestana = (Read-Utf8 (Join-Path $PSScriptRoot 'templates/pestana.html')).TrimEnd()
$tplFicha = (Read-Utf8 (Join-Path $PSScriptRoot 'templates/ficha.html')).TrimEnd()

$lineasPestanas = @()
$paneles = @()
$opciones = @()
$indice = 0
foreach ($categoria in $datos.categorias) {
  $indice++
  $activo = if ($indice -eq 1) { 'true' } else { 'false' }
  $foco = if ($indice -eq 1) { '0' } else { '-1' }
  $lineasPestanas += (Sustituye $tplPestana @{
    id = $categoria.id; nombre = $categoria.nombre
    conteo = $categoria.productos.Count; seleccionada = $activo; tabindex = $foco
  })

  $fichas = @()
  foreach ($idProducto in $categoria.productos) {
    $producto = $datos.productos | Where-Object { $_.id -eq $idProducto }
    $icono = (Read-Utf8 (Join-Path $PSScriptRoot ("icons/" + $producto.icono))).TrimEnd()
    $ficha = Sustituye $tplFicha @{ id = $producto.id; nombre = $producto.nombre; icono = $icono }
    if ($producto.nota) {
      $ficha = $ficha.Replace("{{nota}}", ("<p class=`"text-sm tx-muted mt-1 font-semibold`">" + $producto.nota + "</p>"))
    } else {
      $ficha = [regex]::Replace($ficha, "(?m)^[ \t]*\{\{nota\}\}\r?\n", "")
    }
    $fichas += $ficha
  }
  $oculto = if ($indice -eq 1) { "" } else { " hidden" }
  $paneles += "      <!-- Categoria $indice -->"
  $paneles += "      <section id=`"cat-$($categoria.id)`" role=`"tabpanel`" aria-labelledby=`"tab-cat-$($categoria.id)`" data-od-id=`"cat-$($categoria.id)`" class=`"space-y-4 scroll-mt-24`"$oculto>"
  $paneles += "        <div class=`"flex flex-wrap items-baseline gap-3`">"
  $paneles += "          <h3 class=`"font-display text-3xl tx-ink`">$($categoria.nombre)</h3>"
  $paneles += "          <span class=`"text-xs font-bold tx-muted uppercase tracking-wider`">$($categoria.productos.Count) productos</span>"
  $paneles += "        </div>"
  $paneles += "        <div class=`"grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6`">"
  $paneles += ""
  $paneles += ($fichas -join "`n`n")
  $paneles += ""
  $paneles += "        </div>"
  $paneles += "      </section>"
  $paneles += ""

  $opciones += "                <optgroup label=`"$($categoria.nombre)`">"
  $primero = $true
  foreach ($idProducto in $categoria.productos) {
    $producto = $datos.productos | Where-Object { $_.id -eq $idProducto }
    $seleccionado = if ($primero -and $indice -eq 1) { " selected" } else { "" }
    $opciones += "                  <option value=`"$($producto.selectValor)`"$seleccionado>$($producto.selectTexto)</option>"
    $primero = $false
  }
  $opciones += "                </optgroup>"
}
foreach ($extra in $datos.opciones_extra) {
  $opciones += "                <option value=`"$($extra.valor)`">$($extra.texto)</option>"
}
$pestanasGeneradas = ($lineasPestanas -join "`n")
if ($paneles.Count -gt 0 -and $paneles[-1] -eq "") { $paneles = $paneles[0..($paneles.Count - 2)] }
$panelesGenerados = ($paneles -join "`n")
$opcionesGeneradas = ($opciones -join "`n")

# Parciales de build/sections/, en el orden en que se montan en la pagina.
$secciones = @(
  @{ zona = 'HEADER';      fichero = 'sections/header.html';          anterior = '' },
  @{ zona = 'PORTADA';     fichero = 'sections/portada.html';         anterior = 'HEADER' },
  @{ zona = 'HERO';        fichero = 'sections/hero.html';            anterior = 'PORTADA' },
  @{ zona = 'BENEFICIOS';  fichero = 'sections/beneficios.html';      anterior = 'HERO' },
  @{ zona = 'AVISO';       fichero = 'sections/aviso.html';           anterior = 'BENEFICIOS' },
  @{ zona = 'CATALOGO';    fichero = 'sections/catalogo.html';        anterior = 'AVISO' },
  @{ zona = 'PROCESO';     fichero = 'sections/proceso.html';         anterior = 'CATALOGO' },
  @{ zona = 'COMPROMISOS'; fichero = 'sections/compromisos.html';     anterior = 'PROCESO' },
  @{ zona = 'CONTACTO';    fichero = 'sections/contacto.html';        anterior = 'COMPROMISOS' },
  @{ zona = 'FOOTER';      fichero = 'sections/footer.html';          anterior = 'CONTACTO' },
  @{ zona = 'WIDGET';      fichero = 'sections/widget-whatsapp.html'; anterior = 'FOOTER' }
)

$paginas = @('index.html', 'tienda.html', 'personalizados.html', 'cotizar.html', 'contacto.html')

foreach ($pagina in $paginas) {
  $ruta = Join-Path $root $pagina
  if (-not (Test-Path -LiteralPath $ruta)) {
    Write-Output "  $pagina : todavia no existe, se omite"
    continue
  }
  $t = Read-Utf8 $ruta
  $t = Asegurar-Zona $t 'BASE' 'head'
  $t = Asegurar-Zona $t 'TOKENS' 'head'
  $t = Asegurar-Zona $t 'ESTILOS' 'head'
  $t = Asegurar-Zona-Orden $t 'MOTION' 'ESTILOS'
  $t = Asegurar-Zona $t 'APP' 'head'
  $t = Asegurar-Zona $t 'HEAD' 'head'
  # La vista previa de la app reescribe la etiqueta <body> al servirla y le
  # añade un background-color en linea. Ese color pisa el token --bg, deja el
  # fondo gris en vez del de la marca y rompe el contraste del modo oscuro.
  # El ensamblador deja siempre la etiqueta canonica.
  $t = [regex]::Replace($t, '(?s)<body[^>]*>', '<body class="min-h-screen pb-16">')
  # El cuerpo se reconstruye ENTERO a partir de los parciales. Antes solo se
  # rellenaban las zonas, y cualquier sobrante del HTML anterior (envoltorios
  # viejos, etiquetas sin cerrar) se colaba en el documento y lo descuadraba:
  # el pie acababa dentro de un <textarea> y no se veia. Con esta pasada los
  # parciales son la unica fuente y no puede quedar nada suelto.
  #
  #   <body>  cabecera  <main><div envoltorio>  secciones  </div></main>  pie  widget
  $envoltura = '    <div class="od-secciones w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6">'
  $cuerpo = New-Object System.Text.StringBuilder
  $dentroDeMain = $false
  foreach ($s in $secciones) {
    $contenido = (Read-Utf8 (Join-Path $PSScriptRoot $s.fichero)).TrimEnd()
    if ($s.zona -eq 'HERO') {
      [void]$cuerpo.Append("  <main>`n")
      [void]$cuerpo.Append($envoltura + "`n")
      $dentroDeMain = $true
    }
    if ($s.zona -eq 'FOOTER' -and $dentroDeMain) {
      [void]$cuerpo.Append("    </div>`n  </main>`n`n")
      $dentroDeMain = $false
    }
    [void]$cuerpo.Append("  <!-- OD:$($s.zona) -->`n")
    [void]$cuerpo.Append($contenido)
    [void]$cuerpo.Append("`n  <!-- /OD:$($s.zona) -->`n")
  }
  $t = [regex]::Replace($t, '(?s)(<body[^>]*>).*?(</body>)', {
    param($m)
    $m.Groups[1].Value + "`n" + $cuerpo.ToString() + "`n  " + $m.Groups[2].Value
  })
  foreach ($s in $secciones) {
    $t = Asegurar-Zona-Orden $t $s.zona $s.anterior
  }
  $t = Reemplazar-Zona $t 'BASE' ("  <style>`n" + $cssBase + "`n  </style>") $true
  $t = Reemplazar-Zona $t 'TOKENS' ("  <style>`n" + $tokens + "`n  </style>") $true
  $t = Reemplazar-Zona $t 'ESTILOS' ("  <style>`n" + $cssEstilos + "`n  </style>") $true
  $t = Reemplazar-Zona $t 'MOTION' ("  <style>`n" + $cssMotion + "`n  </style>") $true
  $t = Reemplazar-Zona $t 'APP' ("  <script>`n" + $app + "`n  </script>") $true
  $t = Reemplazar-Zona $t 'HEAD' $head $true
  foreach ($s in $secciones) {
    $contenido = (Read-Utf8 (Join-Path $PSScriptRoot $s.fichero)).TrimEnd()
    $t = Reemplazar-Zona $t $s.zona $contenido $true
  }
  $t = Reemplazar-Zona $t 'PESTANAS' $pestanasGeneradas $true
  $t = Reemplazar-Zona $t 'PANELES' $panelesGenerados $true
  $t = Reemplazar-Zona $t 'OPCIONES' $opcionesGeneradas $true
  $t = Reemplazar-Zona $t 'EXITO' $htmlExito $false
  [IO.File]::WriteAllText($ruta, $t, $utf8)
  Write-Output ("  {0} reconstruido ({1} caracteres)" -f $pagina, $t.Length)
}

Write-Output "Paginas reconstruidas desde build/"

# El contenido aprobado vive en build/contenido-inicio.json y se aplica SOBRE
# la pagina montada. Si se monta sin aplicar, la pagina vuelve al texto
# original de Stitch, asi que los dos pasos van siempre juntos.
$aplicar = Join-Path $PSScriptRoot 'aplicar-contenido.ps1'
if (Test-Path -LiteralPath $aplicar) {
  & $aplicar
}
