# Prompts para las miniaturas de la ficha ampliada (Nano Banana)

Cada ficha ya tiene su foto principal (`tazas.jpg`, `botellas.jpg`…). La ficha ampliada muestra
miniaturas cuando existen fotos numeradas del mismo producto: `tazas-01.jpg`, `tazas-02.jpg`.
Este documento trae **dos prompts por producto**, con la misma lógica que la referencia:

| Archivo | Qué muestra | Para qué sirve |
|---|---|---|
| `<producto>.jpg` | La foto que ya existe | Tarjeta y primera miniatura |
| `<producto>-01.jpg` | **Otro ángulo o detalle** del mismo producto | Ver la forma y la calidad de la impresión |
| `<producto>-02.jpg` | **El producto en contexto**, en una escena sobria | Imaginarlo en uso o como regalo |

> Son imágenes de muestra para el cliente, igual que las principales: siguen con la etiqueta
> «Ejemplo» y se reemplazan por fotos reales del taller cuando lleguen.

---

## 1. Cómo usarlos

1. **Abre un chat nuevo en Gemini (Nano Banana) por cada producto.** Así no arrastra el diseño
   del producto anterior.
2. **Adjunta la foto principal de ese producto** (por ejemplo `regalos/tazas.jpg`). Es lo más
   importante: Nano Banana edita a partir de ella y mantiene el mismo diseño impreso. Sin la foto
   adjunta inventaría otro estampado y la galería no cuadraría.
3. Pega el prompt **-01**, descarga el resultado. En el mismo chat, pega el prompt **-02**.
4. Si el diseño cambia o aparece texto, responde en el mismo chat:
   *«Mantén exactamente el estampado de la primera imagen, sin cambiar colores ni motivos, y quita
   cualquier texto.»*
5. Guarda cada imagen en la carpeta de su categoría con el nombre indicado, en minúsculas y sin
   acentos (`tazas-01.jpg`, `tazas-02.jpg`).
6. Ajusta a **1200 × 1200 px, JPEG, ≤ 150 KB** (igual que los maestros actuales) y ejecuta:

   ```bash
   npm run fotos
   ```

7. Copia los textos alternativos del apartado 7 en `textosAdicionales`
   (`src/sections/Catalog/productImages.js`). Si no lo haces, la web usa el texto de la foto
   principal con «(vista 2)», «(vista 3)».

### Bloque de estilo común

Ya va incluido al final de cada prompt. Si quieres cambiar el estilo de todas las fotos a la vez,
cambia este bloque:

> Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos
> colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado
> 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen
> adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin
> marcas de agua.

---

## 2. Regalos personalizados (`assets/productos/regalos/`)

### Tazas · adjuntar `tazas.jpg`

**`tazas-01.jpg` · otro ángulo**
```
Muestra la misma taza blanca de cerámica de la imagen adjunta girada unos 90 grados, con el asa hacia la cámara en un costado, para que se vea cómo el estampado botánico de líneas coral rodea la taza. Mismo fondo crema liso, encuadre centrado con aire alrededor. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`tazas-02.jpg` · en contexto**
```
Coloca la misma taza de la imagen adjunta sobre una mesa de madera clara, con café dentro y un platillo de cerámica beige al lado, una servilleta de lino y una planta pequeña desenfocada al fondo. Escena de desayuno sobria y cálida, la taza es el protagonista y el estampado se ve con claridad. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Tazas mágicas · adjuntar `tazas-magicas.jpg`

**`tazas-magicas-01.jpg` · antes del calor**
```
Muestra la misma taza de la imagen adjunta completamente negra mate, sin el estampado visible, como se ve antes de verter líquido caliente. Misma forma, mismo ángulo, mismo fondo crema liso y misma luz. Mantén exactamente el mismo producto de la imagen adjunta: mismas proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`tazas-magicas-02.jpg` · estampado revelado**
```
Muestra la misma taza de la imagen adjunta con el estampado floral coral completamente revelado en toda su superficie, con un poco de vapor saliendo del café caliente. Sobre una mesa de madera clara con un paño de lino beige. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Botellas · adjuntar `botellas.jpg`

