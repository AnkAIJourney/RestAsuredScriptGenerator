Methods:
```java
package com.morningstar.automation.aws3.api.investmentplans;

import com.morningstar.automation.api.core.HttpRequest;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.response.ValidatableResponse;
import java.util.HashMap;
import java.util.Map;

public class InvestmentPlansAPI {

    public ValidatableResponse callWFECalculateService(String jwtToken, String payload) {
        RequestSpecBuilder builder = new RequestSpecBuilder();
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1";
        builder.addHeader("Authorization", "Bearer " + jwtToken);
        builder.addHeader("Content-Type", "application/json");
        builder.setBody(payload);
        ValidatableResponse response = HttpRequest.httpRequest(builder.build(), "post", "application/json", url);
        return response;
    }

    public ValidatableResponse callWFECalculateServiceWithoutToken(String payload) {
        RequestSpecBuilder builder = new RequestSpecBuilder();
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1";
        builder.addHeader("Content-Type", "application/json");
        builder.setBody(payload);
        ValidatableResponse response = HttpRequest.httpRequest(builder.build(), "post", "application/json", url);
        return response;
    }

    public ValidatableResponse callWFECalculateServiceWithIncorrectParams(String jwtToken, String payload, String assetClassGoupId, String isGraph) {
        RequestSpecBuilder builder = new RequestSpecBuilder();
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=" + assetClassGoupId + "&forecastType=current&IsGraph=" + isGraph;
        builder.addHeader("Authorization", "Bearer " + jwtToken);
        builder.addHeader("Content-Type", "application/json");
        builder.setBody(payload);
        ValidatableResponse response = HttpRequest.httpRequest(builder.build(), "post", "application/json", url);
        return response;
    }
}
```

Tests:
```java
package com.morningstar.automation.aws3.test.investmentplans;

import com.morningstar.automation.aws3.AbstractTest;
import com.morningstar.automation.aws3.api.AWS_authorizationToken_API;
import com.morningstar.automation.aws3.api.investmentplans.InvestmentPlansAPI;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import io.restassured.response.ValidatableResponse;
import org.testng.annotations.Test;
import java.nio.file.Files;
import java.nio.file.Paths;

public class InvestmentPlansTests extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_1() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent);
        response.statusCode(200);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_2() throws Exception {
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        jwtToken.statusCode(200);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_3() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<graph>"), "Graph data is missing");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_4() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse response = api.callWFECalculateServiceWithoutToken(jsonContent);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_5() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateServiceWithIncorrectParams(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, "", "1");
        response.statusCode(400);
        response = api.callWFECalculateServiceWithIncorrectParams(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, "ACG-USA-BROAD-2", "");
        response.statusCode(400);
        response = api.callWFECalculateServiceWithIncorrectParams(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, "ACG-USA-BROAD-2", "1");
        response.statusCode(400);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_6() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateServiceWithIncorrectParams(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, "ACG-USA-DETAIL-2", "false");
        response.statusCode(400);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_7() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService_blank.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_8() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService_incorrect.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_9() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_10() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonContent = "{}";
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent);
        response.statusCode(400);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("A non-empty request body is required."), "Error message is missing");
        sAssert.assertAll();
    }
}
```