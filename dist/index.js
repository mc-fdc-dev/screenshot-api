import express from "express";
import puppeteer from "puppeteer-core";
const app = express();
(async () => {
    const browser = await puppeteer.connect({ browserURL: process.env.BROWSER_URL });
    app.get("/", async (req, res) => {
        if (!req.query.url) {
            return await res.send({
                "message": "imvalid"
            });
        }
        ;
        let page = await browser.newPage();
        await page.goto(req.query.url);
        let content = await page.screenshot();
        await page.close();
        // return image data
        res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": content.length
        });
        res.end(content);
    });
})();
app.listen(3000);
