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

public class InvestmentPlansTests extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_1() {
        // Login to workstation
        // This step is assumed to be done manually or through a different automation tool
        // Proceed to make the API request
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
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        jwtToken.statusCode(200);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_3() {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestPayload.json")));
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<graph>"), "Graph data is missing in the response");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_4() {
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
        sAssert.assertTrue(response.extract().asString().contains("The assetClassGoupId field is required."), "Error message is incorrect");

        // Remove forecastType
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&IsGraph=1";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("The forecastType field is required."), "Error message is incorrect");

        // Remove IsGraph
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("Invalid input!"), "Error message is incorrect");

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_6() {
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
        sAssert.assertTrue(response.extract().asString().contains("Internal Server Error: File not found"), "Error message is incorrect");

        // Incorrect IsGraph
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=false";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("Invalid input!"), "Error message is incorrect");

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_7() {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = "{}";
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_8() {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = "{\"invalid\":\"data\"}";
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_9() {
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
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        String payload = "";
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("A non-empty request body is required."), "Error message is incorrect");
        sAssert.assertAll();
    }
}