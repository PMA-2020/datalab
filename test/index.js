const fs = require('fs');
const webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until;
require('chromedriver');

const checkHighchartsSvgMatch = require('./checkHighchartsSvgMatch');
const downloadsFolder = require('downloads-folder');
const path = require('path');
const assert = require('assert');
 

const searchTest = (driver, urlQueryParams, urlBase) => {
  /* Checks to see if an image downloaded at a given URL matches what is expected.

  Args:
      driver (selenium-webdriver): Selenium web driver to allow for headless, automated browser testing.
      url (string): URL to chart and download image.
      
  Returns:
      bool: True if images match, else false.
  */
  return new Promise(resolve => {
    const url = urlBase + urlQueryParams;
    driver.get(url);

    driver.wait(until.elementLocated(By.css(".highcharts-contextbutton")), 300000).then(function(){
      // noinspection JSIgnoredPromiseFromCall
      driver.findElement(webdriver.By.css(".highcharts-contextbutton")).click();
      driver.wait(webdriver.until.elementLocated(webdriver.By.css(".highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type")), 100000).then(function() {
        driver.findElement(webdriver.By.css(".highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type")).click().then(function() {
          driver.sleep(3000).then(function() {
            const downloadPath = downloadsFolder();
            const file1 = path.join(downloadPath, 'chart.svg');
            const file2 = path.join(__dirname, 'files/'+urlQueryParams+'.svg');
            const files = [file1, file2];
            const result = checkHighchartsSvgMatch.checkHighchartsSvgSimilarity(files);
            resolve(result);
          });
        })
      })
    });
  // TODO: If it takes too long, throw some sort of error.
  });
};

async function testOnBrowser(driver, urlQueryParamStrings, thresholdValue, urlBase) {
  // return new Promise(resolve => {
    let results = {};
      let successfulTestIterations = 0;
      let testsPassed = false;
      try {
        for (let urlQueryParams of urlQueryParamStrings) {
          const downloadPath = downloadsFolder();
          if (fs.existsSync(path.join(downloadPath, 'chart.svg'))) {
            fs.unlinkSync(path.join(downloadPath, 'chart.svg'));
          }
            stringSimilarity = await searchTest(driver, urlQueryParams, urlBase);
            // stringSimilarity = searchTest(driver, urlQueryParams, urlBase);
            
            // TODO: Debugging timeout and cant find element
            console.log(stringSimilarity);
            console.log(urlQueryParams);
            
            const successCondition = stringSimilarity > thresholdValue;
            const errMsg = `\n\nTest failed on the following assertion.:\n
              ${urlQueryParams}\n
              ${stringSimilarity}\n\n`;
            assert(successCondition, errMsg);
            successfulTestIterations = successCondition ? successfulTestIterations++ : successfulTestIterations;
        }
      }
      catch (error) {
        driver.quit();
        results = {
          testsPassed: testsPassed,
          successfulTestIterations: successfulTestIterations,
          error: error
        };
        console.log(`\n\nRunning test results:\n${JSON.stringify(results)}`);
        throw(results)
        // return results;
        // resolve(results);
      }
      testsPassed = true;
      driver.quit();
      results = {
        testsPassed: testsPassed,
        successfulTestIterations: successfulTestIterations,
        error: null
      };
      console.log(`\n\nFinal test results:\n${JSON.stringify(results)}`);
      return results;
      // resolve(results);
  // });
}

// async function testChartImageMatchesWithParams(urlQueryParamStrings, thresholdValue, urlBase) {
function testChartImageMatchesWithParams(urlQueryParamStrings, thresholdValue, urlBase) {
  let results = {};
  const seleniumBrowserDrivers = ['chrome'];  // TODO @Bciar: Other browsers.
  for (let driverName of seleniumBrowserDrivers) {
    try {
      driver = {'chrome': new webdriver.Builder().forBrowser('chrome').build()}[driverName];
      results = testOnBrowser(driver, urlQueryParamStrings, thresholdValue, urlBase);
    }
    catch (error) {  // TODO @Bciar: I wanted to try running the test again.. But I did something wrong. This doesn't seem to work.
      console.log('Failed 1st iteration of running through test URLs. Trying again.');
      driver = {'chrome': new webdriver.Builder().forBrowser('chrome').build(),}[driverName];
      results = testOnBrowser(urlQueryParamStrings, thresholdValue, urlBase);
    }
    // console.log(results.testsPassed ? 'Success' : 'Failure');
  }
}

