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
   * Enable the tooltop on the pie chart button
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
   * Enable the tooltop on the download button
   */
  static enableBtnDownload() {
    $('#download-csv-wrapper').tooltip({
      title: 'Use this button to download data. To use it, you must first select 1+ Country-Rounds, an indicator, and an option to break data the data down by.'
    });
  }

  /**
   * Disable the tooltop on the download button
   */
  static disableBtnDownload() {
    $('#download-csv-wrapper').tooltip('destroy');
  }

  /**
   * Initialize all tooltips
   */
  static initialize() {
    this.enablePieChart();
    this.enableBtnSubmitChart();
    this.enableOverTime();
    this.enableBtnDownload();
  }

  static guideSteps() {
    const steps = [
      {
        element: '.btn-guided-tour',
        stageBackground: '#fff',   // This will override the one set in driver
        popover: {                    // There will be no popover if empty or not given
          title: 'DataLab Guide',             // Title on the popover
          description: 'Welcome to DataLab!. Click "next" to get started.',
          position: 'top',
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
          description: 'PMA2020 data are categorized by country and survey round. Click to select.',
          position: 'right',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: '#select-indicator-group-wrapper',
        stageBackground: '#fff',
        popover: {
          title: 'Indicators',
          description: 'Next, select an indicator using the drop down menu. You can select only one indicator at a time.',
          position: 'right',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: '#select-characteristic-group-wrapper',
        stageBackground: '#fff',
        popover: {
          title: 'Characteristics',
          description: 'You may want to disaggregate an indicator by specific characteristics. To do this, select the "break data down by" menu. If options are greyed out, it means that the option is not valid for either the indicator or country(s) that you selected. If you do not wish to disaggregate the indicator, select "None"',
          position: 'right',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: '#chart-type-wrapper',
        stageBackground: '#fff',
        popover: {
          title: 'Chart type & over time',
          description: 'Select a chart type. If you have multiple survey rounds selected, you can also enable the "Over Time" option to see trends over time.',
          position: 'right',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: '#submit-chart-wrapper',
        stageBackground: '#fff',
        popover: {
          title: 'Chart button',
          description: "Now you're ready to chart!",
          position: 'right',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: '#chart-container',
        stageBackground: '#fff',
        popover: {
          title: 'About the graph',
          description: "After charting, you can hover over bars or lines to see more information. You can select different country survey rounds to show or hide them from the chart by going back to the “Choose Country-Rounds” menu.",
          position: 'bottom',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: 'section.chart-viewport',
        stageBackground: '#fff',
        popover: {
          title: 'Download the graph',
          description: "You can also select the triple-line (also called 'hamburger' icon) to print or save the chart.",
          position: 'bottom',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: '#tab-definitions',
        stageBackground: '#fff',
        popover: {
          title: 'Definitions',
          description: 'Select the "Definitions" tab to see technical definitions for indicators or disaggregation options.',
          position: 'right',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: '#tab-style',
        stageBackground: '#fff',
        popover: {
          title: 'Styles',
          description: 'Select the "Styles" tab for options to style your chart. (You can choose colors, labels, etc.)',
          position: 'right',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: '#download-csv-wrapper',
        stageBackground: '#fff',
        popover: {
          title: 'Download a table',
          description: 'If you want to download a table of data from your chart, you can do so using the button with the download icon.',
          position: 'right',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: '#header-link-contact-us',
        stageBackground: '#fff',
        popover: {
          title: 'Finish',
          description: "That's it! We hope you enjoy using DataLab. If you have a question, reach out to us here.",
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
