```java
package com.morningstar.automation.aws3.api.ipx;

import com.morningstar.automation.api.core.CacheManager;
import com.morningstar.automation.api.core.HttpRequest;
import com.morningstar.automation.aws3.cons.LoginCookies;
import com.morningstar.automation.aws3.utils.MapFileOperate;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.path.json.JsonPath;
import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.http.ContentType;
import java.util.HashMap;
import java.util.Map;

public class AWS3_Reports_GetXML {

    private RequestSpecification requestSpec;
    private ResponseSpecification responseSpec;

    public AWS3_Reports_GetXML() {
        setupRequestSpec();
        setupResponseSpec();
    }

    private void setupRequestSpec() {
        requestSpec = new RequestSpecBuilder()
                .setContentType(ContentType.JSON)
                .build();
    }

    private void setupResponseSpec() {
        responseSpec = new ResponseSpecBuilder()
                .expectContentType(ContentType.JSON)
                .build();
    }

    public ValidatableResponse getXml_APITest(ValidatableResponse jwtToken, String payLoad) {
        ValidatableResponse response = getXml_APITest_Internal(LoginCookies.MSDEM2Path, jwtToken, payLoad);
        return response;
    }

    public ValidatableResponse getXml_APITest_Internal(String cookiesPath, ValidatableResponse jwtToken, String xmlBody) {
        MapFileOperate file = new MapFileOperate();
        Map<String, String> cookies = new HashMap<>();
        RequestSpecBuilder builder = new RequestSpecBuilder();
        JsonPath jsonPathEvaluator = jwtToken.extract().jsonPath();
        String jwtTokenResponse = jsonPathEvaluator.get("jwtToken");
        String endPoint = CacheManager.GlobalDict.get("AWSIpxReportEndpoint");
        cookies = file.readMapFile(cookiesPath);
        String jwtTokenWithBearer = "Bearer " + jwtTokenResponse;
        builder.addCookies(cookies);
        builder.addHeader("Authorization", jwtTokenWithBearer);
        builder.setBody(xmlBody);
        String contentTypeStr = "application/json";
        String url = endPoint + "/get-xml";
        ValidatableResponse response = HttpRequest.httpRequest(builder.build(), "post", contentTypeStr, url);
        return response;
    }

    public ValidatableResponse callWFECalculateService(String jwtToken, String requestBody) {
        RequestSpecification requestSpec = buildRequestSpec(jwtToken, requestBody);
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1";
        ValidatableResponse response = HttpRequest.httpRequest(requestSpec, "post", "application/json", url);
        return response;
    }

    private RequestSpecification buildRequestSpec(String jwtToken, String requestBody) {
        return new RequestSpecBuilder()
                .addHeader("Authorization", "Bearer " + jwtToken)
                .setBody(requestBody)
                .setContentType(ContentType.JSON)
                .build();
    }

    public ValidatableResponse validateResponse(ValidatableResponse response) {
        response.spec(responseSpec);
        return response;
    }

    public String extractJwtToken(ValidatableResponse response) {
        JsonPath jsonPathEvaluator = response.extract().jsonPath();
        return jsonPathEvaluator.get("jwtToken");
    }

    public void logRequestAndResponse(RequestSpecification requestSpec, ValidatableResponse response) {
        System.out.println("Request: " + requestSpec.log().all());
        System.out.println("Response: " + response.log().all());
    }

    public void handleErrorResponse(ValidatableResponse response) {
        if (response.extract().statusCode() != 200) {
            throw new RuntimeException("API call failed with status code: " + response.extract().statusCode());
        }
    }
}
```