import network from './network';
import utility from './utility';
import initialization from './initialization';
import csv from './csv';
import Highcharts from 'highcharts';

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

  return { text: title };
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
      marker: { radius: 2 }, // add override when available
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
    style: {
      color: '#000' // styles['title-color']
    },
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
      text: indicator
    }
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
  return {
    layout: 'vertical',
    align: 'center',
    verticalAlign: 'bottom'
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
  const chartType = utility.getSelectedChartType();

  return {
    chart: { type: chartType },
    title: generateTitle(inputs),
    subtitle: generateSubtitle(),
    series: generatePieData(
      utility.getSelectedValue('select-characteristic-group'),
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
  const chartType = utility.getSelectedChartType();

  return {
    chart: { type: chartType },
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
  const chartType = utility.getSelectedChartType();

  return {
    chart: { type: chartType },
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
  const selectedSurveys = utility.getSelectedCountryRounds();
  const selectedIndicator = utility.getSelectedValue('select-indicator-group');
  const selectedCharacteristicGroup = utility.getSelectedValue('select-characteristic-group');
  const overTime = $('#dataset_overtime')[0].checked;
  const chartType = utility.getSelectedChartType();

  const opts = {
    "survey": selectedSurveys,
    "indicator": selectedIndicator,
    "characteristicGroup": selectedCharacteristicGroup,
    "overTime": overTime,
  }

  network.get("datalab/data", opts).then(res => {
    let chartData = {};

    if (overTime) {
      chartData = generateOverTimeChart(res);
    } else if (chartType === 'pie') {
      chartData = generatePieChart(res);
    } else {
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
