import Utility from './utility';
import Initialization from './initialization';
import Selectors from './selectors';
import CSV from './csv';
import Highcharts from 'highcharts';
import highchartTheme from './chart-theme';
require('highcharts/modules/exporting')(Highcharts);

/**
 * Main chart object, should be constructed once
 */
export default class Chart {
  /**
   * Chart Class Constructor
   */
  constructor(network, combo, validation) {
    /**
     * The network object
     * @type {Network}
     */
    this.network = network;

    /**
     * The combo object
     * @type {Combo}
     */
    this.combo = combo;

    /**
     * The validation object
     * @type {Validation}
     */
    this.validation = validation;

    /**
     * The currently rendered chart from Highcharts
     * @type {object}
     */
    this.chartObj = {};

    /**
     * The currently rendered chart options
     * that were sent to Highcharts
     * @type {object}
     */
    this.option_obj = {};

    /**
     * The currently rendered chart options
     * that were sent to Highcharts
     * @type {Initialization}
     */
    this.initialization = new Initialization();
  }

  /**
   * Generate the chart title from the options selected,
   * unless overrided
   * @private
   */
  generateTitle(inputs) {
    const characteristicGroupLabel = Utility.getStringById(
      inputs.characteristicGroups[0]["label.id"]
    );
    const indicatorLabel = Utility.getStringById(
      inputs.indicators[0]["label.id"]
    );
    const countries = Array.from(new Set(inputs.surveys.reduce((tot, country) => {
      return [...tot, Utility.getStringById(country["country.label.id"])];
    }, []))).join(", ");

    let title = `${indicatorLabel} ${Utility.getStringById('by')} ${characteristicGroupLabel} ${Utility.getStringById('for')} ${countries}`;
    if (characteristicGroupLabel=="None") {
      title = `${indicatorLabel} ${Utility.getStringById('for')} ${countries}`;
    }
    sessionStorage.setItem('chart-title', title);

    return {
      style: {
        color: Utility.getOverrideValue('title-color')
      },
      text: title,
    };
  }

  /**
   * Generate the series name based on the data for the chart axis
   * @param {string} countryId - countryId to lookup in strings data
   * @param {string} geographyId - geographyId to lookup in strings data
   * @param {string} surveyId - surveyId to lookup in strings data
   * @return {string} name of the series for the axis
   * @private
   */
  generateSeriesName(countryId, geographyId, surveyId) {
    const country = Utility.getStringById(countryId);
    const geography = Utility.getStringById(geographyId);
    const survey = Utility.getStringById(surveyId);

    return `${country} ${geography} ${survey}`;
  }

