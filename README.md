# twig-renderer
This package provides the possibility to convert twig template to HTML. A special feature is the integration of Puppeteer, so that via this package can also be converted directly into PDF. Currently only the DIN A4 format is supported.

### Conversion to HTML
```javascript
const TwigRenderer = require("twig-renderer");

const twigRenderer = new TwigRenderer();
        
const html = await twigRenderer
    .render("./path/to/template", { a: 1, b: 2, c: "Any other data!"})
    .then(result => result.toHtml());
```

### Conversion to PDF-Buffer
```javascript
const TwigRenderer = require("twig-renderer");

const twigRenderer = new TwigRenderer();

const pdfBuffer = await twigRenderer
    .render("./path/to/template", { a: 1, b: 2, c: "Any other data!"})
    .then(result => result.toPdf());
```
