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

    public ValidatableResponse getXmlWithBenchmarkId(ValidatableResponse jwtToken, String payLoad, String benchmarkId) {
        payLoad = payLoad.replace("\"currentBenchmarkId\": \"AutoCategory\"", "\"currentBenchmarkId\": \"" + benchmarkId + "\"")
                         .replace("\"proposedBenchmarkId\": \"AutoCategory\"", "\"proposedBenchmarkId\": \"" + benchmarkId + "\"");
        return getXml_APITest_Internal(LoginCookies.MSDEM2Path, jwtToken, payLoad);
    }

    public ValidatableResponse getXmlWithReportFlags(ValidatableResponse jwtToken, String payLoad, Map<String, Integer> reportFlags) {
        for (Map.Entry<String, Integer> entry : reportFlags.entrySet()) {
            payLoad = payLoad.replace("\"" + entry.getKey() + "\": 1", "\"" + entry.getKey() + "\": " + entry.getValue());
        }
        return getXml_APITest_Internal(LoginCookies.MSDEM2Path, jwtToken, payLoad);
    }

    public ValidatableResponse getXmlWithoutSectionsEnabled(ValidatableResponse jwtToken, String payLoad) {
        payLoad = payLoad.replaceAll("\"sectionsEnabled\": \\{[^\\}]*\\},", "");
        return getXml_APITest_Internal(LoginCookies.MSDEM2Path, jwtToken, payLoad);
    }

    public ValidatableResponse getXmlWithoutCookies(ValidatableResponse jwtToken, String payLoad) {
        return getXml_APITest_Internal(null, jwtToken, payLoad);
    }

    private ValidatableResponse getXml_APITest_Internal(String cookiesPath, ValidatableResponse jwtToken, String xmlBody) {
        MapFileOperate file = new MapFileOperate();
        Map<String, String> cookies = new HashMap<>();
        RequestSpecBuilder builder = new RequestSpecBuilder();
        JsonPath jsonPathEvaluator = jwtToken.extract().jsonPath();
        String jwtTokenResponse = jsonPathEvaluator.get("jwtToken");
        String endPoint = CacheManager.GlobalDict.get("AWSIpxReportEndpoint");
        if (cookiesPath != null) {
            cookies = file.readMapFile(cookiesPath);
            builder.addCookies(cookies);
        }
        String jwtTokenWithBearer = "Bearer " + jwtTokenResponse;
        builder.addHeader("Authorization", jwtTokenWithBearer);
        builder.setBody(xmlBody);
        String contentTypeStr = "application/json";
        String url = endPoint + "/get-xml";
        return HttpRequest.httpRequest(builder.build(), "post", contentTypeStr, url);
    }
}