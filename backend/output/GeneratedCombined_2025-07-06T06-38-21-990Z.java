// ======= METHOD FILE =======
package com.morningstar.automation.aws3.api.investmentplans;

import com.morningstar.automation.api.core.HttpRequest;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.response.ValidatableResponse;
import java.util.Map;

public class InvestmentPlans_API {

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
import com.morningstar.automation.aws3.api.investmentplans.InvestmentPlans_API;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import io.restassured.response.ValidatableResponse;
import org.testng.annotations.Test;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class InvestmentPlans_Tests extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_1() throws Exception {
        // Login to workstation
        // URL: https://advqa.morningstar.com/advisor/login/instlgn.asp?INSTID=MSDEM2&login=Support_1&pwd=M$tar5upp0rT!2024
        // Make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(200);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_2() throws Exception {
        // Generate JWT Token
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        jwtToken.statusCode(200);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_3() throws Exception {
        // Update API > Post > require JWT Token
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<graph>"), "Graph data is not present in the response");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_4() throws Exception {
        // Make request without adding JWT Token
        InvestmentPlans_API api = new InvestmentPlans_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService("", jsonContent, headers);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_5() throws Exception {
        // Remove any or request parameters and make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");

        // Remove assetClassGoupId
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?forecastType=current&IsGraph=1";
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("The assetClassGoupId field is required."), "Error message not found for missing assetClassGoupId");

        // Remove forecastType
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&IsGraph=1";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("The forecastType field is required."), "Error message not found for missing forecastType");

        // Remove IsGraph
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("Invalid input!"), "Error message not found for missing IsGraph");

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_6() throws Exception {
        // Pass incorrect request parameters and make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");

        // Incorrect assetClassGoupId
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-DETAIL-2&forecastType=current&IsGraph=1";
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(500);
        sAssert.assertTrue(response.extract().asString().contains("Internal Server Error: File not found: /app/InvestmentPlans/XmlData/Ipx/AWSData/ACG-USA-DETAIL-2.xml"), "Error message not found for incorrect assetClassGoupId");

        // Incorrect IsGraph
        url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=false";
        response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("Invalid input!"), "Error message not found for incorrect IsGraph");

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_7() throws Exception {
        // Pass blank data to mandatory input and make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), "", headers);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_8() throws Exception {
        // Pass incorrect data to mandatory input and make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService_invalid.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_9() throws Exception {
        // Verify certain objects like holding details from payload and make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_10() throws Exception {
        // Send completely empty JSON body
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), "{}", headers);
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("A non-empty request body is required.\nThe request field is required."), "Error message not found for empty JSON body");
        sAssert.assertAll();
    }
}