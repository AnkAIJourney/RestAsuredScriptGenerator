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
