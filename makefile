.PHONY: build serve dev staging production set-default-development-env \
set-full-development-env set-full-staging-env set-full-production-env test \
push-dev push-dev2 push-staging push-production push-prod prod open-dev \
open-staging open-production open-prod

# Local Development
build:
	middleman build
serve:
	npm install && middleman serve
set-default-development-env:
	sed 's/const env = envSrc\..*;/const env = envSrc\.developmentWithProductionApi;/g' env.js > temp.js \
	&& mv temp.js env.js
set-default-staging-env:
	sed 's/const env = envSrc\..*;/const env = envSrc\.stagingWithProductionApi;/g' env.js > temp.js && \
	mv temp.js env.js
set-full-development-env:
	sed 's/const env = envSrc\..*;/const env = envSrc\.developmentAll;/g' env.js > temp.js \
	&& mv temp.js env.js
set-full-staging-env:
	sed 's/const env = envSrc\..*;/const env = envSrc\.stagingAll;/g' env.js \
	&& mv temp.js env.js
set-full-production-env:
	sed 's/const env = envSrc\..*;/const env = envSrc\.productionAll;/g' env.js \
	&& mv temp.js env.js

# Testing
test:
	npm run test
open-dev:
	open http://joe.local:4567/
open-staging:
	open http://datalab-staging.pma2020.org
open-production:
	open http://datalab.pma2020.org
open-prod: open-production

# Server Management
push-dev:
	make set-full-staging-env && \
	cp env.js build/env.js && \
	make build && \
	aws s3 sync build/ s3://datalab-dev.pma2020.org --profile work
push-dev2:
	make set-full-staging-env && \
	cp env.js build/env.js && \
	make build && \
	aws s3 sync build/ s3://datalab-dev2.pma2020.org --profile work
push-staging:
	make set-default-staging-env && \
	cp env.js build/env.js && \
	make build && \
	aws s3 sync build/ s3://datalab-staging.pma2020.org --region eu-central-1 --profile work
push-production:
	make set-full-production-env && \
	cp env.js build/env.js && \
	make build && \
	aws s3 sync build/ s3://datalab.pma2020.org --region eu-central-1 --profile work
push-prod: push-production
dev: push-dev
dev2: push-dev2
staging: push-staging
prod: push-production
production: push-production
