const webdriver = require('selenium-webdriver'),
By = webdriver.By,
until = webdriver.until;

require('chromedriver');

const checkHighchartsSvgMatch = require('./checkHighchartsSvgMatch');
const downloadsFolder = require('downloads-folder');
const path = require('path');
 

const searchTest = (driver, url) => {
  /* Checks to see if an image downloaded at a given URL matches what is expected.
  
  
  Args:
      driver (selenium-webdriver): Selenium web driver to allow for headless, automated browser testing.
      url (string): URL to chart and download image.
      
  Returns:
      bool: True if images match, else false.
  */
  driver.get(url);
  
  driver.wait(until.elementLocated(By.css(".highcharts-contextbutton")), 300000).then(function(){
    driver.findElement(webdriver.By.css(".highcharts-contextbutton")).click();
    driver.wait(webdriver.until.elementLocated(webdriver.By.css(".highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type")), 100000).then(function() {
      driver.findElement(webdriver.By.css(".highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type")).click().then(function() {
        driver.sleep(2000).then(function() {
          const downloadPath = downloadsFolder();
          const file1 = path.join(downloadPath, 'chart.svg');
          const file2 = path.join(__dirname, 'bin/chart.svg');
          const files = [file1, file2];
          const result = checkHighchartsSvgMatch(files);
          console.log(result);
          driver.quit();
        });
      })
    })
  });
};

const testChartImageMatches2 = () => {
    const urlHostName = 'http://datalab-staging.pma2020.org/?';  // TODO @Bciar: Run tests on localhost.
    const urlQueryParamStrings = [
      'surveyCountries=PMA2014_BFR1&indicators=cp_all&characteristicGroups=none&chartType=bar&overTime=false'
    ];
    const seleniumBrowserDrivers = [
      new webdriver.Builder().forBrowser('chrome').build(),
      // new webdriver.Builder().forBrowser('firefox').build()  // TODO @Bciar: Low priority.
      // new webdriver.Builder().forBrowser('internet_explorer').build()  // TODO @Bciar: Low priority.
    ];
    for (let driver of seleniumBrowserDrivers) {
      for (let urlQueryParams of urlQueryParamStrings) {
        searchTest(driver, urlHostName+urlQueryParams);
      }
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