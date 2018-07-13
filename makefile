.PHONY: build serve staging production

# Local Development
build:
	middleman build
serve:
	npm install && middleman serve

# Server Management
dev:
	make build && cp env.js build/env.js && sed 's/const env = env_src\..*;/const env = env_src\.staging;/g' build/env.js && cd build/ && aws s3 sync . s3://datalab-dev.pma2020.org --profile work
staging:
	make build && cp env.js build/env.js && sed 's/const env = env_src\..*;/const env = env_src\.staging3;/g' build/env.js && cd build/ && aws s3 sync . s3://datalab-staging.pma2020.org --region eu-central-1 --profile work
production:
	make build && cp env.js build/env.js && sed 's/const env = env_src\..*;/const env = env_src\.production;/g' build/env.js && cd build/ && aws s3 sync . s3://datalab.pma2020.org --region eu-central-1 --profile work
