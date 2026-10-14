# MVP — sólidos orales, 1.000.000 comprimidos recubiertos/mes

**Layout conceptual, requiere revisión experta.**

Este documento describe el único escenario que genera el software. No es un diseño de HVAC, no es una calificación y no es una aprobación regulatoria. Las cifras viven en `lib/osd/assumptions.ts`. Si un experto las cambia, hay que volver a generar y revisar este texto.

La leyenda de toda salida (pantalla, PDF, PNG y JSON) es exactamente: **Layout conceptual, requiere revisión experta**.

## Qué hace el flujo

1. El cliente compra desde la portada. El botón abre `NEXT_PUBLIC_HOTMART_CHECKOUT_URL`. Si esa variable está vacía, el botón se muestra deshabilitado.
2. Hotmart avisa a `POST /api/webhooks/hotmart`. El aviso tiene que traer el token (`X-HOTMART-HOTTOK` o `hottok` en el cuerpo), igual a `HOTMART_WEBHOOK_TOKEN`. Un pago aprobado (`PURCHASE_APPROVED`, `PURCHASE_COMPLETE` o `approved`) crea un pedido pagado en Postgres y un token de acceso. El mismo identificador de transacción no duplica el pedido.
3. Para pruebas, `POST /api/admin/mark-paid` marca un email como pagado si el token coincide con `ADMIN_TOKEN`. La respuesta incluye `/app?token=…`.
4. En `/app` la persona confirma parámetros y el motor genera el layout. Se ve en 2D y en el visor 3D, y se exporta a PDF, PNG y JSON.

Sin `DATABASE_URL` el pedido no se finge: la API responde 503.

Conocer el email de la compra basta para abrir el escenario. No hay un segundo factor. Un reembolso de Hotmart no revoca el acceso en esta versión.

## Parámetros de entrada

| Parámetro | En este escenario | Fuera de rango |
| --- | --- | --- |
| Forma | `comprimido-recubierto` (pelicular). Fija. | v2 |
| Capacidad | Exactamente 1.000.000 comprimidos/mes. Fija. | v2 |
| Turnos / día | 1 o 2. Defecto: 1. | v2 |
| Días laborables / mes | Entero de 18 a 23. Defecto: 20. | v2 |
| Peso del comprimido | 100 a 800 mg. Defecto: 400 mg. | v2 |
| Vía | `wet` (granulación húmeda) o `direct-compression`. Defecto: húmeda. | v2 |
| OEB | 1, 2 o 3. Defecto: 1. OEB 4 o más queda fuera. | v2 |
| Grado | Solo D, que aquí se dibuja como ISO 8 en proceso. | v2 |
| Huella | Opcional, ancho y fondo juntos, en metros. Si es menor que el bloque generado, v2. Esta versión no escala la planta. | v2 |

El mensaje de rechazo empieza siempre por `Fuera de alcance de esta versión (v2):`.

Valores por defecto que usa la prueba: 1 turno, 20 días, 400 mg, vía húmeda, OEB 1, grado D, sin huella.

## Supuestos de dimensionamiento

Archivo: `lib/osd/assumptions.ts`.

- Tamaño de lote: 100.000 comprimidos. A 1.000.000/mes son 10 lotes.
- Horas productivas por turno: 7.
- Ganancia de peso del recubrimiento: 3 % sobre el núcleo.
- Masa de núcleo (kg) = comprimidos del lote × mg / 1.000.000.
- Masa recubierta = núcleo × 1,03.
- A 400 mg: 40 kg de núcleo y 41,2 kg recubiertos por lote.
- A 800 mg: 80 kg de núcleo y 82,4 kg recubiertos. El bombo supuesto admite 90 kg por carga, así que sigue siendo un solo equipo dentro del rango de peso.
- Dispensación: 2 h/lote.
- Vía húmeda, en la misma sala y en serie: alta cizalla 1,25 h + lecho fluido 3 h = 4,25 h/lote.
- Compresión directa: premezcla en contenedor 1 h/lote. No hay granulador ni lecho fluido. El rectángulo de la sala no cambia.
- Molienda y tamizado: 1 h/lote.
- Mezcla final IBC: 0,5 h/lote.
- Compresión: 80.000 comprimidos/h más 1 h de preparación → 2,25 h/lote.
- Recubrimiento: 3,5 h/lote.
- Blíster: 4 h/lote.
- El cuello de botella es la etapa más larga. Se multiplica por 10 lotes y se compara con turnos × 7 h × días. Con los defectos (vía húmeda) la etapa límite es la granulación, 4,25 h × 10 = 42,5 h, frente a 140 h disponibles. Si no cabe, la respuesta es v2 (haría falta otro turno fuera de rango o una segunda línea).
- Un equipo principal por sala. No hay línea duplicada.

