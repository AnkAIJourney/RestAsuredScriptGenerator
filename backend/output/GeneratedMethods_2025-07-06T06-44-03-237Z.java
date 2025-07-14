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