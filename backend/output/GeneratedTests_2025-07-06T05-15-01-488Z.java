```java
@MorningstarAutomationAnnotation(owner = "Ankit Yadav")
@Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
public void Test_1() throws IOException {
    AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
    String jsonFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\getXml.json";
    String jsonContent = new String(Files.readAllBytes(Paths.get(jsonFilePath)));
    ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
    ValidatableResponse response = api.getXml_APITest(jwtToken, jsonContent);
    response.statusCode(200);
    sAssert.assertAll();
}

@MorningstarAutomationAnnotation(owner = "Ankit Yadav")
@Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
public void Test_2() throws IOException {
    AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
    ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
    jwtToken.statusCode(200);
    sAssert.assertTrue(jwtToken.extract().asString().contains("token"), "JWT token should generate successfully");
    sAssert.assertAll();
}

@MorningstarAutomationAnnotation(owner = "Ankit Yadav")
@Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
public void Test_3() throws IOException {
    AWS3_Reports_GenerateReport api = new AWS3_Reports_GenerateReport();
    AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
    String xmlFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\generateReport.xml";
    String xmlInput = new String(Files.readAllBytes(Paths.get(xmlFilePath)), StandardCharsets.UTF_8);
    ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
    ValidatableResponse response = api.generateReport_APITest(jwtToken, xmlInput);
    response.statusCode(200);
    String responseBody = response.extract().asString();
    sAssert.assertTrue(responseBody.contains("<graph>"), "Graph data is missing");
    sAssert.assertTrue(responseBody.contains("<forecast"), "Forecast data is missing");
    sAssert.assertTrue(responseBody.contains("<confidence id=\"50\">"), "Confidence id 50 is missing for current");
    sAssert.assertTrue(responseBody.contains("<confidence id=\"10\">"), "Confidence id 10 is missing for target");
    sAssert.assertTrue(responseBody.contains("<confidence id=\"50\">"), "Confidence id 50 is missing for target");
    sAssert.assertTrue(responseBody.contains("<confidence id=\"90\">"), "Confidence id 90 is missing for target");
    sAssert.assertAll();
}

@MorningstarAutomationAnnotation(owner = "Ankit Yadav")
@Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
public void Test_4() throws IOException {
    AWS3_Reports_GenerateReport api = new AWS3_Reports_GenerateReport();
    String xmlFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\generateReport.xml";
    String xmlInput = new String(Files.readAllBytes(Paths.get(xmlFilePath)), StandardCharsets.UTF_8);
    ValidatableResponse response = api.generateReport_APITest(null, xmlInput);
    response.statusCode(500);
    sAssert.assertAll();
}

@MorningstarAutomationAnnotation(owner = "Ankit Yadav")
@Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
public void Test_5() throws IOException {
    AWS3_Reports_GenerateReport api = new AWS3_Reports_GenerateReport();
    AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
    String xmlFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\generateReport.xml";
    String xmlInput = new String(Files.readAllBytes(Paths.get(xmlFilePath)), StandardCharsets.UTF_8);
    ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
    ValidatableResponse response = api.generateReport_APITest(jwtToken, xmlInput.replace("ACG-USA-BROAD-2", ""));
    response.statusCode(400);
    sAssert.assertTrue(response.extract().asString().contains("The assetClassGoupId field is required."), "Error message for missing assetClassGoupId is incorrect");
    response = api.generateReport_APITest(jwtToken, xmlInput.replace("current", ""));
    response.statusCode(400);
    sAssert.assertTrue(response.extract().asString().contains("The forecastType field is required."), "Error message for missing forecastType is incorrect");
    response = api.generateReport_APITest(jwtToken, xmlInput.replace("IsGraph=1", ""));
    response.statusCode(400);
    sAssert.assertTrue(response.extract().asString().contains("Invalid input!"), "Error message for missing IsGraph is incorrect");
    sAssert.assertAll();
}

@MorningstarAutomationAnnotation(owner = "Ankit Yadav")
@Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
public void Test_6() throws IOException {
    AWS3_Reports_GenerateReport api = new AWS3_Reports_GenerateReport();
    AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
    String xmlFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\generateReport.xml";
    String xmlInput = new String(Files.readAllBytes(Paths.get(xmlFilePath)), StandardCharsets.UTF_8);
    ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
    ValidatableResponse response = api.generateReport_APITest(jwtToken, xmlInput.replace("ACG-USA-BROAD-2", "ACG-USA-DETAIL-2"));
    response.statusCode(500);
    sAssert.assertTrue(response.extract().asString().contains("Internal Server Error: File not found: /app/InvestmentPlans/XmlData/Ipx/AWSData/ACG-USA-DETAIL-2.xml"), "Error message for incorrect assetClassGoupId is incorrect");
    response = api.generateReport_APITest(jwtToken, xmlInput.replace("IsGraph=1", "IsGraph=false"));
    response.statusCode(400);
    sAssert.assertTrue(response.extract().asString().contains("Invalid input!"), "Error message for incorrect IsGraph is incorrect");
    sAssert.assertAll();
}

@MorningstarAutomationAnnotation(owner = "Ankit Yadav")
@Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
public void Test_7() throws IOException {
    AWS3_Reports_GenerateReport api = new AWS3_Reports_GenerateReport();
    AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
    String xmlFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\generateReport.xml";
    String xmlInput = new String(Files.readAllBytes(Paths.get(xmlFilePath)), StandardCharsets.UTF_8);
    ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
    ValidatableResponse response = api.generateReport_APITest(jwtToken, "");
    response.statusCode(500);
    sAssert.assertAll();
}

@MorningstarAutomationAnnotation(owner = "Ankit Yadav")
@Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
public void Test_8() throws IOException {
    AWS3_Reports_GenerateReport api = new AWS3_Reports_GenerateReport();
    AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
    String xmlFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\generateReport.xml";
    String xmlInput = new String(Files.readAllBytes(Paths.get(xmlFilePath)), StandardCharsets.UTF_8);
    ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
    ValidatableResponse response = api.generateReport_APITest(jwtToken, xmlInput.replace("ACG-USA-BROAD-2", "INVALID"));
    response.statusCode(500);
    sAssert.assertAll();
}

@MorningstarAutomationAnnotation(owner = "Ankit Yadav")
@Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
public void Test_9() throws IOException {
    AWS3_Reports_GenerateReport api = new AWS3_Reports_GenerateReport();
    AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
    String xmlFilePath = "src\\test\\resources\\testData\\RequestData\\ipx\\generateReport.xml";
    String xmlInput = new String(Files.readAllBytes(Paths.get(xmlFilePath)), StandardCharsets.UTF_8);
    ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
    ValidatableResponse response = api.generateReport_APITest(jwtToken, xmlInput);
    response.statusCode(500);
    sAssert.assertTrue(response.extract().asString().contains("holding details"), "Holding details are missing in the response");
    sAssert.assertAll();
}

@MorningstarAutomationAnnotation(owner = "Ankit Yadav")
@Test(groups = {Group.SMOKE, Group.FULL_REGRESSION})
public void Test_10() throws IOException {
    AWS3_Reports_GenerateReport api = new AWS3_Reports_GenerateReport();
    AWS_authorizationToken_API jwtTokenAPI = new AWS_authorizationToken_API();
    ValidatableResponse jwtToken = jwtTokenAPI.jwtTokenWithValidRoles();
    ValidatableResponse response = api.generateReport_APITest(jwtToken, "{}");
    response.statusCode(400);
    sAssert.assertTrue(response.extract().asString().contains("A non-empty request body is required."), "Error message for empty request body is incorrect");
    sAssert.assertTrue(response.extract().asString().contains("The request field is required."), "Error message for empty request body is incorrect");
    sAssert.assertAll();
}
```