/**
 * Tooltip support throughout the app
 */
export default class Tooltips {
  /**
   * Adds the tooltip on the charting button, indicating why it can't be used
   */
  static enableBtnSubmitChart() {
    $('.tooltip-btn-chart').tooltip({
      title: 'You must select Country-Rounds of data, an indicator, an option to break the data down, and a chart type in order to generate a chart.'
    });
  }

  /**
   * Disables the tooltop on the chart button
   */
  static disableBtnSubmitChart() {
    $('.tooltip-btn-chart').tooltip('destroy');
  }

  /**
   * Enable black and white mode tooltip, indicating why black and white can't be used
   */
  static enableBlackAndWhite() {
    $('#black-and-white-checkbox-container').tooltip({
      title: 'This option is only available if the chart uses 3 or less colors.'
    });
  }

  /**
   * Disable the black and white mode tooltip
   */
  static disableBlackAndWhite() {
    $('#black-and-white-checkbox-container').tooltip('destroy');
  }

  /**
   * @private
   */
  static enablePieChart() {
    $('.tooltip-pie-chart').tooltip({
      title: 'Pie charts are available to graph indicators that present data on various parts or portions that make up a whole. For example, method mix, which shows the portion of contraceptive users by each method type, may be graphed with a pie chart.'
    });
  }

  /**
   * @private
   */
  static enableOverTime() {
    $('.overtime-wrapper').tooltip({
      title: 'To chart data overtime, select multiple rounds of data from the same country.'
    });
  }

  /**
   * Initialize all tooltips
   */
  static initialize() {
    this.enablePieChart();
    this.enableBtnSubmitChart();
    this.enableOverTime();
  }
}
