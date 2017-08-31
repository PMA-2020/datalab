# Datalab Client Applicattion
PMA2020 Datalab client

## Setup

To get the application setup just:

- Clone the repository
- Run `npm install` to get dependencies
- Run `bundle install` to get Middleman/Ruby dependencies

## Development

During development we are using Webpack to manage assets including Javascript and CSS files.
Normally you would have to run a webpack server along side things but this is abstracted away
via Middleman.

To run a development server just use the command:
`middleman server`

## Building and Deploying

The Datalab Client uses Amazon S3 for its hosting since it is just static content.

When you are ready to deploy a new version run these steps:

- `middleman build` - generates static assets to the `build/` directory
- Copy the static assets to the Amazon S3 Bucket
