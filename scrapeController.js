import { scrapeCategories, scraper } from "./scraper.js";
import fs from "fs";

export const scrapeController = async (scrapeInstance) => {
  const url = "https://phongtro123.com/";
  const indexs = [1, 2, 3, 4];
  try {
    let browser = await scrapeInstance;
    //*gọi hàm cào ở file scrape
    const categories = await scrapeCategories(browser, url);
    const selectedCategories = categories.filter((category, index) =>
      indexs.some((i) => i === index),
    );

    // let result1 = await scraper(browser, selectedCategories[0].link);
    // fs.writeFile("chothuephongtro.json", JSON.stringify(result1), (err) => {
    //   if (err) console.log("Ghi data vô file json thất bại" + err);
    //   console.log("Ghi data vô file json thành công");
    // });
    let result2 = await scraper(browser, selectedCategories[1].link);
    fs.writeFile("nhachothue.json", JSON.stringify(result2), (err) => {
      if (err) console.log("Ghi data vô file json thất bại" + err);
      console.log("Ghi data vô file json thành công");
    });
    let result3 = await scraper(browser, selectedCategories[2].link);
    fs.writeFile("chothuecanho.json", JSON.stringify(result3), (err) => {
      if (err) console.log("Ghi data vô file json thất bại" + err);
      console.log("Ghi data vô file json thành công");
    });
    let result4 = await scraper(browser, selectedCategories[3].link);
    fs.writeFile("matbang-vanphong.json", JSON.stringify(result4), (err) => {
      if (err) console.log("Ghi data vô file json thất bại" + err);
      console.log("Ghi data vô file json thành công");
    });

    await browser.close();
  } catch (error) {
    console.log("😐 ~ error:👉", error);
  }
};
