import Selectors from './selectors';

/**
 * Encapsulate interactions within the app
 */
export default class Interaction {
  /**
   * Select all rounds that are visible (collapsed in) within the modal
   */
  static selectAll() {
    $('#countryRoundModal .collapse.in input[type=checkbox]').prop('checked', true);
  }

  /**
   * Select the latest rounds that are visible (collapsed in) within the modal
   */
  static selectLatest() {
    $('#countryRoundModal .collapse input[type=checkbox]').prop('checked', false);
    $("#countryRoundModal .collapse.in .country-round.latest").prop('checked', true);
  }

  /**
   * clear selected rounds across all countries
   */
  static clear() {
    $('#countryRoundModal .collapse input[type=checkbox]').prop('checked', false);
  }

  /**
   * Closes the country round modal, storing what was selected
   */
  static closeModal() {
    const previouslySelectedCountryRounds = localStorage.getItem('selectedCountryRounds').split(",");
    this.clear();
    previouslySelectedCountryRounds.forEach(countryRound => {
      $(`#countryRoundModal .collapse.in input[value=${countryRound}]`).prop('checked', true);
    });
  }

  /**
   * Finish the modal selection
   */
  static finishModal() {
    if (typeof(Storage) !== "undefined") {
      localStorage.removeItem('selectedCountryRounds');
      localStorage.selectedCountryRounds = Selectors.getSelectedCountryRounds();
    } else {
      console.log('Warning: Local Storage is unavailable.');
    }
  }

  /**
   * Clear the chart and re-initialize
   */
  static resetChart(chart) {
    $(".chart-style-wrapper").find("input[type=text], textarea").val("");
    chart.initialize();
  }
}
