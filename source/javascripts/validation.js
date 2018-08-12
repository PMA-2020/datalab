import Utility from './utility';
import CSV from './csv';
import Selectors from './selectors';
import Tooltips from './tooltip';

/**
 * Validate the state of various options
 * and enable/disable buttons depending on it
 */
export default class Validation {
  /**
   * Check the pie options
   */
  static checkPie() {
    const selectedIndicator = Selectors.getSelectedItem('select-indicator-group');
    const countryRounds = Selectors.getSelectedCountryRounds();
    const pieChartType = $("#chart-types").find($("#option-pie")).parent();

    if (countryRounds.length > 1) {
      pieChartType.remove();
    } else if (selectedIndicator.dataset.type && selectedIndicator.dataset.type !== 'distribution') {
      pieChartType.remove();
    } else {
      if (pieChartType.length <= 0) {
        const buttonLabel = Utility.createNode('label');
        buttonLabel.className = 'btn btn-primary';

        const pieChartInput = Utility.createNode('input');
        pieChartInput.setAttribute('type', 'radio');
        pieChartInput.setAttribute('name', 'options');
        pieChartInput.setAttribute('id', 'option-pie');
        pieChartInput.setAttribute('autocomplete', 'off');
        pieChartInput.setAttribute('checked', '');
        pieChartInput.setAttribute('data-type', 'pie');

        const pieIcon = Utility.createNode('i');
        pieIcon.className = 'fa fa-pie-chart';

        buttonLabel.append(pieChartInput);
        buttonLabel.append(pieIcon);
        $('#chart-types').append(buttonLabel);
      }
    }
  }

  /**
   * Check to see if over time option is valid
   */
  static checkOverTime() {
    const countryRounds = Selectors.getSelectedCountryRounds();
    const overTimeCheckbox = $("#dataset_overtime");

    if (countryRounds.length > 1) {
      overTimeCheckbox.prop('disabled', '');
    } else {
      overTimeCheckbox.prop('disabled', 'disabled');
      overTimeCheckbox.prop('checked', false);
    }
  }

  /**
   * Check to see if black and white is allowed
   */
  static checkBlackAndWhite() {
    const countryRounds = Selectors.getSelectedCountryRounds();
    const blackAndWhiteCheck = $("#dataset_black_and_white");
    const overTimeCheckbox = $("#dataset_overtime")[0];

    if ((countryRounds.length >= 1 && countryRounds.length < 4) &&
      overTimeCheckbox.checked == false) {
      blackAndWhiteCheck.prop('disabled', '');
      Tooltips.disableBlackAndWhite();
    } else {
      blackAndWhiteCheck.prop('disabled', 'disabled');
      blackAndWhiteCheck.prop('checked', false);
      Tooltips.enableBlackAndWhite();
    }
  }

  /**
   * Check to see if charting can run
   * Enabled or disables the button
   * and enabled or disable the tooltip indicating
   * why charting can't run when it can't.
   */
  static checkCharting() {
    const countryRounds = Selectors.getSelectedCountryRounds().length;
    const selectedIndicator = Selectors.getSelectedValue('select-indicator-group').length;
    const selectedCharacteristicGroup = Selectors.getSelectedValue('select-characteristic-group').length;
    const chartType = Selectors.getSelectedChartType();

    if (countryRounds > 0 && selectedIndicator > 0 && selectedCharacteristicGroup > 0 &&
      chartType != undefined &&
      chartType.length > 0) {
      CSV.setDownloadUrl();
      $('.submit-chart').prop('disabled', '');
      Tooltips.disableBtnSubmitChart();
      $('.reset-chart').prop('disabled', '');
      $('#download-csv').removeClass('disabled');
      Tooltips.disableBtnDownload();
    } else {
      $('.submit-chart').prop('disabled', 'disabled');
      Tooltips.enableBtnSubmitChart();
      $('.reset-chart').prop('disabled', '');
      $('#download-csv').addClass('disabled');
      Tooltips.enableBtnDownload();
    }
  }
}
