var net = require('net');

function SkyRemote(ip) {

	// IS IP VALID?

	function sendCommand(code, cb) {
		var commandBytes = [4,1,0,0,0,0, Math.floor(224 + (code/16)), code % 16];

		var client = net.connect({
			host: ip,
			port: 49160
		});

		var l = 12;
		client.on('data', function(data) {
			// Clear timeout
			if (data.length < 24) {
				client.write(data.slice(0, l))
				l = 1;
			} else {
				client.write(new Buffer(commandBytes), function() {
					commandBytes[1]=0;
					client.write(new Buffer(commandBytes), function() {
						client.destroy();
						cb(null)
					});
				});
			}
		});
	}

	this.press = function press(sequence, cb) {
		if (typeof sequence !== 'object' || !sequence.hasOwnProperty('length')) {
			return press(sequence.split(','), cb)
		};
		sendCommand(SkyRemote.commands[sequence.shift()],function() {
			if (sequence.length) {
				setTimeout(function() {
					press(sequence, cb);
				},500);
			} else {
				if (typeof cb === 'function') {
					cb();
				}
			}
		});
	}

}

SkyRemote.commands = {
	power: 0,
	select: 1,
	backup: 2,
	channelup: 6,
	channeldown: 7,
	interactive: 8,
	help: 9,
	services: 10,
	tvguide: 11,
	i: 14,
	text: 15, 
	up: 16,
	down: 17,
	left: 18,
	right: 19,
	red: 32,
	green: 33,
	yellow: 34,
	blue: 35,
	0: 48,
	1: 49,
	2: 50,
	3: 51,
	4: 52,
	5: 53,
	6: 54,
	7: 55,
	8: 56,
	9: 57,
	play: 64,
	pause: 65,
	stop: 66,
	record: 67,
	fastforward: 69,
	rewind: 71,
	sky: 241, 
	boxoffice: 240
}

module.exports = SkyRemote;
