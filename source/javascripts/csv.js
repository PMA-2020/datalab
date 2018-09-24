import Selectors from './selectors';

/**
 * Hanlding to build CSV download link
 */
export default class CSV {
  /**
   * Sets the CSV download URL based
   * on the current selections
   */
  static setDownloadUrl(network) {
    const selectedSurveys = Selectors.getSelectedCountryRounds();
    const selectedIndicator = Selectors.getSelectedValue('select-indicator-group');
    const selectedCharacteristicGroup = Selectors.getSelectedValue('select-characteristic-group');
    const overTime = $('#dataset_overtime')[0].checked;

    const opts = {
      "survey": selectedSurveys,
      "indicator": selectedIndicator,
      "characteristicGroup": selectedCharacteristicGroup,
      "overTime": overTime,
      "format": "csv",
    };

    const url = network.buildUrl("datalab/data", opts);
    const csvDownloadLink = $("#download-csv");
    csvDownloadLink.attr("href", url);
  }
}
