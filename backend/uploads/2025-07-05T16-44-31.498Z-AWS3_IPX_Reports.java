package com.morningstar.automation.aws3.test.ipx;

import com.morningstar.automation.aws3.AbstractTest;
import com.morningstar.automation.aws3.api.AWS_authorizationToken_API;
import com.morningstar.automation.aws3.api.ipx.AWS3_Reports_GenerateReport;
import com.morningstar.automation.aws3.api.ipx.AWS3_Reports_GetXML;
import com.morningstar.automation.aws3.cons.Group;
import com.morningstar.automation.base.core.annotation.MorningstarAutomationAnnotation;
import io.restassured.response.ValidatableResponse;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.testng.annotations.Test;
import org.xml.sax.SAXException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

public class AWS3_IPX_Reports extends AbstractTest {

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void getXml_APITest() throws IOException, SAXException {
        AWS3_Reports_GetXML api = new AWS3_Reports_GetXML();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
        String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.getXml_APITest(jwtToken, jsonContent);
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

    @MorningstarAutomationAnnotation(owner = "Ankit Yadav")
    @Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
    public void generateReport_APITest() throws IOException {
        AWS3_Reports_GenerateReport api = new AWS3_Reports_GenerateReport();
        AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
        String xmlFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\generateReport.xml";
        String xmlInput = new String(Files.readAllBytes(Paths.get(xmlFilePath)), StandardCharsets.UTF_8);
        ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
        ValidatableResponse response = api.generateReport_APITest(jwtToken, xmlInput);
        response.statusCode(200);
        byte[] pdfData = response.extract().asByteArray();
        InputStream pdfStream = new ByteArrayInputStream(pdfData);
        PDDocument document = PDDocument.load(pdfStream);
        PDFTextStripper pdfStripper = new PDFTextStripper();
        String pdfText1 = pdfStripper.getText(document);
        String pdfText = pdfText1.replace("\n", " ");

        sAssert.assertTrue(pdfData.length > 0, "Unable to load Pdf");
        sAssert.assertTrue(pdfText.contains("Prepared for:"), "Cover page is missing");
        sAssert.assertTrue(pdfText.contains("Firm-Specific Marke"), "Marketing page is missing");
        sAssert.assertTrue(pdfText.contains("Investment Plan Summary Report"), "Investment Plan Summary Report page is missing");
        sAssert.assertTrue(pdfText.contains("Morningstar Risk Profiler"), "Risk tolerance report is missing");
        sAssert.assertTrue(pdfText.contains("Target Asset Allocation"), "Target Asset Allocation page is missing");
        sAssert.assertTrue(pdfText.contains("Risk Profile Notes"), "Risk Profile Notes page is missing");
        sAssert.assertTrue(pdfText.contains("Performance X-Ray"), "Performance X-Ray page is missing");
        sAssert.assertTrue(pdfText.contains("Portfolio Snapshot"), "Portfolio Snapshot page is missing");
        sAssert.assertTrue(pdfText.contains("Portfolio Comparison Report"), "Portfolio Comparison Report page is missing");
        sAssert.assertTrue(pdfText.contains("C Bass 07"), "C Bass 07 IDR page is missing");
        sAssert.assertTrue(pdfText.contains("AK University"), "AK University IDR page is missing");
        sAssert.assertTrue(pdfText.contains("12th Street Asset Management LP"), "12th Street Asset Management LP IDR report is missing");
        sAssert.assertTrue(pdfText.contains("1290 Diversified Bond A"), "1290 Diversified Bond A IDR report is missing");
        sAssert.assertTrue(pdfText.contains("3D ESG Equity Model"), "3D ESG Equity Model IDR report is missing");
        sAssert.assertTrue(pdfText.contains("1623 Pro Onshore Fund, LP"), "1623 Pro Onshore Fund, LP IDR report is missing");
        sAssert.assertTrue(pdfText.contains("AB Core Plus Bond ETF"), "AB Core Plus Bond ETF IDR report is missing");
        sAssert.assertTrue(pdfText.contains("AAM Angels 2024-1Q RE"), "AAM Angels 2024-1Q RE IDR report is missing");
        sAssert.assertTrue(pdfText.contains("abrdn Asia-Pacific"), "abrdn Asia-Pacific IDR report is missing");
        sAssert.assertTrue(pdfText.contains("BNY Mellon VIF Apprec Port Initl"), "BNY Mellon VIF Apprec Port Initl IDR report is missing");
        sAssert.assertTrue(pdfText.contains("Neuberger Berman AMT Mid-Cap"), "Neuberger Berman AMT Mid-Cap IDR report is missing");
        sAssert.assertTrue(pdfText.contains("3iQ Bitcoin ETF"), "3iQ Bitcoin ETF IDR report is missing");
        sAssert.assertTrue(pdfText.contains("1.31 FFCB 17 Sr 2017-01-18"), "1.31 FFCB 17 Sr 2017-01-18 IDR report is missing");
        sAssert.assertTrue(pdfText.contains("AK JH American Mutual 529 A"), "AK JH American Mutual 529 A IDR report is missing");
        sAssert.assertTrue(pdfText.contains("1290 VT Convertible"), "1290 VT Convertible IDR report is missing");
        sAssert.assertTrue(pdfText.contains("1290 Avantis U.S. Large Cap"), "1290 Avantis U.S. Large Cap IDR report is missing");
        sAssert.assertTrue(pdfText.contains("AB Government Money Market 1"), "AB Government Money Market 1 IDR report is missing");
        sAssert.assertTrue(pdfText.contains("1060 Capital Opportunity Fund, LP"), "1060 Capital Opportunity Fund, LP IDR report is missing");
        sAssert.assertTrue(pdfText.contains("(LF) FoF Equity Blend"), "(LF) FoF Equity Blend IDR report is missing");
        sAssert.assertTrue(pdfText.contains("2x Bitcoin Strategy ETF"), "2x Bitcoin Strategy ETF IDR report is missing");
        sAssert.assertTrue(pdfText.contains("AAM 60/40 Asset Allocation 2023 3Q CA"), "AAM 60/40 Asset Allocation 2023 3Q CA IDR report is missing");
        sAssert.assertTrue(pdfText.contains("AB VPS Discovery Value A"), "AB VPS Discovery Value A IDR report is missing");
        sAssert.assertTrue(pdfText.contains("JHVIT 500 Index Trust NAV"), "JHVIT 500 Index Trust NAV IDR report is missing");
        sAssert.assertTrue(pdfText.contains("01 Communique Laboratory Inc OONEF"), "01 Communique Laboratory Inc OONEF IDR report is missing");
        sAssert.assertTrue(pdfText.contains("1st Cap Bancorp "), "1st Cap Bancorp IDR report is missing");
        sAssert.assertTrue(pdfText.contains("Abacus Life Inc Pref"), "Abacus Life Inc Pref IDR report is missing");
        sAssert.assertTrue(pdfText.contains("AES Indiana Pref Share"), "AES Indiana Pref Share IDR report is missing");
        sAssert.assertTrue(pdfText.contains("Stock Intersection"), "Stock Intersection IDR report is missing");
        sAssert.assertTrue(pdfText.contains("Single Investment Detail"), "Single Investment Detail fee report is missing");
        sAssert.assertTrue(pdfText.contains("The Portfolio X-Ray report is supplemental sales literature"), "Portfolio X-Ray Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("The Investment Plan Summary Report compares"), "Investment Plan Summary Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("Risk Tolerance Disclosure Statement"), "Morningstar Risk Profiler: Risk Tolerance Results report is missing");
        sAssert.assertTrue(pdfText.contains("Annuity Holdings Proxy Disclosure"), "Annuity Holdings Proxy Disclosure report is missing");
        sAssert.assertTrue(pdfText.contains("The Mutual Fund Detail Report is supplemental sales"), "Mutual Fund Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("The Hedge Fund Detail Report is to be used as supplemental sales"), "Hedge Fund Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("The stock price shown represents the market price of the "), "Preferred Stock Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("The Exchange-Traded Fund (ETF) Detail Report is supplemental sales "), "ETF Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("The Variable Annuity Subaccount Detail Report is supplemental sales"), "Variable Annuity Subaccount Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("The Variable Life Subaccount Investment Detail report"), "Variable Life Subaccount Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("The Closed-End Fund Detail Report is supplemental sales li"), "Closed-End Fund Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("Used as supplemental sales literature, the 529"), "529 Portfolio Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("The Separate Account Investment Detail report"), "Separate Account Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("All bond issue data and price evaluations"), "Bond Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("The UIT Detail Report is to be used as supplemental sales"), "Unit Investment Trust Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("The Model Investment Detail Report is supplemental sales"), "Model Investment Detail Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("Performance Return Time Periods"), "Portfolio Comparison Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("Defined Contribution Plan Disclosure"), "Defined Contribution Plan Disclosure report is missing");
        sAssert.assertTrue(pdfText.contains("Used as supplemental sales literature, the Stock Intersection report must be"), "Stock Intersection Report Disclosure Statement report is missing");
        sAssert.assertTrue(pdfText.contains("Morningstar makes no representation concerning the appropriateness of"), "Investment Risks report is missing");
        sAssert.assertTrue(pdfText.contains("Funds in allocation categories seek to provide both income"), "Benchmark Disclosure report is missing");
        sAssert.assertTrue(pdfText.contains("I have reviewed and agree with the tenets of this Investment Proposal"), "Agreement report is missing");
        sAssert.assertAll();
    }
}