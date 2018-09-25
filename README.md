# Datalab Client Applicattion
PMA2020 Datalab client

## Setup

To get the application setup just:

- Clone the repository
- Create an `env.js` from the example at `env.js.example`
- Run `npm install` to get dependencies
- Run `bundle install` to get Middleman/Ruby dependencies

### Setting up the Environment

In order to make the app more flexible for differenet environments
(development, staging, production, etc) we utilize a `env.js` file to describe
the environment for the client application. Your actual `env.js` should never
be committed.

Currently the options are:

- `api_url`: The url you would like to use for the API. This will hard default to `http://api.pma2020.org`
- `environment`: The environment you are using
- `version`: The version # of the client application. This should be incremented using Semantic Versioning on every deploy.

## Development

During development we are using Webpack to manage assets including Javascript and CSS files.
Normally you would have to run a webpack server along side things but this is abstracted away
via Middleman.

To run a development server just use the command:
`middleman server`

## Testing
Unit Tests use Karma and Chai.

To run tests:

- Ensure node dependencies are installed with `npm install`.
- Run `npm run test:unit`.
- Karma will instruct you to open a browser to run the tests.

Snapshot tests use Selenium

- Can be run with default config using `npm test`
- See the makefile for other options

## Building and Deploying

The Datalab Client uses Amazon S3 for its hosting since it is just static content.

When you are ready to deploy a new version run these steps:

- `middleman build` - generates static assets that are uglified and minified to the `build/` directory
- Copy the static assets in the build folder to the Amazon S3 Bucket
- If the build does not automatically create an updated `env.js` in `build/`, copy/patse `env.js.example` into `build/` and change the name to `env.js`.

## Documentation

You can generate the JS documentation using:

```
npm run doc:gen
```
