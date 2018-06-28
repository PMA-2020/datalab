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
        element: '#select-indicator-group-wrapper',
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
      },
      {
        element: '#select-characteristic-group-wrapper',
        stageBackground: '#fff',
        popover: {
          title: 'Characteristics',
          description: 'You may also want to disaggregate the data. To do this, select and open the "break data down by" menu. If options are greyed out, it means that the particular option is not valid for either the indicator or country(s) that you selected. If you do not wish to disaggregate, select "None".',
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
          description: 'Select a chart type. If you have multiple survey rounds selected, you can also enable the "Over Time" option to see a different way of visualizing the data over time.',
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
          title: 'About the graph 1',
          description: "After charting, you can hover over bars or lines to see more information. You can also select different country survey rounds to show or hide them from the chart.",
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
          title: 'About the graph 2',
          description: "You can also select the triple-line (also called 'hamburger' icon) to print or save the chart.",
          position: 'right',
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
          description: 'Select the "Styles" tab for a wealth of options for styling your chart.',
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
          title: 'Dataset download',
          description: 'If you want to download a whole dataset, you can do so using the button with the download icon.',
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
          description: "That's it! We hope you enjoy using datalab. If you ever need anything, you can always reach out to us here.",
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
