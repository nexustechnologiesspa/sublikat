$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

# La foto que entrega el cliente llega a 2752 x 1536 px y pesa 2,5 MB: too
# pesada para una portada a pantalla completa. Este script genera la copia
# que usa la web, sin recortarla y respetando la proporcion original
# (2752:1536 = 43:24 -> 2150:1200).
Add-Type -AssemblyName System.Drawing

$origen = Join-Path $root 'quita_la_luz_de_la_821edea9_2K.jpg'
$destinoDir = Join-Path $root 'assets\portada'
$destino = Join-Path $destinoDir 'quita-la-luz-2150.jpg'

if (-not (Test-Path -LiteralPath $origen)) { throw "No se encuentra la foto original: $origen" }
if (-not (Test-Path -LiteralPath $destinoDir)) { New-Item -ItemType Directory -Path $destinoDir | Out-Null }

$img = [System.Drawing.Image]::FromFile($origen)
$ancho = 2150
$alto = [int][Math]::Round($img.Height * $ancho / $img.Width)
$bmp = New-Object System.Drawing.Bitmap($ancho, $alto)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$g.DrawImage($img, 0, 0, $ancho, $alto)
$g.Dispose()

$codigo = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
$bmp.Save($destino, $codigo, $params)
$bmp.Dispose()
$img.Dispose()

$origenBytes = (Get-Item -LiteralPath $origen).Length
$destinoBytes = (Get-Item -LiteralPath $destino).Length
"portada: {0} x {1} px  {2:N0} KB  (original {3:N0} KB)" -f $ancho, $alto, ($destinoBytes / 1KB), ($origenBytes / 1KB)
