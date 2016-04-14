var express = require('express')
var path = require('path')
var _ = require('lodash')
var fs = require('fs')
var app = express()
var marked = require('marked')
var pygmentize = require('pygmentize-bundled')

var port = 8079
marked.setOptions({
	highlight: function(code, lang, callback) {
		var cb = _.once(callback)
		pygmentize({lang: lang, format: 'html'}, code, function(err, result) {
			if (err) {
				cb(err)
			} else {
				cb(null, result.toString())
			}
		})
	}
})

app
	.engine('jade', require('jade').__express)
	.set('views', path.join(__dirname, 'views'))
	.use('/preview', function(req, res, next) {
		var basename = path.basename(req.url)
		var extname = path.extname(basename)
		console.log(extname)
		fs.readFile(path.join('files', basename), function(err, buf) {
			if (err) {
				return res.send(404, err)
			} else {
				var str = buf + ''
				if (_.includes(['.md', '.markdown'], extname)) {
					console.log(11111111111111111)
					marked(str, _.once(function(err, content) {
						if (!err) {
							console.log('ok')
							return res.render('markdown.jade', {
								markdown: content,
								title: basename
							})
						} else {
							return res.send(500, 'markdown parser fucked up')
						}
					}))
					//res.send('xx')
				} else {
					// return res.send(str)
				}
			}
		})
	})
	.use('/public', express.static(path.join(__dirname, '/public')))
	.listen(port, function(err) {
		if (err) {
			console.err(err)
		} else {
			console.log('markdown server listen: %d', port)
		}
	})

// app.locals.pretty = true
