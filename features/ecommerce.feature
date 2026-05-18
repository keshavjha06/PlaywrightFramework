Feature: Ecommerce

  @Regression
  Scenario: Validate order status in order history
    Given a login to Ecommerce application with "anshika@gmail.com" and "Iamking@000"
    When Add "ZARA COAT 3" to Cart
    Then Verify "ZARA COAT 3" is displayed in the Cart
    When Enter valid details and Place the Order
    Then Verify order is present in the OrderHistory

  @errormessage
  Scenario Outline: validate error messages for login
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then Verify Error message is displayed

    Examples:
      | username           | password          |
      | anshikaw@gmail.com | Learning@830$3mK3 |
