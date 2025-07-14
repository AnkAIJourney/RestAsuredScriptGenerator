```java
package com.morningstar.automation.aws3.test.ipx;

import com.morningstar.automation.aws3.AbstractTest;
import com.morningstar.automation.aws3.api.AWS_authorizationToken_API;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import io.restassured.RestAssured;
import io.restassured.response.ValidatableResponse;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import static io.restassured.RestAssured.given;

public class AWS3_IPX_Reports extends AbstractTest {

    private String jwtToken;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "https://localhost:7257";
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_1() {
        given()
            .auth().preemptive().basic("Support_1", "M$tar5upp0rT!2024")
            .when()
            .get("https://advqa.morningstar.com/advisor/login/instlgn.asp?INSTID=MSDEM2")
            .then()
            .statusCode(200);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_2() {
        ValidatableResponse response = given()
            .header("Content-Type", "application/json")
            .when()
            .get("https://awse2webqa.morningstar.com/aws/api/v1/authorization/jwttoken?")
            .then()
            .statusCode(200);

        jwtToken = response.extract().path("token");
        sAssert.assertNotNull(jwtToken, "JWT token should generate successfully");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_3() throws IOException {
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/ipx/requestBody.json")));

        ValidatableResponse response = given()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + jwtToken)
            .body(requestBody)
            .when()
            .post("/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1")
            .then()
            .statusCode(200);

        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<graph>"), "Graph data should be present in the response body");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_4() throws IOException {
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/ipx/requestBody.json")));

        given()
            .header("Content-Type", "application/json")
            .body(requestBody)
            .when()
            .post("/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1")
            .then()
            .statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_5() throws IOException {
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/ipx/requestBody.json")));

        // Test missing assetClassGoupId
        given()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + jwtToken)
            .body(requestBody)
            .when()
            .post("/api/v1/investment-plans/CallWFECalculateService?forecastType=current&IsGraph=1")
            .then()
            .statusCode(400)
            .body("Message", equalTo("The assetClassGoupId field is required."));

        // Test missing forecastType
        given()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + jwtToken)
            .body(requestBody)
            .when()
            .post("/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&IsGraph=1")
            .then()
            .statusCode(400)
            .body("Message", equalTo("The forecastType field is required."));

        // Test missing IsGraph
        given()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + jwtToken)
            .body(requestBody)
            .when()
            .post("/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current")
            .then()
            .statusCode(400)
            .body("Message", equalTo("Invalid input!"));
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_6() throws IOException {
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/ipx/requestBody.json")));

        // Test incorrect assetClassGoupId
        given()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + jwtToken)
            .body(requestBody)
            .when()
            .post("/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-DETAIL-2&forecastType=current&IsGraph=1")
            .then()
            .statusCode(500)
            .body("Message", equalTo("Internal Server Error: File not found: /app/InvestmentPlans/XmlData/Ipx/AWSData/ACG-USA-DETAIL-2.xml"));

        // Test incorrect IsGraph
        given()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + jwtToken)
            .body(requestBody)
            .when()
            .post("/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=false")
            .then()
            .statusCode(400)
            .body("Message", equalTo("Invalid input!"));
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_7() {
        given()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + jwtToken)
            .body("{}")
            .when()
            .post("/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1")
            .then()
            .statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_8() throws IOException {
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/ipx/incorrectRequestBody.json")));

        given()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + jwtToken)
            .body(requestBody)
            .when()
            .post("/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1")
            .then()
            .statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_9() throws IOException {
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/ipx/requestBody.json")));

        ValidatableResponse response = given()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + jwtToken)
            .body(requestBody)
            .when()
            .post("/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1")
            .then()
            .statusCode(500);

        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("holding details"), "Holding details should be present in the response body");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_10() {
        given()
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + jwtToken)
            .body("{}")
            .when()
            .post("/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1")
            .then()
            .statusCode(400)
            .body("Message", equalTo("A non-empty request body is required.\nThe request field is required."));
    }
}
```