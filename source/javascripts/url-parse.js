/**
 * URL Parsing to initialize the chart
 * from shared or bookmarked urls, or for a
 * hard browser refresh
 */
export default class URLParse {
  /**
   * Returns the query from the window location
   * to help initialize a direct url with query params
   * correctly
   */
  static getQuery(url) {
    let pieces = url.split('?');
    if (pieces.length == 2) {
      return pieces[1];
    } else {
      return false;
    }
  }

  /**
   * Parse the query string to load state from the href URL
   */
  static parseQuery(queryString) {
    let queryArray = queryString.split('&');
    return queryArray.reduce((acc, pair) => {
      const [k, v] = pair.split('=');
      return {...acc, [k]: v };
    }, {});
  }
}
