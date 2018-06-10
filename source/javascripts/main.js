/**
 * The main JavaScript entrypoint.
 *
 * This file loads the top level dependencies,
 * initializes the chart
 * and other components via jQuery.
 */

import 'bootstrap';
import 'bootstrap-select';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-select/dist/css/bootstrap-select.css';
import 'bootstrap-colorpicker';
import 'font-awesome/css/font-awesome.css';

import chart from './chart';
import Combo from './combo';
import Interaction from './interaction';
import Validation from './validation';
import Translate from './translate';
import Definitions from './definitions';
import Tooltips from './tooltip';

// Bind on the document ready
$(function() {
  // Initialize the Tooltips and Chart
  Tooltips.initialize();
  chart.initialize();

  // Bind to run translations when the language select is changed
  $("#select-language").change((e) => (Translate.translatePage()));

  // Bind the clear button to reset everything
  $(".clear-input").click((e) => {
    const clearId = e.target.dataset.type;

    $(`.help-definition.${clearId}`).html('');
    $(`#select-${clearId}`).selectpicker('val', '');
    $(`#select-${clearId}`).value = '';
    $(`#select-${clearId}`).selectpicker('deselectAll');
    $(`#select-${clearId}`).selectpicker('refresh');

    Combo.filter();
    Validation.checkCharting();
    Validation.checkPie();
  });

  // bind for when the country round modal closes
  $("#finishCountryRoundModal").click(() => {
    Interaction.finishModal();
    Validation.checkOverTime();
    Validation.checkBlackAndWhite();
    Validation.checkCharting();
    Validation.checkPie();
    Combo.filter();
  });

  // bind for the indicator group selection
  $("#select-indicator-group").change(() => {
    Combo.filter();
    Validation.checkPie();
    Validation.checkCharting();
    Definitions.setDefinitionText();
  });

  // bind for the characteristic group selection
  $("#select-characteristic-group").change(() => {
    Combo.filter();
    Validation.checkPie();
    Validation.checkCharting();
    Definitions.setDefinitionText();
  });

  // setup color picker and styling
  $('.colorpicker').colorpicker();
  chart.setStyleEvents();

  // Additional link bindings
  $("#select-all").click(() => (Interaction.selectAll()));
  $("#select-latest").click(() => (Interaction.selectLatest()));
  $("#clear-all").click(() => (Interaction.clear()));
  $("#dataset_overtime").click(() => (Validation.checkBlackAndWhite()));
  $("#closeCountryRoundModal").click(() => (Interaction.closeModal()));
  $("#chart-types input").click(() => (Validation.checkCharting()));
  $(".submit-chart").click(() => (chart.loadData()));
  $(".reset-chart").click(() => (Interaction.resetChart()));
  $(".btn-save-style").click(() => (chart.saveChartStyle()))
});
