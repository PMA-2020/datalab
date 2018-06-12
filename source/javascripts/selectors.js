/**
 * Helpers to select common items, usually by ID
 */
export default class Selectors {

  /**
   * Gets the selected language
   */
  static getSelectedLanguage() {
    return $('#select-language option:selected').val();
  }

  /**
   * Gets the value of the element with id
   */
  static getSelectedValue(id) {
    return this.getSelectedItem(id).value;
  }

  /**
   * Gets the text of the element with id
   */
  static getSelectedText(id) {
    return this.getSelectedItem(id).text;
  }

  /**
   * Gets the selected chart type
   */
  static getSelectedChartType() {
    return $("#chart-types label.active input").data("type");
  }

  /**
   * Gets a selected item from a select box identified by the id param
   */
  static getSelectedItem(id) {
    const el = document.getElementById(id);
    const selectedVal = el.options[el.selectedIndex];

    return selectedVal;
  }

  /**
   * Gets the country rounds from the modal
   */
  static getSelectedCountryRounds() {
    const countries = [];
    const checkboxes = $("#countryRoundModal input[type=checkbox]:checked");

    checkboxes.map(checkbox => {
      countries.push(checkboxes[checkbox].value);
    });

    return countries;
  }
}
