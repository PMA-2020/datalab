import Selectors from './selectors';

/**
 * Utility functions
 */
export default class Utility {
  /**
   * Creates a new node in the document
   */
  static createNode(elementName, props = {}) {  
    const element = document.createElement(elementName);
    Object.entries(props).map(([prop, value]) => {
      if (prop === 'innerHTML') {
        element.innerHTML = value;
      } else {
        element.setAttribute(prop, value);
      }
    });
    return element;
  }

  /**
   * Sets the help text definitions
   */
  static setDefinitionText() {
    const selectedIndicator = getSelectedItem('select-indicator-group');
    const selectedCharacteristicGroup = getSelectedItem('select-characteristic-group');

    $(".help-definition.indicator-group").html(Utility.getDefinition(selectedIndicator));
    $(".help-definition.characteristic-group").html(Utility.getDefinition(selectedCharacteristicGroup));
  }

  /**
   * Get override values from inputs on the style tab, or returns the fallback
   * @param {string} id - DOM ID to get the value from
   * @param {string} fallback - Fallback value to use if the id doesn't have a value
   * @return {string} override value or the fallback provided
   */
  static getOverrideValue(id, fallback) {
    let overRideValue = document.getElementById(id).value;
    if (!!sessionStorage.getItem('saved_style') && sessionStorage.getItem('saved_style') == 1) {
      overRideValue = sessionStorage.getItem('styles.'+id);
    }
    return overRideValue || fallback;
  }

  /**
   * Get label for a specific item
   */
  static getString(item) {
    const labelId = item['label.id'];
    return Utility.getStringById(labelId);
  }

  /**
   * Gets the selected language
   */
  static getSelectedLanguage() {
    $('#select-language option:selected').val();
  }

  /**
   * Get label for a specific item by id
   * Uses the strings loaded into local storage, provided by the API
   */
  static getStringById(labelId) {
    const strings = this.loadStringsFromSessionStorage();
    const lang = Utility.getSelectedLanguage();
    const string = strings[labelId];
    if (string) {
      const enString = string['en'];
      return string[lang] || enString;
    } else {
      if (labelId !== undefined) {
        console.log(`No String for "${labelId}"`);
      }
      return false;
    }
  }

  /**
   * Parses dates to Unix timestamps.
   * Expects dates to either be presented in MM-DD-YYYY form, or MM-YYYY form.
   * If the day is missing, it will be inferred to the first of the month.
   *
   * @param {string} date - a date string in either MM-YYYY or MM-DD-YYYY form.
   *
   * @returns {number} - a Unix timestamp representing the date provided.
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
  static loadStringsFromSessionStorage() {
    return JSON.parse(sessionStorage.getItem('pma2020Strings'));
  }

  /**
   * @private
   */
  static getDefinition(item) {
    const definitionId = item.dataset.definitionId;
    const itemNameId = item.dataset.labelId;

    if (definitionId && itemNameId) {
      const definition = Utility.getStringById(definitionId);
      const itemName = Utility.getStringById(itemNameId);
      return `${itemName}: ${definition}`;
    } else {
      return '';
    }
  }

  /**
   * Indicates if the client browser is an IE variant
   * @return {boolean} true if the client is IE
   */
  static isIE() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        return true;
    }

    return false;
  }
}
