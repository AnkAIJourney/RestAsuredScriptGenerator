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
        String contentTypeStr = "application/json";
        String url = "https://ipt-api.morningstar.com/api/v1/Summary/get-xml";
        ValidatableResponse response = HttpRequest.httpRequest(builder.build(), "post", contentTypeStr, url);
        return response;
    }
}