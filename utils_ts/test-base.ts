import { test as baseTest } from '@playwright/test';
interface TestDataForOrder {
  username: string;
  password: string;
  productName: string;
};
export const customTest = baseTest.extend<{ testDataForOrder: TestDataForOrder }>(
  {
    testDataForOrder: {
      username: "anshikaw@gmail.com",
      password: "Learning@830$3mK3",
      productName: "ADIDAS ORIGINAL"

    }

  }

)