import chai, { expect } from 'chai';

import URLParse from '../../source/javascripts/url-parse';

describe('getQuery', () => {
  it('should return false if a URL does not include a query', () => {
    const url = 'https://www.example.org';
    const queryString = URLParse.getQuery(url);
    expect(queryString).to.equal(false);
  });

  it('should return a query string if the URL contains one', () => {
    const url = 'https://www.example.org/?foo=bar';
    const queryString = URLParse.getQuery(url);
    expect(queryString).to.equal('foo=bar');
  });
});

describe('parseQuery', () => {
  it('should return an object containing a single key-value pair when there is one query param', () => {
    const queryString = 'foo=bar';
    const queryPairs = URLParse.parseQuery(queryString);
    expect(queryPairs).to.deep.equal({'foo': 'bar'});
  });

  it('should return multiple key-value pairs when there are multiple query params', () => {
    const queryString = 'foo=1&bar=2';
    const queryPairs = URLParse.parseQuery(queryString);
    expect(queryPairs).to.deep.equal({'foo': '1', 'bar': '2'});
  });
});
