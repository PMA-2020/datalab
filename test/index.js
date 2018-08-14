/* TODOs
* 1. Do we need to handle promises marked (1)?
* */
const assert = require('assert');
const downloadsFolder = require('downloads-folder');
const fs = require('fs');
const ls = require('ls');
const path = require('path');
const webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;

require('chromedriver');

const checkHighchartsSvgMatch = require('./checkHighchartsSvgMatch');

const testConfig = {
  acceptableErrorThreshold: 0.2,
  maxUnitTestCaseAttempts: 3,
  maxBrowserTestSuiteAttempts: 3,
  decimalPrecision: 3,
  thresholdValue: 0.950,
  urlBase: 'http://localhost:4567/?',
  svgFileName: 'chart.svg'
};
let globals = {
  failCount: 0,
  passCount: 0,
  errorCount: 0
};
const assertFailureExplanation =
'Test failed because SVG string similarity did not exceed threshold set in \`testConfig.thresholdValue\`. ' +
'This means that the image downloaded in this test at the URL shown above was not considered to sufficiently match the ' +
'original, stored SVG test file as shown above, at least not according to the string similarity algorithm used. The ' +
'recommended course of action from this point is examine the originally stored test image with the image generated and ' +
'saved as these tests were being run. Based on that inspection, it can be determined if this test failure is a true ' +
'positive failure or false positive failure.\n' +
'\n' +
'# False positive test failures\n' +
'In the event that, upon inspecting further, you find that the images do indeed match visually to the naked eye, you may ' +
'want to consider taking one or more of the following courses of action: (1) decrease the `testConfig.thresholdValue`, ' +
'though this may also compromise the accuracy of other tests, (2) removing this test case if it is not helpful, ' +
'(3) altering this test case in some way, perhaps by using a different chart image that still gets at the heart ' +
'of what this test case is trying to test against, (4) changing this test so that it does not use a string similarity ' +
'algorithm, but some other means of determining if two charts are the same.\n' +
'\n' +
'# True positive test failures\n' +
'In the event that, upon inspecting further, it is determined that the test failed because the images do indeed not ' +
'visually match to the naked eye, it must be determined if this event is: (a) due to an unexpected bug, or (b) due ' +
'to an intentional change in the application.\n' +
'\n' +
'## True positives due to a new bug\n' +
'If it is due to a new bug, the bug should be fixed, and these tests should be re-run to validate the fix.\n' +
'\n' +
'## True positives due to an intional change\n' +
'If there is no bug, that means that the test image stored at the \'SVG original file\' path as shown above is now ' +
'outdated. This file should be replaced with the new, valid SVG image that can be downloaded from the url \'URL\' ' +
'as shown above. After doing so, this test case should pass the next time around.\n';

const handleSeleniumErr = (err, rejectionHandler, options) => {
  /* Example errors
  * NoSuchElementError
    { NoSuchElementError: no such element: Unable to locate element: {"method":"css selector","selector":".highcharts-contextbutton"}
  * StaleElementReferenceError
    { StaleElementReferenceError: stale element reference: element is not attached to the page document
  * TimeoutError
    { TimeoutError: Waiting for element to be located By(css selector, .highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type)
    Wait timed out after 100000ms
  * WebDriverError
    WebDriverError: element not visible
  * Error
    Error: ENOENT: no such file or directory, open '/path/to/Downloads/chart.svg'
  * About Assertion Errors
    https://airbrake.io/blog/nodejs-error-handling/assertionerror-nodejs
  */
  const problematicErrorMsg = 'We are not entirely sure at the moment if this type of issue could cause problems for the test suite. ' +
    'However, as long as all assertions pass, this is probably fine.';
  const isAssertionError = err.name.toLowerCase().substring(0, 6) === 'assert' || err.name === 'AssertionError [ERR_ASSERTION]';
  
  if (options && !isAssertionError) {
    const spacer = options.testCaseNum <= 1 ? '' : '\n';
    console.log(`${spacer}Test case ${options.testCaseNum}/${options.totTestCases}: (error)`);
    console.log(`  - Message: Encountered test error '${err.name}'`);
  }
  
  if (isAssertionError) {
      globals.failCount++;
      console.log('Throwing AssertionError and exiting now.\n');
      throw(err);  // This doesnt actually exit with Error 1. Handle error elsewhere.
  } else {
    globals.errorCount++;
    if (
        err.name === 'NoSuchElementError' ||
        err.name === 'TimeoutError' ||
        err.name === 'StaleElementReferenceError') {
      // TODO: Test re-running is not actually working. Instead, going with error threshold method instead.
      // Don't actually need to print anything... this is printed elsewhere.
      // console.log('Test case may be re-attempted. If not re-attempted or if ' +
      //   're-attempts fail, this will increase the running error count.');
    } else if (
        err.name === 'NoSuchSessionError' ||
        err.name === 'WebDriverError') {
      console.log(`\nSelenium SVG test encountered error: ${err.name}.`);
      console.log(problematicErrorMsg);  // console.log(`Error details: \n${err}`);
    } else if (
      `${err}`.substring(0, 13) === 'Error: ENOENT' &&
      `${err}`.substring(err.length - testConfig.svgFileName.length) === testConfig.svgFileName) {
      // Do nothing. This seems to immediately follow "WebDriverError: element not visible", so it is redundant.
    } else {
      console.log('Unanticipated error' + err.name ? ': ' + err.name : '');
      console.log(problematicErrorMsg);
      console.log(`Error details: \n${err}`);
    }
    if (typeof rejectionHandler === 'undefined') { return err; } else { return rejectionHandler(err); }
  }
};

