.PHONY: build serve dev dev2 staging production set-default-development-env \
set-full-development-env set-full-staging-env set-full-production-env

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

# Server Management
dev:
	make set-full-staging-env && \
	cp env.js build/env.js && \
	make build && \
	aws s3 sync build/ s3://datalab-dev.pma2020.org --profile work
dev2:
	make set-full-staging-env && \
	cp env.js build/env.js && \
	make build && \
	aws s3 sync build/ s3://datalab-dev2.pma2020.org --profile work
staging:
	make set-default-staging-env && \
	cp env.js build/env.js && \
	make build && \
	aws s3 sync build/ s3://datalab-staging.pma2020.org --region eu-central-1 --profile work
production:
	make set-full-production-env && \
	cp env.js build/env.js && \
	make build && \
	aws s3 sync build/ s3://datalab.pma2020.org --region eu-central-1 --profile work
