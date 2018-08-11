const fs = require('fs');
const  stringSimilarity = require('string-similarity');


const readFile = (file) => {
  /* Returns the contents of a file given a path to that file.
  
     Args:
         file (string): An path string of the pattern '/absolute/path/to/file.svg'.
  
     Returns:
       string: File text.
  */
  // noinspection JSUnresolvedFunction
  return fs.readFileSync(file, 'utf8', (err, data) => {
    if (err) throw err;
    return data;
  });
};

const checkSvgMatch = (files, cleaningFunction) => {
  /* Checks that two SVG files match.
  
     Args:
         files (array): An array of strings of the pattern '/absolute/path/to/file.svg'.
         cleaningFunction (func): A function which will 'clean' the SVGs before checking if they match.
  
     Returns:
       bool: Return result true if SVGs match, else false.
  */
  let filesMatchesToCheck = [];
  for (let file of files) {
    const fileText = readFile(file);
    const cleanedFileText = cleaningFunction(fileText);
    filesMatchesToCheck.push(cleanedFileText);
  }
  return filesMatchesToCheck.reduce((x, y) => {return x === y});
};

const removeHighChartsId = (text) => {
  /* Removes any hashed IDs from a HighCharts SVG file.
  
     Args:
         text (string): Plain text of an SVG file.
  
     Returns:
         string: New SVG text string, without IDs.
  */
  let svgId;
  const matchPattern1 = /<clipPath id="highcharts-[a-zA-Z0-9]{7}-[0-9]{1,2}">/g;
  const matchPattern2 = /-[a-zA-Z0-9]{7}-[0-9]{1,2}/g;
  svgId = text.match(matchPattern1)[0];
  svgId = svgId.match(matchPattern2)[0];
  return text.replace(new RegExp(svgId, 'g'), '');
};

const checkHighchartsSvgMatch = (files) => {
  /* Checks that two highchart SVG files match.
  
     Args:
         files (array): An array of strings of the pattern '/absolute/path/to/file.svg'.
  
     Returns:
         bool: Return result true if SVGs match, else false.
  */
  return checkSvgMatch(files, removeHighChartsId);
};

const checkHighchartsSvgSimilarity = (files) => {
  /* Checks that two highchart SVG files match.
  
     Args:
         files (array): An array of strings of the pattern '/absolute/path/to/file.svg'.
  
     Returns:
         bool: Return result true if SVGs match, else false.
  */
  let filesToCheck = [];
  for (let file of files) {
    const fileText = readFile(file);
    filesToCheck.push(fileText );
  }
  return stringSimilarity.compareTwoStrings(filesToCheck[0], filesToCheck[1]);
};

// noinspection JSUnusedGlobalSymbols
module.exports = {
  checkHighchartsSvgMatch: checkHighchartsSvgMatch,
  checkHighchartsSvgSimilarity: checkHighchartsSvgSimilarity
};
