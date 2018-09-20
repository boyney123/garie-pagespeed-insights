![reports](./screenshots/garie-pagespeed-insights-logo.png 'Reports')

<p align="center">
  <p align="center">Tool to gather pagespeed-insights metrics and supports CRON jobs and webhooks.<p>
  <p align="center"><a href="https://travis-ci.org/boyney123/garie-pagespeed-insights"><img src="https://img.shields.io/travis/boyney123/garie-pagespeed-insights/master.svg" alt="Build Status"></a>
    <a href="https://codecov.io/gh/boyney123/garie-pagespeed-insights/"><img src="https://codecov.io/gh/boyney123/garie-pagespeed-insights/branch/master/graph/badge.svg?token=AoXW3EFgMP" alt="Codecov"></a>
	<a href="https://github.com/boyney123/garie"><img src="https://img.shields.io/badge/plugin%20built%20for-garie-blue.svg" alt="garie"></a>  
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT"></a>

  </p>
</p>

**Highlights**

-   Poll for page-speed-insights performance metrics on any website and stores the data into InfluxDB
-   Webhook support
-   Get page weight data
-   View all historic reports.
-   Setup within minutes

## Overview of garie-pagespeed-insights

garie-pagespeed-insights was developed as a plugin for the [Garie](https://github.com/boyney123/garie) Architecture.

[Garie](https://github.com/boyney123/garie) is an out the box web performance toolkit, and `garie-pagespeed-insights` is a plugin that generates and stores page-speed-insights data into `InfluxDB`.

`garie-pagespeed-insights` can also be run outside the `Garie` environment and run as standalone.

If your interested in an out the box solution that supports multiple performance tools like `page-speed-insights`, `google-speed-insight` and `lighthouse` then checkout [Garie](https://github.com/boyney123/garie).

If you want to run `garie-pagespeed-insights` standalone you can find out how below.

## Getting Started

### Prerequisites

-   Docker installed

### Running garie-pagespeed-insights

You can get setup with the basics in a few minutes.

First clone the repo.

```sh
git clone git@github.com:boyney123/garie-pagespeed-insights.git
```

Next setup you're config. Edit the `config.json` and add websites to the list.

```javascript
{
	"cron": "00 00 */6 * * *",
	"urls": [
		{
			"url": "https://www.comparethemarket.com"
		},
		{
			"url": "https://www.bbc.co.uk"
		},
		{
			"url": "https://www.cnn.com"
		}
	]
}
```

Once you finished edited your config, lets build our docker image and setup our environment.

```sh
docker build -t garie-pagespeed-insights . && docker-compose up
```

This will build your copy of `garie-pagespeed-insights` and run the application.

On start garie-pagespeed-insights will start to gather performance metrics for the websites added to the `config.json`.

## Webhook

garie-pagespeed-insights also supports webhooks. You will need to `POST` to `localhost:3000/collect`.

**Payload**

| Property | Type                | Description             |
| -------- | ------------------- | ----------------------- |
| `url`    | `string` (required) | Url to get metrics for. |

**Payload Example**

```javascript
{
  "url": "https://www.bbc.co.uk"
}
```

## config.json

| Property | Type                | Description                                                                          |
| -------- | ------------------- | ------------------------------------------------------------------------------------ |
| `cron`   | `string` (optional) | Cron timer. Supports syntax can be found [here].(https://www.npmjs.com/package/cron) |
| `urls`   | `object` (required) | Config for pagespeed-insights. More detail below                                     |

**urls object**

| Property | Type                | Description                                |
| -------- | ------------------- | ------------------------------------------ |
| `url`    | `string` (required) | Url to get pagespeed-insights metrics for. |
