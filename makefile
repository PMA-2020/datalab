.PHONY: build serve dev staging production set-default-development-env \
set-full-development-env set-full-staging-env set-full-production-env test \
push-dev push-dev2 push-staging push-production push-prod prod open-dev \
open-staging open-production open-prod test-dev test-staging test-production \
test-prod set-env

# Local Development
build:
	middleman build
serve:
	npm install && middleman serve
set-env:
	sed 's/const env = envSrc\..*;/const env = envSrc\.${CONFIG_KEY};/g' env.js > temp.js && \
	mv temp.js env.js
set-default-development-env:
	make set-env CONFIG_KEY=developmentWithProductionApi
set-default-staging-env:
	make set-env CONFIG_KEY=stagingWithProductionApi
set-full-development-env:
	make set-env CONFIG_KEY=developmentAll
set-full-staging-env:
	make set-env CONFIG_KEY=stagingAll
set-full-production-env:
	make set-env CONFIG_KEY=productionAll

# Testing
test-dev:
#	npm run test
	node ./test/index.js url=http://localhost:4567
test-staging:
#	npm run test
	node ./test/index.js url=http://datalab-staging.pma2020.org
test-production:
#	npm run test
	node ./test/index.js url=http://datalab.pma2020.org
test-prod: test-production
test: test-dev

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
