import express from "express";
import puppeteer from "puppeteer-core";

const app = express();

(async () => {
  const browser = await puppeteer.connect({ browserURL: process.env.BROWSER_URL });

  app.get("/", async (req, res) => {
    let page = await browser.newPage();
    await page.goto(req.query.url);
    await res.send("Ok");
  });
})();

app.listen(3000);
