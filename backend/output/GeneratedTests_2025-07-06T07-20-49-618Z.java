package com.morningstar.automation.aws3.test.ipx;

import com.morningstar.automation.aws3.AbstractTest;
import com.morningstar.automation.aws3.api.AWS_authorizationToken_API;
import com.morningstar.automation.aws3.api.ipx.AWS3_Reports_GetXML;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import io.restassured.response.ValidatableResponse;
import org.testng.annotations.Test;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class AWS3_IPX_Reports extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_AutoAsset() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXmlWithBenchmarkId(jwtToken, jsonContent, "AutoAsset");
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_dcc56cad() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXmlWithBenchmarkId(jwtToken, jsonContent, "dcc56cad-a24f-4d93-9522-86435029d494");
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_FOUSA06WNW() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXmlWithBenchmarkId(jwtToken, jsonContent, "FOUSA06WNW");
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<eepdfrpt"), "Unable to load xml");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyBenchmarkId_Incorrect() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXmlWithBenchmarkId(jwtToken, jsonContent, "&9r89rnnkldf");
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("Cannot find out security ID for some holdings."), "Error message not found");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyReportsBasedOnReportFlag_0() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, Integer> reportFlags = new HashMap<>();
        reportFlags.put("XRay", 0);
        reportFlags.put("IncludeDisc", 0);
        reportFlags.put("InvestDetail", 0);
        reportFlags.put("SnapShot", 0);
        reportFlags.put("SingleFee", 0);
        reportFlags.put("portfolioComparision", 0);
        reportFlags.put("StkIntersect", 0);
        reportFlags.put("portfolioFee", 0);
        reportFlags.put("IncludeFeeComp", 0);
        ValidatableResponse response = api.getXmlWithReportFlags(jwtToken, jsonContent, reportFlags);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertFalse(responseBody.contains("<snapshot"), "snapshot should not be present");
        sAssert.assertFalse(responseBody.contains("<portcomprpt"), "portcomprpt should not be present");
        sAssert.assertFalse(responseBody.contains("<xray"), "xray should not be present");
        sAssert.assertFalse(responseBody.contains("<stockintsec"), "stockintsec should not be present");
        sAssert.assertFalse(responseBody.contains("<mfdetail"), "mfdetail should not be present");
        sAssert.assertFalse(responseBody.contains("<disclosurerpt"), "disclosurerpt should not be present");
        sAssert.assertFalse(responseBody.contains("<transfeesingle"), "transfeesingle should not be present");
        sAssert.assertFalse(responseBody.contains("<transfeeportfolio"), "transfeeportfolio should not be present");
        sAssert.assertFalse(responseBody.contains("<transfeeportcomp"), "transfeeportcomp should not be present");
        sAssert.assertFalse(responseBody.contains("<portfolios"), "portfolios should not be present");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyReportsBasedOnReportFlag_1() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, Integer> reportFlags = new HashMap<>();
        reportFlags.put("XRay", 1);
        reportFlags.put("IncludeDisc", 1);
        reportFlags.put("InvestDetail", 1);
        reportFlags.put("SnapShot", 1);
        reportFlags.put("SingleFee", 1);
        reportFlags.put("portfolioComparision", 1);
        reportFlags.put("StkIntersect", 1);
        reportFlags.put("portfolioFee", 1);
        reportFlags.put("IncludeFeeComp", 1);
        ValidatableResponse response = api.getXmlWithReportFlags(jwtToken, jsonContent, reportFlags);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("<snapshot"), "snapshot should be present");
        sAssert.assertTrue(responseBody.contains("<portcomprpt"), "portcomprpt should be present");
        sAssert.assertTrue(responseBody.contains("<xray"), "xray should be present");
        sAssert.assertTrue(responseBody.contains("<stockintsec"), "stockintsec should be present");
        sAssert.assertTrue(responseBody.contains("<mfdetail"), "mfdetail should be present");
        sAssert.assertTrue(responseBody.contains("<disclosurerpt"), "disclosurerpt should be present");
        sAssert.assertTrue(responseBody.contains("<transfeesingle"), "transfeesingle should be present");
        sAssert.assertTrue(responseBody.contains("<transfeeportfolio"), "transfeeportfolio should be present");
        sAssert.assertTrue(responseBody.contains("<transfeeportcomp"), "transfeeportcomp should be present");
        sAssert.assertTrue(responseBody.contains("<portfolios"), "portfolios should be present");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyReportsBasedOnReportFlag_Mixed() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        Map<String, Integer> reportFlags = new HashMap<>();
        reportFlags.put("IncludeDisc", 0);
        reportFlags.put("InvestDetail", 0);
        reportFlags.put("SnapShot", 1);
        reportFlags.put("SingleFee", 0);
        reportFlags.put("portfolioComparision", 1);
        reportFlags.put("StkIntersect", 0);
        reportFlags.put("portfolioFee", 0);
        reportFlags.put("IncludeFeeComp", 1);
        ValidatableResponse response = api.getXmlWithReportFlags(jwtToken, jsonContent, reportFlags);
        response.statusCode(200);
        String responseBody = response.extract().asString();
        sAssert.assertFalse(responseBody.contains("<disclosurerpt"), "disclosurerpt should not be present");
        sAssert.assertFalse(responseBody.contains("<mfdetail"), "mfdetail should not be present");
        sAssert.assertTrue(responseBody.contains("<snapshot"), "snapshot should be present");
        sAssert.assertFalse(responseBody.contains("<transfeesingle"), "transfeesingle should not be present");
        sAssert.assertTrue(responseBody.contains("<portcomprpt"), "portcomprpt should be present");
        sAssert.assertFalse(responseBody.contains("<stockintsec"), "stockintsec should not be present");
        sAssert.assertFalse(responseBody.contains("<transfeeportfolio"), "transfeeportfolio should not be present");
        sAssert.assertTrue(responseBody.contains("<transfeeportcomp"), "transfeeportcomp should be present");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void verifyMandatoryObjects() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXmlWithoutSectionsEnabled(jwtToken, jsonContent);
        response.statusCode(500);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("\"message\": \"Server Error\""), "Error message not found");
        sAssert.assertAll();
    }

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void validateCookies() throws IOException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXmlWithoutCookies(jwtToken, jsonContent);
        response.statusCode(401);
        String responseBody = response.extract().asString();
        sAssert.assertTrue(responseBody.contains("\"message\": \"Invlid cookie!\""), "Error message not found");
        sAssert.assertAll();
    }
}