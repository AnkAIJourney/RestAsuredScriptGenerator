package com.morningstar.automation.aws3.test.ipx;

import com.morningstar.automation.aws3.AbstractTest;
import com.morningstar.automation.aws3.api.AWS_authorizationToken_API;
import com.morningstar.automation.aws3.api.ipx.AWS3_Reports_VerifyBenchmarkId;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import io.restassured.response.ValidatableResponse;
import org.testng.annotations.Test;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class AWS3_IPX_VerifyBenchmarkId extends AbstractTest {

    private void verifyBenchmarkId(String benchmarkId) throws IOException {
        AWS3_Reports_VerifyBenchmarkId api = new AWS3_Reports_VerifyBenchmarkId();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\verifyBenchmarkId.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        jsonContent = jsonContent.replace("\"currentBenchmarkId\": \"AutoCategory\"", "\"currentBenchmarkId\": \"" + benchmarkId + "\"");
        jsonContent = jsonContent.replace("\"proposedBenchmarkId\": \"AutoCategory\"", "\"proposedBenchmarkId\": \"" + benchmarkId + "\"");
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.verifyBenchmarkId_APITest(jwtToken, jsonContent);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_AutoCategory() throws IOException {
        verifyBenchmarkId("AutoCategory");
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_dcc56cad_a24f_4d93_9522_86435029d494() throws IOException {
        verifyBenchmarkId("dcc56cad-a24f-4d93-9522-86435029d494");
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_AutoAsset() throws IOException {
        verifyBenchmarkId("AutoAsset");
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_FOUSA06WNW() throws IOException {
        verifyBenchmarkId("FOUSA06WNW");
    }
}