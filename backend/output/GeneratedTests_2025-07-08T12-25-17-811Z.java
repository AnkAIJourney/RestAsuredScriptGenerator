package com.morningstar.automation.aws3.test.ipx;

import com.morningstar.automation.aws3.AbstractTest;
import com.morningstar.automation.aws3.api.AWS_authorizationToken_API;
import com.morningstar.automation.aws3.api.ipx.AWS3_Reports_VerifyBenchmarkId;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import io.restassured.response.ValidatableResponse;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class AWS3_IPX_VerifyBenchmarkId extends AbstractTest {

    @DataProvider(name = "benchmarkIdProvider")
    public Object[][] benchmarkIdProvider() {
        return new Object[][]{
                {"AutoCategory"},
                {"dcc56cad-a24f-4d93-9522-86435029d494"},
                {"AutoAsset"},
                {"FOUSA06WNW"}
        };
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION}, dataProvider = "benchmarkIdProvider")
    public void verifyBenchmarkIdTest(String benchmarkId) throws Exception {
        AWS3_Reports_VerifyBenchmarkId api = new AWS3_Reports_VerifyBenchmarkId();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"currentBenchmarkId\": \"AutoCategory\"", "\"currentBenchmarkId\": \"" + benchmarkId + "\"");
        jsonContent = jsonContent.replace("\"proposedBenchmarkId\": \"AutoCategory\"", "\"proposedBenchmarkId\": \"" + benchmarkId + "\"");

        ValidatableResponse jwtTokenResponse = jwtTokenAPI.jwtTokenWithValidRoles();
        String jwtToken = jwtTokenResponse.extract().jsonPath().getString("jwtToken");

        Map<String, String> cookies = new HashMap<>();
        cookies.put("cookieName", "cookieValue");

        ValidatableResponse response = api.verifyBenchmarkId(jwtToken, cookies, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();

        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertTrue(responseBody.contains("<portcomprpt"), "Unable to load Portfolio comparison xml");
        sAssert.assertTrue(responseBody.contains("<xray"), "Unable to load xray xml");
        sAssert.assertTrue(responseBody.contains("<stockintsec"), "Unable to load stock intersection xml");
        sAssert.assertTrue(responseBody.contains("<mfdetail"), "Unable to load MF detail xml");
        sAssert.assertTrue(responseBody.contains("<disclosurerpt"), "Unable to load disclosure xml");
        sAssert.assertTrue(responseBody.contains("<transfeesingle"), "Unable to load single fee report xml");
        sAssert.assertTrue(responseBody.contains("<transfeeportfolio"), "Unable to load portfolio fee report xml");
        sAssert.assertTrue(responseBody.contains("<transfeeportcomp"), "Unable to load portfolio comparison fee xml");
        sAssert.assertTrue(responseBody.contains("<portfolios"), "Unable to load portfolios xml");
        sAssert.assertAll();
    }
}