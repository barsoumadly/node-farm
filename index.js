const http = require("http");
const fs = require("fs");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate");

const overviewTemplate = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const cardTemplate = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const productTemplate = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((element) =>
  slugify(element.productName, { lower: true })
);

for (let i = 0; i < slugs.length; i++) {
  dataObj[i] = { slug: slugs[i], ...dataObj[i] };
}

const server = http.createServer((req, res) => {
  const { pathname: pathName } = url.parse(req.url, true);

  // Overview page
  if (pathName === "/" || pathName === "/overview") {
    const cards = dataObj
      .map((element) => replaceTemplate(cardTemplate, element))
      .join();
    const overviewPage = overviewTemplate.replace("{%PRODUCT_CARDS%}", cards);

    res.writeHead(200, { "content-type": "text/html" });
    res.end(overviewPage);
  }

  // Product page
  else if (pathName.includes("/product")) {
    const productName = pathName.split("/product/")[1];
    const [product] = dataObj.filter((element) => element.slug === productName);
    const productPage = replaceTemplate(productTemplate, product);

    res.writeHead(200, { "content-type": "text/html" });
    res.end(productPage);
  }

  // API page
  else if (pathName === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data);
  }

  // Not found page
  else {
    res.writeHead(404, {
      "content-type": "text/html",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening requests on port 8000");
});
