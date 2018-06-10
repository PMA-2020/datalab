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

let chart_obj = {};
let option_obj = {};

const generateTitle = inputs => {
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
  localStorage.setItem('chart-title', title);

  return {
    style: { color: Utility.getOverrideValue('title-color') },
    text: Utility.getOverrideValue('chart-title', title),
  };
};

const generateSeriesName = (countryId, geographyId, surveyId) => {
  const country = Utility.getStringById(countryId);
  const geography = Utility.getStringById(geographyId);
  const survey = Utility.getStringById(surveyId);

  return `${country} ${geography} ${survey}`
};

const generatePlotOptions = (precision) => {
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
};

const generateSubtitle = () => {
  return {
    style: { color: Utility.getOverrideValue('title-color') },
    text: "PMA2020"
  }
};

const generateCitation = partners => {
  let citation = "Performance Monitoring and Accountability 2020. Johns Hopkins University;";
  citation = [citation, ...partners];
  citation = `${citation} ${new Date().toJSON().slice(0,10)}`;

  return citation;
};

const generateCredits = (inputs) => {
  const partners = Array.from(new Set(inputs.surveys.reduce((tot, country) => {
    return [...tot, Utility.getStringById(country["partner.label.id"])];
  }, [])));

  return {
    text: generateCitation(partners),
    href: '',
    position: {
      align: 'center',
      y: Utility.getOverrideValue('credits-y-position')
    }
  }
};

const generateToolTip = (precision) => {
  return {
    xDateFormat: '%m-%Y',
    pointFormat: `{series.name}: {point.y:.${precision}f}`
  }
};

const generateOverTimeXAxis = () => {
  return {
    type: 'datetime',
    title: { text: 'Date' },
    dateTimeLabelFormats: {
      month: '%m-%Y',
      year: '%m-%Y',
      day: '%m-%Y',
    },
  }
};

const getCharacteristicGroupNames = (groups) => {
  return groups.reduce((tot, charGroup) => {
    const charGroupName = Utility.getStringById(charGroup["characteristic.label.id"]);
    return [...tot, charGroupName];
  }, []);
};

const generateXaxis = characteristicGroups => {
  return {
    categories: getCharacteristicGroupNames(characteristicGroups),
    title: {
      text: Utility.getOverrideValue("x-axis-label", ""),
      x: Utility.getOverrideValue('x-axis-x-position'),
      y: Utility.getOverrideValue('x-axis-y-position')
    },
    lineColor: Utility.getOverrideValue('x-axis-color'),
    tickColor: Utility.getOverrideValue('tick-color'),
    minorTickColor: Utility.getOverrideValue('minor-tick-color'),
  }
};