Estas horas son supuestos de campaña escalonada, no un cronograma validado.

## Presión y grado

Diferenciales conceptuales, en pascales. No hay cálculo de caudal ni de renovaciones.

| Zona | Pa | Grado |
| --- | --- | --- |
| Recepción, cuarentena, almacenes, técnico, lavado, almacenes de equipo, lavado de IBC, IPC, secundario | 0 | CNC |
| Vestuario | +5 | D / ISO 8 |
| PAL, MAL de entrada, MAL de salida, pasillo de producto terminado | +10 | D / ISO 8 |
| Pasillo limpio | +15 | D / ISO 8 |
| Proceso (muestreo, pesada, granulación o premezcla, molienda, mezcla, compresión, recubrimiento, solución, inspección, blíster) | +20 | D / ISO 8 |
| Pesada, granulación o premezcla, y molienda cuando OEB es 3 | +5 | D / ISO 8, por debajo del pasillo |
| Pasillo sucio | −5 | CNC |
| Residuos | −10 | CNC |

En OEB 1 y 2 el proceso queda por encima del pasillo (protección del producto). En OEB 3 la pesada, la granulación o premezcla y la molienda bajan a +5 Pa (contención). La compresión y el recubrimiento siguen a +20 Pa.

## Bloque y salas

Bloque generado: **60 m × 22 m**, 1.320 m² brutos. Origen al noroeste. +x este, +z sur. Cuatro bandas: logística (z 0–5), esclusas y pasillo (z 5–9), proceso (z 9–16), soporte y acondicionado (z 16–22). La columna x 56–60 es la salida de producto terminado.

Áreas con los supuestos por defecto (OEB 1, vía húmeda):

| Sala | m² | Grado | Pa | Equipo típico |
| --- | ---: | --- | ---: | --- |
| Recepción | 40 | CNC | 0 | — |
| Cuarentena | 35 | CNC | 0 | — |
| Almacén de materias primas | 70 | CNC | 0 | — |
| Esclusa de material (entrada) | 25 | D / ISO 8 | +10 | — |
| Área técnica (HVAC y servicios) | 40 | CNC | 0 | Acceso por el norte. Sin puerta a las MAL. |
| Laboratorio IPC | 30 | CNC | 0 | IPC-01 banco de control en proceso ×1 |
| Almacén de producto terminado | 60 | CNC | 0 | — |
| Vestuario | 28 | D / ISO 8 | +5 | Entrada de personal por el oeste |
| Esclusa de personal (PAL) | 16 | D / ISO 8 | +10 | — |
| Pasillo limpio | 180 | D / ISO 8 | +15 | — |
| Esclusa de material (salida) | 16 | D / ISO 8 | +10 | — |
| Lavado de equipos | 49 | CNC | 0 | EW-01 zona de lavado de piezas ×1 |
| Muestreo | 42 | D / ISO 8 | +20 | SM-01 cabina de muestreo ×1 |
| Dispensación / pesada | 42 | D / ISO 8 | +20 | WB-01 cabina de pesada ×1 |
| Granulación | 56 | D / ISO 8 | +20 | HSG-01 granulador de alta cizalla ×1; FBD-01 secador de lecho fluido ×1 |
| Molienda y tamizado | 35 | D / ISO 8 | +20 | ML-01 molino cónico y tamiz ×1 |
| Mezcla final (IBC) | 42 | D / ISO 8 | +20 | IBC-01 mezclador de contenedores ×1 |
| Compresión | 42 | D / ISO 8 | +20 | CP-01 comprimidora rotativa ×1 |
| Recubrimiento | 42 | D / ISO 8 | +20 | PC-01 bombo perforado ×1 |
| Preparación de solución de recubrimiento | 42 | D / ISO 8 | +20 | VS-01 reactor de solución ×1 |
| Pasillo de producto terminado | 28 | D / ISO 8 | +10 | — |
| Almacén de equipos limpios | 30 | CNC | 0 | Acceso desde el patio, no desde Grado D |
| Almacén de equipos sucios | 30 | CNC | 0 | — |
| Lavado de IBC | 36 | CNC | 0 | IW-01 cabina de lavado de IBC ×1 |
| Residuos | 18 | CNC | −10 | — |
| Pasillo sucio | 162 | CNC | −5 | — |
| Inspección | 30 | D / ISO 8 | +20 | — |
| Acondicionado primario (blíster) | 30 | D / ISO 8 | +20 | BL-01 línea de blíster ×1 |
| Acondicionado secundario | 24 | CNC | 0 | — |

