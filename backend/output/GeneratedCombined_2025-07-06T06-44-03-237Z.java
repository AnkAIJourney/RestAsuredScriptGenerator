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
        return HttpRequest.httpRequest(builder.build(), "post", contentTypeStr, url);
    }

    public ValidatableResponse callWFECalculateServiceWithoutToken(String payload, Map<String, String> headers) {
        RequestSpecBuilder builder = new RequestSpecBuilder();
        builder.addHeaders(headers);
        builder.setBody(payload);
        String contentTypeStr = "application/json";
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1";
        return HttpRequest.httpRequest(builder.build(), "post", contentTypeStr, url);
    }

    public ValidatableResponse callWFECalculateServiceWithInvalidParams(String jwtToken, String payload, Map<String, String> headers, String url) {
        RequestSpecBuilder builder = new RequestSpecBuilder();
        builder.addHeader("Authorization", "Bearer " + jwtToken);
        builder.addHeaders(headers);
        builder.setBody(payload);
        String contentTypeStr = "application/json";
        return HttpRequest.httpRequest(builder.build(), "post", contentTypeStr, url);
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
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class InvestmentPlansTests extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void testCallWFECalculateService() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(200);
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void testCallWFECalculateServiceWithoutToken() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateServiceWithoutToken(jsonContent, headers);
        response.statusCode(500);
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void testCallWFECalculateServiceWithInvalidParams() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");

        String[] invalidUrls = {
            "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?forecastType=current&IsGraph=1",
            "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&IsGraph=1",
            "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current"
        };

        for (String url : invalidUrls) {
            ValidatableResponse response = api.callWFECalculateServiceWithInvalidParams(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers, url);
            response.statusCode(400);
        }

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void testCallWFECalculateServiceWithIncorrectParams() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateService.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");

        String[] incorrectUrls = {
            "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-DETAIL-2&forecastType=current&IsGraph=1",
            "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=false"
        };

        for (String url : incorrectUrls) {
            ValidatableResponse response = api.callWFECalculateServiceWithInvalidParams(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers, url);
            response.statusCode(400);
        }

        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void testCallWFECalculateServiceWithBlankData() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonContent = "{}";
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(500);
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void testCallWFECalculateServiceWithIncorrectData() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\investmentplans\\callWFECalculateServiceIncorrect.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(500);
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void testCallWFECalculateServiceWithEmptyBody() throws Exception {
        InvestmentPlansAPI api = new InvestmentPlansAPI();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonContent = "";
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), jsonContent, headers);
        response.statusCode(400);
        sAssert.assertAll();
    }
}