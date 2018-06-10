import Selectors from './selectors';

/**
 * Utility functions
 */
export default class Utility {
  /**
   * Creates a new node in the document
   */
  static createNode(el) {
    return document.createElement(el);
  }

  /**
   * Sets the help text definitions
   */
  static setDefinitionText() {
    const selectedIndicator = getSelectedItem('select-indicator-group');
    const selectedCharacteristicGroup = getSelectedItem('select-characteristic-group');

    $(".help-definition.indicator-group").html(this.getDefinition(selectedIndicator));
    $(".help-definition.characteristic-group").html(this.getDefinition(selectedCharacteristicGroup));
  }

  /**
   * Get override values
   */
  static getOverrideValue(id, fallback) {
    let overRideValue = document.getElementById(id).value;
    if (!!localStorage.saved_style && localStorage.saved_style==1)
        overRideValue = localStorage.getItem('styles.'+id);
    return overRideValue || fallback;
  }

  /**
   * Get label for a specific item
   */
  static getString(item) {
    const labelId = item['label.id'];
    return this.getStringById(labelId);
  }

  /**
   * Get label for a specific item by id
   */
  static getStringById(labelId) {
    const strings = this.loadStringsFromLocalStorage();
    const lang = Selectors.getSelectedLanguage();
    const string = strings[labelId];
    if (string) {
      const enString = string['en'];
      return string[lang] || enString;
    } else {
      if (labelId !== undefined) { console.log(`No String for "${labelId}"`) }
      return false;
    }
  }

  /**
   * Parse date values
   */
  static parseDate(date) {
    const splitDate = date.split("-");
    if (splitDate.length === 2) {
      return new Date(splitDate[1], splitDate[0] - 1, 1).getTime();
    } else {
      return new Date(date).getTime();
    }
  }

  /**
   * @private
   */
  static loadStringsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('pma2020Strings'));
  }

  /**
   * @private
   */
  static getDefinition(item) {
    const definitionId = item.dataset.definitionId;
    const itemNameId = item.dataset.labelId;

    if (definitionId && itemNameId) {
      const definition = this.getStringById(definitionId);
      const itemName = this.getStringById(itemNameId);
      return `${itemName}: ${definition}`;
    } else {
      return '';
    }
  }
}
