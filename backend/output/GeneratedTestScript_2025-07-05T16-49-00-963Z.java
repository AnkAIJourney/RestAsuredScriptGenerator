```java
package com.morningstar.automation.aws3.api.investmentplans;

import com.morningstar.automation.api.core.HttpRequest;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.response.ValidatableResponse;
import java.util.HashMap;
import java.util.Map;

public class InvestmentPlans_API {

    public ValidatableResponse callWFECalculateService(String jwtToken, String requestBody) {
        RequestSpecBuilder builder = new RequestSpecBuilder();
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1";
        builder.addHeader("Authorization", "Bearer " + jwtToken);
        builder.addHeader("Content-Type", "application/json");
        builder.setBody(requestBody);
        ValidatableResponse response = HttpRequest.httpRequest(builder.build(), "post", "application/json", url);
        return response;
    }
}
```

```java
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

public class InvestmentPlans_Tests extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_1() {
        // Login to workstation
        // URL: https://advqa.morningstar.com/advisor/login/instlgn.asp?INSTID=MSDEM2&login=Support_1&pwd=M$tar5upp0rT!2024
        // This step is assumed to be done manually or through another automated process

        // Make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestBody.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), requestBody);
        response.statusCode(200);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_2() {
        // Generate JWT Token
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        jwtToken.statusCode(200);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_3() {
        // Update API > Post > require JWT Token
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestBody.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), requestBody);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<graph>"), "Graph data is not present in the response");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_4() {
        // Make request without adding JWT Token
        InvestmentPlans_API api = new InvestmentPlans_API();
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestBody.json")));
        ValidatableResponse response = api.callWFECalculateService("", requestBody);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_5() {
        // Remove any or request parameters and make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestBody.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), requestBody.replace("ACG-USA-BROAD-2", ""));
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("The assetClassGoupId field is required."), "Error message is not as expected");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_6() {
        // Pass incorrect request parameters and make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestBody.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), requestBody.replace("ACG-USA-BROAD-2", "ACG-USA-DETAIL-2"));
        response.statusCode(500);
        sAssert.assertTrue(response.extract().asString().contains("Internal Server Error: File not found"), "Error message is not as expected");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_7() {
        // Pass blank data to mandatory input and make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), "");
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_8() {
        // Pass incorrect data to mandatory input and make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/incorrectRequestBody.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), requestBody);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_9() {
        // Verify certain objects like holding details from payload and make request
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String requestBody = new String(Files.readAllBytes(Paths.get("src/test/resources/testData/RequestData/investmentplans/requestBody.json")));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), requestBody);
        response.statusCode(500);
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_10() {
        // Send completely empty JSON body
        InvestmentPlans_API api = new InvestmentPlans_API();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.callWFECalculateService(jwtToken.extract().jsonPath().getString("jwtToken"), "{}");
        response.statusCode(400);
        sAssert.assertTrue(response.extract().asString().contains("A non-empty request body is required."), "Error message is not as expected");
        sAssert.assertAll();
    }
}
```