  /**
   * Generate plot options for Highcharts
   * @private
   */
  generatePlotOptions(precision) {
    return {
      series: {
        connectNulls: true,
        marker: {
          radius: Utility.getOverrideValue('marker-size')
        },
        dataLabels: {
          enabled: true,
          format: `{y:.${precision}f}`,
          x: Utility.getOverrideValue('data-label-x-position'),
          y: Utility.getOverrideValue('data-label-y-position'),
        }
      },
      bar: {
        dataLabels: {
          enabled: true
        }
      },
      column: {
        dataLabels: {
          enabled: true,
          crop: false,
          overflow: "none"
        }
      },
      line: {
        dataLabels: {
          enabled: true
        }
      },
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true
        },
        showInLegend: true
      }
    };
  }

  /**
   * Generate chart subtitle, checking for override color
   * @return {object} object with style and text
   * @private
   */
  generateSubtitle() {
    return {
      style: {
        color: Utility.getOverrideValue('title-color')
      },
      text: "PMA2020"
    };
  }

  /**
   * Generate the date in yyyy-mm-dd format
   * @return {string} the date in string format
   * @private
   */
  generateDate() {
    return new Date().toJSON().slice(0, 10);
  }

  /**
   * Generate chart citation based on the current date
   * and passed in partners
   * @param {Array} partners - an array of partners to mention in the citation
   * @return {string} citation string
   * @private
   */
  generateCitation(partners = []) {
    let citation = "Performance Monitoring and Accountability 2020. Johns Hopkins University;";
    citation = [citation, ...partners];
    const date = this.generateDate();
    return `${citation} ${date}`;
  }

  /**
   * @private
   */
  generateCredits(inputs) {
    const partners = Array.from(new Set(inputs.surveys.reduce((tot, country) => {
      return [...tot, Utility.getStringById(country["partner.label.id"])];
    }, [])));

    return {
      text: this.generateCitation(partners),
      href: '',
      position: {
        align: 'center',
        y: Utility.getOverrideValue('credits-y-position')
      }
    };
  }

  /**
   * @private
   */
  generateToolTip(precision) {
    return {
      xDateFormat: '%m-%Y',
      pointFormat: `{series.name}: {point.y:.${precision}f}`
    };
  }

  /**
   * @private
   */
  generateOverTimeXAxis() {
    return {
      type: 'datetime',
      title: { text: 'Date' },
      dateTimeLabelFormats: {
        month: '%m-%Y',
        year: '%m-%Y',
        day: '%m-%Y',
      },
    };
  }

  /**
   * @private
   */
  getCharacteristicGroupNames(groups) {
    return groups.reduce((tot, charGroup) => {
      const charGroupName = Utility.getStringById(charGroup["characteristic.label.id"]);
      return [...tot, charGroupName];
    }, []);
  }

  /**
   * @private
   */
  generateXaxis(characteristicGroups) {
    return {
      categories: this.getCharacteristicGroupNames(characteristicGroups),
      title: {
        text: "",
        x: Utility.getOverrideValue('x-axis-x-position'),
        y: Utility.getOverrideValue('x-axis-y-position')
      },
      lineColor: Utility.getOverrideValue('x-axis-color'),
      tickColor: Utility.getOverrideValue('tick-color'),
      minorTickColor: Utility.getOverrideValue('minor-tick-color'),
    };
  }

  /**
   * @private
   */
  generateYaxis(indicator) {
    sessionStorage.setItem('chart-axis-label', indicator);

    return {
      title: {
        text: indicator,
        style: { color: Utility.getOverrideValue("label-color") },
        x: Utility.getOverrideValue('y-axis-x-position'),
        y: Utility.getOverrideValue('y-axis-y-position')
      },
      lineColor: Utility.getOverrideValue('y-axis-color'),
      labels: { style: { color: Utility.getOverrideValue('label-color') } },
      tickColor: Utility.getOverrideValue('tick-color'),
      minorTickColor: Utility.getOverrideValue('minor-tick-color'),
      minorTickInterval: 'auto'
    };
  }

  /**
   * @private
   */
  generateExporting() {
    return {
      chartOptions: {
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true
            }
          }
        }
      },
      scale: 3,
      fallbackToExportServer: false
    };
  }

  /**
   * @private
   */
  generateLegend() {
    // const countryRounds = Selectors.getSelectedCountryRounds();

    let legendContent = {
      layout: 'vertical',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        color: Utility.getOverrideValue('label-color'),
      }
    };
    return legendContent;
  }

  /**
   * @private
   */
  generateChartSettings() {
    const chartType = Selectors.getSelectedChartType();
    sessionStorage.setItem('chart-type', chartType);

    return {
      type: chartType,
      marginBottom: Utility.getOverrideValue('bottom-margin-offset'),
      backgroundColor: Utility.getOverrideValue('chart-background-color'),
      style: {
        color: Utility.getOverrideValue('label-color')
      }
    };
  }

  /**
   * @private
   */
  generatePieData(charGroup, charGroups, dataPoints) {
    const charGroupNames = this.getCharacteristicGroupNames(charGroups);
    const series = charGroupNames.map((group) => {
      const dataPoint = dataPoints[0].values[charGroupNames.indexOf(group)];
      return { name: group, y: dataPoint.value };
    });

    return [{ name: charGroup, data: series }];
  }

  /**
   * @private
   */
  generateOverTimeSeriesData(dataPoints = []) {
    return dataPoints.map(dataPoint => {
      const characteristicGroupId = dataPoint["characteristic.label.id"];

      return {
        name: Utility.getStringById(characteristicGroupId),
        data: dataPoint.values.map(item => {
          const utcDate = Utility.parseDate(item["survey.date"]);
          return [utcDate, item.value];
        })
      }
    })
  }

  /**
   * Builds the series array of data for Highcharts
   * @private
   */
  generateSeriesData(dataPoints = []) {
    return dataPoints.map(dataPoint => {
      const countryId = dataPoint["country.label.id"];
      const geographyId = dataPoint["geography.label.id"];
      const surveyId = dataPoint["survey.label.id"];

      return {
        name: this.generateSeriesName(countryId, geographyId, surveyId),
        data: dataPoint.values.map(item => item.value)
      }
    })
  }

  /**
   * Generate the Pie chart from an API response
   * returns the object necessary to send to Highcharts.
   * @private
   */
  generatePieChart(res) {
    const inputs = res.queryInput;
    const characteristicGroups = res.results[0].values;
    // const indicator = Utility.getStringById(inputs.indicators[0]["label.id"]);
    const dataPoints = res.results;
    const precision = res.chartOptions.precision;
    return {
        chart: this.generateChartSettings(),
        title: this.generateTitle(inputs),
        subtitle: this.generateSubtitle(),
        tooltip: this.generateToolTip(precision),
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.'+precision+'f} %',
            },
            // showInLegend: true
          }
        },
        series: this.generatePieData(
            Selectors.getSelectedValue('select-characteristic-group'),
            characteristicGroups,
            dataPoints
          ),
        credits: this.generateCredits(inputs),
        legend: this.generateLegend(),
        exporting: this.generateExporting(),
    };
    // plotOptions: this.generatePlotOptions(precision),
  }

  /**
   * Generate the Over Time chart from an API response
   * returns the object necessary to send to Highcharts.
   * @private
   */
  generateOverTimeChart(res) {
    const inputs = res.queryInput;
    // const characteristicGroups = res.results[0].values;
    const indicator = Utility.getStringById(inputs.indicators[0]["label.id"]);
    const dataPoints = res.results;
    const precision = res.chartOptions.precision;

    return {
      chart: this.generateChartSettings(),
      title: this.generateTitle(inputs),
      subtitle: this.generateSubtitle(),
      xAxis: this.generateOverTimeXAxis(),
      yAxis: this.generateYaxis(indicator),
      series: this.generateOverTimeSeriesData(dataPoints),
      credits: this.generateCredits(inputs),
      legend: this.generateLegend(),
      exporting: this.generateExporting(),
      plotOptions: this.generatePlotOptions(precision),
      tooltip: this.generateToolTip(precision),
    };
  }

  /**
   * Generate the chart from an API response
   * returns the object necessary to send to Highcharts.
   * For all chart types that aren't Over Time or Pie
   * @private
   */
  generateChart(res) {
    const inputs = res.queryInput;
    const characteristicGroups = res.results[0].values;
    const indicator = Utility.getStringById(inputs.indicators[0]["label.id"]);
    const dataPoints = res.results;
    const precision = res.chartOptions.precision;

    return {
      chart: this.generateChartSettings(),
      title: this.generateTitle(inputs),
      subtitle: this.generateSubtitle(),
      xAxis: this.generateXaxis(characteristicGroups),
      yAxis: this.generateYaxis(indicator),
      series: this.generateSeriesData(dataPoints),
      credits: this.generateCredits(inputs),
      legend: this.generateLegend(),
      exporting: this.generateExporting(),
      plotOptions: this.generatePlotOptions(precision),
      tooltip: this.generateToolTip(precision),
    };
  }

  /**
   * Gather data from the server and render
   */
  data(query) {
    // Gather options from chart inputs
    const selectedSurveys = query['surveyCountries'].split(',');
    const selectedIndicator = query['indicators'];
    const selectedCharacteristicGroup = query['characteristicGroups'];
    const overTime = query['overTime'] == 'true';
    const chartType = query['chartType'];

    const opts = {
      "survey": selectedSurveys,
      "indicator": selectedIndicator,
      "characteristicGroup": selectedCharacteristicGroup,
      "overTime": overTime,
    }

    return new Promise((resolve, reject) => {
      this.network.get("datalab/data", opts).then(res => {
        if (overTime) { // Overtime series option selected
          this.option_obj = this.generateOverTimeChart(res);
        } else if (chartType === 'pie') { // Pie chart type option selected
          this.option_obj = this.generatePieChart(res);
        } else { // Everything else
          this.option_obj = this.generateChart(res);
        }

        this.chartObj = Highcharts.chart('chart-container', this.option_obj);
        if (sessionStorage.getItem('switch.bw')==='true') {
          this.chartObj.update(highchartTheme.gray());
        }

        this.combo.filter();
        this.validation.checkOverTime();
        this.validation.checkBlackAndWhite();
        this.validation.checkPie();
        this.validation.checkCharting();
        resolve();
      });
    });
  }

  /**
   * Load data via redirect to a full url with query
   */
  loadData() {
    const selectedSurveys = Selectors.getSelectedCountryRounds();
    const selectedIndicator = Selectors.getSelectedValue('select-indicator-group');
    const selectedCharacteristicGroup = Selectors.getSelectedValue('select-characteristic-group');
    const selectedLanguage = Selectors.getSelectedLanguage();
    const overTime = $('#dataset_overtime')[0].checked;
    const chartType = Selectors.getSelectedChartType();
    const urlRoot = window.location.href.split('?')[0];
    const url = urlRoot + '?surveyCountries=' + selectedSurveys.join(',') 
                + '&indicators=' + selectedIndicator 
                + '&characteristicGroups=' + selectedCharacteristicGroup 
                + '&chartType=' + chartType 
                + '&overTime=' + overTime.toString()
                + '&lang=' + selectedLanguage;
    window.location.href = url;
  }

  /**
   * Call to bind all the styling events in the DOM
   * so that the graph updates as they are changed
   */
  setStyleEvents() {
    $('.colorpicker').on('change', (e) => {
      if (Object.keys(this.chartObj).length == 0) return;
      const chartType = sessionStorage.getItem('chart-type');
      const isBar = chartType==="bar";
      const colorValue = e.target.value;
      const colorDefaultBlack = !!colorValue ? colorValue : '#000';
      switch (e.target.id) {
        case 'chart-background-color':
          this.option_obj.chart.backgroundColor = !!colorValue ? colorValue : '#fff';
          break;
        case 'title-color':
          this.option_obj.title.style.color = colorDefaultBlack;
          break;
        case 'label-color':
          this.option_obj.chart.style.color = colorDefaultBlack;
          break;
        case 'y-axis-color':
          isBar ? this.option_obj.xAxis.lineColor = colorDefaultBlack : this.option_obj.yAxis.lineColor = colorDefaultBlack;
          break;
        case 'x-axis-color':
          isBar ? this.option_obj.yAxis.lineColor = colorDefaultBlack : this.option_obj.xAxis.lineColor = colorDefaultBlack;
          break;
        case 'tick-color':
          this.option_obj.xAxis.tickColor = colorDefaultBlack;
          this.option_obj.yAxis.tickColor = colorDefaultBlack;
          break;
        case 'minor-tick-color':
          this.option_obj.xAxis.minorTickColor = colorDefaultBlack;
          this.option_obj.yAxis.minorTickColor = colorDefaultBlack;
          break;
      }
      this.chartObj.update(this.option_obj);
      this.saveChartStyle();
    });

    $('.form-control.style-input').on('blur', (e) => {
      if (Object.keys(this.chartObj).length == 0) return;
      const chartType = sessionStorage.getItem('chart-type');
      const isBar = chartType==="bar";
      const inputValue = e.target.value;
      let num = 0;
      switch (e.target.id) {
        case 'chart-title':
          this.option_obj.title.text = inputValue;
          break;
        case 'y-axis-label':
          isBar ? this.option_obj.xAxis.title.text = inputValue : this.option_obj.yAxis.title.text = inputValue;
          break;
        case 'x-axis-label':
          isBar ? this.option_obj.yAxis.title.text = inputValue : this.option_obj.xAxis.title.text = inputValue;
          break;
        case 'y-axis-x-position':
          num = !!inputValue ? parseInt(inputValue) : 0;
          isBar ? this.option_obj.xAxis.title.x = num : this.option_obj.yAxis.title.x = num;
          break;
        case 'y-axis-y-position':
          num = !!inputValue ? parseInt(inputValue) : 0;
          isBar ? this.option_obj.xAxis.title.y = num : this.option_obj.yAxis.title.y = num;
          break;
        case 'x-axis-x-position':
          num = !!inputValue ? parseInt(inputValue) : 0;
          isBar ? this.option_obj.yAxis.title.x = num : this.option_obj.xAxis.title.x = num;
          break;
        case 'x-axis-y-position':
          num = !!inputValue ? parseInt(inputValue) : 0;
          isBar ? this.option_obj.yAxis.title.y = num : this.option_obj.xAxis.title.y = num;
          break;
        case 'marker-size':
          this.option_obj.plotOptions.series.marker.radius = !!inputValue ? parseInt(inputValue) : 4;
          break;
        case 'data-label-x-position':
          this.option_obj.plotOptions.series.dataLabels.x = !!inputValue ? parseInt(inputValue) : 0;
          break;
        case 'data-label-y-position':
          this.option_obj.plotOptions.series.dataLabels.y = !!inputValue ? parseInt(inputValue) : -6;
          break;
        case 'credits-y-position':
          this.option_obj.credits.position.y = !!inputValue ? parseInt(inputValue) : 0;
          break;
        case 'bottom-margin-offset':
          this.option_obj.chart.marginBottom = !!inputValue ? parseInt(inputValue) : 115;
          break;
      }
      this.chartObj.update(this.option_obj);
      this.saveChartStyle();
    });

    $("#dataset_black_and_white").on('change', (e) => {
      if (Object.keys(this.chartObj).length == 0) return;

      if ($(e.target).prop('checked')) {
        this.chartObj.update(highchartTheme.gray());
      } else {
        this.chartObj.update(highchartTheme.sunset());
      }
      this.saveChartStyle();
    });
  }

  /**
   * Initialize the chart by calling the initialization with
   * this chart object.
   */
  initialize() {
    this.initialization.initialize(this.network, this);
  }

  /**
   * Record the custom chart styling to local storage
   */
  saveChartStyle() {
    sessionStorage.saved_style = 1;
    const styleElements = $('.chart-style-wrapper .form-control');
    styleElements.each(function() {
        const id = $(this).attr('id');
        const key = `styles.${id}`;
        const value = $(this).val();
        sessionStorage.setItem(key, value);
    });
    sessionStorage.setItem('switch.bw', $('#dataset_black_and_white').prop('checked'));
    // this.loadData();
  }
}
