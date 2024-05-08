# Create Deriv V2

This template was generated using `create-deriv-v2`

## Getting started

To run the development server:

```bash
npm run dev
```

To generate a build:

```bash
npm run build
```

## Deploying to Cloudflare Pages

In order to generate a deployment to Cloudflare Pages, ensure that the following secrets are set in the Github Actions:

```bash
CLOUDFLARE_ACCOUNT_ID=****
CLOUDFLARE_API_TOKEN=****
CLOUDFLARE_PROJECT_NAME=****
```

## Generating a test link preview to Cloudflare Pages

In order to generate a test link deployment to Cloudflare Pages, ensure that the following secrets are set in the Github Actions:

```bash
CLOUDFLARE_ACCOUNT_ID=****
CLOUDFLARE_TEST_LINK_TOKEN=****
CLOUDFLARE_PROJECT_NAME=****
```

## Notifications to Slack

To allow notifications to be sent to Slack whenever a new staging build is triggered, ensure that the following secrets are set in the Github Actions:

```bash
SLACK_WEBHOOK=***
```
