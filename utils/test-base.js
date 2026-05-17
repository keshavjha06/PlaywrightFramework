import base from "@playwright/test";

exports.customtest = base.test.extend({
  testDataForOrder: {
    username: "anshikaw@gmail.com",
    password: "Learning@830$3mK3",
    productName: "ADIDAS ORIGINAL"
  },
});
