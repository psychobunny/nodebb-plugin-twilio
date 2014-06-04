"use strict";

var plugin = {},
	meta = module.parent.require('./meta'),
	user = module.parent.require('./user'),
	nconf = module.parent.require('nconf');

function renderConfirm(req, res, next) {
	if (req.user && req.user.uid) {
		user.getUserField(req.user.uid, 'mobileNumber', function(err, mobileNumber) {
			res.render('verify', {
				"mobileNumber": mobileNumber
			});
		});
	} else {
		res.redirect('/login');
	}
}

function renderAdmin(req, res, next) {
	res.render('admin/twilio', {});
}

plugin.init = function(app, middleware, controllers) {
	app.get('/verify', middleware.buildHeader, renderConfirm);
	app.get('/api/verify', renderConfirm);

	app.get('/admin/twilio', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/twilio', renderAdmin);
};

plugin.generateCode = function(code, callback) {
	var length = parseInt(meta.config['twilio:length'], 10) > 0 ? meta.config['twilio:length'] : 4;
	callback(null, parseInt(Math.random() * Math.pow(10, length), 10));
};

plugin.redirectToConfirm = function(uid, destination, callback) {
	callback(null, uid, nconf.get('relative_path') + '/verify');
};

plugin.verifyUser = function(uid, data, callback) {
	var accountSid = meta.config['twilio:sid'],
		authToken = meta.config['twilio:token'];

	var client = require('twilio')(accountSid, authToken);

	user.getUserField(uid, 'mobileNumber', function(err, mobileNumber) {
		client.messages.create({
			body: 'Welcome to ' + data.site_title + '! Your access code is: ' + data.confirm_code,
			to: mobileNumber,
			from: meta.config['twilio:from']
		}, function(err, message) {
			if (err) {
				console.log(err, message);
			}

			if (typeof callback === 'function') {
				callback(err);
			}
		});
	});
};

plugin.addCaptcha = function(req, res, data, callback) {
	data.captcha = {
		label: 'Mobile Number (for verification)',
		html: '<input class="form-control" type="text" placeholder="Phone Number" name="mobileNumber" id="mobileNumber" />'
	}

	callback(null, req, res, data);
};

plugin.setMobileNumber = function(userData, callback) {
	callback(null, {
		mobileNumber: userData.mobileNumber
	});
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/twilio',
		icon: 'fa-mobile',
		name: 'Twilio Verification'
	});

	callback(null, header);
};

module.exports = plugin;