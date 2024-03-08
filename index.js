import { scrapeController } from "./scrapeController.js";
import { startBrowser } from "./browser.js";

let browser = startBrowser();
scrapeController(browser);
