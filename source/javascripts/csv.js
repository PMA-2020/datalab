import network from './network';
import utility from './utility';

const setDownloadUrl = () => {
  const selectedSurveys = utility.getSelectedCountryRounds();
  const selectedIndicator = utility.getSelectedValue('select-indicator-group');
  const selectedCharacteristicGroup = utility.getSelectedValue('select-characteristic-group');
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

const csv = {
  setDownloadUrl,
};

export default csv;
