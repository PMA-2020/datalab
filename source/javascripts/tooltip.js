import Selectors from './selectors';

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

  /**
   * Get all guide steps for the tooltips, in the correct language
   */
  static guideSteps() {
    const lang = Selectors.getSelectedLanguage();
    let arrayDescription = [];
    let arrayTitle = [];
    if (lang == 'en') {
      arrayTitle = [
        'DataLab Guide',
        'Country Survey-Rounds',
        'Indicators',
        'Characteristics',
        'Chart type & over time',
        'Chart button',
        'About charts',
        'Download the graph',
        'Definitions',
        'Styles',
        'Download a table',
        'Finish',
      ];
      arrayDescription = [
        'Welcome to DataLab!. Click "next" to get started.',
        'PMA2020 data are categorized by country and survey round. Click to select.',
        'Next, select an indicator using the drop down menu. You can select only one indicator at a time.',
        'You may want to disaggregate an indicator by specific characteristics. To do this, select the "break data down by" menu. If options are greyed out, it means that the option is not valid for either the indicator or country(s) that you selected. If you do not wish to disaggregate the indicator, select "None"',
        'Select a chart type. If you have multiple survey rounds selected, you can also enable the "Over Time" option to see trends over time.',
        "Now you're ready to chart!",
        "After charting, you can hover over bars or lines to see more information. You can select different country survey rounds to show or hide them from the chart by going back to the “Choose Country-Rounds” menu.",
        "You can also select the triple-line (also called 'hamburger' icon) to print or save the chart.",
        'Select the "Definitions" tab to see technical definitions for indicators or disaggregation options.',
        'Select the "Styles" tab for options to style your chart. (You can choose colors, labels, etc.)',
        'If you want to download a table of data from your chart, you can do so using the button with the download icon.',
        "That's it! We hope you enjoy using Datalab. If you ever need anything, you can always reach out to us here.",
      ];
    } else {
      arrayTitle = [
        'Guide du DataLab',
        'Vagues d’enquête des pays',
        'Indicateurs',
        'Caractéristiques',
        'Type de diagramme & dans le temps',
        'Diagramme',
        'À propos des diagrammes',
        'Télécharger le graphique',
        'Définitions',
        'Styles',
        'Télécharger l’ensemble des données',
        'Fin',
      ];
      arrayDescription = [
        'Bienvenue au Datalab! Vous êtes sur le point de visualiser les données de PMA2020. Cliquez sur « suivant » pour démarrer.',
        'Les ensembles de données de PMA2020 sont catégorisés par pays et par vague d’enquête.',
        'Ensuite, vous aurez probablement envie de sélectionner un indicateur!',
        'Vous aurez peut-être aussi besoin de désagréger les données. Sélectionnez et ouvrez « Désagréger les données par » dans le menu. Si des options sont en gris, cela signifie que cette option en particulier n’est pas valable pour l’indicateur ou le pays que vous avez sélectionné. Si vous ne souhaitez pas désagréger les données, sélectionnez « Aucune ».',
        'Sélectionnez le type de diagramme. Si vous avez sélectionné plusieurs vagues d’enquête, vous pouvez aussi activer l’option « Dans le temps » pour voir différentes manières de visualiser les données dans le temps.',
        "Vous n’avez plus qu’à créer votre diagramme!",
        "Après avoir créé votre diagramme, vous pouvez faire passer votre souris au-dessus des barres ou des lignes pour voir plus d’informations. Vous pouvez aussi sélectionner différentes vagues d’enquête de pays pour les afficher ou les retirer du diagramme.",
        "Vous pouvez aussi sélectionner la triple ligne (appelée icône 'hamburger') pour imprimer ou sauvegarder le diagramme.",
        'Sélectionnez l’onglet « Définitions » pour lire les définitions techniques des indicateurs ou les options de désagrégation.',
        'Sélectionnez l’onglet « Styles » pour avoir une gamme d’options et styliser votre diagramme.',
        'Si vous souhaitez télécharger un ensemble de données complet, cliquez sur l’icône de téléchargement.',
        "Et voilà ! Nous espérons que vous apprécierez votre utilisation du Datalab. Si vous avez besoin de quoique ce soit, vous pouvez toujours nous joindre ici.",
      ];
    }
    const steps = [
      {
        element: '.btn-guided-tour',
        stageBackground: '#fff', // This will override the one set in driver
        popover: {
          title: arrayTitle[0], // Title on the popover
          description: arrayDescription[0],
          position: 'top',
          showButtons: true, // Do not show control buttons in footer
          doneBtnText: 'Done', // Text on the last button
          closeBtnText: 'Close', // Text on the close button
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        }
      },
      {
        element: '#btn-choose-country-rounds',
        stageBackground: '#fff',
        popover: {
          title: arrayTitle[1],
          description: arrayDescription[1],
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
          title: arrayTitle[2],
          description: arrayDescription[2],
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
          title: arrayTitle[3],
          description: arrayDescription[3],
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
          title: arrayTitle[4],
          description: arrayDescription[4],
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
          title: arrayTitle[5],
          description: arrayDescription[5],
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
          title: arrayTitle[6],
          description: arrayDescription[6],
          position: 'bottom',
          showButtons: true,
          doneBtnText: 'Done',
          closeBtnText: 'Close',
          nextBtnText: 'Next',
          prevBtnText: 'Previous',
        },
      },
      {
        element: '.highcharts-contextbutton', // 'section.chart-viewport',
        stageBackground: '#ffffff50',
        popover: {
          title: arrayTitle[7],
          description: arrayDescription[7],
          position: 'left',
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
          title: arrayTitle[8],
          description: arrayDescription[8],
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
          title: arrayTitle[9],
          description: arrayDescription[9],
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
          title: arrayTitle[10],
          description: arrayDescription[10],
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
          title: arrayTitle[11],
          description: arrayDescription[11],
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
