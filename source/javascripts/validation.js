import chart from './chart';
import utility from './utility';
import selectors from './selectors';

const checkPie = () => {
  const countryRounds = selectors.getSelectedCountryRounds();
  const pieChartType = $("#chart-types").find($("#option-pie")).parent();

  if(countryRounds.length > 1) {
    pieChartType.remove();
  } else {
    if(pieChartType.length <= 0) {
      const buttonLabel = utility.createNode('label');
      buttonLabel.className = 'btn btn-primary';

      const pieChartInput = utility.createNode('input');
      pieChartInput.setAttribute('type', 'radio');
      pieChartInput.setAttribute('name', 'options');
      pieChartInput.setAttribute('id', 'option-pie');
      pieChartInput.setAttribute('autocomplete', 'off');
      pieChartInput.setAttribute('checked', '');
      pieChartInput.setAttribute('data-type', 'pie');

      const pieIcon = utility.createNode('i');
      pieIcon.className = 'fa fa-pie-chart';

      buttonLabel.append(pieChartInput);
      buttonLabel.append(pieIcon);
      $('#chart-types').append(buttonLabel);
    }
  }
}

const checkOverTime = () => {
  const countryRounds = selectors.getSelectedCountryRounds();
  const overTimeCheckbox = $("#dataset_overtime");

  if(countryRounds.length > 1) { overTimeCheckbox.prop('disabled', ''); }
  else {
    overTimeCheckbox.prop('disabled', 'disabled');
    overTimeCheckbox.prop('checked', false);
  }
};

const checkBlackAndWhite = () => {
  const countryRounds = selectors.getSelectedCountryRounds();
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
  const countryRounds = selectors.getSelectedCountryRounds().length;
  const selectedIndicator = selectors.getSelectedValue('select-indicator-group').length;
  const selectedCharacteristicGroup = selectors.getSelectedValue('select-characteristic-group').length;
  const chartType = selectors.getSelectedChartType();

  if(countryRounds > 0 && selectedIndicator > 0 && selectedCharacteristicGroup > 0 &&
         chartType != undefined &&
         chartType.length > 0) {
    chart.setCSVDownloadUrl();
    $('#submit-chart').prop('disabled', '');
    $('#download-csv').removeClass('disabled');
  } else {
    $('#submit-chart').prop('disabled', 'disabled');
    $('#download-csv').addClass('disabled');
  }
}

const validation = {
  checkOverTime,
  checkBlackAndWhite,
  checkCharting,
  checkPie,
};

export default validation;
