const webdriver = require('selenium-webdriver');
const checkHighchartsSvgMatch = require('./checkHighchartsSvgMatch');


const searchTest = (driver, url) => {
  /* Checks to see if an image downloaded at a given URL matches what is expected.
  
  Args:
      driver (selenium-webdriver): Selenium web driver to allow for headless, automated browser testing.
      url (string): URL to chart and download image.
      
  Returns:
      bool: True if images match, else false.
  */
  driver.get(url);
  
  driver.wait(webdriver.until.elementLocated(webdriver.By.className("highcharts-contextbutton")), 200000);
  driver.findElement(webdriver.By.className("highcharts-contextbutton")).click();
  driver.wait(webdriver.until.elementLocated(webdriver.By.css(".highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type")), 100000);
  driver.findElement(webdriver.By.css(".highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type")).click();

  // TODO @Bciar: Change so that this can work on any computer.
  // Detect operating system: https://stackoverflow.com/questions/8683895/how-do-i-determine-the-current-operating-system-with-node-js
  const file1 = 'C:\\Users\\asharp\\Downloads\\chart.svg';
  const file2 = 'C:\\Users\\asharp\\Downloads\\chart2.svg';// 'input\\chart2.svg';
  const files = [file1, file2];
  
  driver.sleep(2000).then(function() {
      const result = checkHighchartsSvgMatch(files);
      console.log(result);
  });
};

const testChartImageMatches = () => {
  /* Tests multiple URLs in multiple browsers and checks if images downloaded match what is expected. */
  const urlHostName = 'http://datalab-staging.pma2020.org/?';  // TODO @Bciar: Run tests on localhost.
    const urlQueryParamStrings = [
      'surveyCountries=PMA2014_BFR1&indicators=cp_all&characteristicGroups=none&chartType=bar&overTime=false'
    ];

  try {
    const seleniumBrowserDrivers = [
      new webdriver.Builder().forBrowser('chrome').build(),
      // new webdriver.Builder().forBrowser('firefox').build()  // TODO @Bciar: Low priority.
      // new webdriver.Builder().forBrowser('internet_explorer').build()  // TODO @Bciar: Low priority.
    ];
    for (let driver of seleniumBrowserDrivers) {
      for (let urlQueryParams of urlQueryParamStrings) {
        searchTest(driver, urlHostName+urlQueryParams);
      }
      driver.quit();
    }
  }
  
  catch (err) {
    // TODO @Joe: Syncronously install binary and call testChartImageMatches() again.
    // https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
    console.log('You need to download a selenium web driver as explained below. Some are provided in the "test/bin/" directory.\n\n' + err)
  }
};

testChartImageMatches();
