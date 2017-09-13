function filterData(dataSet, type, value) {
  if (type == 'CountryDateRound') {
    var items = dataSet.filter(function(hsh) {
      return hsh['Country'] === value.country && hsh['Round'] === value.round && hsh['Date'] === value.year
    });
  } else {
    var items = dataSet.filter(function(hsh) {
      return hsh[type] === value;
    });
  };
  return items
};
function dataIntersection(arrays) {
  var result = arrays.shift().filter(function(v) {
    return arrays.every(function(a) {
      return a.indexOf(v) !== -1;
    });
  });
  return result;
};
function select(item, key) {
  var result = [];
  if (isArray(item) == true) {
    item.forEach(function(row) {
      result.push(row[key]);
    });
  }
  return result;
}
function uniq(array) {
  return array.filter(function(i,x,a){return x==a.indexOf(i);});
};
function addRow(data, category, countryRound) {
  var keys = Object.keys(data[0]);
  var tmpItem = {};
  // null out everything
  keys.forEach(function(key) { tmpItem[key] = null; });
  tmpItem['Country'] = countryRound.split("|")[0];
  tmpItem['Round'] = countryRound.split("|")[1];
  tmpItem['Date'] = countryRound.split("|")[2];
  tmpItem['Category'] = category;
  data.push(tmpItem);
};
function syncDataSets(data) {
  var sets = {};
  data.forEach(function(row) {
    var key = row['Country'] + "|" + row['Round'] + "|" + row['Date'];
    if (sets[key] == null) {
      sets[key] = [row['Category']];
    } else {
      var items = sets[key];
      items.push(row['Category']);
      sets[key] = items;
    }
  });
  var allValues  = uniq($.map(sets, function(v) { return v; }));

  Object.keys(sets).forEach(function(countryRound) {
    allValues.forEach(function(category) {
      if (sets[countryRound].indexOf(category) == -1) {
        addRow(data, category, countryRound);
      }
    });
  });

  return data;
};
function reduceDataSet(data, filters, filterType) {
  var result = [];
  if (isArray(filters) == true) {
    filters.forEach(function(filter) {
      result.push(filterData(data, filterType, filter));
    })
  } else {
    result.push(filterData(data, filterType, filters));
  }
  result = [].concat.apply([], result);
  return result;
};
function scopeDataSet(data, scope, countries) {
  var scopedData = {};

  if(scope == 'OverTime') {
    var countries = selectedData().countries;
    scope = 'Category';
    countries.forEach(function(country) { scopedData[country] = {}; });
    data.forEach(function(row) {
      appendToHash(scopedData[row['Country']], row[scope], row);
    });
  } else {
    data.forEach(function(row) {
      appendToHash(scopedData, row[scope], row);
    });
  }
  return scopedData;
};
function reduceDataBasedOnSelection() {
  var countryDateRounds = selectedData().countryYearRounds;
  var grouping = selectedData().disaggregator;
  var overTime = selectedData().overTime;

  var reducedDataSet;
  var syncedData;

  var countries = countryDateRounds.map(function(obj){return obj.country });
  var dates = countryDateRounds.map(function(obj){return obj.year });

  reducedDataSet = dataIntersection([
    reduceDataSet(data, countryDateRounds, 'CountryDateRound'),
    reduceDataSet(data, grouping, 'Grouping')
  ]);

  if (overTime) {
    syncedData = reducedDataSet;
  } else {
    syncedData = syncDataSets(reducedDataSet);
  }

  var dataTestResult = validateDataset(syncedData, countries);
  var validData = dataTestResult[0];
  var error = dataTestResult[1];

  if(validData) {
    var scopedData;

    if(overTime) {
      scopedData = scopeDataSet(reducedDataSet, 'OverTime', countries);
    } else if(multiSeries()) {
      scopedData = scopeDataSet(reducedDataSet, 'Category', countries);
    } else {
      scopedData = scopeDataSet(reducedDataSet, 'Country');
    }

    return scopedData;
  } else {
    alert(translate(error, labelText));
    return false;
  }
};
function generateOverTimeSeriesData() {
  var dataSet = reduceDataBasedOnSelection();
  var dates = selectedData().years;
  var countries = selectedData().countries;
  var blackAndWhite = selectedData().blackAndWhite;
  var indicator = selectedData().indicator;

  var series = [];
  var evaluatedCountries = [];
  var unassessedCountryRounds = [];
  var removedCountries = [];
  var unassessedRounds = {};
  var xAxis = [];

  dates.sort(function(a,b){ return Date.parse(a) - Date.parse(b); });

  for(var key in dataSet) {
    var countryData = dataSet[key];

    var roundIndex = 0;
    for(var countryKey in countryData) {
      var data = countryData[countryKey];
      var newRow = {};

      var countryIndex = countries.indexOf(countryData[countryKey][0]['Country']);
      if (blackAndWhite) {
        var color = blackAndWhiteValue(Object.keys(countryData).length, roundIndex);
        if (color == false) { return false }
        newRow['color'] = color;
      } else {
        newRow['color'] = colorValue(countries.length, countryIndex, roundIndex)
      }

      newRow['name'] = titleCase(key) + ' ' + translate(countryKey, labelText);
      newRow['data'] = [];

      var tmpHsh = {};

      // Gather the possible keys
      data.forEach(function(row) {
        dates.forEach(function(date) {
          if(date == row['Date']) {
            tmpHsh[date] = row[indicator];
          } else {
            if(tmpHsh[date] == null || tmpHsh[date] == undefined) {
              tmpHsh[date] = null;
            }
          }
        });
      });

      var country;
      var category;
      var round;
      var nullKeys = Object.keys(tmpHsh).filter(function(key) { return tmpHsh[key] == null });
      var nullIndexes = [];

      nullKeys.forEach(function(date) { nullIndexes.push(date); });

      data.forEach(function(row) {
        var dataElement = {};

        if(!(nullIndexes.indexOf(row['Date']) > -1)) {
          country = translate(row['Country'], labelText);
          category = row['Category'];
          round = row['Round'];

          dataElement['name'] = country + ' ' + category + ' ' + round;
          dataElement['y'] = parseFloat(checkValue(tmpHsh[row['Date']]));
          dataElement['x'] = (new Date(row['Date']+"-02")).getTime()

          newRow['data'].push(dataElement);
        } else {
          unassessedCountryRounds.push(country + ' ' + category + ' ' + round);
          removedCountries.push(country);
        }
      });

      nullIndexes.forEach(function(date) {
        var dataElement = {};

        dataElement['name'] = country + ' ' + category;
        dataElement['y'] = null;
        dataElement['x'] = (new Date(date+"-02")).getTime()

        newRow['data'].push(dataElement);
      });

      roundIndex++;
      xAxis = null;
      series.push(newRow);

      removedCountries.forEach(function(country) {
        if(countries.indexOf(country) > -1) {
          countries.splice(countries.indexOf(country), 1);
        }
        if(!(countries.indexOf(country + "*") > -1)) {
          countries.push(country + "*");
        }
      });

      evaluatedCountries = countries;
    };
  }


  // Remove Duplicate Countries
  evaluatedCountries = evaluatedCountries.filter(function(country) { return !!country });

  chartComponents = [xAxis, series, unassessedRounds, evaluatedCountries, unassessedCountryRounds];
  return chartComponents;
};
function generateMultiSeriesData() {
  var dataSet = reduceDataBasedOnSelection();
  var indicator = selectedData().indicator;
  var blackAndWhite = selectedData().blackAndWhite;
  var countries = selectedData().countries;
  var tmpHsh = {};

  var series = [];
  var evaluatedCountries = [];
  var unassessedCountryRounds = [];
  var removedCountries = [];
  var unassessedRounds = {};
  var xAxis = [];

  for(var key in dataSet) {
    var data = dataSet[key];

    data.forEach(function(row) {
      key = dateRoundLabel(row['Country'], row['Date'], row['Round']);
      appendToHash(tmpHsh, key, checkValue(row[indicator]));
    });
  };

  var countryIndex = 0;
  var roundIndex = 0;
  var totalIndex = 0;
  for(var countryDate in tmpHsh) {
    var country = keyify(countryDate.split("|")[0]);
    var lastCountry;
    if (lastCountry == null) { lastCountry = country; }
    var name  = countryDate.split("|")[1];
    var dataPoints = tmpHsh[countryDate];
    var newRow = {};

    if (country != lastCountry) {
      countryIndex++;
      roundIndex = 0;
    }

    if (blackAndWhite == true) {
      var color = blackAndWhiteValue(Object.keys(tmpHsh).length, totalIndex);
      if (color == false) { return false }
      newRow['color'] = color;
    } else {
      newRow['color'] = colorValue(countries.length, countryIndex, roundIndex);
    }

    newRow['data'] = [];
    newRow['name'] = name;
    newRow['country'] = country;

    dataPoints.forEach(function(dataPoint) {
      var dataElement = {};
      var val = checkValue(dataPoint);
      dataElement['y'] = parseFloat(val);
      newRow['data'].push(dataElement);
    });

    lastCountry = country;
    roundIndex++;
    totalIndex++;
    series.push(newRow);
  };

  var keptSeries = [];
  var removedSeries = [];
  series.forEach(function(round) {
    var nulls = isNullSeries(dataValues(round.data));
    if (nulls) {
      if (!(removedSeries.indexOf(round.country) > -1)) {
        removedSeries.push(round.country)
      }
      unassessedCountryRounds.push(round.name);
    } else {
      if (!(evaluatedCountries.indexOf(round.country) > -1)) {
        evaluatedCountries.push(round.country);
      }
      keptSeries.push(round);
    }
  });

  removedSeries.forEach(function(country) {
    if(evaluatedCountries.indexOf(country) > -1) {
      evaluatedCountries.splice(evaluatedCountries.indexOf(country), 1);
    }
  });

  removedSeries.forEach(function(country) {
    evaluatedCountries.push(country + "*");
  });

  var index = 0;
  for(var key in dataSet) {
    var hasNaN = false;
    var translatedText = translate(key, labelText);
    keptSeries.forEach(function(round) {
      if (isNaN(round['data'][index]['y'])){
        hasNaN = true;
        round['data'][index]['y'] = null;
        if (unassessedRounds[key] == null || unassessedRounds[key] == undefined) {
          unassessedRounds[key] = [];
        }
        unassessedRounds[key].push(round['name']);
      }
    });
    if (hasNaN) {
      xAxis.push(translatedText + '*');
    } else {
      xAxis.push(translatedText);
    }
    index++;
  }

  var compactedData = compactData(keptSeries, xAxis);
  series = compactedData[0];
  xAxis = compactedData[1];

  // Remove Duplicate Countries
  evaluatedCountries = evaluatedCountries.filter(function(country) { return !!country });

  chartComponents = [
    xAxis,
    series,
    unassessedRounds,
    evaluatedCountries,
    unassessedCountryRounds
  ];
  return chartComponents;
};
function generateSingleSeriesData() {
  var dataSet = reduceDataBasedOnSelection();
  var dates = selectedData().years;
  var indicator = selectedData().indicator;
  var blackAndWhite = selectedData().blackAndWhite;
  var countries = selectedData().countries;
  var tmpHsh = {};
  var series = [];
  var evaluatedCountries = [];
  var unassessedCountryRounds = [];
  var removedCountries = [];
  var unassessedRounds = {};
  var xAxis = [];
  var itemIndex = 1;

  for(var key in dataSet) {
    var data = dataSet[key];
    var newRow = {};

    newRow['data'] = [];
    newRow['name'] = dateRoundLabel(countries[0], dates[0], data[0]['Round']).split("|")[1];

    data.forEach(function(row) {
      var dataElement = {};
      xAxis.push(translate(row['Category'], labelText))
      dataElement['name'] = row['Category'];
      dataElement['y'] = parseFloat(checkValue(row[indicator]));
      newRow['data'].push(dataElement);
    });

    series.push(newRow);
  }
  itemIndex++;
  evaluatedCountries = countries;

  // Remove Duplicate Countries
  evaluatedCountries = evaluatedCountries.filter(function(country) { return !!country });

  chartComponents = [
    xAxis,
    series,
    unassessedRounds,
    evaluatedCountries,
    unassessedCountryRounds
  ];
  return chartComponents;
};
function generateSeriesData() {
  if(selectedData().overTime) { return generateOverTimeSeriesData(); }
  else if(multiSeries()) {
    return generateMultiSeriesData();
  } else { return generateSingleSeriesData(); };
};
function dateRoundLabel(country, date, round) {
  return titleCase(country) + "|" + titleCase(translate(country, labelText)) + ' ' + date.split("-")[0] + ' ' + round;
};
function generateTitle(countries, indicator, grouping) {
  var titleResult =  indicator;
  var byArticle = translate('by', labelText);
  var forArticle = translate('for', labelText);
  if (grouping != 'None') { titleResult += ' ' + byArticle + ' ' + grouping; }
  titleResult += ' ' + forArticle + ' ' + translateCountries(countries).join(', ');
  return titleResult;
};
function generateCitation(partners) {
  var citation = "Performance Monitoring and Accountability 2020. Johns Hopkins University; <br/>";
  var index = 1;
  for (partner in partners) {
    partner = partners[partner];
    citation += translate(partner+"_P", labelText) + "; ";
    if (index % 3 == 0 && index != 0) {
      citation += "<br/>";
    }
    index++;
  }
  citation += " " + new Date().toJSON().slice(0,10);
  return citation;
};
function unassessedRoundsWarning(unassessedRounds) {
  var warnings = [];
  Object.keys(unassessedRounds).forEach(function(indicator) {
    var warningString = '* ' + translate(indicator, labelText) + ' ' + translate('was not assessed in', labelText) + ': ' + unassessedRounds[indicator].map(function(countryRound){
      return translateCountryRound(countryRound, labelText);
    }).join(', ');
    warnings.push(warningString);
  });
  return warnings.join("<br/>");
};
function unassessedCountryWarnings(countryRounds, indicator, disaggregator) {
  if (countryRounds.length > 0) {
    var warning = '* ' + translate(indicator, labelText) + ' ' + translate('was not assessed in', labelText) + ':';
    var translatedCountryRounds = countryRounds.map(function(countryRound) {
      return translateCountryRound(countryRound, labelText)
    }).join(", ");
    console.log(countryRounds);
    warning = warning + ' ' + translatedCountryRounds;
    return warning;
  }
};
function chartData() {
  var citationText = generateCitation(selectedData().countries);

  if(validateFilters()) {
    var chartComponents = generateSeriesData();

    var xAxis = xAxisData(chartComponents[0]);
    var yAxis = selectedData().indicatorName;
    var seriesData = chartComponents[1];
    var roundWarnings = unassessedRoundsWarning(chartComponents[2]);
    var countryWarnings = unassessedCountryWarnings(chartComponents[4], selectedData().indicator, selectedData().disaggregator);
    var warnings = [roundWarnings, countryWarnings].join("<br/>");

    var title = generateTitle(
      chartComponents[3],
      selectedData().indicatorName,
      selectedData().disaggregatorName
    );

    return [
      xAxis,
      yAxis,
      title,
      selectedData().chartType,
      selectedData().disaggregator,
      seriesData,
      warnings,
      citationText,
      selectedData().overTime,
    ];
  }
};
function seriesDataLabels(overrides) {
  var dataLabelOverrides = {};
  if (!isNaN(overrides['data-label-x-position'])) {
    dataLabelOverrides['x'] = overrides['data-label-x-position'];
  }
  if (!isNaN(overrides['data-label-y-position'])) {
    dataLabelOverrides['y'] = overrides['data-label-y-position'];
  }
  return dataLabelOverrides;
};
function legendContent(lableColor, seriesCount, chartType, yOffset) {
  var legendContent = {
    itemStyle: {
      color: lableColor
    },
  }
  if (seriesCount > 5 && chartType != 'pie') {
    legendContent['align'] = 'right',
      legendContent['verticalAlign'] = 'top',
      legendContent['layout'] = 'vertical',
      legendContent['x'] = 0,
      legendContent['y'] = 40
  } else {
    legendContent['verticalAlign'] = 'bottom',
      legendContent['y'] = -yOffset
  }
  return legendContent
};
function compactData(series, xAxis, unassessedRounds) {
  var compactedSeries = [];
  var compactedXAxis = [];

  var datapointIndex = 0;
  while(datapointIndex < series[0].data.length) {
    var allNull = series.every(function(round) {
      return(round.data[datapointIndex].y === null ||
      isNaN(round.data[datapointIndex].y))
    });

    if (!allNull) {
      var roundIndex = 0;
      series.forEach(function(round) {
        var roundData = compactedSeries[roundIndex];
        if (roundData == null) { roundData = [] };

        roundData.push(round.data[datapointIndex]);
        compactedSeries[roundIndex] = roundData;

        roundIndex++;
      });
      compactedXAxis.push(xAxis[datapointIndex]);
    }

    datapointIndex++;
  }

  var roundIndex = 0;
  series.forEach(function(round) {
    var roundData = compactedSeries[roundIndex];
    round.data = roundData
    roundIndex++;
  });

  return [series, compactedXAxis];
};
function chartMargin(chartType) {
  return chartOverrides()['bottom-margin-offset'];
};
function accessedOn() { return translate('Accessed on', labelText) + ' ' + new Date() };
function generateChart() {
  var styles = chartStyles();
  var overrides = chartOverrides();

  var data = chartData() || [];
  var xAxis = data[0];
  var yAxis = data[1];
  // Override y-axis-label if necessary
  if (overrides['y-axis-label'] != "") { yAxis = overrides['y-axis-label']; }
  var title = data[2];
  // Override title if necessary
  if (overrides['chart-title'] != "") { title = overrides['chart-title']; }
  var chartType = data[3].toLowerCase();
  var seriesData = data[5];
  var warnings = data[6];
  var citationText = data[7];

  var footerText = warnings + '<br/><br/>' + citationText + '<br/><br/>' + accessedOn();

  var bottomMargin = (warnings.split("*").length * 20) + chartMargin(chartType) + 30;

  if(seriesData != false) {
    $('#chart-container').highcharts({
      plotOptions: {
        series: {
          connectNulls: true,
          marker: {
            radius: overrides['marker-size']
          },
          dataLabels: seriesDataLabels(overrides)
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
      },
      chart: {
        type: chartType,
        marginBottom: bottomMargin,
        backgroundColor: styles["chart-background-color"],
        style: {
          fontFamily: overrides['chart-font']
        }
      },
      exporting: { // specific options for the exported image
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
      },
      credits: {
        text: footerText,
        href: '',
        position: {
          align: 'center',
          y: -(bottomMargin) + overrides['credits-y-position'] + chartMargin(chartType)
        },
      },
      legend: legendContent(
        styles['label-color'],
        seriesData.length,
        chartType,
        (bottomMargin - chartMargin(chartType))
      ),
      title: {
        style: {
          color: styles['title-color']
        },
        text: title
      },
      subtitle: {
        style: {
          color: styles['title-color']
        },
        text: "PMA2020"
      },
      xAxis: xAxis,
      yAxis: {
        min: 0,
        title: {
          text: yAxis,
          style: {
            color: styles['label-color']
          },
          x: overrides['y-axis-x-position'],
          y: overrides['y-axis-y-position'],
        },
        lineColor: styles['y-axis-color'],
        lineWidth: styles['y-axis-width'],
        labels: {
          style: {
            color: styles['label-color']
          }
        },
        tickColor: styles['tick-color'],
        minorTickColor: styles['minor-tick-color']
      },
      series: seriesData
    });

    scrollToAnchor('#chart-container');
  }
};

const chart_helper = {
  filterData,
  dataIntersection,
  select,
  uniq,
  addRow,
  syncDataSets,
  reduceDataSet,
}

export default chart_helper;
