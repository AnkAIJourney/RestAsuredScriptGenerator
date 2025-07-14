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

/**
 * Combined REST Assured Test Automation Class
 * Contains both utility methods and test cases
 * Generated automatically from API specifications
 */
public class CombinedRestAssuredTest {
    
    // ==================== UTILITY METHODS ====================
public class AWS3_InvestmentPlans_CallWFECalculateService {

    public ValidatableResponse callWFECalculateService_APITest(ValidatableResponse jwtToken, String payLoad) {
        ValidatableResponse response = callWFECalculateService_APITest_Internal(LoginCookies.MSDEM2Path, jwtToken, payLoad);
        return response;
    }

    public ValidatableResponse callWFECalculateService_APITest_Internal(String cookiesPath, ValidatableResponse jwtToken, String jsonBody) {
        MapFileOperate file = new MapFileOperate();
        Map<String, String> cookies = new HashMap<String, String>();
        RequestSpecBuilder builder = new RequestSpecBuilder();
        JsonPath jsonPathEvaluator = jwtToken.extract().jsonPath();
        String jwtTokenResponse = jsonPathEvaluator.get("jwtToken");
        String endPoint = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1";
        cookies = file.readMapFile(cookiesPath);
        String jwtTokenWithBearer = "Bearer " + jwtTokenResponse;
        builder.addCookies(cookies);
        builder.addHeader("Authorization", jwtTokenWithBearer);
        builder.addHeader("Content-Type", "application/json");
        builder.setBody(jsonBody);
        String contentTypeStr = "application/json";
        ValidatableResponse response = HttpRequest.httpRequest(builder.build(), "post", contentTypeStr, endPoint);
        return response;
    }

    
    // ==================== TEST METHODS ====================

}