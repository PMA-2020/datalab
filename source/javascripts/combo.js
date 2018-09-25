import Selectors from './selectors';

/**
 * Filters based on the combination of options selected
 */
export default class Combo {
  /**
   * Initialization object constructor
   */
  constructor(network) {
    /**
     * The network interface object
     * @type {Network}
     */
    this.network = network;
  }
  /**
   * Apply the filter defined by the combination of selections
   */
  filter() {
    const opts = {};

    const selectedSurvey = Selectors.getSelectedCountryRounds();
    const selectedIndicator = Selectors.getSelectedValue('select-indicator-group');
    const selectedCharacteristicGroup = Selectors.getSelectedValue('select-characteristic-group');

    if (selectedSurvey.length > 0) {
      opts["survey"] = selectedSurvey;
    }
    if (selectedIndicator !== "") {
      opts["indicator"] = selectedIndicator;
    }
    if (selectedCharacteristicGroup !== "") {
      opts["characteristicGroup"] = selectedCharacteristicGroup;
    }

    this.handleCombos(opts);
  }

  /**
   * Check for combo box restrictions based on the indicator group
   */
  static checkRestriction() {
    const selectedIndicator = Selectors.getSelectedValue('select-indicator-group');
    switch (selectedIndicator) {
      case "methodmix_allw_anym":
        $("#select-characteristic-group").selectpicker('val', 'method_mix_all');
        break;
      case "methodmix_marw_anym":
        $("#select-characteristic-group").selectpicker('val', 'method_mix_all');
        break;
      case "methodmix_allw_modernm":
        $("#select-characteristic-group").selectpicker('val', 'method_mix_modern');
        break;
      case "methodmix_marw_modernm":
        $("#select-characteristic-group").selectpicker('val', 'method_mix_modern');
        break;
      case "methodmix_allw_plusnon":
        $("#select-characteristic-group").selectpicker('val', 'method_mix_non');
        break;
      case "methodmix_marw_plusnon":
        $("#select-characteristic-group").selectpicker('val', 'method_mix_non');
        break;
    }
  }

  /**
   * @private
   */
  setOptionsDisabled(type, availableValues) {
    if (availableValues) {
      let fExistWealthComment = false;
      const availableItems = $(`#select-${type}-group option`);

      availableItems.each(item => {
        const itemDomElement = availableItems[item];
        if (!availableValues.includes(itemDomElement.value)) {
          if (['wealth_quintile', 'wealth_tertile'].includes(itemDomElement.value)) {
              const wealthTooltip = "Burkina Faso and Niger indicators may be broken down by wealth tertile; all other countries may be broken down by wealth quintile. Please adjust your country selections.";
              itemDomElement.setAttribute('data-content', '<span title="'+wealthTooltip+'">'+itemDomElement.text+'</span>');
              fExistWealthComment = true;
          }
          itemDomElement.selected = false;
          itemDomElement.disabled = true;
        } else {
          if (['wealth_quintile', 'wealth_tertile'].includes(itemDomElement.value)) {
              itemDomElement.removeAttribute('data-content');
              fExistWealthComment = false;
          }
          itemDomElement.disabled = false;
        }
      });
      if (type=='characteristic') {
        return fExistWealthComment;
      }
    }
  }

  /**
   * @private
   */
  setCountryRoundsDisabled(availableValues) {
    if (availableValues) {
      const availableItems = $('.country-round');

      availableItems.each(item => {
        const itemDomElement = availableItems[item];
        if (!availableValues.includes(itemDomElement.value)) {
          itemDomElement.checked = false;
          itemDomElement.disabled = true;
        } else {
          itemDomElement.disabled = false;
        }
      });
    }
  }

  /**
   * @private
   */
  static removeComments() {
    const arrCommented = ['Wealth quintile', 'Wealth tertile'];
    arrCommented.forEach(element => {
      const jqObj = $("span:contains('" + element + "')");
      if (!jqObj.closest('li').hasClass('disabled')) {
        jqObj.removeAttr('title');
      }
    });
  }

  /**
   * @private
   */
  handleCombos(opts) {
    this.network.get("datalab/combos", opts).then(res => {
      const fExistWealthComment = this.setOptionsDisabled('characteristic', res['characteristicGroup.id']);
      const selectedCharacteristicGroup = Selectors.getSelectedValue('select-characteristic-group');
      if (selectedCharacteristicGroup !== "none") {
        this.setOptionsDisabled('indicator', res['indicator.id']);
      }
      this.setCountryRoundsDisabled(res['survey.id']);

      $('.selectpicker').selectpicker('refresh');
      if (fExistWealthComment===false) {
        this.removeComments();
      }

      if (opts["indicator"] === undefined) {
        $("#select-indicator-group").selectpicker('val', '');
      }
      if (opts["characteristicGroup"] === undefined) {
        $("#select-characteristic-group").selectpicker('val', '');
      }
    });
  }
}