En compresión directa la sala de 19–27 m (56 m²) pasa a llamarse **Premezcla** y lleva BB-01, un mezclador de contenedores. Desaparecen HSG-01 y FBD-01. El resto del bloque no se mueve.

## Lógica de flujos

Los trazos son ortogonales. No hay una diagonal que cruce salas ajenas al recorrido.

**Personal.** Entra por el oeste al vestuario, pasa la PAL y sigue por el pasillo limpio. Desde el pasillo entra a pesada y avanza por granulación (o premezcla), compresión y recubrimiento. El IPC se alcanza desde el pasillo, hacia el norte. El personal no atraviesa las esclusas de material.

**Material de entrada.** Recepción → cuarentena → almacén de MP → MAL de entrada → pasillo limpio → muestreo.

**Material de proceso, hacia el este.** Muestreo → pesada → granulación o premezcla → molienda → mezcla final → compresión → recubrimiento.

**Solución de recubrimiento.** Sale de la sala de preparación y entra al bombo, un tramo corto hacia el oeste. No baja al acondicionado.

**Producto terminado.** Recubrimiento → inspección → blíster → secundario → pasillo de producto terminado (columna este) → MAL de salida → almacén de PT. Ese pasillo existe para no cruzar la preparación de solución ni el pasillo de personal. La MAL de salida no tiene puerta al pasillo limpio.

**Residuos.** Granulación (o premezcla) y compresión bajan al pasillo sucio y de ahí a la sala de residuos. El residuo de recubrimiento sale por el lado oeste de esa sala (el único tramo que solapa con el pasillo sucio) y sigue por el pasillo sucio, sin volver al oeste a través de las salas de proceso. El pasillo sucio no se vuelve a conectar con el pasillo limpio.

**Limpio y sucio que no se tocan.** El lavado no tiene puerta a muestreo ni al vestuario. El almacén de equipos limpios no comunica con el de equipos sucios. El área técnica no comunica con las MAL. El lavado sí entrega al almacén de equipos sucios, y ese almacén sigue hacia el lavado de IBC y la sala de residuos.

## Limitaciones conocidas

- Un solo escenario. Cápsulas, estériles, líquidos, otras capacidades, otros grados, OEB 4 o más, y una huella menor que 60 × 22 m responden v2.
- El bloque no se deforma para caber en un solar más pequeño.
- Las presiones, los ciclos y el tamaño de lote son supuestos editables, no un balance de aire ni un estudio de capacidad firmado.
- No hay cálculo de HVAC, ni BIM, ni cualificación, ni expediente de registro.
- Hay un solo equipo principal por operación. No se duplican líneas.
- El laboratorio IPC no sustituye al control de calidad completo. El lavado no es un tren CIP.
- El acceso de cliente se abre con el email de la compra o con el enlace que devuelve el marcado manual. No se envía ese enlace por correo.
- Un aviso de Hotmart que no sea un pago aprobado se ignora (respuesta 200) para que Hotmart no reintente. Una anulación posterior no quita el pedido.
- El modelo 3D de la portada sigue siendo el ejemplo inventado de una suite de llenado, marcado como ejemplo. El plano de este escenario solo aparece en `/app` después de generarlo.
- La salida siempre pide revisión experta. No autoriza a construir.
