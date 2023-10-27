'use strict';

const Homey = require('homey');

class MyApp extends Homey.App {
	/**
	 * onInit is called when the app is initialized.
	 */
	async onInit() {
		this.log('MyApp has been initialized');

		this.addAction('pushover-notification', async (args) => {
			const PushoverNotifications = require('pushover-notifications');
			const { message } = args;
            let priority = '0';
			
            if (!message) {
				throw new Error(`Need to specify a message.`);
			}

			if (!priority) {
				priority = '0';
			}

			if (message == '') {
				message = '{Empty message}';
			}

			let user = Homey.env.user;
			let token = Homey.env.token;
			let payload = { priority: parseInt(priority), message: message };

			if (typeof user != 'string' || typeof token != 'string') {
				throw new Error(`Need to specify Pushover user and token in settings.`);
			}

			this.log(`Sending payload ${JSON.stringify(payload)} to Pushover.`);

			var push = new PushoverNotifications({ user: user, token: token });

			// See https://pushover.net/api for payload parameters

			push.send(payload, function (error, result) {
				if (error) {
					this.log(error.stack);
				}
			});
		});
	}

	addAction(name, fn) {
		let action = this.homey.flow.getActionCard(name);
		action.registerRunListener(fn);
	}
}

module.exports = MyApp;
