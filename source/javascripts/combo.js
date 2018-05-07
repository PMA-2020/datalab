import network from './network';
import selectors from './selectors';

const setOptionsDisabled = (type, availableValues) => {
  if (availableValues) {
    let fExistWealthComment = false;
    const availableItems = $(`#select-${type}-group option`);

    availableItems.each(item => {
      const itemDomElement = availableItems[item];
      if (!availableValues.includes(itemDomElement.value)) {
        if (['wealth_quintile', 'wealth_tertile'].includes(itemDomElement.value)) {
            const wealth_tooltip = "Burkina Faso and Niger indicators may be broken down by wealth tertile; all other countries may be broken down by wealth quintile. Please adjust your country selections.";
            itemDomElement.setAttribute('data-content', '<span title="'+wealth_tooltip+'">'+itemDomElement.text+'</span>');
            fExistWealthComment = true;
        }
        itemDomElement.selected = false;
        itemDomElement.disabled = true;
      }
      else { 
        if (['wealth_quintile', 'wealth_tertile'].includes(itemDomElement.value)) {
            itemDomElement.removeAttribute('data-content');
            fExistWealthComment = false;
        }
        itemDomElement.disabled = false; 
      }
    });
    if (type=='characteristic')
        return fExistWealthComment;
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

const removeComments = ()=> {
  const arr_commented = ['Wealth quintile', 'Wealth tertile'];
  arr_commented.forEach(element => {
    const jqObj = $("span:contains('" + element + "')");
    if (!jqObj.closest('li').hasClass('disabled'))
      jqObj.removeAttr('title');
  });
}

const handleCombos = (opts) => {
  network.get("datalab/combos", opts).then(res => {
    const fExistWealthComment = setOptionsDisabled('characteristic', res['characteristicGroup.id']);
    setOptionsDisabled('indicator', res['indicator.id']);
    setCountryRoundsDisabled(res['survey.id']);

    $('.selectpicker').selectpicker('refresh');
    if (fExistWealthComment===false) {
      removeComments();
    }

    if (opts["indicator"] === undefined) { $("#select-indicator-group").selectpicker('val', ''); }
    if (opts["characteristicGroup"] === undefined) { $("#select-characteristic-group").selectpicker('val', ''); }
  });
};

const filter = () => {
  const opts = {};

  const selectedSurvey = selectors.getSelectedCountryRounds();
  const selectedIndicator = selectors.getSelectedValue('select-indicator-group');
  const selectedCharacteristicGroup = selectors.getSelectedValue('select-characteristic-group');

  if (selectedSurvey.length > 0) { opts["survey"] = selectedSurvey; }
  if (selectedIndicator !== "") { opts["indicator"] = selectedIndicator; }
  if (selectedCharacteristicGroup !== "") { opts["characteristicGroup"] = selectedCharacteristicGroup; }

  handleCombos(opts);
};

const combo = {
  filter,
};

export default combo;
