const puppeteer = require("puppeteer");
const twig = require("twig");

module.exports = class {
    constructor () {
        this.browser = null;
        this.twig = twig;
    }

    async initBrowser () {
        await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
    }

    async renderFile (templatePath, data) {
        if (this.browser === null) await this.initBrowser();

        return await new Promise((resolve, reject) => {
            this.twig.renderFile(templatePath, data, (error, html) => {
                if (error !== null) reject("error_rendering_template");
                resolve(html);
            });
        });
    }
}
