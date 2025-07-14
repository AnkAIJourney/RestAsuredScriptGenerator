// ======= METHOD FILE =======
package com.morningstar.automation.aws3.api.investmentplans;

import com.morningstar.automation.api.core.HttpRequest;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.response.ValidatableResponse;
import java.util.Map;

public class InvestmentPlansAPI {

    public ValidatableResponse callWFECalculateService(String jwtToken, String payload, Map<String, String> headers) {
        RequestSpecBuilder builder = new RequestSpecBuilder();
        builder.addHeader("Authorization", "Bearer " + jwtToken);
        builder.addHeaders(headers);
        builder.setBody(payload);
        String contentTypeStr = "application/json";
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1";
        ValidatableResponse response = HttpRequest.httpRequest(builder.build(), "post", contentTypeStr, url);
        return response;
    }
}

// ======= TEST FILE =======
package com.morningstar.automation.aws3.test.investmentplans;

import com.morningstar.automation.aws3.AbstractTest;
import com.morningstar.automation.aws3.api.AWS_authorizationToken_API;
import com.morningstar.automation.aws3.api.investmentplans.InvestmentPlansAPI;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import io.restassured.response.ValidatableResponse;
import org.testng.annotations.Test;
import java.util.HashMap;
import java.util.Map;

public class InvestmentPlansTests extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_1() {
        // Login to workstation
        // This step is assumed to be done manually or through another method
        // Make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = "{...}"; // Replace with actual payload
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
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
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = "{...}"; // Replace with actual payload
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
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
        String payload = "{...}"; // Replace with actual payload
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService("", payload, headers);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_5() {
        // Remove any or request parameters and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = "{...}"; // Replace with actual payload
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");

        // Test for missing assetClassGoupId
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?forecastType=current&IsGraph=1";
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("The assetClassGoupId field is required."), "Error message is missing for assetClassGoupId");

        // Test for missing forecastType
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&IsGraph=1";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("The forecastType field is required."), "Error message is missing for forecastType");

        // Test for missing IsGraph
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("Invalid input!"), "Error message is missing for IsGraph");

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_6() {
        // Pass incorrect request parameters and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = "{...}"; // Replace with actual payload
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");

        // Test for incorrect assetClassGoupId
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-DETAIL-2&forecastType=current&IsGraph=1";
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(500);
        sAssert.assertTrue(response.extract().asString().contains("Internal Server Error: File not found"), "Error message is missing for assetClassGoupId");

        // Test for incorrect IsGraph
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=false";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("Invalid input!"), "Error message is missing for IsGraph");

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_7() {
        // Pass blank data to mandatory input and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = ""; // Blank payload
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_8() {
        // Pass incorrect data to mandatory input and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = "{...}"; // Replace with incorrect payload
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_9() {
        // Verify certain objects like holding details from payload and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = "{...}"; // Replace with actual payload containing holding details
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_10() {
        // Send completely empty JSON body
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = "{}"; // Empty JSON body
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("A non-empty request body is required."), "Error message is missing for empty JSON body");
        sAssert.assertAll();
    }
}