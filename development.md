## Dev Documentation

This guide gives a brief breakdown of how the charting app works.

### Initialization

The first step once the charting app is loaded from S3 is to initialize the chart with data. 

The `network` module sends a request to the
[init](https://github.com/PMA-2020/pma-api#application-initialization-v1datalabinit)
endpoint then runs through the functions in the `chart` module to intialize the
Language, Indicators, Characteristic Groups, and Survey Rounds.

You will know this is successful once the inputs load data.

Some other things that will happen in the background are things including the
`strings` portion of the response will be stored into localstorage for later
use.

### Selecting inputs

The inputs are reactive based on what the user has selected previously on the
chart GUI. For example when a user selects a Indicator a request to the
[combo](https://github.com/PMA-2020/pma-api#query-for-valid-combinations-of-key-resources-v1datalabcombos)
endpoint is fired off.

Once this request is returned the values in the other respetive inputs will be
filtered down to only show what has datapoints in respect to that selected
input.

The user can also clear some of the inputs at will which will send another request to revalidate the other inputs.

One unique input is the Country Round selector which stores the currently
selected country rounds in localstorage so that a user can cancel a change and
we can revert it back to their previously selected inputs.


### Charting

Once all inputs have been filled out the user can choose to chart the data or download a CSV.

In the case of charting the data a request is made to the
[data](https://github.com/PMA-2020/pma-api#querying-application-specific-data-v1datalabdata)
endpoint which is then processed by the Javascript in the `chart` module and
rendered via Highcharts.

In the case of CSV download being selected the users browser will download a
server side generated CSV by adding the `format=csv` query parameter to the
data endpoing.
