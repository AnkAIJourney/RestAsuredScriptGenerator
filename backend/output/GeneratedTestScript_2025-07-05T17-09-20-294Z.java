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
        // https://awse2webqa.morningstar.com/aws/api/v1/authorization/jwttoken?
        // Make request
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        jwtToken.statusCode(200);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_3() {
        // Update API > Post > require JWT Token
        // Authorization > Auth Type > Bearer token > pass the JWT token
        // Make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/callWFECalculateService.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload);
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
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload.replace("ACG-USA-BROAD-2", ""));
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("The assetClassGoupId field is required."), "Error message is not as expected");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_6() {
        // Pass incorrect request parameters and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/callWFECalculateService.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload.replace("ACG-USA-BROAD-2", "ACG-USA-DETAIL-2"));
        response.statusCode(500);
        sAssert.assertTrue(response.extract().asString().contains("Internal Server Error: File not found"), "Error message is not as expected");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_7() {
        // Pass blank data to mandatory input and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), "");
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_8() {
        // Pass incorrect data to mandatory input and make request
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String payload = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/callWFECalculateService.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload.replace("55800", "invalid"));
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
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), payload);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void test_10() {
        // Send completely empty JSON body
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), "{}");
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("A non-empty request body is required."), "Error message is not as expected");
        sAssert.assertAll();
    }
}