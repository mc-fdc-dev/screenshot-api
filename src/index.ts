import express from "express";
import puppeteer from "puppeteer-core";
import { promises as dns, ADDRCONFIG } from "dns";

const app = express();

app.get("/", async (req, res) => {
  try {
    if (!req.query.url) {
      return res.status(400).send({
        message: "Invalid request"
      });
    }
    const { address } = await dns.lookup(process.env.BROWSER_ADDRESS as string, {
      family: 4,
      hints: ADDRCONFIG,
    });
    if (!address) {
      return res.status(500).send("Address not found");
    }
    const browser = await puppeteer.connect({ browserURL: `http://${address}:${process.env.BROWSER_PORT}` });
    const page = await browser.newPage();
    await page.setViewport({
      height: Number(req.query.height ?? "960"),
      width: Number(req.query.width ?? "1260"),
      deviceScaleFactor: 2,
    });
    await page.setDefaultNavigationTimeout(0);
    await page.goto(req.query.url as string, {
      waitUntil: "networkidle2",
    });
    const content = await page.screenshot();
    await page.close();
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": content.length
    });
    res.end(content);
  } catch (error) {
    console.error(error);
    res.status(500).send({"message": "Internal server error"});
  }
});

app.listen(3000);

