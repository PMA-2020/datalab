import network from './network';
import utility from './utility';
import selectors from './selectors';
import validation from './validation';
import initialization from './initialization';
import csv from './csv';
import Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);

const generateTitle = inputs => {
  const characteristicGroupLabel = utility.getStringById(
    inputs.characteristicGroups[0]["label.id"]
  );
  const indicatorLabel = utility.getStringById(
    inputs.indicators[0]["label.id"]
  );
  const countries = Array.from(new Set(inputs.surveys.reduce((tot, country) => {
    return [...tot, utility.getStringById(country["country.label.id"])];
  }, []))).join(", ");

  const title = `${indicatorLabel} by ${characteristicGroupLabel} for ${countries}`;

  return {
    style: { color: utility.getOverrideValue('title-color') },
    text: title,
  };
};

const generateSeriesName = (countryId, geographyId, surveyId) => {
  const country = utility.getStringById(countryId);
  const geography = utility.getStringById(geographyId);
  const survey = utility.getStringById(surveyId);

  return `${country} ${geography} ${survey}`
};

const generatePlotOptions = () => {
  return {
    series: {
      connectNulls: true,
      marker: { radius: utility.getOverrideValue('marker-size')},
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
    style: { color: utility.getOverrideValue('title-color') },
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
    return [...tot, utility.getStringById(country["partner.label.id"])];
  }, [])));

  return {
    text: generateCitation(partners),
    href: '',
    position: {
      align: 'center',
    }
  }
};

const generateOverTimeXAxis = () => {
  return {
    type: 'datetime',
    title: {
      text: 'Date'
    }
  }
};

const getCharacteristicGroupNames = (groups) => {
  return groups.reduce((tot, charGroup) => {
    const charGroupName = utility.getStringById(charGroup["characteristic.label.id"]);
    return [...tot, charGroupName];
  }, []);
};

const generateXaxis = characteristicGroups => {
  return { categories: getCharacteristicGroupNames(characteristicGroups) }
};

const generateYaxis = indicator => {
  return {
    title: {
      text: utility.getOverrideValue("y-axis-label", indicator),
      style: { color: utility.getOverrideValue("label-color") },
      x: utility.getOverrideValue('y-axis-x-position'),
      y: utility.getOverrideValue('y-axis-y-position')
    },
    lineColor: utility.getOverrideValue('y-axis-color'),
    labels: { style: { color: utility.getOverrideValue('label-color') } },
    tickColor: utility.getOverrideValue('tick-color'),
    minorTickColor: utility.getOverrideValue('minor-tick-color')
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
  const countryRounds = selectors.getSelectedCountryRounds();

  let legendContent = {
    layout: 'vertical',
    align: 'center',
    verticalAlign: 'bottom',
    itemStyle: { color: utility.getOverrideValue('label-color'), }
  }

  if (countryRounds.length > 5) {
    legendContent['verticalAlign'] = 'top'
    legendContent['layout'] = 'vertical'
  }

  return legendContent;
};

const generateChartSettings = () => {
  const chartType = selectors.getSelectedChartType();

  return {
    type: chartType,
    marginBottom: utility.getOverrideValue('bottom-margin-offset'),
    backgroundColor: utility.getOverrideValue('chart-background-color'),
    style: { }
  }
};

const generatePieData = (charGroup, charGroups, dataPoints) => {
  let series = [];
  const charGroupNames = getCharacteristicGroupNames(charGroups);

  charGroupNames.forEach((charGroup) => {
    const dataPoint = dataPoints[0].values[charGroupNames.indexOf(charGroup)];
    const precision = dataPoint["precision"];
    const value = parseFloat(dataPoint.value.toFixed(precision));
    series.push({ name: charGroup, y: value });
  });

  return [{ name: charGroup, data: series }];
};

const generateOverTimeSeriesData = dataPoints => (
  dataPoints.reduce((res, dataPoint) => {
    const characteristicGroupId = dataPoint["characteristic.label.id"];

    return [
      ...res,
      {
        name: utility.getStringById(characteristicGroupId),
        data: dataPoint.values.reduce((tot, item) => {
          const precision = item["precision"];
          const value = parseFloat(item.value.toFixed(precision));
          const utcDate = utility.parseDate(item["survey.date"]);

          return [...tot, [utcDate, value]];
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
    const precision = dataPoint["precision"];

    return [
      ...res,
      {
        name: generateSeriesName(countryId, geographyId, surveyId),
        data: dataPoint.values.reduce((tot, item) => {
          const precision = item["precision"];
          const value = parseFloat(item.value.toFixed(precision));


          return [...tot, value]
        }, [])
      }
    ]
  }, [])
);

const generatePieChart = res => {
  const inputs = res.queryInput;
  const characteristicGroups = res.results[0].values;
  const indicator = utility.getStringById(inputs.indicators[0]["label.id"]);
  const dataPoints = res.results;

  return {
    chart: generateChartSettings(),
    title: generateTitle(inputs),
    subtitle: generateSubtitle(),
    series: generatePieData(
      selectors.getSelectedValue('select-characteristic-group'),
      characteristicGroups,
      dataPoints
    ),
    credits: generateCredits(inputs),
    legend: generateLegend(),
    exporting: generateExporting(),
    plotOptions: generatePlotOptions(),
  }
};

const generateOverTimeChart = res => {
  const inputs = res.queryInput;
  const characteristicGroups = res.results[0].values;
  const indicator = utility.getStringById(inputs.indicators[0]["label.id"]);
  const dataPoints = res.results;

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
    plotOptions: generatePlotOptions(),
  }
};

const generateChart = res => {
  const inputs = res.queryInput;
  const characteristicGroups = res.results[0].values;
  const indicator = utility.getStringById(inputs.indicators[0]["label.id"]);
  const dataPoints = res.results;

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
    plotOptions: generatePlotOptions(),
  }
};

const data = () => {
  // Gather options from chart inputs
  const selectedSurveys = selectors.getSelectedCountryRounds();
  const selectedIndicator = selectors.getSelectedValue('select-indicator-group');
  const selectedCharacteristicGroup = selectors.getSelectedValue('select-characteristic-group');
  const overTime = $('#dataset_overtime')[0].checked;
  const chartType = selectors.getSelectedChartType();

  const opts = {
    "survey": selectedSurveys,
    "indicator": selectedIndicator,
    "characteristicGroup": selectedCharacteristicGroup,
    "overTime": overTime,
  }

  network.get("datalab/data", opts).then(res => {
    let chartData = {};

    if (overTime) { // Overtime series option selected
      chartData = generateOverTimeChart(res);
    } else if (chartType === 'pie') { // Pie chart type option selected
      chartData = generatePieChart(res);
    } else { // Everything else
      chartData = generateChart(res);
    }

    Highcharts.chart('chart-container', chartData);
  });
};

const initialize = () => initialization.initialize();
const setCSVDownloadUrl = () => csv.setDownloadUrl();

const chart = {
  initialize,
  data,
  setCSVDownloadUrl,
};

export default chart;