const getSvg = (i, resolve, rejectionHandler, driver, svgFileName, slowdownMultiplier) => {
  const menuItemDescriptor = '.highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type';
  driver.wait(webdriver.until.elementLocated(webdriver.By.css(menuItemDescriptor)), 70000*slowdownMultiplier).then(() => {  // originally 50000
  // driver.wait(webdriver.until.elementLocated(webdriver.By.css(menuItemDescriptor)), 1*slowdownMultiplier).then(() => {  // TODO #2b: See #2a
    const element = driver.findElement(webdriver.By.css(menuItemDescriptor));
    element.then().catch(err => { handleSeleniumErr(err, rejectionHandler); });
    element.click()
    .then(() => {
      driver.sleep(3000*slowdownMultiplier)
      .then(() => {
        const downloadPath = downloadsFolder();
        const file1 = path.join(downloadPath, testConfig.svgFileName);
        const file2 = path.join(__dirname, 'files/'+svgFileName+'.svg');
        const files = [file1, file2];
        const result = checkHighchartsSvgMatch.checkHighchartsSvgSimilarity(files);
        resolve(result);
      }).catch(err => handleSeleniumErr(err, rejectionHandler));
    }).catch(err => handleSeleniumErr(err, rejectionHandler));
  }).catch(err => handleSeleniumErr(err, rejectionHandler));
};


const searchTest = (resolve, rejectionHandler, driver, urlQueryParams, slowdownMultiplier) => {
  /* Checks to see if an image downloaded at a given URL matches what is expected.

  Args:
      driver (selenium-webdriver): Selenium web driver to allow for headless, automated browser testing.
      url (string): URL to chart and download image.
      
  Returns:
      bool: True if images match, else false.
  */
  const url = testConfig.urlBase + urlQueryParams;
  const menuIcon = '.highcharts-contextbutton';
  driver.get(url)
  .then().catch(err => { handleSeleniumErr(err, rejectionHandler); });
  driver.wait(until.elementLocated(By.css(menuIcon)), 400000*slowdownMultiplier)  // originally 300000
  .then(() => {
    // noinspection JSIgnoredPromiseFromCall  // TODO: (1)
    const element = driver.findElement(webdriver.By.css(menuIcon));
    element.click().then().catch(err => handleSeleniumErr(err, rejectionHandler));
    getSvg(0, resolve, rejectionHandler, driver, urlQueryParams, slowdownMultiplier)
  }).catch(err => {
    handleSeleniumErr(err, rejectionHandler);
  });
};

