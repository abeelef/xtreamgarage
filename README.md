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

## Añadir las fotos pendientes

Subir estos archivos, respetando mayúsculas y extensión:

| Contenido | Ruta |
| --- | --- |
| Pulido antes | `img/antesdespues/antesPulido.jpg` |
| Pulido después | `img/antesdespues/despuesPulido.jpg` |
| Vinilo antes | `img/antesdespues/antesVinilo.jpg` |
| Vinilo después | `img/antesdespues/despuesVinilo.jpg` |
| Primera marca nueva | `img/marcas/marca-1.png` |
| Segunda marca nueva | `img/marcas/marca-2.png` |
| Tercera marca nueva | `img/marcas/marca-3.png` |

Los comparadores se activan cuando cargan las dos imágenes. Hasta entonces muestran «Próximamente: antes y después». Las marcas aparecen cuando existe su imagen. Usar fotografías antes/después con el mismo encuadre y proporción. Para los logotipos se recomienda PNG transparente; al conocer el nombre de cada marca, completar su atributo `alt` en `index.html`.

El nuevo logotipo se carga desde `img/logo-xtream-detailing.png`. Mientras falta ese archivo, se muestra el nombre tipográfico Xtream Detailing. Los originales anteriores se conservan sin mostrarse como marca.

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
