import network from './network';
import selectors from './selectors';

const setOptionsDisabled = (type, availableValues) => {
  if (availableValues) {
    const availableItems = $(`#select-${type}-group option`);

    availableItems.each(item => {
      const itemDomElement = availableItems[item];
      if (!availableValues.includes(itemDomElement.value)) {
        itemDomElement.selected = false;
        itemDomElement.disabled = true;
      }
      else { itemDomElement.disabled = false; }
    });
  }
};

const setCountryRoundsDisabled = (availableValues) => {
  if (availableValues) {
    const availableItems = $('.country-round');

    availableItems.each(item => {
      const itemDomElement = availableItems[item];
      if (!availableValues.includes(itemDomElement.value)) {
        itemDomElement.checked = false;
        itemDomElement.disabled = true;
      }
      else { itemDomElement.disabled = false; }
    });
  }
};

const handleCombos = (opts) => {
  network.get("datalab/combos", opts).then(res => {
    setOptionsDisabled('characteristic', res['characteristicGroup.id']);
    setOptionsDisabled('indicator', res['indicator.id']);
    setCountryRoundsDisabled(res['survey.id']);

    $('.selectpicker').selectpicker('refresh');
  });
};

const filter = () => {
  const opts = {};

  const selectedSurvey = selectors.getSelectedCountryRounds();
  const selectedIndicator = selectors.getSelectedValue('select-indicator-group');
  const selectedCharacteristicGroup = selectors.getSelectedValue('select-characteristic-group');

  if (selectedSurvey !== "") { opts["survey"] = selectedSurvey; }
  if (selectedIndicator !== "") { opts["indicator"] = selectedIndicator; }
  if (selectedCharacteristicGroup !== "") { opts["characteristicGroup"] = selectedCharacteristicGroup; }

  handleCombos(opts);
};

const combo = {
  filter,
};

export default combo;