const singleTestCase = (driverName, driver, testCaseNum, totTestCases, urlQueryParams, attemptNumber) => {
  // TODO #2a: The then/catch on searchTest() is sort of not working. Either: (a) need to move them up one level, to singleTestCase().then().catch(), or (b) need to figure out a way to do them here. return result? Change the code otherwise?
  // TODO: To see details on why this is not working, reverse the comments @#2b.
  let success = false;
  const currentFile = path.join(__dirname, 'files/'+urlQueryParams+'.svg');
  return new Promise((resolve, reject) => {
    searchTest(resolve, reject, driver, urlQueryParams, attemptNumber)
  }).then(result => {
    result = result.toPrecision(testConfig.decimalPrecision);
    testCaseNum = testCaseNum < 10 ? `0${testCaseNum}` : testCaseNum;  // padding
    success = result > testConfig.thresholdValue;
    const testResult = success ? 'pass' : 'FAIL';
    const msgHeader = `Test case ${testCaseNum}/${totTestCases}: ${result} > ${testConfig.thresholdValue} (${testResult})`;
    const assertPassMsg = `${msgHeader}`;
    const assertFailMsg = `${msgHeader}\n` +
      `  - URL: ${testConfig.urlBase+urlQueryParams}\n` +
      `  - SVG original file: ${currentFile}\n` +
      `  - SVG string similarity; actual > threshold: ${result} > ${testConfig.thresholdValue}\n` +
      '  - Message: \n\n' +
      '<TestFailureExplanation>' +
      assertFailureExplanation +
      '</TestFailureExplanation>\n';
    if (success) {
      assert(result > testConfig.thresholdValue, assertFailMsg);
      globals.passCount++;
      console.log(assertPassMsg);
    } else {
      console.log(assertFailMsg);
      assert(result > testConfig.thresholdValue);  // always 'false' here
      // assert(success, assertFailMsg);  // is caught, so doesn't print
    }
  }).catch(err => {  // TODO: #5a Move this to error handler, even if I don't have access to the resolver 'resolve' in this catch scope.
    const options = {
      testCaseNum: testCaseNum,
      totTestCases: totTestCases
    };
    handleSeleniumErr(err, null, options);
    
  //   console.log(`  - Message: This test was not able to complete successfully. Test case may be re-attempted. ` +
  //     'If not re-attempted or if re-attempts fail, this will increase the running error count.' + `
  // - URL: ${testConfig.urlBase+urlQueryParams}
  // - Details:` + `\n${err}\n`);  // console.log(err);  console.log();  // blank space
    
    // TODO: Uncomment when issue (2) has been addressed.
    // if (attemptNumber < testConfig.maxUnitTestCaseAttempts+1) {
    //   if (attemptNumber === 1) {
    //     console.log(`\nTest case ${testCaseNum}/${totTestCases}: (status update)\n` +
    //     `  - Message: Encountered test error '${err.name}'. Re-attempting test. (${attemptNumber}/${testConfig.maxUnitTestCaseAttempts})`);
    //     // console.log(`  - URL: ${testConfig.urlBase+urlQueryParams}`);
    //   }
    //   // console.log(`\n  - Details for attempt ${attemptNumber} of ${testConfig.maxUnitTestCaseAttempts}:\n` +
    //   //   `    ${err}`);
    //    // TODO: (1)
    //   // noinspection JSIgnoredPromiseFromCall
    //   driver.quit()
    //   .then(() => {
    //     const newDriver = {'chrome': new webdriver.Builder().forBrowser('chrome').build()}[driverName];
    //     singleTestCase(driverName, newDriver, testCaseNum, totTestCases, urlQueryParams, attemptNumber+1);
    //   })
    //   .catch(err => { throw(err); });
    // }
    // else {
    //   assert(false, `Max test errors reached for test case ${testCaseNum}.`);  // does this increase fail count?
    //   // return err;
    // }
  });
};

