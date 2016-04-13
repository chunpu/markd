var express = require('express')
var path = require('path')
var _ = require('lodash')
var app = express()

var port = 8079

app
	.engine('jade', require('jade').__express)
	.set('views', path.join(__dirname, 'views'))
	.use('/preview', function(req, res, next) {
		var basename = path.basename(req.url)
		var extname = path.extname(basename)
		console.log(extname)
		if (_.includes(['.md', '.markdown'], extname)) {
			app.locals.pretty = true
			res.render('markdown.jade', {
				markdown: 'xxxx',
				title: basename
			})
			//res.send('xx')
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
