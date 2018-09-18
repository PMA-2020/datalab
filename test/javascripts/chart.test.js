import * as $ from 'jquery';
import chai, { expect } from 'chai';
import spies from 'chai-spies';

chai.use(spies);

import Chart from '../../source/javascripts/chart';
import Utility from '../../source/javascripts/utility';

describe('generateCitation', () => {
  it('should handle no partners', () => {
    const chart = new Chart();
    chai.spy.on(chart, 'generateDate', () => '2018-01-01');
    const citation = chart.generateCitation();
    expect(citation).equal("Performance Monitoring and Accountability 2020. Johns Hopkins University; 2018-01-01");
  });

  it('should handle any one or more partners', () => {
    const chart = new Chart();
    chai.spy.on(chart, 'generateDate', () => '2018-01-01');
    const citation = chart.generateCitation(['Jane Doe']);
    expect(citation).to.equal("Performance Monitoring and Accountability 2020. Johns Hopkins University;,Jane Doe 2018-01-01");
    const citation2 = chart.generateCitation(['Jane Doe', 'John Smith']);
    expect(citation2).to.equal("Performance Monitoring and Accountability 2020. Johns Hopkins University;,Jane Doe,John Smith 2018-01-01"); 
  });
});

describe('generateCredits', () => {
  afterEach(() => {
    chai.spy.restore(Utility);
  });

  it('should handle not have duplicate partners', () => {
    const chart = new Chart();
    chai.spy.on(chart, 'generateCitation', partners => `${partners}`);
    const inputs = {
      surveys: [{
        'partner.label.id': 'Jane Doe',
      }, {
        'partner.label.id': 'Jane Doe'
      }]
    };
    chai.spy.on(Utility, 'getStringById', labelId => labelId);
    chai.spy.on(Utility, 'getOverrideValue', (id, fallback) => '');
    const credits = chart.generateCredits(inputs);
    expect(credits.text).to.equal('Jane Doe');
  });
});

describe('generateTitle', () => {
  afterEach(() => {
    chai.spy.restore(Utility);
  });

  it('generate titles correctly', () => {
    const inputs = {
      characteristicGroups: [{
        'label.id': 'some metric'
      }],
      indicators: [{
        'label.id': 'some indicator'
      }],
      surveys: [{
        'country.label.id': 'Kenya'
      }]
    };
    chai.spy.on(Utility, 'getStringById', labelId => labelId);
    chai.spy.on(Utility, 'getOverrideValue', (id, fallback) => {
      if (id === 'title-color') {
        return 'red';
      } else {
        return fallback;
      }
    });
    const chart = new Chart();
    const title = chart.generateTitle(inputs);
    const expected = {
      style: { color: 'red' },
      text: 'some indicator by some metric for Kenya'
    };
    expect(title).to.deep.equal(expected);
  });
});

describe('generateSeriesName', () => {
  afterEach(() => {
    chai.spy.restore(Utility);
  });

  it('returns a string of country, geography, and survey, separated by spaces', () => {
    const country = 'Kenya';
    const geography = 'Mountain';
    const survey = 'Example';
    chai.spy.on(Utility, 'getStringById', labelId => labelId);
    const chart = new Chart();
    const seriesName = chart.generateSeriesName(country, geography, survey);
    expect(seriesName).to.equal('Kenya Mountain Example');
  });
});


describe('generateOverTimeSeriesData', () => {
  after(() => {
    chai.spy.restore(Utility);
  });

  before(() => {
    chai.spy.on(Utility, 'getStringById', labelId => labelId);
    chai.spy.on(Utility, 'parseDate', date => date);
  });

  it('should return an empty array if no data is passed in', () => {
    const chart = new Chart();
    const timeSeries = chart.generateOverTimeSeriesData([]);
    expect(timeSeries).to.deep.equal([]);
  });

  it('should return an array of objects containing a name:String and a data:Array', () => {
    const chart = new Chart();
    const data = [{
      'characteristic.label.id': 'data label',
      values: [{
        'survey.date': '2018-01-01',
        value: 1
      }]
    }];
    const expected = [{name: 'data label', data: [['2018-01-01', 1]]}];
    const timeSeries = chart.generateOverTimeSeriesData(data);
    expect(timeSeries).to.deep.equal(expected);
  });
});

describe('generateSeriesData', () => {
  after(() => {
    chai.spy.restore(Utility);
  });

  before(() => {
    chai.spy.on(Utility, 'getStringById', labelId => labelId);
  });

  it('should return an empty array if no data is passed in', () => {
    const chart = new Chart();
    const series = chart.generateSeriesData([]);
    expect(series).to.deep.equal([]);
  });

  it('should return an array of objects containing a name:String and data:Array', () => {
    const chart = new Chart();
    const data = [{
      'country.label.id': 'Kenya',
      'geography.label.id': 'Mountain',
      'survey.label.id': 'Example',
      values: [{value: 0}, {value: 1}, {value: 2}]
    }];
    const expected = [{
      name: 'Kenya Mountain Example',
      data: [0, 1, 2]
    }];
    const series = chart.generateSeriesData(data);
    expect(series).to.deep.equal(expected);
  });
});
