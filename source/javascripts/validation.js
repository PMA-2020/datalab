import chart from './chart';
import utility from './utility';

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
};

export default validation;
