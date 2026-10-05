.DEFAULT_GOAL := help
.PHONY: help setup install dev dev-lan build preview format format-check typecheck check browsers test test-browser test-webkit share-card clean
help:
	@echo 'make setup         Install locked dependencies'
	@echo 'make dev           Local development with live reload'
	@echo 'make dev-lan       Development accessible on your network'
	@echo 'make preview       Build and preview with production CSP'
	@echo 'make check         Formatting, TypeScript, distribution checks'
	@echo 'make browsers      Install Chromium and WebKit for tests'
	@echo 'make test-browser  Desktop and narrow-phone browser tests'
	@echo 'make test-webkit   iPhone Safari engine tests'
	@echo 'make share-card    Regenerate committed social images'
setup install:
	npm ci
build:
	npm run build
dev:
	npm run dev -- $(ARGS)
dev-lan:
	npm run dev:lan -- $(ARGS)
preview: build
	npm run preview -- $(ARGS)
format:
	npm run format
format-check:
	npm run format:check
typecheck:
	npx tsc --noEmit
check: format-check build
browsers:
	npx playwright install chromium webkit
test test-browser: build
	npx playwright test --project=desktop --project=phone
test-webkit: build
	WEBKIT=1 npx playwright test --project=webkit
# Vite first allows regeneration even when committed PNGs are absent.
share-card:
	npx vite build
	node scripts/build-share-card.mjs
	npm run build
clean:
	rm -rf dist test-results playwright-report
