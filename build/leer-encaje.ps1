# Lector de encaje: convierte el CSV de preguntas/respuestas del cliente en
# datos/encaje.json, con las sugerencias de criterio del sistema de diseno.
# No decide el estado final (eso lo revisa el agente), solo prepara la materia prima.
#
# Uso:
#   powershell -File build/leer-encaje.ps1
#   powershell -File build/leer-encaje.ps1 -Csv "datos\otro.csv"

[CmdletBinding()]
param(
    [string]$Csv,
    [string]$JsonSalida
)

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot

if (-not $Csv) { $Csv = Join-Path $raiz 'datos\encaje-cliente.csv' }
if (-not $JsonSalida) { $JsonSalida = Join-Path $raiz 'datos\encaje.json' }
$criteriosPath = Join-Path $raiz 'build\criterios-encaje.json'

# Tabla de reemplazo sin acentos, escrita con codigos para que el propio
# script se lea igual en UTF-8 que en ANSI.
$script:reemplazos = @(
    @(0xE1, 0x61), @(0xE0, 0x61), @(0xE4, 0x61), @(0xE2, 0x61), @(0xE3, 0x61)
    @(0xE9, 0x65), @(0xE8, 0x65), @(0xEB, 0x65), @(0xEA, 0x65)
    @(0xED, 0x69), @(0xEC, 0x69), @(0xEF, 0x69), @(0xEE, 0x69)
    @(0xF3, 0x6F), @(0xF2, 0x6F), @(0xF6, 0x6F), @(0xF4, 0x6F)
    @(0xFA, 0x75), @(0xF9, 0x75), @(0xFC, 0x75), @(0xFB, 0x75)
    @(0xF1, 0x6E), @(0xE7, 0x63)
)

function Sin-Acentos([string]$texto) {
    if (-not $texto) { return '' }
    $s = $texto.ToLowerInvariant()
    foreach ($par in $script:reemplazos) { $s = $s.Replace([char]$par[0], [char]$par[1]) }
    return $s
}

if (-not (Test-Path -LiteralPath $Csv)) {
    Write-Output "Falta el CSV en: $Csv"
    Write-Output "Coloca el fichero en datos\encaje-cliente.csv o pasa -Csv con la ruta."
    exit 0
}

# --- lectura con deteccion de codificacion ------------------------------------
$bytes = [IO.File]::ReadAllBytes($Csv)
try {
    $utf8Estricto = New-Object System.Text.UTF8Encoding($false, $true)
    $texto = $utf8Estricto.GetString($bytes)
} catch {
    $texto = [Text.Encoding]::GetEncoding(1252).GetString($bytes)
}
if ($texto.Length -gt 0 -and [int]$texto[0] -eq 0xFEFF) { $texto = $texto.Substring(1) }

# --- deteccion de delimitador --------------------------------------------------
$primera = ($texto -split "`r?`n" | Where-Object { $_.Trim() -ne '' } | Select-Object -First 1)
$delim = ','
$mejor = -1
foreach ($cand in @(';', "`t", ',', '|')) {
    $n = ([regex]::Matches($primera, [regex]::Escape($cand))).Count
    if ($n -gt $mejor) { $mejor = $n; $delim = $cand }
}
if ($mejor -lt 1) { $delim = ',' }

$filas = @($texto | ConvertFrom-Csv -Delimiter $delim)
if ($filas.Count -eq 0) {
    Write-Output "El CSV no tiene filas de datos."
    exit 0
}

# --- deteccion de columnas -----------------------------------------------------
$props = @($filas[0].PSObject.Properties | ForEach-Object { $_.Name })
$colPregunta = -1
$colRespuesta = -1
for ($i = 0; $i -lt $props.Count; $i++) {
    $n = (Sin-Acentos $props[$i]).Trim()
    if ($colPregunta -lt 0 -and ($n -match 'pregunta|question|consulta|peticion|prompt|tema')) { $colPregunta = $i }
    elseif ($colRespuesta -lt 0 -and ($n -match 'respuesta|answer|reply|contestacion|valoracion')) { $colRespuesta = $i }
}
$tieneEncabezado = $true
if ($colPregunta -lt 0 -or $colRespuesta -lt 0) {
    $tieneEncabezado = $false
    $colPregunta = 0
    $colRespuesta = if ($props.Count -gt 1) { 1 } else { 0 }
    $filas = @($filas | Select-Object -Skip 1)
}

# --- criterios -----------------------------------------------------------------
$criterios = @()
if (Test-Path -LiteralPath $criteriosPath) {
    $criterios = @((Get-Content -LiteralPath $criteriosPath -Raw -Encoding UTF8 | ConvertFrom-Json).criterios)
}

function Get-Cell($fila, [int]$indice) {
    $miembros = @($fila.PSObject.Properties)
    if ($indice -lt $miembros.Count) { return [string]$miembros[$indice].Value }
    return ''
}

$pares = @()
$i = 0
foreach ($f in $filas) {
    $i++
    $pregunta = (Get-Cell $f $colPregunta).Trim()
    $respuesta = (Get-Cell $f $colRespuesta).Trim()
    if ($pregunta -eq '' -and $respuesta -eq '') { continue }

    $norm = Sin-Acentos $respuesta
    $hits = @()
    foreach ($crit in $criterios) {
        foreach ($palabra in $crit.palabras) {
            if ($norm.Contains((Sin-Acentos $palabra))) { $hits += $crit.id; break }
        }
    }

    $pares += [pscustomobject]@{
        indice    = $i
        pregunta  = $pregunta
        respuesta = $respuesta
        vacia     = ($respuesta -eq '')
        criterios = $hits
    }
}

$salida = [pscustomobject]@{
    fuente           = $Csv
    generado         = (Get-Date).ToString('s')
    delimitador      = $delim
    columnas         = @{ pregunta = $props[$colPregunta]; respuesta = $props[$colRespuesta] }
    tiene_encabezado = $tieneEncabezado
    total            = $pares.Count
    pares            = $pares
}

$dir = Split-Path -Parent $JsonSalida
if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
$utf8Salida = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText($JsonSalida, ($salida | ConvertTo-Json -Depth 6), $utf8Salida)

Write-Output "CSV leido: $Csv"
Write-Output "Pares: $($pares.Count)  Delimitador: '$delim'  Encabezado: $tieneEncabezado"
Write-Output "Salida: $JsonSalida"
Write-Output ''
foreach ($p in $pares) {
    $c = if ($p.criterios.Count -gt 0) { $p.criterios -join ', ' } else { '(sin coincidencia)' }
    $vista = $p.respuesta
    if ($vista.Length -gt 70) { $vista = $vista.Substring(0, 70) + '...' }
    Write-Output ("[{0}] {1}" -f $p.indice, $p.pregunta)
    Write-Output ("     {0}" -f $vista)
    Write-Output ("     criterios: {0}" -f $c)
}
