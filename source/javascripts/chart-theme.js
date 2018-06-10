/**
 * Theme objects for black and white and color displays
 */
export default class ChartTheme {
  /**
   * returns colors and styling for grayscale display
   */
  static gray() {
    return {
      colors: ['#222', '#777', '#ccc'],
      xAxis: {
          tickColor: '#000',
          labels: {
              style: {
                  color: '#000',
              }
          },
          title: {
              style: {
                  color: '#000',
              }
          }
      },
      yAxis: {
          labels: {
              style: {
                  color: '#000',
              }
          },
          title: {
              style: {
                  color: '#000',
              }
          }
      },
      labels: {
          style: {
              color: '#000'
          }
      }
    }
  }

  /**
   * returns colors and styling for sunset style display
   */
  static sunset() {
    return {
      colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
      xAxis: {
          tickColor: '#000',
          labels: {
              style: {
                  color: '#000',
              }
          },
          title: {
              style: {
                  color: '#000',
              }
          }
      },
      yAxis: {
          labels: {
              style: {
                  color: '#000',
              }
          },
          title: {
              style: {
                  color: '#000',
              }
          }
      },
      labels: {
          style: {
              color: '#000'
          }
      }
    }
  }
}
