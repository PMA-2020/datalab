const fs = require('fs');


const readFile = (file) => {
  // noinspection JSUnresolvedFunction
  return fs.readFileSync(file, 'utf8', (err, data) => {
    if (err) throw err;
    return data;
  });
};

// Not necessary, actually. We can just check that the SVG strings match. (1)
// const md5Check = (text) => {
//   ...
// };

const checkSvgMatch = (files, cleaningFunction) => {
  let filesMatchesToCheck = [];
  for (let file of files) {
    const fileText = readFile(file);
    const cleanedFileText = cleaningFunction(fileText);
    filesMatchesToCheck.push(cleanedFileText);
    // filesMatchesToCheck.push(md5Check(cleanedFileText));  // See: (1)
  }
  return filesMatchesToCheck.reduce((x, y) => {return x === y});
};

// ----------------------------------------------------------------------------
/* TODO: @Bciar replace 'file1' and 'file2' with the files that were are comparing:
   One of the SVG files downloaded before the test, and the SVG files downloaded during the test.
   
   Also, we only have PNGs right now... I need to get a lot of SVGs for you, lol. - Joe
*/
const removeHighChartsId = (text) => {
  const matchPattern1 = /<clipPath id="highcharts-[a-zA-Z0-9]{7}-[0-9]{1,2}">/g;
  const matchPattern2 = /-[a-zA-Z0-9]{7}-[0-9]{1,2}/g;
  // const replacePattern = /-/g;
  let svgId;
  svgId = text.match(matchPattern1)[0];
  svgId = svgId.match(matchPattern2)[0];
  // svgId = svgId.replace(replacePattern, '');
  return text.replace(new RegExp(svgId, 'g'), '');
};

const checkHighchartsSvgMatch = (files) => {
  /* Checks that two highchart SVG files match.
  *
  * Args:
  *     files (Array): An array of strings of the pattern '/absolute/path/to/file.svg'.
  *
  * Returns:
  *     bool: Return result true if SVGs match, else false.
  * */
  return checkSvgMatch(files, removeHighChartsId);
};

// export default checkHighchartsSvgMatch;
module.exports = checkHighchartsSvgMatch;