const generateYaxis = indicator => {
    localStorage.setItem('chart-axis-label', indicator);

    return {
      title: {
        text: Utility.getOverrideValue("y-axis-label", indicator),
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
};

const generateExporting = () => {
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
};

const generateLegend = () => {
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
};

const generateChartSettings = () => {
    const chartType = Selectors.getSelectedChartType();
    localStorage.setItem('chart-type', chartType);

    return {
      type: chartType,
      marginBottom: Utility.getOverrideValue('bottom-margin-offset'),
      backgroundColor: Utility.getOverrideValue('chart-background-color'),
      style: {
          color: Utility.getOverrideValue('label-color')
      }
    }
};

const generatePieData = (charGroup, charGroups, dataPoints) => {
  let series = [];
  const charGroupNames = getCharacteristicGroupNames(charGroups);

  charGroupNames.forEach((charGroup) => {
    const dataPoint = dataPoints[0].values[charGroupNames.indexOf(charGroup)];
    series.push({ name: charGroup, y: dataPoint.value });
  });

  return [{ name: charGroup, data: series }];
};

const generateOverTimeSeriesData = dataPoints => (
  dataPoints.reduce((res, dataPoint) => {
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
);

const generateSeriesData = dataPoints => (
  dataPoints.reduce((res, dataPoint) => {
    const countryId = dataPoint["country.label.id"];
    const geographyId = dataPoint["geography.label.id"];
    const surveyId = dataPoint["survey.label.id"];

    return [
      ...res,
      {
        name: generateSeriesName(countryId, geographyId, surveyId),
        data: dataPoint.values.reduce((tot, item) => {
          return [...tot, item.value]
        }, [])
      }
    ]
  }, [])
);

const generatePieChart = res => {
  const inputs = res.queryInput;
  const characteristicGroups = res.results[0].values;
  const indicator = Utility.getStringById(inputs.indicators[0]["label.id"]);
  const dataPoints = res.results;
  const precision = res.chartOptions.precision;

  return {
    chart: generateChartSettings(),
    title: generateTitle(inputs),
    subtitle: generateSubtitle(),
    series: generatePieData(
      Selectors.getSelectedValue('select-characteristic-group'),
      characteristicGroups,
      dataPoints
    ),
    credits: generateCredits(inputs),
    legend: generateLegend(),
    exporting: generateExporting(),
    plotOptions: generatePlotOptions(precision),
    tooltip: generateToolTip(precision),
  }
};

const generateOverTimeChart = res => {
  const inputs = res.queryInput;
  const characteristicGroups = res.results[0].values;
  const indicator = Utility.getStringById(inputs.indicators[0]["label.id"]);
  const dataPoints = res.results;
  const precision = res.chartOptions.precision;

  return {
    chart: generateChartSettings(),
    title: generateTitle(inputs),
    subtitle: generateSubtitle(),
    xAxis: generateOverTimeXAxis(),
    yAxis: generateYaxis(indicator),
    series: generateOverTimeSeriesData(dataPoints),
    credits: generateCredits(inputs),
    legend: generateLegend(),
    exporting: generateExporting(),
    plotOptions: generatePlotOptions(precision),
    tooltip: generateToolTip(precision),
  }
};

const generateChart = res => {
  const inputs = res.queryInput;
  const characteristicGroups = res.results[0].values;
  const indicator = Utility.getStringById(inputs.indicators[0]["label.id"]);
  const dataPoints = res.results;
  const precision = res.chartOptions.precision;

  return {
    chart: generateChartSettings(),
    title: generateTitle(inputs),
    subtitle: generateSubtitle(),
    xAxis: generateXaxis(characteristicGroups),
    yAxis: generateYaxis(indicator),
    series: generateSeriesData(dataPoints),
    credits: generateCredits(inputs),
    legend: generateLegend(),
    exporting: generateExporting(),
    plotOptions: generatePlotOptions(precision),
    tooltip: generateToolTip(precision),
  }
};

const data = (query) => {
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

    Network.get("datalab/data", opts).then(res => {

        if (overTime) { // Overtime series option selected
          option_obj = generateOverTimeChart(res);
        } else if (chartType === 'pie') { // Pie chart type option selected
          option_obj = generatePieChart(res);
        } else { // Everything else
          option_obj = generateChart(res);
        }

        chart_obj = Highcharts.chart('chart-container', option_obj);

        Combo.filter();
        Validation.checkOverTime();
        Validation.checkBlackAndWhite();
        Validation.checkPie();
        Validation.checkCharting();
        Initialization.initializeStyles();
    });
};

const loadData = () => {
  const selectedSurveys = Selectors.getSelectedCountryRounds();
  const selectedIndicator = Selectors.getSelectedValue('select-indicator-group');
  const selectedCharacteristicGroup = Selectors.getSelectedValue('select-characteristic-group');
  const overTime = $('#dataset_overtime')[0].checked;
  const chartType = Selectors.getSelectedChartType();
  const url_root = window.location.href.split('?')[0];
  const url = url_root + '?surveyCountries=' + selectedSurveys.join(',') + '&indicators=' + selectedIndicator + '&characteristicGroups=' + selectedCharacteristicGroup + '&chartType=' + chartType + '&overTime=' + overTime.toString();
  window.location.href = url;
}

const setStyleEvents = () => {
  $('.colorpicker').on('change', (e) => {
      if (Object.keys(chart_obj).length == 0) return;
      const is_bar = localStorage.getItem('chart-type')==="bar";
      const color_value = e.target.value;
      switch (e.target.id) {
          case 'chart-background-color':
              option_obj.chart.backgroundColor = color_value;
              break;
          case 'title-color':
              option_obj.title.style.color = color_value;
              break;
          case 'label-color':
              option_obj.chart.style.color = color_value;
              break;
          case 'y-axis-color':
              is_bar ? option_obj.xAxis.lineColor = color_value : option_obj.yAxis.lineColor = color_value;
              break;
          case 'x-axis-color':
              is_bar ? option_obj.yAxis.lineColor = color_value : option_obj.xAxis.lineColor = color_value;
              break;
          case 'tick-color':
              option_obj.xAxis.tickColor = color_value;
              option_obj.yAxis.tickColor = color_value;
              break;
          case 'minor-tick-color':
              option_obj.xAxis.minorTickColor = color_value;
              option_obj.yAxis.minorTickColor = color_value;
              break;
      }
      chart_obj.update(option_obj);
  });

  $('.form-control').on('blur', (e) => {
      if (Object.keys(chart_obj).length == 0) return;
      const is_bar = localStorage.getItem('chart-type')==="bar";
      const input_value = e.target.value;
      let num = 0;
      switch (e.target.id) {
          case 'chart-title':
              option_obj.title.text = input_value;
              break;
          case 'y-axis-label':
              is_bar ? option_obj.xAxis.title.text = input_value : option_obj.yAxis.title.text = input_value;
              break;
          case 'x-axis-label':
              is_bar ? option_obj.yAxis.title.text = input_value : option_obj.xAxis.title.text = input_value;
              break;
          case 'y-axis-x-position':
              num = !!input_value ? parseInt(input_value) : 0;
              is_bar ? option_obj.xAxis.title.x = num : option_obj.yAxis.title.x = num;
              break;
          case 'y-axis-y-position':
              num = !!input_value ? parseInt(input_value) : 0;
              is_bar ? option_obj.xAxis.title.y = num : option_obj.yAxis.title.y = num;
              break;
          case 'x-axis-x-position':
              num = !!input_value ? parseInt(input_value) : 0;
              is_bar ? option_obj.yAxis.title.x = num : option_obj.xAxis.title.x = num;
              break;
          case 'x-axis-y-position':
              num = !!input_value ? parseInt(input_value) : 0;
              is_bar ? option_obj.yAxis.title.y = num : option_obj.xAxis.title.y = num;
              break;
          case 'marker-size':
              option_obj.plotOptions.series.marker.radius = !!input_value ? parseInt(input_value) : 4;
              break;
          case 'data-label-x-position':
              option_obj.plotOptions.series.dataLabels.x = !!input_value ? parseInt(input_value) : 0;
              break;
          case 'data-label-y-position':
              option_obj.plotOptions.series.dataLabels.y = !!input_value ? parseInt(input_value) : -6;
              break;
          case 'credits-y-position':
              option_obj.credits.position.y = !!input_value ? parseInt(input_value) : 0;
              break;
          case 'bottom-margin-offset':
              option_obj.chart.marginBottom = !!input_value ? parseInt(input_value) : 115;
              break;
      }
      chart_obj.update(option_obj);
  });

  $("#dataset_black_and_white").on('change', function() {
      if (Object.keys(chart_obj).length == 0) return;

      if ($(this).prop('checked'))
        chart_obj.update(Highchart_theme.gray());
      else
        chart_obj.update(Highchart_theme.sunset());
  });
}

const initialize = () => Initialization.initialize();
const setCSVDownloadUrl = () => CSV.setDownloadUrl();

const saveChartStyle = () => {
    const chart_style_wrapper = document.getElementsByClassName('chart-style-wrapper')[0];
    const style_DOMs = chart_style_wrapper.getElementsByClassName('form-control');
    localStorage.saved_style = 1;
    for (let i = 0; i < style_DOMs.length; i++ )
    {
        localStorage.setItem('styles.'+style_DOMs[i].id, style_DOMs[i].value);
    }
    loadData();
}

const chart = {
  initialize,
  data,
  setCSVDownloadUrl,
  loadData,
  setStyleEvents,
  saveChartStyle,
};

export default chart;
