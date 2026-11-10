# Xtream Detailing

Web estática: abrir `index.html` mediante un servidor local o publicar los archivos en el alojamiento actual. No necesita compilación.

```sh
python -m http.server 8000
```

## Páginas

- `index.html`: presentación, antes/después, marcas, equipo y opiniones.
- `ppf.html`, `pulido.html`, `ceramico.html`, `tintado.html`.
- `detailing-exterior.html`, `detailing-interior-intermedio.html`, `detailing-interior-completo.html`, `limpieza-motor.html`.
- `galeria.html`: galería con ampliación de fotos.

El selector ES / CA / EN conserva el idioma entre páginas. Las traducciones se editan en `assets/translations.js`. El contenido base está en español. Los valores internos de las opciones de reserva permanecen en español; el formulario y el mensaje de WhatsApp se muestran en el idioma elegido.

## Tarifas

Pulido mínimo por tamaño: 250 / 330 / 400 / 450 €. Referencias por pasos: 250 / 460 / 620 €, sujetas a valoración. Cerámica: 250 / 450 / 550 €, con pulido previo presupuestado aparte. Mantener sincronizados texto, botones de reserva y opciones del formulario al cambiar tarifas.

## Comprobaciones

Las comprobaciones de navegador están en `tests/site.cjs`. Instalar Playwright y Chromium, iniciar el servidor anterior y ejecutar:

```sh
npm install
npx playwright install chromium
npm test
```

Los estilos de Tailwind están compilados en `assets/utilities.css`; ejecutar `npm run build:css` al añadir clases. Las fuentes y los iconos también se sirven localmente, con sus licencias en `assets/vendor/`. El mapa sigue siendo externo. Los enlaces de aviso legal, privacidad y cookies ya apuntaban a archivos ausentes en el repositorio; se necesitan los documentos reales para completarlos.

## Imágenes pendientes de aportar

Todas deben ser WebP. No es necesario volver a aportar los archivos del inventario siguiente. Los comparadores necesitan ambas fotos del mismo coche y encuadre.

| Ruta exacta | Contenido |
|---|---|
| `img/antesdespues/antesPulido.webp` | Pintura antes del pulido |
| `img/antesdespues/despuesPulido.webp` | La misma pintura después |
| `img/antesdespues/antesVinilo.webp` | Vehículo antes de vinilar |
| `img/antesdespues/despuesVinilo.webp` | El mismo vehículo vinilado |
| `img/vinilado-1.webp` | Foto principal de un trabajo de vinilado |
| `img/vinilado-2.webp` | Detalle del acabado o aplicación |
| `img/marcas/marca-1.webp` | Logo transparente de la primera marca nueva |
| `img/marcas/marca-2.webp` | Logo transparente de la segunda marca nueva |
| `img/marcas/marca-3.webp` | Logo transparente de la tercera marca nueva |

Recomendación: fotos de 1200–1600 px, mismo encuadre en comparadores; logotipos con transparencia. Las fotos opcionales se muestran automáticamente al subirlas. Completar los nombres reales de las marcas en los atributos alt cuando estén disponibles. Vinilado se ofrece con presupuesto personalizado, sin inventar tarifas.

## Inventario de imágenes existentes

- `foto-equipo.webp`
- `img/antesdespues/antesInterior.webp`
- `img/antesdespues/despuesInterior.webp`
- `img/ceramicoBase1.webp`
- `img/ceramicoBase2.webp`
- `img/detailingExteriorBase1.webp`
- `img/detailingExteriorBase2.webp`
- `img/detailingInterioBase2.webp`
- `img/detailingInteriorBase1.webp`
- `img/galeria/antespulidobmw.webp`
- `img/galeria/bmw.webp`
- `img/galeria/despuespulidobmw.webp`
- `img/galeria/interiorazul.webp`
- `img/galeria/interiorbmwnegro.webp`
- `img/galeria/interiornaranja.webp`
- `img/galeria/lambo.webp`
- `img/galeria/pantallappf.webp`
- `img/galeria/porsche.webp`
- `img/galeria/trabajando1.webp`
- `img/labocosmetica-logo.webp`
- `img/limpiezaBasicaBase1.webp`
- `img/limpiezaBasicaBase2.webp`
- `img/limpiezaIntegralDetalladaBase1.webp`
- `img/limpiezaIntegralDetalladaBase2.webp`
- `img/logo-xtream-detailing-perfil-transparente.webp`
- `img/logo-xtream-detailing-perfil.webp`
- `img/logo-xtream-detailing-transparente.webp`
- `img/logo-xtream-detailing.webp`
- `img/logo.webp`
- `img/logo_fondo_negro.webp`
- `img/motor1.webp`
- `img/motor2.webp`
- `img/plantillas_coches/4x4.webp`
- `img/plantillas_coches/compacto.webp`
- `img/plantillas_coches/furgoneta.webp`
- `img/plantillas_coches/pequeno.webp`
- `img/plantillas_coches/sedan.webp`
- `img/ppfBase.webp`
- `img/pulidoBase.webp`
- `img/tintadoBase.webp`
- `img/video/poster.webp`

