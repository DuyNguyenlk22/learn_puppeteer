import puppeteer from "puppeteer";

export const startBrowser = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      //TODO: có hiện UI của chromium hay không , false là có
      headless: true,
      //*Chrome sử dụng multiple layers của sandbox đê tránh những nội dung web không đáng tin cậy
      //*Nếu tin tưởng content đúng thì set như vậy
      args: ["--disable-setuid-sandbox"],
      //TODO: truy cập website bỏ qua lỗi http secure
      ignoreHTTPSErrors: true,
    });
  } catch (error) {
    console.log("😐 ~ startBrowser ~ error:👉", error);
  }
  return browser;
};
