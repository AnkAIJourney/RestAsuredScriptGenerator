package com.morningstar.automation.aws3.api.ipx;
import com.morningstar.automation.api.core.CacheManager;
import com.morningstar.automation.api.core.HttpRequest;
import com.morningstar.automation.aws3.cons.LoginCookies;
import com.morningstar.automation.aws3.utils.MapFileOperate;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.path.json.JsonPath;
import io.restassured.response.ValidatableResponse;
import java.util.HashMap;
import java.util.Map;
import com.morningstar.automation.aws3.AbstractTest;
import com.morningstar.automation.aws3.api.AWS_authorizationToken_API;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import org.testng.annotations.Test;
import static io.restassured.RestAssured.given;

/**
 * Combined REST Assured Test Automation Class
 * Contains both utility methods and test cases
 * Generated automatically from API specifications
 */
public class CombinedRestAssuredTest {
    
    // ==================== UTILITY METHODS ====================
public class AWS3_Reports_GetXML {

    public ValidatableResponse callWFECalculateService(ValidatableResponse jwtToken, String payLoad) {
        ValidatableResponse response = callWFECalculateService_Internal(LoginCookies.MSDEM2Path, jwtToken, payLoad);
        return response;
    }

    public ValidatableResponse callWFECalculateService_Internal(String cookiesPath, ValidatableResponse jwtToken, String jsonBody) {
        MapFileOperate file = new MapFileOperate();
        Map<String, String> cookies = new HashMap<String, String>();
        RequestSpecBuilder builder = new RequestSpecBuilder();
        JsonPath jsonPathEvaluator = jwtToken.extract().jsonPath();
        String jwtTokenResponse = jsonPathEvaluator.get("jwtToken");
        String endPoint = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1";
        cookies = file.readMapFile(cookiesPath);
        String jwtTokenWithBearer = "Bearer " + jwtTokenResponse;
        builder.addCookies(cookies);
        builder.addHeader("Authorization", jwtTokenWithBearer);
        builder.addHeader("Content-Type", "application/json");
        builder.setBody(jsonBody);
        String contentTypeStr = "application/json";
        ValidatableResponse response = HttpRequest.httpRequest(builder.build(), "post", contentTypeStr, endPoint);
        return response;
    }

    
    // ==================== TEST METHODS ====================

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