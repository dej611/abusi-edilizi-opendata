const webServer = require("./server.js");
const puppeteer = require("puppeteer");

async function printSVGElement(page, wrapperClass, fileName) {
  const element = await page.waitForSelector(wrapperClass);
  await page.waitForSelector(`${wrapperClass} .rsm-geographies path`);
  await element.screenshot({ path: `./public/${fileName}.png` });
}

module.exports = async function prerender() {
  let server, browser;
  try {
    server = await webServer.start();
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      window.PRERENDER = true;
    });
    await page.goto("http://localhost:3000");
    await printSVGElement(page, ".is-two-third svg", "mappa_italia_comuni");
    await printSVGElement(
      page,
      ".is-three-quarters svg",
      "mappa_italia_regioni"
    );
    await printSVGElement(page, ".is-one-third svg", "mappa_comune_roma");

    await browser.close();
    await server.close();

    console.log("Prerender done :)");
  } catch (e) {
    console.error("Something went wrong with prerender :(");
    console.error(e);
    await browser.close();
    await server.close();
  }
};
