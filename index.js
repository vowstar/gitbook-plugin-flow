/*jshint esversion: 8 */

const path = require('path');
const puppeteer = require('puppeteer');

async function processBlock(blk) {
    const book = this;
    const code = blk.body;
    const config = book.config.get('pluginsConfig.flow', {});
    const width = blk.kwargs.width;
    const height = 'Reserved';

    try {
        const browser = await puppeteer.launch({
            args: [
                '--disable-dev-shm-usage',
                '--no-sandbox',
                '--allow-file-access-from-files',
                '--enable-local-file-accesses'
            ]
        });
        const page = await browser.newPage();

        const htmlFile = path.join(__dirname, 'renderer.html');
        await page.goto("file://" + htmlFile, { waitUntil: 'domcontentloaded' });

        const xCode = encodeURIComponent(code);
        const xConfig = encodeURIComponent(JSON.stringify(config));
        const xWidth = encodeURIComponent(width);
        const xHeight = encodeURIComponent(height);

        /* istanbul ignore next */
        const result = await page.evaluate(
            `(async () => {
                code = decodeURIComponent("${xCode}");
                config = JSON.parse(decodeURIComponent("${xConfig}"));
                width = decodeURIComponent("${xWidth}");
                height = decodeURIComponent("${xHeight}");
                window.renderComplete = false;
                const rendered = await render(code, config, width);
                window.renderComplete = true;
                return rendered;
            })()`
        );

        await page.waitForFunction('window.renderComplete === true', {
            timeout: 50000
        });
        await browser.close();

        return result;
    } catch (error) {
        console.error("Error processing block:", error);
        return `<svg version="1.1" width="600" height="200" xmlns="http://www.w3.org/2000/svg">
            <text x="10" y="100" font-size="60" text-anchor="left">
                Failed to render flow diagram. Check console for details.
            </text>
        </svg>`;
    }
}

module.exports = {
    blocks: {
        flow: {
            process: processBlock
        },
        flowchart: {
            process: processBlock
        }
    },
    hooks: {
        // Initialize plugin and read config
        "init": function () {
            if (!Object.keys(this.book.config.get('pluginsConfig.flow', {})).length) {
                this.book.config.set('pluginsConfig.flow', {});
            }
        },
        // Before parsing markdown
        "page:before": function (page) {
            // Get all code texts
            const flows = page.content.match(/```(\x20|\t)*(flow)((.*[\r\n]+)+?)?```/igm);
            // Begin replace
            if (Array.isArray(flows)) {
                for (let i = 0; i < flows.length; i++) {
                    page.content = page.content.replace(
                        flows[i],
                        flows[i]
                            .replace(/```(\x20|\t)*(flow)[ \t]+{(.*)}/i, function (matchedStr) {
                                if (!matchedStr) return "";
                                let newStr = "";
                                let modeQuote = false;
                                let modeArray = false;
                                let modeChar = false;
                                let modeEqual = false;

                                let str = matchedStr.replace(/^\s+|\s+$/g, "").replace(/```(\x20|\t)*(flow)/i, "");

                                for (let j = 0; j < str.length; j++) {
                                    if (str.charAt(j) === "\"") {
                                        modeQuote = !modeQuote;
                                        modeChar = true;
                                        newStr += str.charAt(j);
                                        continue;
                                    }
                                    if (str.charAt(j) === "[") {
                                        modeArray = true;
                                        newStr += str.charAt(j);
                                        continue;
                                    }
                                    if (str.charAt(j) === "]") {
                                        modeArray = false;
                                        newStr += str.charAt(j);
                                        continue;
                                    }
                                    if (modeQuote || modeArray) {
                                        newStr += str.charAt(j);
                                    } else {
                                        if (/[A-Za-z0-9_]/.test(str.charAt(j))) {
                                            modeChar = true;
                                            newStr += str.charAt(j);
                                        } else if (str.charAt(j) === "=") {
                                            modeEqual = true;
                                            modeChar = false;
                                            newStr += str.charAt(j);
                                        } else if (modeChar && modeEqual) {
                                            modeChar = false;
                                            modeEqual = false;
                                            newStr += ",";
                                        }
                                    }
                                }

                                newStr = newStr.replace(/,$/, "");
                                return `{% flow ${newStr} %}`;
                            })
                            .replace(/```(\x20|\t)*(flow)/i, '{% flow %}')
                            .replace(/```/, '{% endflow %}')
                    );
                }
            }
            return page;
        }
    }
};
