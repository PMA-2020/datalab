import 'bootstrap';
import 'bootstrap-select';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-select/dist/css/bootstrap-select.css';
import 'font-awesome/css/font-awesome.css';
// import chart_helper from './chart_helper';

import chart from './chart';
import interaction from './interaction';

$(function() {
  chart.initialize();

  $("#select-all").click(() => { interaction.selectAll(); });
  $("#select-latest").click(() => { interaction.selectLatest(); });
  $("#clear-all").click(() => { interaction.clear(); });
  $("#closeCountryRoundModal").click(() => { interaction.closeModal(); });
  $("#finishCountryRoundModal").click(() => {
    interaction.finishModal();
    chart.surveyCombo();
  });
  $("#select-indicator-group").change(() => { chart.indicatorCombo(); });
  $("#select-characteristic-group").change(() => { chart.characteristicGroupCombo(); });

  $("#submit-chart-filters").click(() => {
    chart.data();
  });
});
