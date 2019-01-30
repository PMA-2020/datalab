.PHONY: build serve dev staging production set-default-development-env \
set-full-development-env set-full-staging-env set-full-production-env test \
push-dev push-staging push-production push-prod prod open-dev \
open-staging open-production open-prod test-dev test-staging test-production \
test-prod set-env choices-prompt push-staging_prod-like-env \
push-staging_full-staging-env staging_prod-like-env staging_full-staging-env \
set-stagingWithProductionApi set-stagingWithStagingApi dev prod production \
push-staging2 staging2 open-local open-staging2

# Local Development
build:
	middleman build
serve:
	npm install; middleman serve
set-env:
	sed 's/const env = envSrc\..*;/const env = envSrc\.${CONFIG_KEY};/g' \
	  env.js > temp.js;
	mv temp.js env.js
set-default-development-env:
	make set-env CONFIG_KEY=developmentWithProductionApi

set-full-development-env:
	make set-env CONFIG_KEY=developmentAll
set-full-staging-env:
	make set-env CONFIG_KEY=stagingAll
set-full-production-env:
	make set-env CONFIG_KEY=productionAll
set-stagingWithProductionApi:
	make set-env CONFIG_KEY=stagingWithProductionApi
set-stagingWithStagingApi:
	make set-env CONFIG_KEY=stagingWithStagingApi
set-default-staging-env: set-stagingWithProductionApi
set-full-staging-env: set-stagingWithStagingApi

# Testing
test-unit:
	npm run test:unit
test-selenium:
	npm run test:selenium
test-dev:
	echo INSTRUCTIONS; \
	echo 1. Karma tests; \
	printf "Currently, the first command (Karma unit tests) do not close \
	  automatically. After the tests run and you get SUCCESS, you should \
	  terminate manually (e.g. cmd+c)."; \
	echo https://github.com/karma-runner/karma/issues/24; \
	echo ; \
	echo 2. Selenium tests; \
	echo Make sure the server is running first.; \
	npm run test:unit; \
	node ./test/index.js url=http://localhost:4567
test-staging:
	node ./test/index.js url=http://datalab-staging.pma2020.org
test-production:
	node ./test/index.js url=http://datalab.pma2020.org
test-prod: test-production
test: test-dev

open-local:
	open http://joe.local:4567/
open-dev:
	open http://datalab-dev.pma2020.org
open-staging:
	open http://datalab-staging.pma2020.org
open-staging2:
	open http://datalab-staging2.pma2020.org
open-production:
	open http://datalab.pma2020.org
open-prod: open-production

# Server Management
push-staging-static:
	cp env.js build/env.js; \
	make build
choices-prompt:
	@echo
	@echo Please select one of the following choices:
push-staging: choices-prompt
	@printf "  1. 'make push-dev': http://datalab-dev.pma2020.org (same as 2, \
	just different url)"
	@printf "\n  2. 'make push-staging_full-staging-env': \
	http://datalab-staging.pma2020.org (same as 1, just different url)"
	@printf "\n  3. 'make push-staging_prod-like-env': \
	http://datalab-staging2.pma2020.org"
	@echo
	@echo
push-dev: set-stagingWithStagingApi push-staging-static
	aws s3 sync build/ s3://datalab-dev.pma2020.org \
	  --region eu-central-1 --profile work
	@echo Pushed to: http://datalab-dev.pma2020.org
push-staging_full-staging-env: set-stagingWithStagingApi push-staging-static
	aws s3 sync build/ s3://datalab-staging.pma2020.org \
	  --region eu-central-1 --profile work
	@echo Pushed to: http://datalab-staging.pma2020.org
push-staging_prod-like-env: set-stagingWithProductionApi push-staging-static
	aws s3 sync build/ s3://datalab-staging2.pma2020.org \
	  --region eu-central-1 --profile work
	@echo Pushed to: http://datalab-staging2.pma2020.org
staging_prod-like-env: set-stagingWithProductionApi push-staging-static
staging_full-staging-env: set-stagingWithStagingApi push-staging-static
push-production:
	make set-full-production-env; \
	cp env.js build/env.js; \
	make build; \
	aws s3 sync build/ s3://datalab.pma2020.org \
	  --region eu-central-1 --profile work
push-prod: push-production
staging: push-staging
push-staging2: push-staging_prod-like-env
staging2: push-staging2
dev: push-dev
prod: push-production
production: push-production
