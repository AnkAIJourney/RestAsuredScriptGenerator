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
        return HttpRequest.httpRequest(builder.build(), "post", "application/json", url);
    }
}

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
    public void test_1() {
        // Login to workstation
        // https://advqa.morningstar.com/advisor/login/instlgn.asp?INSTID=MSDEM2&login=Support_1&pwd=M$tar5upp0rT!2024
        // Make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/callWFECalculateService.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload);
        response.statusCode(200);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_2() {
        // Generate JWT Token
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        jwtToken.statusCode(200);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_3() {
        // Update API > Post > require JWT Token
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/callWFECalculateService.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<graph>"), "Graph data is missing");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_4() {
        // Make request without adding JWT Token
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/callWFECalculateService.json")));
        ValidatableResponse response = api.callWFECalculateService("", payload);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_5() {
        // Remove any or request parameters and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/callWFECalculateService.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String jwtTokenStr = jwtToken.extract().jsonPath().getString("jwtToken");

        // Remove assetClassGoupId
        String url1 = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?forecastType=current&IsGraph=1";
        ValidatableResponse response1 = api.callWFECalculateService(jwtTokenStr, payload);
        response1.statusCode(400);

        // Remove forecastType
        String url2 = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&IsGraph=1";
        ValidatableResponse response2 = api.callWFECalculateService(jwtTokenStr, payload);
        response2.statusCode(400);

        // Remove IsGraph
        String url3 = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current";
        ValidatableResponse response3 = api.callWFECalculateService(jwtTokenStr, payload);
        response3.statusCode(400);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_6() {
        // Pass incorrect request parameters and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/callWFECalculateService.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String jwtTokenStr = jwtToken.extract().jsonPath().getString("jwtToken");

        // Incorrect assetClassGoupId
        String url1 = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-DETAIL-2&forecastType=current&IsGraph=1";
        ValidatableResponse response1 = api.callWFECalculateService(jwtTokenStr, payload);
        response1.statusCode(500);

        // Incorrect IsGraph
        String url2 = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=false";
        ValidatableResponse response2 = api.callWFECalculateService(jwtTokenStr, payload);
        response2.statusCode(400);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_7() {
        // Pass blank data to mandatory input and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String jwtTokenStr = jwtToken.extract().jsonPath().getString("jwtToken");
        ValidatableResponse response = api.callWFECalculateService(jwtTokenStr, "");
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_8() {
        // Pass incorrect data to mandatory input and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String payload = "{\"invalid\":\"data\"}";
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String jwtTokenStr = jwtToken.extract().jsonPath().getString("jwtToken");
        ValidatableResponse response = api.callWFECalculateService(jwtTokenStr, payload);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_9() {
        // Verify certain objects like holding details from payload and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/callWFECalculateService.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String jwtTokenStr = jwtToken.extract().jsonPath().getString("jwtToken");
        ValidatableResponse response = api.callWFECalculateService(jwtTokenStr, payload);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_10() {
        // Send completely empty JSON body
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String jwtTokenStr = jwtToken.extract().jsonPath().getString("jwtToken");
        ValidatableResponse response = api.callWFECalculateService(jwtTokenStr, "{}");
        response.statusCode(400);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("A non-empty request body is required"), "Error message is missing");
        sAssert.assertAll();
    }
}