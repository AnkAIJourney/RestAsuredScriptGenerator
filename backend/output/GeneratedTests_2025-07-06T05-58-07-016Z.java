```java
package com.morningstar.automation.aws3.test.ipx;

import com.morningstar.automation.aws3.AbstractTest;
import com.morningstar.automation.aws3.api.AWS_authorizationToken_API;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import io.restassured.response.ValidatableResponse;
import org.testng.annotations.Test;
import static io.restassured.RestAssured.given;

public class AWS3_IPX_Reports extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_1() {
        ValidatableResponse response = given()
            .queryParam("INSTID", "MSDEM2")
            .queryParam("login", "Support_1")
            .queryParam("pwd", "M$tar5upp0rT!2024")
            .when()
            .get("https://advqa.morningstar.com/advisor/login/instlgn.asp")
            .then()
            .statusCode(200);

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_2() {
        ValidatableResponse response = given()
            .when()
            .get("https://awse2webqa.morningstar.com/aws/api/v1/authorization/jwttoken")
            .then()
            .statusCode(200);

        String jwtToken = response.extract().path("token");
        sAssert.assertNotNull(jwtToken, "JWT token should generate successfully");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_3() {
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtTokenResponse = jwtTokenAPI.jwtTokenWithValidRoles();
        String jwtToken = jwtTokenResponse.extract().path("token");

        String requestBody = "{...}"; // The JSON body as provided in the prompt

        ValidatableResponse response = given()
            .header("Authorization", "Bearer " + jwtToken)
            .header("Content-Type", "application/json")
            .body(requestBody)
            .when()
            .post("https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1")
            .then()
            .statusCode(200);

        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<graph>"), "Response body should contain graph data");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_4() {
        String requestBody = "{...}"; // The JSON body as provided in the prompt

        ValidatableResponse response = given()
            .header("Content-Type", "application/json")
            .body(requestBody)
            .when()
            .post("https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1")
            .then()
            .statusCode(500);

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_5() {
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtTokenResponse = jwtTokenAPI.jwtTokenWithValidRoles();
        String jwtToken = jwtTokenResponse.extract().path("token");

        String requestBody = "{...}"; // The JSON body as provided in the prompt

        // Test missing assetClassGoupId
        ValidatableResponse response1 = given()
            .header("Authorization", "Bearer " + jwtToken)
            .header("Content-Type", "application/json")
            .body(requestBody)
            .when()
            .post("https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?forecastType=current&IsGraph=1")
            .then()
            .statusCode(400);

        sAssert.assertTrue(response1.extract().asString().contains("The assetClassGoupId field is required."), "Error message should be present");

        // Test missing forecastType
        ValidatableResponse response2 = given()
            .header("Authorization", "Bearer " + jwtToken)
            .header("Content-Type", "application/json")
            .body(requestBody)
            .when()
            .post("https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&IsGraph=1")
            .then()
            .statusCode(400);

        sAssert.assertTrue(response2.extract().asString().contains("The forecastType field is required."), "Error message should be present");

        // Test missing IsGraph
        ValidatableResponse response3 = given()
            .header("Authorization", "Bearer " + jwtToken)
            .header("Content-Type", "application/json")
            .body(requestBody)
            .when()
            .post("https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current")
            .then()
            .statusCode(400);

        sAssert.assertTrue(response3.extract().asString().contains("Invalid input!"), "Error message should be present");

        sAssert.assertAll();
    }
}
```