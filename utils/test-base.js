import base from "@playwright/test";

exports.customtest = base.test.extend({
  testDataForOrder: {
    username: "anshika@gmail.com",
    password: "Iamking@000",
    productName: "zara coat 3",
  },
});
