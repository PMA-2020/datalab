import Network from './network';
import Utility from './utility';
import Selectors from './selectors';
import Combo from './combo';
import Validation from './validation';
import Initialization from './initialization';
import CSV from './csv';
import Highcharts from 'highcharts';
import Highchart_theme from './chart-theme';
require('highcharts/modules/exporting')(Highcharts);

/**
 * Main chart object, should be constructed once
 */
export default class Chart {
  /**
   * Chart Class Constructor
   */
  constructor() {
    /**
     * The currently rendered chart from Highcharts
     * @type {object}
     */
    this.chart_obj = {};
    /**
     * The currently rendered chart options
     * that were sent to Highcharts
     * @type {object}
     */
    this.option_obj = {};
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

    const title = `${indicatorLabel} ${Utility.getStringById('by')} ${characteristicGroupLabel} ${Utility.getStringById('for')} ${countries}`;
    sessionStorage.setItem('chart-title', title);

    return {
      style: { color: Utility.getOverrideValue('title-color') },
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

    return `${country} ${geography} ${survey}`
  }

  /**
   * Generate plot options for Highcharts
   * @private
   */
  generatePlotOptions(precision) {
    return {
      series: {
        connectNulls: true,
        marker: { radius: Utility.getOverrideValue('marker-size')},
        dataLabels: {
          enabled: true,
          format: `{y:.${precision}f}`,
          x: Utility.getOverrideValue('data-label-x-position'),
          y: Utility.getOverrideValue('data-label-y-position'),
        }
      },
      bar: { dataLabels: { enabled: true } },
      column: { dataLabels: { enabled: true } },
      line: { dataLabels: { enabled: true } },
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true
        },
        showInLegend: true
      }
    }
  }

  /**
   * Generate chart subtitle, checking for override color
   * @return {object} object with style and text
   * @private
   */
  generateSubtitle() {
    return {
      style: { color: Utility.getOverrideValue('title-color') },
      text: "PMA2020"
    }
  }

  /**
   * Generate chart citation based on the current date
   * and passed in partners
   * @param {Array} partners - an array of partners to mention in the citation
   * @return {string} citation string
   * @private
   */
  generateCitation(partners) {
    let citation = "Performance Monitoring and Accountability 2020. Johns Hopkins University;";
    citation = [citation, ...partners];
    return `${citation} ${new Date().toJSON().slice(0,10)}`;
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
    }
  }

  /**
   * @private
   */
  generateToolTip(precision) {
    return {
      xDateFormat: '%m-%Y',
      pointFormat: `{series.name}: {point.y:.${precision}f}`
    }
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
    }
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
    }
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
    }
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
    }
  }

  /**
   * @private
   */
  generateLegend() {
    const countryRounds = Selectors.getSelectedCountryRounds();

    let legendContent = {
      layout: 'vertical',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: { color: Utility.getOverrideValue('label-color'), }
    }

    if (countryRounds.length > 5) {
      legendContent['verticalAlign'] = 'top'
      legendContent['layout'] = 'vertical'
    }

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
    }
  }

  /**
   * @private
   */
  generatePieData(charGroup, charGroups, dataPoints) {
    let series = [];
    const charGroupNames = this.getCharacteristicGroupNames(charGroups);

    charGroupNames.forEach((charGroup) => {
      const dataPoint = dataPoints[0].values[charGroupNames.indexOf(charGroup)];
      series.push({ name: charGroup, y: dataPoint.value });
    });

    return [{ name: charGroup, data: series }];
  }

  /**
   * @private
   */
  generateOverTimeSeriesData(dataPoints) {
    return dataPoints.reduce((res, dataPoint) => {
      const characteristicGroupId = dataPoint["characteristic.label.id"];

      return [
        ...res,
        {
          name: Utility.getStringById(characteristicGroupId),
          data: dataPoint.values.reduce((tot, item) => {
            const utcDate = Utility.parseDate(item["survey.date"]);

            return [...tot, [utcDate, item.value]];
          }, [])
        }
      ]
    }, [])
  }

  /**
   * Builds the series array of data for Highcharts
   * @private
   */
  generateSeriesData(dataPoints) {
    return dataPoints.reduce((res, dataPoint) => {
      const countryId = dataPoint["country.label.id"];
      const geographyId = dataPoint["geography.label.id"];
      const surveyId = dataPoint["survey.label.id"];

      return [
        ...res,
        {
          name: this.generateSeriesName(countryId, geographyId, surveyId),
          data: dataPoint.values.reduce((tot, item) => {
            return [...tot, item.value]
          }, [])
        }
      ]
    }, [])
  }

  /**
   * Generate the Pie chart from an API response
   * returns the object necessary to send to Highcharts.
   * @private
   */
  generatePieChart(res) {
    const inputs = res.queryInput;
    const characteristicGroups = res.results[0].values;
    const indicator = Utility.getStringById(inputs.indicators[0]["label.id"]);
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
            //showInLegend: true
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
    //plotOptions: this.generatePlotOptions(precision),
  }

  /**
   * Generate the Over Time chart from an API response
   * returns the object necessary to send to Highcharts.
   * @private
   */
  generateOverTimeChart(res) {
    const inputs = res.queryInput;
    const characteristicGroups = res.results[0].values;
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
    }
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
    }
  }

  /**
   * Gather data from the server and render
   */
  data(query) {
    // Gather options from chart inputs
    const selectedSurveys = query['surveyCountries'].split(',');
    const selectedIndicator = query['indicators'];
    const selectedCharacteristicGroup = query['characteristicGroups'];
    const overTime = query['overTime']=='true';
    const chartType = query['chartType'];

    const opts = {
      "survey": selectedSurveys,
      "indicator": selectedIndicator,
      "characteristicGroup": selectedCharacteristicGroup,
      "overTime": overTime,
    }

    return new Promise((resolve, reject) => {
        Network.get("datalab/data", opts).then(res => {

          if (overTime) { // Overtime series option selected
            this.option_obj = this.generateOverTimeChart(res);
          } else if (chartType === 'pie') { // Pie chart type option selected
            this.option_obj = this.generatePieChart(res);
          } else { // Everything else
            this.option_obj = this.generateChart(res);
          }

          this.chart_obj = Highcharts.chart('chart-container', this.option_obj);
          if (sessionStorage.getItem('switch.bw')==='true')
            this.chart_obj.update(Highchart_theme.gray());

          Combo.filter();
          Validation.checkOverTime();
          Validation.checkBlackAndWhite();
          Validation.checkPie();
          Validation.checkCharting();
          resolve();
        });
    })
  }

  /**
   * Load data via redirect to a full url with query
   */
  loadData() {
    const selectedSurveys = Selectors.getSelectedCountryRounds();
    const selectedIndicator = Selectors.getSelectedValue('select-indicator-group');
    const selectedCharacteristicGroup = Selectors.getSelectedValue('select-characteristic-group');
    const overTime = $('#dataset_overtime')[0].checked;
    const chartType = Selectors.getSelectedChartType();
    const url_root = window.location.href.split('?')[0];
    const url = url_root + '?surveyCountries=' + selectedSurveys.join(',') + '&indicators=' + selectedIndicator + '&characteristicGroups=' + selectedCharacteristicGroup + '&chartType=' + chartType + '&overTime=' + overTime.toString();
    window.location.href = url;
  }

  /**
   * Call to bind all the styling events in the DOM
   * so that the graph updates as they are changed
   */
  setStyleEvents() {
    $('.colorpicker').on('change', (e) => {
      if (Object.keys(this.chart_obj).length == 0) return;
      const chart_type = sessionStorage.getItem('chart-type');
      const is_bar = chart_type==="bar";
      const color_value = e.target.value;
      const color_default_black = !!color_value ? color_value : '#000';
      switch (e.target.id) {
        case 'chart-background-color':
          this.option_obj.chart.backgroundColor = !!color_value ? color_value : '#fff';
          break;
        case 'title-color':
          this.option_obj.title.style.color = color_default_black;
          break;
        case 'label-color':
          this.option_obj.chart.style.color = color_default_black;
          break;
        case 'y-axis-color':
          is_bar ? this.option_obj.xAxis.lineColor = color_default_black : this.option_obj.yAxis.lineColor = color_default_black;
          break;
        case 'x-axis-color':
          is_bar ? this.option_obj.yAxis.lineColor = color_default_black : this.option_obj.xAxis.lineColor = color_default_black;
          break;
        case 'tick-color':
          this.option_obj.xAxis.tickColor = color_default_black;
          this.option_obj.yAxis.tickColor = color_default_black;
          break;
        case 'minor-tick-color':
          this.option_obj.xAxis.minorTickColor = color_default_black;
          this.option_obj.yAxis.minorTickColor = color_default_black;
          break;
      }
      this.chart_obj.update(this.option_obj);
      this.saveChartStyle();
    });

    $('.form-control.style-input').on('blur', (e) => {
      if (Object.keys(this.chart_obj).length == 0) return;    
      const chart_type = sessionStorage.getItem('chart-type');  
      const is_bar = chart_type==="bar";
      const input_value = e.target.value;
      let num = 0;
      switch (e.target.id) {
        case 'chart-title':
          this.option_obj.title.text = input_value;
          break;
        case 'y-axis-label':
          is_bar ? this.option_obj.xAxis.title.text = input_value : this.option_obj.yAxis.title.text = input_value;
          break;
        case 'x-axis-label':
          is_bar ? this.option_obj.yAxis.title.text = input_value : this.option_obj.xAxis.title.text = input_value;
          break;
        case 'y-axis-x-position':
          num = !!input_value ? parseInt(input_value) : 0;
          is_bar ? this.option_obj.xAxis.title.x = num : this.option_obj.yAxis.title.x = num;
          break;
        case 'y-axis-y-position':
          num = !!input_value ? parseInt(input_value) : 0;
          is_bar ? this.option_obj.xAxis.title.y = num : this.option_obj.yAxis.title.y = num;
          break;
        case 'x-axis-x-position':
          num = !!input_value ? parseInt(input_value) : 0;
          is_bar ? this.option_obj.yAxis.title.x = num : this.option_obj.xAxis.title.x = num;
          break;
        case 'x-axis-y-position':
          num = !!input_value ? parseInt(input_value) : 0;
          is_bar ? this.option_obj.yAxis.title.y = num : this.option_obj.xAxis.title.y = num;
          break;
        case 'marker-size':
          this.option_obj.plotOptions.series.marker.radius = !!input_value ? parseInt(input_value) : 4;
          break;
        case 'data-label-x-position':
          this.option_obj.plotOptions.series.dataLabels.x = !!input_value ? parseInt(input_value) : 0;
          break;
        case 'data-label-y-position':
          this.option_obj.plotOptions.series.dataLabels.y = !!input_value ? parseInt(input_value) : -6;
          break;
        case 'credits-y-position':
          this.option_obj.credits.position.y = !!input_value ? parseInt(input_value) : 0;
          break;
        case 'bottom-margin-offset':
          this.option_obj.chart.marginBottom = !!input_value ? parseInt(input_value) : 115;
          break;
      }
      this.chart_obj.update(this.option_obj);
      this.saveChartStyle();
    });

    $("#dataset_black_and_white").on('change', (e) => {
      if (Object.keys(this.chart_obj).length == 0) return;

      if ($(e.target).prop('checked'))
        this.chart_obj.update(Highchart_theme.gray());
      else
        this.chart_obj.update(Highchart_theme.sunset());
      this.saveChartStyle();
    });
  }

  /**
   * Initialize the chart by calling the Initialization with
   * this chart object.
   */
  initialize() {
    Initialization.initialize(this);
  }

  /**
   * Record the custom chart styling to local storage
   */
  saveChartStyle() {
    sessionStorage.saved_style = 1;
    const styleElements = $('.chart-style-wrapper .form-control');
    styleElements.each(function(){
        const id = $(this).attr('id');
        const key = `styles.${id}`;
        const value = $(this).val();
        sessionStorage.setItem(key, value);
    });
    sessionStorage.setItem('switch.bw', $('#dataset_black_and_white').prop('checked'));
    //this.loadData();
  }
}
