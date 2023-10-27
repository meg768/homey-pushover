'use strict';

const Homey = require('homey');

class MyApp extends Homey.App {
	async pushover({ message, priority, token, user }) {
		const PushoverNotifications = require('pushover-notifications');

		if (priority == undefined) {
			priority = 0;
		}

		if (typeof priority == 'string') {
			priority = parseInt(priority);
		}

		if (typeof message != 'string' || message == '') {
			message = '{Empty message}';
		}

		if (user == undefined) {
			user = Homey.env.user;
		}

		if (token == undefined) {
			token = Homey.env.token;
		}

		if (typeof user != 'string' || typeof token != 'string') {
			throw new Error(`Need to specify Pushover user and token in settings.`);
		}

		let payload = { priority: priority, message: message };

		this.log(`Sending payload ${JSON.stringify(payload)} to Pushover.`);

		var push = new PushoverNotifications({ user: user, token: token });

		// See https://pushover.net/api for payload parameters

		push.send(payload, function (error, result) {
			if (error) {
				this.log(error.stack);
			}
		});
	}

	async onInit() {
		this.log('MyApp has been initialized');

		this.addAction('pushover-notification-priority-high', async (args) => {
			let { message, priority = 1 } = args;
			this.pushover({ message: message, priority: priority });
		});

		this.addAction('pushover-notification', async (args) => {
			let { message, priority = 0 } = args;
			this.pushover({ message: message, priority: priority });
		});
	}

	addAction(name, fn) {
		let action = this.homey.flow.getActionCard(name);
		action.registerRunListener(fn);
	}
}

module.exports = MyApp;
