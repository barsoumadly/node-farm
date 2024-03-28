module.exports = function (template, product) {
  let filledTemplate = template
    .replace(/{%ID%}/g, product.id)
    .replace(/{%PRODUCTNAME%}/g, product.productName)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%QUANTITY%}/g, product.quantity)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%DESCRIPTION%}/g, product.description);

  if (!product.organic) {
    filledTemplate = filledTemplate.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return filledTemplate;
};