## Fotos que conviene revisar o sustituir

- `img/limpiezaBasicaBase1.webp` se utiliza en detailing interior completo, pero muestra un lavado exterior. Sustituir por una foto representativa de limpieza interior, conservando el nombre, o actualizar su referencia en esa página.
- La galería conserva sus fotos actuales; no requiere nuevas imágenes para funcionar. Verificar visualmente el orden real de las fotos `antespulidobmw.webp` y `despuespulidobmw.webp` antes de reutilizarlas como comparador: las etiquetas originales no coinciden con los nombres.
- Los logotipos antiguos `img/logo.webp` y `img/logo_fondo_negro.webp` se conservan como archivo histórico; no son necesarios para la marca visible.
- El vídeo existente `img/video/video-hero.mp4` se conserva. WebP se aplica a las imágenes, no al vídeo.

## Preparación técnica para producción

- El español se mantiene en la raíz, el catalán en `/ca/` y el inglés en `/en/`. Cada URL contiene el texto traducido en el HTML; funciona e indexa sin JavaScript. Los archivos de `ca/` y `en/` son generados: editar los HTML españoles y `assets/translations.js`, después ejecutar `npm run build`.
- El idioma se determina por la URL. Los enlaces antiguos con `?lang=` redirigen a la URL correspondiente. Los enlaces de idioma sin JavaScript siguen disponibles.
- `robots.txt` permite indexación. Se incluye canonical relativo y datos estructurados del negocio con dirección y teléfono ya presentes en la web. No se han inventado horarios, razón social ni datos fiscales.
- Cuando el cliente confirme el dominio, ejecutar `SITE_URL=https://DOMINIO-CONFIRMADO npm run build` (en PowerShell: `$env:SITE_URL='https://DOMINIO-CONFIRMADO'; npm run build`). Esto genera `sitemap.xml`, canonical absolutos, hreflang y metadatos sociales con URLs absolutas. **No ejecutar el ejemplo literalmente** ni publicar URLs de un dominio sin confirmar.
- El mapa de Google no hace ninguna petición hasta pulsar «Cargar mapa de Google».
- El vídeo se comprime a 540 px de ancho y 24 fps, sin audio y con faststart. En móvil, ahorro de datos o movimiento reducido, se conserva el póster y la reproducción es manual. Incluye botón de pausa; se pausa al ocultar la pestaña.
- Se han añadido dimensiones de imagen, enlace para saltar al contenido, nombres accesibles en enlaces sociales y mejoras de contraste.
- `_headers.example` es una plantilla de caché y cabeceras para Cloudflare Pages/Netlify. **No está activada:** falta confirmar alojamiento y adaptar su configuración. La compresión Brotli/gzip se configura en el servidor.
- Permanecen pendientes los documentos legales, los datos del titular, horarios confirmados, condiciones de anticipo/cancelación y el dominio/alojamiento. Las rutas legales originales siguen pendientes de contenido real.

Comprobaciones: `npm test` verifica navegación, idiomas, reservas y móvil; `npm run test:production` comprueba HTML traducido sin JavaScript, carga diferida de terceros, preferencias de movimiento y accesibilidad automática WCAG A/AA. Una auditoría automática no sustituye una revisión manual con tecnologías de asistencia.
