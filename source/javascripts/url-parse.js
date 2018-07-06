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
  static getQuery() {
    let pieces = window.location.href.split('?');
    if (pieces.length == 2) {
      return pieces[1];
    } else {
      return false;
    }
  }

  /**
   * Parse the query string to load state from the href URL
   */
  static parseQuery() {
    const queryString = this.getQuery();
    let queryArray = queryString.split('&');
    let parseResult = [];
    queryArray.forEach((query)=>{
      const _temp = query.split('=');
      parseResult[_temp[0]] = _temp[1];
    });
    return parseResult;
  }
}
