import utility from './utility';

function validateFilters() {
  var chartType = getInput('chart_types');
  var selectedDates = getSelectedYearRounds();
  var selectedCountries = getCountries();

  disablePieOption(selectedCountries, selectedDates);
  toggleOverTimeOption(selectedDates, selectedCountries);
  toggleBlackAndWhiteOption(getSelectedCountryYearRounds());
  disableUnavailableFilters();

  return chartable(selectedDates);
};

function validateDataset(dataSet, countries) {
   var tmpHsh = {};

   countries.forEach(function(country) {
     tmpHsh[country] = [];
   });

   dataSet.forEach(function(row) {
     tmpHsh[row['Country']].push(row['Category']);
   });

   countries.forEach(function(country) {
     var uniqueTmpHshItems = [];
     var items = tmpHsh[country];

     $.each(items, function(i, el){
       if($.inArray(el, uniqueTmpHshItems) === -1) uniqueTmpHshItems.push(el);
     });

     tmpHsh[country] = uniqueTmpHshItems;
   });

   var tmpArr = [];
   countries.forEach(function(country) {
     tmpArr.push(tmpHsh[country].length);
   });

  var uniqueLength = [];
  $.each(tmpArr, function(i, el){
    if($.inArray(el, uniqueLength) === -1) uniqueLength.push(el);
  });

  return [true, null]
}

function disablePieOption(countries, dates) {
  var pieOption = $("#dataset_chart_types").find($('#option-pie')).parent();
  var disablePieForCountry = false;
  var disablePieForDate = false;

  // Add or remove pie option based on country
  if(countries.length > 1) { disablePieForCountry = true; }
  // Add or remove pie option based on country
  if(dates.length > 1) { disablePieForDate = true; }

  if(disablePieForCountry || disablePieForDate) {
    pieOption.remove();
  } else {
    if(pieOption.length <= 0) {
      $('#dataset_chart_types')
            .append($("<label></label>")
              .attr("class", "btn btn-primary")
              .append($("<input />")
                .attr("type", "radio")
                .attr("name", "options")
                .attr("id", "option-pie")
                .attr("autocomplete", "off")
                .attr("checked", "")
                .data("type", "pie"))
              .append($("<i></i>")
                .attr("class", "fa fa-pie-chart")));

    }
  }
};

function disableUnavailableFilters() {
  var selectedIndicator = getSelectedItemValue('indicators');
  var selectedGrouping = getSelectedItemValue('disaggregators');

  var groupFilterInput = getInput('disaggregators');
  var indicatorFilterInput = getInput('indicators');

  var unavailableIndicatorFilters = unavailableFilters[selectedIndicator];
  var unavailableGroupingFilters = unavailableFilters[selectedGrouping];

  enableFilters(groupFilterInput);
  enableFilters(indicatorFilterInput);

  if(unavailableIndicatorFilters) {
    disableFilters(unavailableIndicatorFilters, groupFilterInput);
  }
  if(unavailableGroupingFilters) {
    disableFilters(unavailableGroupingFilters, indicatorFilterInput);
  }

  $('.selectpicker').selectpicker('refresh');
};

function enableFilters(input) {
  input.find('option').each(function() {
    $(this).prop('disabled', '');
  });
};

function disableFilters(filters, input) {
  if(filters.length > 0) {
    filters.forEach(function(filter) {
      input.find("option[value='" + filter + "']").prop('disabled', 'disabled');
    });
  }
};

const checkOverTime = () => {
  const countryRounds = utility.getSelectedCountryRounds();
  const overTimeCheckbox = $("#dataset_overtime");

  if(countryRounds.length > 1) { overTimeCheckbox.prop('disabled', ''); }
  else {
    overTimeCheckbox.prop('disabled', 'disabled');
    overTimeCheckbox.prop('checked', false);
  }
};

const checkBlackAndWhite = () => {
  const countryRounds = utility.getSelectedCountryRounds();
  const blackAndWhiteCheck = $("#dataset_black_and_white");
  const overTimeCheckbox = $("#dataset_overtime")[0];

  if((countryRounds.length >= 1 && countryRounds.length < 3) &&
      overTimeCheckbox.checked == false) {
    blackAndWhiteCheck.prop('disabled', '');
  }
  else {
    blackAndWhiteCheck.prop('disabled', 'disabled');
    blackAndWhiteCheck.prop('checked', false);
  }
}


const checkCharting = () => {
  const countryRounds = utility.getSelectedCountryRounds().length;
  const selectedIndicator = utility.getSelectedValue('select-indicator-group').length;
  const selectedCharacteristicGroup = utility.getSelectedValue('select-characteristic-group').length;
  const chartType = utility.getSelectedChartType();

  if(countryRounds > 0 && selectedIndicator > 0 && selectedCharacteristicGroup > 0 &&
         chartType != undefined &&
         chartType.length > 0) {
    $('#submit-chart').prop('disabled', '');
    $('#download-csv').prop('disabled', '');
  } else {
    $('#submit-chart').prop('disabled', 'disabled');
    $('#download-csv').prop('disabled', 'disabled');
  }
}

const validation = {
  checkOverTime,
  checkBlackAndWhite,
  checkCharting,
};

export default validation;