**`botellas-01.jpg` · detalle**
```
Primer plano de la misma botella térmica color crema de la imagen adjunta, ligeramente inclinada, enfocando la banda geométrica coral y la tapa, para que se aprecie la calidad de la impresión y el acabado mate. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`botellas-02.jpg` · en contexto**
```
La misma botella de la imagen adjunta de pie junto a una mochila de lona beige y un cuaderno cerrado sobre un escritorio de madera clara, con una ventana luminosa desenfocada al fondo. Escena de día de trabajo o estudio, sobria. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Mousepads · adjuntar `mousepads.jpg`

**`mousepads-01.jpg` · detalle**
```
Primer plano en ángulo bajo de una esquina del mismo mousepad de la imagen adjunta, mostrando el borde cosido, el grosor de la base de goma y la textura de la tela con las curvas coral y mostaza. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`mousepads-02.jpg` · en contexto**
```
El mismo mousepad de la imagen adjunta sobre un escritorio de madera clara, con un mouse inalámbrico blanco encima, parte de un teclado blanco y una taza de cerámica beige. Vista cenital ligeramente inclinada, escritorio ordenado y luminoso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Bolsas · adjuntar `bolsas.jpg`

**`bolsas-01.jpg` · detalle**
```
Primer plano de la misma bolsa de tela cruda de la imagen adjunta, enfocando el motivo geométrico coral estampado y la trama de la tela, con parte del asa visible. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`bolsas-02.jpg` · en contexto**
```
La misma bolsa de la imagen adjunta colgada de un perchero de madera clara junto a una pared color crema, con unas baguettes y un ramo pequeño de flores secas asomando por arriba. Escena cotidiana, sobria y cálida. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Relojes · adjuntar `relojes.jpg`

**`relojes-01.jpg` · detalle**
```
Primer plano de la esfera del mismo reloj de la imagen adjunta, mostrando con nitidez el diseño estampado en tonos coral, las agujas y el bisel. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin números de marca, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`relojes-02.jpg` · como regalo**
```
El mismo reloj de la imagen adjunta dentro de una caja de regalo abierta color kraft, apoyado sobre papel de seda beige, con una cinta de lino terracota al lado, sobre una mesa de madera clara. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Chapas para mascotas · adjuntar `chapas-mascotas.jpg`

**`chapas-mascotas-01.jpg` · detalle**
```
Primer plano de la misma chapa redonda de metal de la imagen adjunta, ligeramente inclinada, mostrando el perfil del perro dibujado en línea coral, el brillo del metal y la argolla. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`chapas-mascotas-02.jpg` · en contexto**
```
La misma chapa de la imagen adjunta colgando de un collar de cuero color café claro, apoyado sobre una manta tejida beige junto a una pelota de juguete de lana. Sin animales en la escena. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

---

## 3. Cuadros y fotografías (`assets/productos/cuadros/`)

### Cuadros de piedra · adjuntar `cuadros-piedra.jpg`

**`cuadros-piedra-01.jpg` · detalle**
```
Vista lateral en ángulo de tres cuartos del mismo cuadro de piedra de la imagen adjunta, mostrando el grosor, los bordes naturales irregulares de la piedra y la textura sobre la que está impreso el paisaje abstracto en tonos tierra y coral. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`cuadros-piedra-02.jpg` · en contexto**
```
El mismo cuadro de piedra de la imagen adjunta apoyado sobre una repisa de madera clara junto a un florero de cerámica beige con ramas secas y un par de libros, contra una pared color crema. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Cuadros con fotos · adjuntar `cuadros-fotos.jpg`

**`cuadros-fotos-01.jpg` · detalle**
```
Primer plano de una esquina del mismo marco negro de la imagen adjunta, mostrando el acabado del marco, el paspartú y la nitidez de la lámina de hojas y montañas en tonos cálidos. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`cuadros-fotos-02.jpg` · en contexto**
```
El mismo cuadro enmarcado de la imagen adjunta colgado en una pared color crema sobre un aparador de madera clara con una lámpara de cerámica y una planta. Sala luminosa y minimalista, el cuadro es el protagonista. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Cuadros de aluminio · adjuntar `cuadros-aluminio.jpg`

