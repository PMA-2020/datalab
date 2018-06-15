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

  static guideSteps() {
    const steps = [
      {
        element: '.btn-guided-tour',
        stageBackground: '#fff',   // This will override the one set in driver
        popover: {                    // There will be no popover if empty or not given
          title: 'DataLab Guide',             // Title on the popover
          description: 'Welcome to Datalab! You are moments away from visualizing PMA2020 data. Click "next" to get started.',
          position: 'right',
          showButtons: true,         // Do not show control buttons in footer
          doneBtnText: 'Done',        // Text on the last button
          closeBtnText: 'Close',      // Text on the close button
          nextBtnText: 'Next',        // Next button text
          prevBtnText: 'Previous',    // Previous button text
        }
      },
      {
        element: '#btn-choose-country-rounds',
        stageBackground: '#fff',
        popover: {
          title: 'Country Survey-Rounds',
          description: 'PMA2020 datasets are categorized by country and survey round.',
          position: 'right',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: '#select-indicator-group',
        stageBackground: '#fff',
        popover: {
          title: 'Indicators',
          description: 'Next, you probably want to select an indicator!',
          position: 'right',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      }
    ];
    return steps;
  }
}
