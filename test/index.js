var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
// const md5File = require('md5-file');
// const fs = require('fs');
const checkHighchartsSvgMatch = require('./checkHighchartsSvgMatch');


var driver_chr = new webdriver.Builder()
    .forBrowser('chrome')
    .build();
searchTest(driver_chr);


function searchTest(driver) {
    driver.get('http://datalab-staging.pma2020.org/?surveyCountries=PMA2014_BFR1&indicators=cp_all&characteristicGroups=none&chartType=bar&overTime=false'); 
    
    driver.wait(webdriver.until.elementLocated(webdriver.By.className("highcharts-contextbutton")), 200000);
    driver.findElement(webdriver.By.className("highcharts-contextbutton")).click();
    driver.wait(webdriver.until.elementLocated(webdriver.By.css(".highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type")), 100000);
    driver.findElement(webdriver.By.css(".highcharts-contextmenu .highcharts-menu .highcharts-menu-item:last-of-type")).click();

    const file1 = 'C:\\Users\\asharp\\Downloads\\chart.svg';
    const file2 = 'C:\\Users\\asharp\\Downloads\\chart2.svg';// 'input\\chart2.svg';
    const files = [file1, file2];
    driver.sleep(2000).then(function() {
        // const hash1 = md5File.sync('C:\\Users\\asharp\\Downloads\\chart.svg');
        // const hash2 = md5File.sync('hash2.png');
        const result = checkHighchartsSvgMatch(files);
        console.log(result); 
    });

    driver.quit();
}