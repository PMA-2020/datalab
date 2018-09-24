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
import 'driver.js/dist/driver.min.css';

import Chart from './chart';
import Combo from './combo';
import Interaction from './interaction';
import Validation from './validation';
import Translate from './translate';
import Definitions from './definitions';
import Tooltips from './tooltip';
import Network from './network';
import Driver from 'driver.js/dist/driver.min.js';

// Bind on the document ready
$(function() {
  // Initialize the Tooltips and Chart
  const network = new Network();
  const combo = new Combo(network);
  const validation = new Validation(network);
  const chart = new Chart(network, combo, validation);
  Tooltips.initialize();
  chart.initialize();

  // Bind to run translations when the language select is changed
  $("#select-language").change((e) => {
    if (e.target.value==="en") {
      $('#submit-chart span').css('font-size', '18px');
    } else {
      $('#submit-chart span').css('font-size', '16px');
    }
    Translate.translatePage();
  });

  // Bind the clear button to reset everything
  $(".clear-input").click((e) => {
    const clearId = e.target.dataset.type;

    $(`.help-definition.${clearId}`).html('');
    $(`#select-${clearId}`).selectpicker('val', '');
    $(`#select-${clearId}`).value = '';
    $(`#select-${clearId}`).selectpicker('deselectAll');
    $(`#select-${clearId}`).selectpicker('refresh');

    combo.filter();
    validation.checkCharting();
    validation.checkPie();
  });

  // bind for when the country round modal closes
  $("#finishCountryRoundModal").click(() => {
    Interaction.finishModal();
    validation.checkOverTime();
    validation.checkBlackAndWhite();
    validation.checkCharting();
    validation.checkPie();
    combo.filter();
  });

  // bind for the indicator group selection
  $("#select-indicator-group").change(() => {
    Combo.checkRestriction();
    Combo.filter();
    Validation.checkPie();
    Validation.checkCharting();
    Definitions.setDefinitionText();
  });

  // bind for the characteristic group selection
  $("#select-characteristic-group").change(() => {
    combo.filter();
    validation.checkPie();
    validation.checkCharting();
    Definitions.setDefinitionText();
  });

  // setup color picker and styling
  $('.colorpicker').colorpicker();
  chart.setStyleEvents();

  // Additional link bindings
  $("#select-all").click(() => (Interaction.selectAll()));
  $("#select-latest").click(() => (Interaction.selectLatest()));
  $("#clear-all").click(() => (Interaction.clear()));
  $("#dataset_overtime").click(() => (validation.checkBlackAndWhite()));
  $("#closeCountryRoundModal").click(() => (Interaction.closeModal()));
  $("#chart-types input").click(() => (validation.checkCharting()));
  $(".submit-chart").click(() => (chart.loadData()));
  $(".reset-chart").click(() => (Interaction.resetChart(chart)));
  $(".chart-style-wrapper .form-group .col-lg-6 label").click(e => {
    e.preventDefault();
  });

  // Guided Tour
  $(".btn-guided-tour").click(function() {
      $('#tab-controls a').click();
      const driver = new Driver();
      const guidedSteps = Tooltips.guideSteps();
      driver.defineSteps(guidedSteps);
      driver.start();
  });

});
