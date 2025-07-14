Methods:
```java
package com.morningstar.automation.aws3.test.ipx;

import com.morningstar.automation.aws3.AbstractTest;
import com.morningstar.automation.aws3.api.AWS_authorizationToken_API;
import com.morningstar.automation.aws3.api.ipx.AWS3_Reports_GetXML;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import io.restassured.response.ValidatableResponse;
import org.testng.annotations.Test;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class AWS3_IPX_Reports extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_AutoAsset() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"currentBenchmarkId\": \"\"", "\"currentBenchmarkId\": \"AutoAsset\"")
                                 .replace("\"proposedBenchmarkId\": \"\"", "\"proposedBenchmarkId\": \"AutoAsset\"");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXml_APITest(jwtToken, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_dcc56cad() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"currentBenchmarkId\": \"\"", "\"currentBenchmarkId\": \"dcc56cad-a24f-4d93-9522-86435029d494\"")
                                 .replace("\"proposedBenchmarkId\": \"\"", "\"proposedBenchmarkId\": \"dcc56cad-a24f-4d93-9522-86435029d494\"");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXml_APITest(jwtToken, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_FOUSA06WNW() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"currentBenchmarkId\": \"\"", "\"currentBenchmarkId\": \"FOUSA06WNW\"")
                                 .replace("\"proposedBenchmarkId\": \"\"", "\"proposedBenchmarkId\": \"FOUSA06WNW\"");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXml_APITest(jwtToken, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_Invalid() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"currentBenchmarkId\": \"\"", "\"currentBenchmarkId\": \"&9r89rnnkldf\"")
                                 .replace("\"proposedBenchmarkId\": \"\"", "\"proposedBenchmarkId\": \"&9r89rnnkldf\"");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXml_APITest(jwtToken, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("Cannot find out security ID for some holdings."), "Expected error message not found");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyReportsBasedOnReportFlag_0() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"XRay\": 1", "\"XRay\": 0")
                                 .replace("\"IncludeDisc\": 1", "\"IncludeDisc\": 0")
                                 .replace("\"InvestDetail\": 1", "\"InvestDetail\": 0")
                                 .replace("\"SnapShot\": 1", "\"SnapShot\": 0")
                                 .replace("\"SingleFee\": 1", "\"SingleFee\": 0")
                                 .replace("\"portfolioComparision\": 1", "\"portfolioComparision\": 0")
                                 .replace("\"StkIntersect\": 1", "\"StkIntersect\": 0")
                                 .replace("\"portfolioFee\": 1", "\"portfolioFee\": 0")
                                 .replace("\"IncludeFeeComp\": 1", "\"IncludeFeeComp\": 0");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXml_APITest(jwtToken, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertFalse(responseBody.contains("<snapshot"), "snapshot element should not be present");
        sAssert.assertFalse(responseBody.contains("<portcomprpt"), "portcomprpt element should not be present");
        sAssert.assertFalse(responseBody.contains("<xray"), "xray element should not be present");
        sAssert.assertFalse(responseBody.contains("<stockintsec"), "stockintsec element should not be present");
        sAssert.assertFalse(responseBody.contains("<mfdetail"), "mfdetail element should not be present");
        sAssert.assertFalse(responseBody.contains("<disclosurerpt"), "disclosurerpt element should not be present");
        sAssert.assertFalse(responseBody.contains("<transfeesingle"), "transfeesingle element should not be present");
        sAssert.assertFalse(responseBody.contains("<transfeeportfolio"), "transfeeportfolio element should not be present");
        sAssert.assertFalse(responseBody.contains("<transfeeportcomp"), "transfeeportcomp element should not be present");
        sAssert.assertFalse(responseBody.contains("<portfolios"), "portfolios element should not be present");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyReportsBasedOnReportFlag_1() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"XRay\": 0", "\"XRay\": 1")
                                 .replace("\"IncludeDisc\": 0", "\"IncludeDisc\": 1")
                                 .replace("\"InvestDetail\": 0", "\"InvestDetail\": 1")
                                 .replace("\"SnapShot\": 0", "\"SnapShot\": 1")
                                 .replace("\"SingleFee\": 0", "\"SingleFee\": 1")
                                 .replace("\"portfolioComparision\": 0", "\"portfolioComparision\": 1")
                                 .replace("\"StkIntersect\": 0", "\"StkIntersect\": 1")
                                 .replace("\"portfolioFee\": 0", "\"portfolioFee\": 1")
                                 .replace("\"IncludeFeeComp\": 0", "\"IncludeFeeComp\": 1");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXml_APITest(jwtToken, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<snapshot"), "snapshot element should be present");
        sAssert.assertTrue(responseBody.contains("<portcomprpt"), "portcomprpt element should be present");
        sAssert.assertTrue(responseBody.contains("<xray"), "xray element should be present");
        sAssert.assertTrue(responseBody.contains("<stockintsec"), "stockintsec element should be present");
        sAssert.assertTrue(responseBody.contains("<mfdetail"), "mfdetail element should be present");
        sAssert.assertTrue(responseBody.contains("<disclosurerpt"), "disclosurerpt element should be present");
        sAssert.assertTrue(responseBody.contains("<transfeesingle"), "transfeesingle element should be present");
        sAssert.assertTrue(responseBody.contains("<transfeeportfolio"), "transfeeportfolio element should be present");
        sAssert.assertTrue(responseBody.contains("<transfeeportcomp"), "transfeeportcomp element should be present");
        sAssert.assertTrue(responseBody.contains("<portfolios"), "portfolios element should be present");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyReportsBasedOnReportFlag_Mixed() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"IncludeDisc\": 1", "\"IncludeDisc\": 0")
                                 .replace("\"InvestDetail\": 1", "\"InvestDetail\": 0")
                                 .replace("\"SnapShot\": 0", "\"SnapShot\": 1")
                                 .replace("\"SingleFee\": 1", "\"SingleFee\": 0")
                                 .replace("\"portfolioComparision\": 0", "\"portfolioComparision\": 1")
                                 .replace("\"StkIntersect\": 1", "\"StkIntersect\": 0")
                                 .replace("\"portfolioFee\": 1", "\"portfolioFee\": 0")
                                 .replace("\"IncludeFeeComp\": 0", "\"IncludeFeeComp\": 1");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXml_APITest(jwtToken, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertFalse(responseBody.contains("<disclosurerpt"), "disclosurerpt element should not be present");
        sAssert.assertFalse(responseBody.contains("<mfdetail"), "mfdetail element should not be present");
        sAssert.assertTrue(responseBody.contains("<snapshot"), "snapshot element should be present");
        sAssert.assertFalse(responseBody.contains("<transfeesingle"), "transfeesingle element should not be present");
        sAssert.assertTrue(responseBody.contains("<portcomprpt"), "portcomprpt element should be present");
        sAssert.assertFalse(responseBody.contains("<stockintsec"), "stockintsec element should not be present");
        sAssert.assertFalse(responseBody.contains("<transfeeportfolio"), "transfeeportfolio element should not be present");
        sAssert.assertTrue(responseBody.contains("<transfeeportcomp"), "transfeeportcomp element should be present");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyMandatoryObjects() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"sectionsEnabled\": {", "");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXml_APITest(jwtToken, jsonContent);
        response.statusCode(500);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("\"message\": \"Server Error\""), "Expected error message not found");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void validateCookies() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXml_APITest_Internal("", jwtToken, jsonContent);
        response.statusCode(401);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("\"message\": \"Invlid cookie!\""), "Expected error message not found");
        sAssert.assertAll();
    }
}
```

