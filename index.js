const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const twig = require("twig");

module.exports = class {
    constructor () {
        this.browser = null;
        this.initTwig();
    }

    initTwig () {
        this.twig = twig;
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
        if (this.browser === null) await this.initBrowser();
        if (!fs.existsSync(templatePath)) throw new Error("template_file_not_exists");

        const renderedHtml = this.twig.renderFile(templatePath, data, (error, html) => {
            if (error !== null) throw new Error("error_rendering_template");
            debugger;
        });
    }
}