async function testOnBrowser(driverName, driver, urlQueryParamStrings, attemptNumber) {
  const timeStart = new Date();
  let testCaseNum = 0;
  const totTestsToRun = urlQueryParamStrings.length;
  // let temp = urlQueryParamStrings; urlQueryParamStrings = []; urlQueryParamStrings.push(temp[0]);  // TO-DO: DE-BUGGING
  for (let urlQueryParams of urlQueryParamStrings) {
    testCaseNum++;
    const downloadPath = downloadsFolder();
    const testFile = path.join(downloadPath, testConfig.svgFileName);
    if (fs.existsSync(testFile))
      fs.unlinkSync(testFile);
    await singleTestCase(driverName, driver, testCaseNum, totTestsToRun , urlQueryParams, 1)
    // .then(() => { passCount++ }).catch(() => { failCount++; });  // For some reason, this seemed to worked as long as there was not a selenium error.
  }
  // noinspection JSIgnoredPromiseFromCall  TODO: (1)
  driver.quit();
  // .then().catch(err => { handleSeleniumErr(err) });  // TODO: Does removing this crash everything?
  // .then().catch(err => { });  // TODO: Does removing the handler crash everything?
  const timeEnd = new Date();
  let totTestTime = new Date();
  totTestTime.setTime(timeEnd.getTime() - timeStart.getTime());
  const secondsLab = (totTestTime.getSeconds() < 10 ? '0' : '') + totTestTime.getSeconds().toString();
  const totTestTimeLab = totTestTime.getMinutes() === 0
    ? '00:' + secondsLab
    : (totTestTime.getMinutes() < 10 ? '0' : '') + totTestTime.getMinutes().toString() + ':' + secondsLab;
  const totTestsRun = globals.passCount+globals.failCount+globals.errorCount;
  const successRatio = (
    globals.failCount === 0 && globals.passCount > 0 ? 1
      : globals.passCount === 0 && globals.failCount > 0 ? 0
        : globals.failCount/globals.passCount).toPrecision(testConfig.decimalPrecision);
  const errorRatio = (globals.errorCount === 0 ? 0 : (globals.errorCount/totTestsRun).toPrecision(testConfig.decimalPrecision));
  const successRateLab = globals.passCount+globals.failCount === 0 ? null : (successRatio*100).toString()+'%';
  // console.log(`\nSelenium SVG similarity test success ${successRatio*100}%.
  // - Pass count: ${globals.passCount}
  // - Fail count: ${globals.failCount}`);
  const attemptLab = attemptNumber === 1 ? '' : ` (${attemptNumber}/${testConfig.maxBrowserTestSuiteAttempts})`;
  console.log(`\nSelenium SVG similarity (${driverName}) test complete.${attemptLab}
  - Success rate: ${successRateLab}
  - Time taken: ${totTestTimeLab}
  - Total tests run: ${totTestsRun}
  - Pass count: ${globals.passCount}
  - Fail count: ${globals.failCount}
  - Error count: ${globals.errorCount}\n`);
  
  if (errorRatio >= testConfig.acceptableErrorThreshold) {
    const errRatioLab = (errorRatio*100).toPrecision(testConfig.decimalPrecision).toString()+'%';
    const errThresholdLab = (testConfig.acceptableErrorThreshold*100).toPrecision(testConfig.decimalPrecision).toString()+'%';
    assert(false, `\nSelenium SVG similarity (${driverName}) critical test error: ErrorRatioExceeded\n` +
      'Too many test cases resulted in runtime errors. Error ratio ' + errRatioLab +
      ' exceeded `testConfig.acceptaableErrorThreshold` set at ' + errThresholdLab + '.')
  }
  if (totTestsRun < totTestsToRun ) {
    if (attemptNumber < testConfig.maxBrowserTestSuiteAttempts) {
      console.log(`Selenium SVG similarity (${driverName}) test error (${attemptNumber}/${testConfig.maxBrowserTestSuiteAttempts})\n` +
      `The test suite run attempt ${attemptNumber} of ${testConfig.maxBrowserTestSuiteAttempts} did not fully complete. ` +
      `Due to an unknown issue, only ${totTestsRun} of ${totTestsToRun} tests were run. ` +
      'The test suite will be attempted again.\n');
      const newDriver = {'chrome': new webdriver.Builder().forBrowser('chrome').build()}[driverName];
      console.log(`Starting: Selenium SVG similarity test, ${driverName} (${attemptNumber+1}/${testConfig.maxBrowserTestSuiteAttempts})`);
      // noinspection JSIgnoredPromiseFromCall  TODO: (1)
      testOnBrowser(driverName, newDriver, urlQueryParamStrings, attemptNumber+1);
    } else {
      assert(false, `\nSelenium SVG similarity (${driverName}) critical test error: MaximumAttemptsExceeded\n` +
        `Due to an unknown issue, only ${totTestsRun} of ${totTestsToRun} tests were run. ` +
        'The test suite run did not complete fully, and exceeded max attempts allowed as set by' +
        `\`testConfig.maxBrowserTestSuiteAttempts\` of: ${testConfig.maxBrowserTestSuiteAttempts}\n` +
        'It is advised to run this test suite again until it completes fully. ' +
        'If repeating the test suite does not work, contact the developer.\n');
    }
  } else {
    console.log('Success!\n');
  }
}

function testChartImageMatchesWithParams(urlQueryParamStrings) {
  const seleniumBrowserDrivers = ['chrome'];  // TODO @Bciar: Other browsers.
  for (let driverName of seleniumBrowserDrivers) {
    // TODO: Put this in a global function, so it can be re-used in other places that are quitting and restarting the driver to do re-attempts.
    const driver = {'chrome': new webdriver.Builder().forBrowser('chrome').build()}[driverName];
    console.log(`Starting: Selenium SVG similarity test, ${driverName}`);
    // noinspection JSIgnoredPromiseFromCall  TODO: (1)
    testOnBrowser(driverName, driver, urlQueryParamStrings, 1);
    // .then().catch(err => { console.log(err) });
  }
}

const setUp = () => {
  let urlQueryParamStrings = [];
  const filePathGlob = path.join(__dirname, 'files/*.svg');
  for (let file of ls(filePathGlob)) {
    urlQueryParamStrings.push(file.name);
  }
  return {
    urlQueryParamStrings: urlQueryParamStrings,
  }
};

const testChartImageMatches = () => {
  const testParams = setUp();
  // noinspection JSIgnoredPromiseFromCall  TODO: (1)
  testChartImageMatchesWithParams(testParams.urlQueryParamStrings);
  // try { testChartImageMatchesWithParams(testParams.urlQueryParamStrings); }
  // catch(err) { console.log(err); }  // TODO: #3b - see @#3a
};

testChartImageMatches();

process.on('unhandledRejection', (reason) => {
  // Recommended: send the information to sentry.io or crash reporting service.
  console.log('Unhandled Rejection at:', reason.stack || reason);
  throw('Exiting with error status 1.')
});
