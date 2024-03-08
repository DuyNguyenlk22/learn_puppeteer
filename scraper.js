export const scrapeCategories = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      const page = await browser.newPage();
      console.log("Mở tab mới ...");
      //Navigate the page to a URL
      await page.goto(url);
      console.log("Truy cập vào url: " + url);
      await page.waitForSelector("#webpage");
      console.log("Website đã load xong ...");

      const dataCategories = await page.$$eval(`#navbar-menu > ul > li`, (els) => {
        dataCategories = els.map((el) => {
          return {
            category: el.querySelector("a").innerText,
            link: el.querySelector("a").href,
          };
        });
        return dataCategories;
      });

      await page.close();
      console.log(">>> tab đã đóng");
      resolve(dataCategories);
    } catch (error) {
      console.log("🐼🐸 ~ newPromise ~ error🚀", error);
      reject(error);
    }
  });

export const scraper = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      const page = await browser.newPage();
      console.log("Mở tab mới...");
      await page.goto(url);
      console.log("Truy cập vào trang: " + url);
      await page.waitForSelector("#main");
      console.log("Website đã load xong");

      const scraperData = {};
      //Lấy header
      const headerData = await page.$eval("header", (el) => {
        return {
          title: el.querySelector("h1").innerText,
          des: el.querySelector("p").innerText,
        };
      });
      scraperData.header = headerData;

      //Lấy links detail item
      const detailLinks = await page.$$eval(
        "#left-col > section.section-post-listing > ul > li ",
        (els) => {
          detailLinks = els.map((el) => {
            return el.querySelector(".post-meta > h3 > a").href;
          });
          return detailLinks;
        },
      );

      const scraperDetail = async (link) =>
        new Promise(async (resolve, reject) => {
          try {
            let pageDetail = await browser.newPage();
            await pageDetail.goto(link);
            console.log("Truy cập " + link);
            await pageDetail.waitForSelector("#main");

            //! Bắt đầu cào dữ liệu
            const dataDetail = {}; //* chứa toàn bộ data của page detail
            //*Cào ảnh
            const images = await pageDetail.$$eval(
              "#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide",
              (els) => {
                images = els.map((el) => {
                  return el.querySelector("img")?.src;
                });
                return images.filter((i) => !i === false);
              },
            );
            dataDetail.images = images;

            //*Lấy header detail
            const header = await pageDetail.$eval("header.page-header", (el) => {
              return {
                title: el.querySelector("h1 > a").innerText,
                star: el.querySelector("h1 > span")?.className?.replace(/^\D+/g, ""),
                class: {
                  content: el.querySelector("p").innerText,
                  classType: el.querySelector("p > a > strong").innerText,
                },
                address: el.querySelector("address.post-address").innerText,
                attributes: {
                  price: el.querySelector("div.post-attributes > .price > span").innerText,
                  acreage: el.querySelector("div.post-attributes > .acreage > span").innerText,
                  published: el.querySelector("div.post-attributes > .published > span").innerText,
                  hashtag: el.querySelector("div.post-attributes > .hashtag > span").innerText,
                },
              };
            });
            dataDetail.header = header;

            //*Thông tin mô tả
            const mainContentHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-main-content",
              (el) => el.querySelector("div.section-header > h2").innerText,
            );
            const mainContentContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-main-content > div.section-content > p",
              (els) => els.map((el) => el.innerText),
            );

            dataDetail.mainContent = {
              header: mainContentHeader,
              content: mainContentContent,
            };

            //*Đặc điểm tin đăng
            const overviewHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-overview",
              (el) => el.querySelector("div.section-header > h3").innerText,
            );
            const overviewContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-overview > div.section-content > table.table > tbody > tr",
              (els) =>
                els.map((el) => {
                  return {
                    name: el.querySelector("td:first-child").innerText,
                    content: el.querySelector("td:last-child").innerText,
                  };
                }),
            );
            dataDetail.overview = {
              header: overviewHeader,
              content: overviewContent,
            };

            //*Thông tin liên hệ
            const contactHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-contact",
              (el) => el.querySelector("div.section-header > h3").innerText,
            );
            const contactContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-contact > div.section-content > table.table > tbody > tr",
              (els) =>
                els.map((el) => {
                  return {
                    name: el.querySelector("td:first-child").innerText,
                    content: el.querySelector("td:last-child").innerText,
                  };
                }),
            );
            dataDetail.contact = {
              header: contactHeader,
              content: contactContent,
            };

            await pageDetail.close();
            console.log("Đã đóng tab " + link);

            resolve(dataDetail);
          } catch (error) {
            console.log("Lấy data detail lỗi " + error);
            reject(error);
          }
        });

      const details = [];

      for (let link of detailLinks) {
        const detail = await scraperDetail(link);
        details.push(detail);
      }

      scraperData.body = details;

      console.log("Trình duyệt đã đóng...");
      resolve(scraperData);
    } catch (error) {
      reject(error);
    }
  });
