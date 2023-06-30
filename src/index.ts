import express from "express";
import puppeteer from "puppeteer-core";
import { promises as dns, ADDRCONFIG } from "dns";

const app = express();

(async () => {
  const { address } = await dns.lookup(process.env.BROWSER_URL as string, {
    family: 4,
    hints: ADDRCONFIG,
  });
  if (!address) {
    return;
  }
  const browser = await puppeteer.connect({ browserURL: address });

  app.get("/", async (req, res) => {
    if (!req.query.url) {
      return await res.send({
        "message": "imvalid"
      });
    };
    let page = await browser.newPage();
    await page.goto(req.query.url as string);
    let content = await page.screenshot() as Buffer;
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