Tests:
```java
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

public class AWS3_Reports_GetXML {

    public ValidatableResponse getXml_APITest(ValidatableResponse jwtToken, String payLoad) {
        ValidatableResponse response = getXml_APITest_Internal(LoginCookies.MSDEM2Path ,jwtToken, payLoad);
        return response;
    }

    public ValidatableResponse getXml_APITest_Internal(String cookiesPath , ValidatableResponse jwtToken, String xmlBody){
        MapFileOperate file = new MapFileOperate();
        Map<String, String> cookies = new HashMap<String, String>();
        RequestSpecBuilder builder = new RequestSpecBuilder();
        JsonPath jsonPathEvaluator = jwtToken.extract().jsonPath();
        String jwtTokenResponse = jsonPathEvaluator.get("jwtToken");
        String endPoint= CacheManager.GlobalDict.get("AWSIpxReportEndpoint");
        cookies = file.readMapFile(cookiesPath);
        String jwtTokenWithBearer = "Bearer "+jwtTokenResponse;
        builder.addCookies(cookies);
        builder.addHeader("Authorization", jwtTokenWithBearer);
        builder.setBody(xmlBody);
        String contentTypeStr = "application/json";
        String url = endPoint +"/get-xml";
        ValidatableResponse response = HttpRequest.httpRequest(builder.build(), "post", contentTypeStr, url);
        return response;
    }
}
```