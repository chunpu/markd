var express = require('express')
var path = require('path')
var _ = require('lodash')
var app = express()

var port = 8079

app
	.use('/preview', function(req, res, next) {
		var basename = path.basename(req.url)
		if (_.includes['md', 'markdown'], basename) {
			res.send('md')
		}
	})
	.use('/public', express.static(path.join(__dirname, '/public')))
	.listen(port, function(err) {
		if (err) {
			console.err(err)
		} else {
			console.log('markdown server listen: %d', port)
		}
	})
