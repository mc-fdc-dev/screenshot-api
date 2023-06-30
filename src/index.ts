import express from "express";
import puppeteer from "puppeteer-core";

const app = express();

(async () => {
  const browser = await puppeteer.connect({ browserURL: process.env.BROWSER_URL });

  app.get("/", async (req, res) => {
    await res.send("Test");
  });
})();

app.listen(3000);
