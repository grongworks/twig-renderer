const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const twig = require("twig");
const TwigWrapper = require("./src/TwigWrapper");

module.exports = class {
    defaultOptionsPdf = {
        headerTemplate: null,
        footerTemplate: null
    }

    constructor () {
        this.browser = null;
        this.initTwig();
    }

    initTwig () {
        this.twig = new TwigWrapper();
        return this;
    }

    async initBrowser () {
        this.browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        return this;
    }

    enableTwigCache () {
        this.twig.cache(true);
        return this;
    }

    async render (templatePath, data) {
        this.renderedHtml = ""; // reset variable to avoid side-effects
        if (this.browser === null) await this.initBrowser();
        if (!fs.existsSync(templatePath)) throw new Error("template_file_not_exists");

        this.renderedHtml = await this.twig.renderFile(templatePath, data);
        return this;
    }

    async toHtml () {
        return this.renderedHtml;
    }

    async toPdf (options = { headerTemplate: null, footerTemplate: null }) {
        const page = await this.browser.newPage();
        await page.setContent(this.renderedHtml);
        await page.emulateMediaType("print");
        const pdf = await page.pdf({
            format: "A4",
            preferCSSPageSize: true,
            displayHeaderFooter: true,
            headerTemplate: (options.headerTemplate && options.headerTemplate instanceof String) ? headerTemplate : "<span>&nbsp;</span>",
            footerTemplate: (options.footerTemplate && options.footerTemplate instanceof String) ? footerTemplate : `
                <div id="footer-template" style="text-align: center; font-size: 8px; width: 100%; padding: 10px 20mm">
                    Seite <span class="pageNumber"></span> von <span class="totalPages"></span>
                </div>
            `,
            margin: { top: "20mm", bottom: "20mm", left: "24mm", right: "20mm" },
        });
        page.close();
        await this.browser.close();
        return pdf;
    }
}
