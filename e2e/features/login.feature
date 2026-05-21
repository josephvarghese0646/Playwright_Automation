Feature: Login Functionality
  As a user
  I want to be able to log in to the application
  So that I can access my account

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid credentials
    And I click the login button
    Then I should be redirected to the dashboard

  Scenario: Failed login with invalid credentials
    Given I am on the login page
    When I enter invalid credentials
    And I click the login button
    Then I should see an error message

  Scenario: Login page displays correctly
    Given I am on the login page
    Then I should see the login form
    And I should see the username field
    And I should see the password field
    And I should see the login button
