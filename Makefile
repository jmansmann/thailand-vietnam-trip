.PHONY: help serve test verify

help: ## List available targets
	@grep -E '^[a-z]+:.*##' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "%-10s %s\n", $$1, $$2}'

serve: ## Preview at http://localhost:8000
	python3 -m http.server 8000

test: ## Run data integrity tests
	node --test

verify: ## Syntax-check JavaScript and run tests
	node --check assets/js/app.js && node --check data/trip.js && node --test
