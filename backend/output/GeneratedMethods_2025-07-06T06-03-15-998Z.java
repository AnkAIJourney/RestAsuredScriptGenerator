```java
package com.morningstar.automation.aws3.api.investmentplans;

import com.morningstar.automation.api.core.HttpRequest;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.response.ValidatableResponse;
import java.util.Map;

public class InvestmentPlansAPI {

    public ValidatableResponse callWFECalculateService(String jwtToken, String payload) {
        return callWFECalculateService_Internal(jwtToken, payload);
    }

    private ValidatableResponse callWFECalculateService_Internal(String jwtToken, String payload) {
        RequestSpecBuilder builder = new RequestSpecBuilder();
        String jwtTokenWithBearer = "Bearer " + jwtToken;
        String url = "https://localhost:7257/api/v1/investment-plans/CallWFECalculateService?assetClassGoupId=ACG-USA-BROAD-2&forecastType=current&IsGraph=1";

        builder.addHeader("Authorization", jwtTokenWithBearer);
        builder.addHeader("Content-Type", "application/json");
        builder.setBody(payload);

        ValidatableResponse response = HttpRequest.httpRequest(builder.build(), "post", "application/json", url);
        return response;
    }
}
```