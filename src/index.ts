import express from "express";
import puppeteer from "puppeteer-core";
import { promises as dns, ADDRCONFIG } from "dns";

const app = express();

app.get("/", async (req, res) => {
  const { address } = await dns.lookup(process.env.BROWSER_ADDRESS as string, {
    family: 4,
    hints: ADDRCONFIG,
   });
  if (!address) {
    return;
  }
  const browser = await puppeteer.connect({ browserURL: `http://${address}:${process.env.BROWSER_PORT}` });
  if (!req.query.url) {
    return await res.send({
      "message": "invalid"
    });
  };
  let page = await browser.newPage();
  await page.setViewport({
    height: 960,
    width: 1260,
  });
  await page.setDefaultNavigationTimeout(0);
  await page.goto(req.query.url as string, {
    waitUntil: "networkidle2",
  });
  let content = await page.screenshot() as Buffer;
  await page.close();
  res.writeHead(200, {
    "Content-Type": "image/png",
    "Content-Length": content.length
  });
  res.end(content);
});

app.listen(3000);
