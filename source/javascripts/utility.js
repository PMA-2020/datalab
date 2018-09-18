/**
 * Utility functions
 */
export default class Utility {
  /**
   * Creates a new node in the document
   */
  static createNode(el) {  
    document.createElement(el);
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
    if (!!localStorage.getItem('saved_style') && localStorage.getItem('saved_style') == 1) {
      overRideValue = localStorage.getItem('styles.'+id);
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
    const strings = Utility.loadStringsFromLocalStorage();
    const lang = Utility.getSelectedLanguage();
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
   * TODO: Refactor to use a formal date format, or specify format used.
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
    JSON.parse(localStorage.getItem('pma2020Strings'))
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
}