const setUp = () => {
  const urlQueryParamStrings = [
    'surveyCountries=PMA2014_BFR1&indicators=cp_all&characteristicGroups=none&chartType=bar&overTime=false',
    'surveyCountries=PMA2014_BFR1&indicators=cp_all&characteristicGroups=none&chartType=column&overTime=false',
    'surveyCountries=PMA2014_BFR1&indicators=cp_all&characteristicGroups=none&chartType=line&overTime=false',
    'surveyCountries=PMA2014_BFR1&indicators=cp_all&characteristicGroups=age_5yr_int&chartType=bar&overTime=false',
    'surveyCountries=PMA2014_BFR1&indicators=cp_all&characteristicGroups=age_5yr_int&chartType=column&overTime=false',
    'surveyCountries=PMA2014_BFR1&indicators=cp_all&characteristicGroups=age_5yr_int&chartType=line&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=none&chartType=bar&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=none&chartType=column&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=none&chartType=line&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=wealth_quintile&chartType=bar&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=wealth_quintile&chartType=column&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=wealth_quintile&chartType=line&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=none&chartType=bar&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=none&chartType=column&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=none&chartType=line&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=parity&chartType=bar&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=parity&chartType=column&overTime=false',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=parity&chartType=line&overTime=false',
  
    'surveyCountries=PMA2014_BFR1&indicators=methodmix_allw_anym&characteristicGroups=method_mix_all&chartType=pie&overTime=false',
    'surveyCountries=PMA2013_CDR1_Kinshasa&indicators=methodmix_marw_anym&characteristicGroups=method_mix_all&chartType=pie&overTime=false',
    'surveyCountries=PMA2013_GHR1&indicators=methodmix_marw_modernm&characteristicGroups=method_mix_modern&chartType=pie&overTime=false',
    'surveyCountries=PMA2014_ETR1&indicators=methodmix_allw_modernm&characteristicGroups=method_mix_modern&chartType=pie&overTime=false',
    'surveyCountries=PMA2016_INR1_Rajasthan&indicators=methodmix_allw_plusnon&characteristicGroups=method_mix_non&chartType=pie&overTime=false',
    'surveyCountries=PMA2016_NER2&indicators=methodmix_marw_plusnon&characteristicGroups=method_mix_non&chartType=pie&overTime=false',
  
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=none&chartType=bar&overTime=true',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=none&chartType=column&overTime=true',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=none&chartType=line&overTime=true',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=wealth_quintile&chartType=bar&overTime=true',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=wealth_quintile&chartType=column&overTime=true',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2,PMA2014_KER1,PMA2014_KER2&indicators=mcp_mar&characteristicGroups=wealth_quintile&chartType=line&overTime=true',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=none&chartType=bar&overTime=true',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=none&chartType=column&overTime=true',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=none&chartType=line&overTime=true',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=parity&chartType=bar&overTime=true',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=parity&chartType=column&overTime=true',
    'surveyCountries=PMA2014_ETR1,PMA2014_ETR2&indicators=mcp_mar&characteristicGroups=parity&chartType=line&overTime=true',
  ];
  
  return {
    urlQueryParamStrings: urlQueryParamStrings,
    thresholdValue: 0.95,
    urlBase: 'http://localhost:4567/?'
  }
};

const testChartImageMatches = () => {
  const testParams = setUp();
  // noinspection JSIgnoredPromiseFromCall
  testChartImageMatchesWithParams(testParams.urlQueryParamStrings, testParams.thresholdValue, testParams.urlBase);
};

testChartImageMatches();
