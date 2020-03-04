---
title: Building a Smart Mirror - 2
eleventyExcludeFromCollections: true
---

> This is the second post in the **Building a Smart Mirror** blog series. If you haven't read the first part, you might want to → [Part 1](/posts/2020/building-a-smart-mirror-1).

In the first part, I wrote about how we got the mirror up and running - honestly the feeling of accomplishment was amazing. It was almost midnight when the mirror finally hung on the wall, so I wasn't in the exact mood of setting up the UI. I had cloned the MagicMirror repo, so running `npm start` ran just fine; it would open the MagicMirror UI which had its default widgets.

## Using MagicMirror

If a minimal setup is sufficient for you, cloning [MagicMirror](https://magicmirror.builders/) would be sufficient. Shoutout to [@MichMich](https://github.com/MichMich) for the amazing project. It is open source and has several widgets that you can add to the screen by just adding a few lines to a config file.

```shell
1. Clone the repo on the Raspberry Pi
git clone https://github.com/MichMich/MagicMirror

2. Install dependencies
cd MagicMirror/
npm install

3. Run the app
npm start
```

When you start the app, the Pi would enter full screen mode and the default screen for MagicMirror would be visible. I has a calendar, a clock, some news and a greeting widget. This is the simplest way to get a magic mirror running. A start-up service can be created so that this app loads up on every boot, if that's what is required.

To edit the screen layout you'll have to create a `config.js` file inside `/config` directory. The repository already has a `config.sample.js` which can be used to extend any required widgets. Copy the contents from `config.sample.js` and paste them to the newly created `config.js`.

```js
// Config file looks like this
var config = {
	address: 'localhost',
	port: 8080,
	ipWhitelist: ['127.0.0.1', '::ffff:127.0.0.1', '::1'],
	language: 'en',
	timeFormat: 24,
	units: 'metric',
	modules: [
		{
			module: 'alert'
		},
		{
			module: 'updatenotification',
			position: 'top_bar'
		},
		{
			module: 'clock',
			position: 'top_left'
		},
		{
			module: 'calendar',
			header: 'US Holidays',
			position: 'top_left',
			config: {
				calendars: [
					{
						symbol: 'calendar-check',
						url:
							'webcal://www.calendarlabs.com/ical-calendar/ics/76/US_Holidays.ics'
					}
				]
			}
		}
	]
};
```
