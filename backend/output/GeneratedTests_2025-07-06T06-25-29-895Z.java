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
import java.util.HashMap;
import java.util.Map;

public class InvestmentPlansTest extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_1() {
        // Login to workstation
        // This step is assumed to be done manually or through another automated process
        // Make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestPayload.json")));
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
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestPayload.json")));
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<graph>"), "Graph data is not present in the response");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_4() {
        // Make request without adding JWT Token
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestPayload.json")));
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
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestPayload.json")));
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");

        // Remove assetClassGoupId
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?forecastType=current&IsGraph=1";
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("The assetClassGoupId field is required."), "Error message not found for missing assetClassGoupId");

        // Remove forecastType
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&IsGraph=1";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("The forecastType field is required."), "Error message not found for missing forecastType");

        // Remove IsGraph
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("Invalid input!"), "Error message not found for missing IsGraph");

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_6() {
        // Pass incorrect request parameters and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestPayload.json")));
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");

        // Incorrect assetClassGoupId
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-DETAIL-2&forecastType=current&IsGraph=1";
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(500);
        sAssert.assertTrue(response.extract().asString().contains("Internal Server Error: File not found"), "Error message not found for incorrect assetClassGoupId");

        // Incorrect IsGraph
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=false";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("Invalid input!"), "Error message not found for incorrect IsGraph");

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_7() {
        // Pass blank data to mandatory input and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = "";
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
        String payload = "{ \"invalid\": \"data\" }";
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
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestPayload.json")));
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
        String payload = "{}";
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("A non-empty request body is required."), "Error message not found for empty JSON body");
        sAssert.assertAll();
    }
}