const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const twig = require("twig");
const TwigWrapper = require("./src/TwigWrapper");

module.exports = class {
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
        if (this.browser === null) await this.initBrowser();
        if (!fs.existsSync(templatePath)) throw new Error("template_file_not_exists");

        this.renderedHtml = await this.twig.renderFile(templatePath, data);
        return this;
    }

    async toHtml () {
        return this.renderedHtml;
    }

    async toPdf () {

    }
}