**`cuadros-aluminio-01.jpg` · detalle**
```
Vista lateral en ángulo del mismo cuadro de aluminio de la imagen adjunta, mostrando su perfil delgado, los bordes metálicos y el leve brillo de la superficie con el diseño geométrico de arcos coral. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`cuadros-aluminio-02.jpg` · en contexto**
```
El mismo cuadro de aluminio de la imagen adjunta colgado en la pared color crema de una oficina moderna y cálida, sobre un escritorio de madera clara con una silla tapizada beige. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

---

## 4. Estampados textiles (`assets/productos/textiles/`)

### Polerones · adjuntar `polerones.jpg`

**`polerones-01.jpg` · detalle**
```
Primer plano del mismo polerón color crema de la imagen adjunta, enfocando el estampado geométrico coral y mostaza y la textura del algodón, con parte del cuello visible. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`polerones-02.jpg` · en contexto**
```
El mismo polerón de la imagen adjunta colgado de una percha de madera en un perchero, en un ambiente luminoso con pared color crema y una planta al lado. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Estampado 1 color · adjuntar `estampado-1-color.jpg`

**`estampado-1-color-01.jpg` · detalle**
```
Primer plano del mismo estampado circular a una sola tinta coral de la imagen adjunta, mostrando la definición de los bordes y la textura de la tela de la camiseta. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`estampado-1-color-02.jpg` · en contexto**
```
La misma camiseta de la imagen adjunta extendida sobre una superficie de madera clara, vista cenital, con el estampado centrado y algunos accesorios sobrios alrededor: una gorra beige y unas zapatillas blancas. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Estampado 2 colores · adjuntar `estampado-2-colores.jpg`

**`estampado-2-colores-01.jpg` · detalle**
```
Primer plano del mismo estampado botánico en coral y mostaza de la imagen adjunta, mostrando cómo se combinan las dos tintas y la textura de la tela. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`estampado-2-colores-02.jpg` · en contexto**
```
La misma camiseta de la imagen adjunta colgada de una percha de madera en un perchero contra una pared color crema, con luz de ventana suave. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Estampado 3 colores · adjuntar `estampado-3-colores.jpg`

**`estampado-3-colores-01.jpg` · detalle**
```
Primer plano del mismo estampado botánico en tres tintas (coral, mostaza y café) de la imagen adjunta, mostrando el registro preciso entre los colores y la textura de la tela. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`estampado-3-colores-02.jpg` · en contexto**
```
La misma camiseta de la imagen adjunta doblada sobre una pila de otras dos camisetas lisas color crema y beige, sobre una mesa de madera clara, como en un pedido listo para entregar. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

### Estampado de imágenes · adjuntar `estampado-imagenes.jpg`

