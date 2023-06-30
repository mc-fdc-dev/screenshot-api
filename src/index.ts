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
    let page = await browser.newPage();
    await page.goto(req.query.url as string);
    await page.close();
    await res.send("Ok");
  });
})();

app.listen(3000);
