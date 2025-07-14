```java
package com.morningstar.automation.aws3.api.ipx;

import com.morningstar.automation.api.core.HttpRequest;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.response.ValidatableResponse;
import java.util.Map;

public class AWS3_Reports_VerifyBenchmarkId {

    public ValidatableResponse verifyBenchmarkId(String jwtToken, Map<String, String> cookies, String payload) {
        RequestSpecBuilder builder = new RequestSpecBuilder();
        builder.addHeader("Authorization", "Bearer " + jwtToken);
        builder.addCookies(cookies);
        builder.addHeader("Accept", "application/json");
        builder.setBody(payload);
        String url = "https://ipt-api.morningstar.com/api/v1/Summary/get-xml";
        return HttpRequest.httpRequest(builder.build(), "post", "application/json", url);
    }
}
```

```java
package com.morningstar.automation.aws3.test.ipx;

import com.morningstar.automation.aws3.AbstractTest;
import com.morningstar.automation.aws3.api.AWS_authorizationToken_API;
import com.morningstar.automation.aws3.api.ipx.AWS3_Reports_VerifyBenchmarkId;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import io.restassured.response.ValidatableResponse;
import org.testng.annotations.Test;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class AWS3_IPX_VerifyBenchmarkId extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_1() throws Exception {
        AWS3_Reports_VerifyBenchmarkId api = new AWS3_Reports_VerifyBenchmarkId();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\verifyBenchmarkId.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"currentBenchmarkId\": \"\",", "\"currentBenchmarkId\": \"AutoCategory\",");
        jsonContent = jsonContent.replace("\"proposedBenchmarkId\": \"\",", "\"proposedBenchmarkId\": \"AutoCategory\",");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> cookies = new HashMap<>();
        cookies.put("cookieName", "cookieValue");
        ValidatableResponse response = api.verifyBenchmarkId(jwtToken.extract().jsonPath().getString("jwtToken"), cookies, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_2() throws Exception {
        AWS3_Reports_VerifyBenchmarkId api = new AWS3_Reports_VerifyBenchmarkId();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\verifyBenchmarkId.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"currentBenchmarkId\": \"\",", "\"currentBenchmarkId\": \"dcc56cad-a24f-4d93-9522-86435029d494\",");
        jsonContent = jsonContent.replace("\"proposedBenchmarkId\": \"\",", "\"proposedBenchmarkId\": \"dcc56cad-a24f-4d93-9522-86435029d494\",");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> cookies = new HashMap<>();
        cookies.put("cookieName", "cookieValue");
        ValidatableResponse response = api.verifyBenchmarkId(jwtToken.extract().jsonPath().getString("jwtToken"), cookies, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_3() throws Exception {
        AWS3_Reports_VerifyBenchmarkId api = new AWS3_Reports_VerifyBenchmarkId();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\verifyBenchmarkId.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"currentBenchmarkId\": \"\",", "\"currentBenchmarkId\": \"AutoAsset\",");
        jsonContent = jsonContent.replace("\"proposedBenchmarkId\": \"\",", "\"proposedBenchmarkId\": \"AutoAsset\",");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> cookies = new HashMap<>();
        cookies.put("cookieName", "cookieValue");
        ValidatableResponse response = api.verifyBenchmarkId(jwtToken.extract().jsonPath().getString("jwtToken"), cookies, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_4() throws Exception {
        AWS3_Reports_VerifyBenchmarkId api = new AWS3_Reports_VerifyBenchmarkId();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\verifyBenchmarkId.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"currentBenchmarkId\": \"\",", "\"currentBenchmarkId\": \"dcc56cad-a24f-4d93-9522-86435029d494\",");
        jsonContent = jsonContent.replace("\"proposedBenchmarkId\": \"\",", "\"proposedBenchmarkId\": \"dcc56cad-a24f-4d93-9522-86435029d494\",");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> cookies = new HashMap<>();
        cookies.put("cookieName", "cookieValue");
        ValidatableResponse response = api.verifyBenchmarkId(jwtToken.extract().jsonPath().getString("jwtToken"), cookies, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void Test_5() throws Exception {
        AWS3_Reports_VerifyBenchmarkId api = new AWS3_Reports_VerifyBenchmarkId();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\verifyBenchmarkId.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"currentBenchmarkId\": \"\",", "\"currentBenchmarkId\": \"FOUSA06WNW\",");
        jsonContent = jsonContent.replace("\"proposedBenchmarkId\": \"\",", "\"proposedBenchmarkId\": \"FOUSA06WNW\",");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, String> cookies = new HashMap<>();
        cookies.put("cookieName", "cookieValue");
        ValidatableResponse response = api.verifyBenchmarkId(jwtToken.extract().jsonPath().getString("jwtToken"), cookies, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }
}
```