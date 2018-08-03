const fs = require('fs');
const webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until;
require('chromedriver');

const checkHighchartsSvgMatch = require('./checkHighchartsSvgMatch');
const downloadsFolder = require('downloads-folder');
const path = require('path');
const assert = require('assert');
 

const searchTest = (driver, urlQueryParams) => {
  /* Checks to see if an image downloaded at a given URL matches what is expected.


  Args:
      driver (selenium-webdriver): Selenium web driver to allow for headless, automated browser testing.
      url (string): URL to chart and download image.
      
  Returns:
      bool: True if images match, else false.
  */
  return new Promise(resolve => {
    const urlHostName = 'http://datalab-staging.pma2020.org/?';  // TODO @Bciar: Run tests on localhost.
    const url = urlHostName + urlQueryParams;
    driver.get(url);

    driver.wait(until.elementLocated(By.css(".highcharts-contextbutton")), 300000).then(function(){
      driver.findElement(webdriver.By.css(".highcharts-contextbutton")).click();
      driver.wait(webdriver.until.elementLocated(webdriver.By.css(".highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type")), 100000).then(function() {
        driver.findElement(webdriver.By.css(".highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type")).click().then(function() {
          driver.sleep(3000).then(function() {
            const downloadPath = downloadsFolder();
            const file1 = path.join(downloadPath, 'chart.svg');
            const file2 = path.join(__dirname, 'files/'+urlQueryParams+'.svg');
            const files = [file1, file2];
            const result = checkHighchartsSvgMatch(files);
            resolve(result);
            // console.log(result);
          });
        })
      })
    });
  });
};

async function testChartImageMatches2() {
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
    const seleniumBrowserDrivers = [
      new webdriver.Builder().forBrowser('chrome').build(),
      // new webdriver.Builder().forBrowser('firefox').build()  // TODO @Bciar: Low priority.
      // new webdriver.Builder().forBrowser('internet_explorer').build()  // TODO @Bciar: Low priority.
    ];
    for (let driver of seleniumBrowserDrivers) {
      for (let urlQueryParams of urlQueryParamStrings) {
        const downloadPath = downloadsFolder();
        if (fs.existsSync(path.join(downloadPath, 'chart.svg'))) {
          fs.unlinkSync(path.join(downloadPath, 'chart.svg'));
        }
        const result = await searchTest(driver, urlQueryParams);
        assert( result, 'passed!');
        // console.log(result);
      }
      console.log('success!');
      driver.quit();
    }
};

const testChartImageMatches = () => {
  /* Tests multiple URLs in multiple browsers and checks if images downloaded match what is expected. */
  try {
    testChartImageMatches2()
  }
  
  catch (err) {
    // TODO @Joe: Syncronously install binary and call testChartImageMatches() again.
    // https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
    const os = process.platform;
    const msg = 'You need to download a selenium web driver as explained below. Some are provided in the "test/bin/" directory.\n\n' + err;

    if (os === 'darwin') {
      'use strict';
      const { spawnSync } = require('child_process'),
          addToPath = spawnSync('export', ['PATH=$PATH:'+__dirname+'/bin/seleniumDriver_chrome_mac64']);
      if (addToPath['stderr']) {
        console.log(`stderr: ${addToPath.stderr.toString()}`);
        console.log(addToPath);
      }
      else if (addToPath['error']) {
        console.log(`error: ${addToPath.error.toString()}`);
        console.log(addToPath);
      }
      if (addToPath['stdout']) {
        console.log(`stdout: ${addToPath.stdout.toString()}`);
        testChartImageMatches2()
      }
      // console.log(addToPath);
    } else if (os === 'win32'){
      console.log(msg)
    } else {
      console.log(msg)
    }
    
    testChartImageMatches2()
  }
};

testChartImageMatches();