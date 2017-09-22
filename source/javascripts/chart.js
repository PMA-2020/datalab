import network from './network';
import utility from './utility';
import selectors from './selectors';
import Highcharts from 'highcharts';

/* Chart initialization */

const initializeStrings = (strings) => {
  if (typeof(Storage) !== "undefined") {
    localStorage.removeItem('pma2020Strings', strings);
    localStorage.pma2020Strings = JSON.stringify(strings);
  } else {
    console.log('Warning: Local Storage is unavailable.');
  }
};

const initializeLanguage = (languages) => {
  for(var k in languages) {
    let opt = utility.createNode('option');
    opt.value = k;
    opt.innerHTML = languages[k];
    $('#select-language').append(opt);
  }
};

const initializeCharacteristicGroups = (characteristicGroups) => {
  characteristicGroups.forEach(group => {
    const optGroupName = utility.getString(group);
    let optGroup = utility.createNode('optgroup');

    optGroup.label = optGroupName;
    optGroup.className = 'i18nable-optgroup';
    optGroup.setAttribute('data-key', group["label.id"]);

    group.characteristicGroups.forEach(characteristic => {
      let opt = utility.createNode('option');

      opt.value = characteristic.id;
      opt.className = 'i18nable';
      opt.setAttribute('data-definition-id', characteristic["definition.id"]);
      opt.setAttribute('data-label-id', characteristic["label.id"]);
      opt.setAttribute('data-key', characteristic["label.id"]);
      opt.innerHTML = utility.getString(characteristic);
      optGroup.append(opt);
    });

    $('#select-characteristic-group').append(optGroup);
  });
};

const initializeIndicators = (indicators) => {
  indicators.forEach(group => {
    const optGroupName = utility.getString(group);
    let optGroup = utility.createNode('optgroup');

    optGroup.label = optGroupName;
    optGroup.className = 'i18nable-optgroup';
    optGroup.setAttribute('data-key', group["label.id"]);

    group.indicators.forEach(indicator => {
      let opt = utility.createNode('option');

      opt.value = indicator.id;
      opt.className = 'i18nable';
      opt.setAttribute('data-definition-id', indicator["definition.id"]);
      opt.setAttribute('data-label-id', indicator["label.id"]);
      opt.setAttribute('data-key', indicator["label.id"]);
      opt.innerHTML = utility.getString(indicator);
      optGroup.append(opt);
    });

    $('#select-indicator-group').append(optGroup);
  });
};

const initializeSurveyCountries = (surveyCountries) => {
  const language = selectors.getSelectedLanguage();

  surveyCountries.forEach(country => {
    const countryName = utility.getString(country);
    let panelContainer  = utility.createNode('div');

    let panelHeading  = utility.createNode('div');
    let panelTitle  = utility.createNode('div');
    let panelLink  = utility.createNode('a');

    let panelBodyContainer  = utility.createNode('div');
    let panelBody  = utility.createNode('div');

    panelContainer.className = 'panel panel-default';

    panelHeading.className = 'panel-heading';
    panelHeading.setAttribute('role', 'tab');
    panelHeading.id = countryName;

    panelTitle.className = 'panel-title';

    panelLink.href = `#collapse${country["label.id"]}`
    panelLink.setAttribute('role', 'button');
    panelLink.setAttribute('data-toggle', 'collapse');
    panelLink.setAttribute('data-parent', '#accordion');
    panelLink.innerHTML = countryName;

    panelTitle.append(panelLink);
    panelHeading.append(panelTitle);
    panelContainer.append(panelHeading);

    panelBodyContainer.id = `collapse${country["label.id"]}`;
    panelBodyContainer.className = 'panel-collapse collapse';

    panelBody.className = 'panel-body';

    country.geographies.forEach(geography => {
      const geographyName = utility.getString(geography);

      let listHeader = utility.createNode('h4');

      listHeader.innerHTML = geographyName;

      panelBody.append(listHeader);

      geography.surveys.forEach(survey => {
        const surveyName = utility.getString(survey);
        const surveyId = survey["id"];

        let listItem  = utility.createNode('div');
        let surveyInput = utility.createNode('input');

        surveyInput.type = 'checkbox';
        surveyInput.name = surveyId;
        surveyInput.value = surveyId;
        surveyInput.id = surveyId;

        let surveyInputLabel = utility.createNode('label');

        surveyInputLabel.htmlFor = surveyId;
        surveyInputLabel.innerHTML = surveyName;

        listItem.append(surveyInput);
        listItem.append(surveyInputLabel);
        panelBody.append(listItem);
      });
    });

    panelBodyContainer.append(panelBody);
    panelContainer.append(panelBodyContainer);

    $('#countryRoundModal .modal-body').append(panelContainer);
  });
};

/* Chart interctions */

const setCSVDownloadUrl = () => {
  const selectedSurveys = selectors.getSelectedCountryRounds();
  const selectedIndicator = selectors.getSelectedValue('select-indicator-group');
  const selectedCharacteristicGroup = selectors.getSelectedValue('select-characteristic-group');
  const overTime = $('#dataset_overtime')[0].checked;

  const opts = {
    "survey": selectedSurveys,
    "indicator": selectedIndicator,
    "characteristicGroup": selectedCharacteristicGroup,
    "overTime": overTime,
    "format": "csv",
  }

  const url = network.buildUrl("datalab/data", opts);
  const csvDownloadLink = $("#download-csv");
  csvDownloadLink.attr("href", url);
};

const setOptionsDisabled = (type, availableValues) => {
  if (availableValues) {
    const availableItems = $(`#select-${type}-group option`);

    availableItems.each(item => {
      const itemDomElement = availableItems[item];
      if (!availableValues.includes(itemDomElement.value)) { itemDomElement.disabled = true; }
      else { itemDomElement.disabled = false; }
    });
  }
};

/* Chart building */

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
    align: 'right',
    verticalAlign: 'middle'
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
  const chartType = selectors.getSelectedChartType();

  return {
    chart: { type: chartType },
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
  const chartType = selectors.getSelectedChartType();

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
  const chartType = selectors.getSelectedChartType();

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

const surveyCombo = () => {
  const opts = { survey: selectors.getSelectedCountryRounds() }
  handleCombos(opts);
};

const indicatorCombo = () => {
  const opts = { indicator: selectors.getSelectedValue('select-indicator-group') }
  handleCombos(opts);
};

const characteristicGroupCombo = () => {
  const opts = { characteristicGroup: selectors.getSelectedValue('select-characteristic-group') }
  handleCombos(opts);
};

const initialize = () => {
  network.get("datalab/init").then(res => {
    initializeStrings(res.strings);
    initializeLanguage(res.languages);
    initializeCharacteristicGroups(res.characteristicGroupCategories);
    initializeIndicators(res.indicatorCategories);
    initializeSurveyCountries(res.surveyCountries);

    $('.selectpicker').selectpicker('refresh');
  });
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

const handleCombos = (opts) => {
  network.get("datalab/combos", opts).then(res => {
    setOptionsDisabled('characteristic', res['characteristicGroup.id']);
    setOptionsDisabled('indicator', res['indicator.id']);

    $('.selectpicker').selectpicker('refresh');
  });
};

const chart = {
  initialize,
  data,
  setCSVDownloadUrl,
  surveyCombo,
  indicatorCombo,
  characteristicGroupCombo,
};

export default chart;