**`estampado-imagenes-01.jpg` · detalle**
```
Primer plano de la misma impresión a todo color de hojas en tonos cálidos de la imagen adjunta, mostrando la riqueza de colores, los degradados y la textura de la tela. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

**`estampado-imagenes-02.jpg` · en contexto**
```
La misma camiseta de la imagen adjunta extendida sobre una cama con ropa de cama de lino beige, vista cenital, con el estampado centrado y bien visible. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto, sin letras, sin logotipos, sin marcas, sin personas y sin marcas de agua.
```

---

## 5. Papelería corporativa (`assets/productos/papeleria/`)

### Tarjetas de presentación · adjuntar `tarjetas-presentacion.jpg`

**`tarjetas-presentacion-01.jpg` · detalle**
```
Primer plano en ángulo bajo del mismo mazo de tarjetas de presentación de la imagen adjunta, con una tarjeta apoyada de canto para que se vea el grosor del papel, su textura y el símbolo coral impreso. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto legible, sin letras, sin logotipos reales, sin marcas, sin personas y sin marcas de agua.
```

**`tarjetas-presentacion-02.jpg` · en contexto**
```
Las mismas tarjetas de la imagen adjunta en un tarjetero de madera clara sobre un escritorio ordenado, junto a un cuaderno beige, un lápiz y una taza de cerámica. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto legible, sin letras, sin logotipos reales, sin marcas, sin personas y sin marcas de agua.
```

### Tarjetas de PVC · adjuntar `tarjetas-pvc.jpg`

**`tarjetas-pvc-01.jpg` · detalle**
```
Primer plano inclinado de la misma tarjeta de PVC de la imagen adjunta, con un reflejo suave de luz sobre la superficie brillante, mostrando el patrón geométrico coral y crema y el canto de la tarjeta. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto legible, sin letras, sin logotipos reales, sin marcas, sin personas y sin marcas de agua.
```

**`tarjetas-pvc-02.jpg` · en contexto**
```
Varias tarjetas iguales a la de la imagen adjunta abiertas en abanico sobre una mesa de madera clara, junto a una billetera de cuero café claro. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto legible, sin letras, sin logotipos reales, sin marcas, sin personas y sin marcas de agua.
```

---

## 6. Identificación corporativa (`assets/productos/identificacion/`)

### Lanyards · adjuntar `lanyards.jpg`

**`lanyards-01.jpg` · detalle**
```
Primer plano del mismo lanyard de la imagen adjunta, enfocando el estampado de la cinta, el mosquetón metálico y la unión con el portacredencial. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto legible, sin letras, sin logotipos reales, sin marcas, sin personas y sin marcas de agua.
```

**`lanyards-02.jpg` · en contexto**
```
Varios lanyards iguales al de la imagen adjunta colgados de ganchos de madera en una pared color crema, ordenados como en la recepción de un evento o una oficina. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto legible, sin letras, sin logotipos reales, sin marcas, sin personas y sin marcas de agua.
```

### Credenciales · adjuntar `credenciales.jpg`

**`credenciales-01.jpg` · detalle**
```
Primer plano inclinado de la misma credencial de la imagen adjunta dentro de su funda transparente, mostrando el borde de la funda, el reflejo suave del plástico y la impresión de la credencial. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto legible, sin nombres, sin letras, sin logotipos reales, sin marcas, sin personas y sin marcas de agua.
```

**`credenciales-02.jpg` · en contexto**
```
Varias credenciales iguales a la de la imagen adjunta, con sus lanyards oscuros, ordenadas en fila sobre una mesa de madera clara de recepción, listas para entregar en un evento. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto legible, sin nombres, sin letras, sin logotipos reales, sin marcas, sin personas y sin marcas de agua.
```

### Credenciales PVC · adjuntar `credenciales-pvc.jpg`

**`credenciales-pvc-01.jpg` · detalle**
```
Primer plano inclinado de la misma credencial rígida de PVC de la imagen adjunta, mostrando su canto, el acabado de la superficie, la silueta genérica y el código de barras. Mismo fondo crema liso. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto legible, sin nombres, sin letras, sin logotipos reales, sin marcas, sin personas reales y sin marcas de agua.
```

**`credenciales-pvc-02.jpg` · en contexto**
```
La misma credencial de PVC de la imagen adjunta dentro de un porta credencial retráctil (yoyó) de color beige, apoyada sobre un escritorio de madera clara junto a un portátil cerrado y un cuaderno. Mantén exactamente el mismo producto y el mismo diseño impreso de la imagen adjunta: mismos colores, motivos, proporciones y acabado. Fotografía de producto profesional, formato cuadrado 1:1, luz natural suave y cálida, sombras suaves, paleta crema, beige y terracota como la imagen adjunta. Realista y nítida. Sin texto legible, sin nombres, sin letras, sin logotipos reales, sin marcas, sin personas reales y sin marcas de agua.
```

---

## 7. Textos alternativos listos para pegar

Reemplaza `const textosAdicionales = {};` en `src/sections/Catalog/productImages.js` por este
bloque. Si una imagen generada sale distinta a lo descrito (otra escena u otros objetos), corrige
su texto para que describa lo que realmente se ve.

```js
const textosAdicionales = {
  'tazas-01': 'La misma taza vista de costado, con el estampado botánico coral rodeándola',
  'tazas-02': 'La taza con café sobre una mesa de madera clara junto a un platillo beige',
  'tazas-magicas-01': 'La taza mágica completamente negra, antes de servir líquido caliente',
  'tazas-magicas-02': 'La taza mágica con el estampado floral coral revelado y café humeante',
  'botellas-01': 'Detalle de la banda geométrica coral y la tapa de la botella térmica',
  'botellas-02': 'La botella térmica sobre un escritorio junto a una mochila beige y un cuaderno',
  'mousepads-01': 'Esquina del mousepad con el borde cosido y la base de goma',
  'mousepads-02': 'El mousepad en un escritorio con un mouse y un teclado blancos',
  'bolsas-01': 'Detalle del motivo geométrico coral y la trama de la tela de la bolsa',
  'bolsas-02': 'La bolsa de tela colgada de un perchero con pan y flores secas',
  'relojes-01': 'Primer plano de la esfera estampada en tonos coral del reloj',
  'relojes-02': 'El reloj dentro de una caja de regalo kraft con papel de seda beige',
  'chapas-mascotas-01': 'Detalle de la chapa de metal con el perfil del perro en línea coral',
  'chapas-mascotas-02': 'La chapa colgando de un collar de cuero sobre una manta tejida',
  'cuadros-piedra-01': 'Vista lateral del cuadro de piedra con sus bordes naturales',
  'cuadros-piedra-02': 'El cuadro de piedra sobre una repisa de madera junto a un florero',
  'cuadros-fotos-01': 'Esquina del marco negro con el paspartú y la lámina',
  'cuadros-fotos-02': 'El cuadro enmarcado colgado sobre un aparador de madera clara',
  'cuadros-aluminio-01': 'Perfil delgado del cuadro de aluminio con sus bordes metálicos',
  'cuadros-aluminio-02': 'El cuadro de aluminio colgado en una oficina sobre un escritorio',
  'polerones-01': 'Detalle del estampado geométrico coral y mostaza del polerón',
  'polerones-02': 'El polerón colgado de una percha de madera junto a una planta',
  'estampado-1-color-01': 'Detalle del estampado circular a una tinta coral sobre la tela',
  'estampado-1-color-02': 'La camiseta extendida sobre madera junto a una gorra y zapatillas',
  'estampado-2-colores-01': 'Detalle del estampado botánico en coral y mostaza',
  'estampado-2-colores-02': 'La camiseta con estampado a dos tintas colgada de una percha',
  'estampado-3-colores-01': 'Detalle del registro entre las tintas coral, mostaza y café',
  'estampado-3-colores-02': 'La camiseta estampada doblada sobre otras camisetas lisas',
  'estampado-imagenes-01': 'Detalle de la impresión a todo color de hojas en tonos cálidos',
  'estampado-imagenes-02': 'La camiseta con impresión a todo color extendida sobre una cama',
  'tarjetas-presentacion-01': 'Tarjeta de canto que muestra el grosor del papel y el símbolo coral',
  'tarjetas-presentacion-02': 'Las tarjetas en un tarjetero de madera sobre un escritorio',
  'tarjetas-pvc-01': 'La tarjeta de PVC inclinada con un reflejo sobre su superficie brillante',
  'tarjetas-pvc-02': 'Varias tarjetas de PVC en abanico junto a una billetera de cuero',
  'lanyards-01': 'Detalle de la cinta estampada, el mosquetón y el portacredencial',
  'lanyards-02': 'Varios lanyards colgados de ganchos de madera en una pared crema',
  'credenciales-01': 'La credencial en su funda transparente, vista en ángulo',
  'credenciales-02': 'Varias credenciales con lanyards ordenadas sobre una mesa de recepción',
  'credenciales-pvc-01': 'Canto y superficie de la credencial rígida de PVC',
  'credenciales-pvc-02': 'La credencial de PVC en un portacredencial retráctil sobre un escritorio'
};
```

---

## 8. Consejos si algo sale mal

- **Cambia el diseño impreso:** vuelve a adjuntar la foto principal y empieza el mensaje con
  *«Usa exactamente el estampado de esta imagen»*.
- **Sale texto inventado o letras raras** (frecuente en tarjetas y credenciales): pide
  *«Quita todo el texto y deja las superficies lisas, sin letras»*.
- **No sale cuadrada:** pide *«Formato cuadrado 1:1»* o recórtala al centro antes de guardarla
  (`npm run fotos` también recorta al centro y lo avisa).
- **El fondo se ve muy distinto a las demás:** pide *«Usa el mismo fondo y la misma luz que la
  imagen adjunta»*.
- **Queda muy recargada:** pide *«Menos objetos, que el producto ocupe al menos el 60 % del
  encuadre»*.
