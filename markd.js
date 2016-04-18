var express = require('express')
var path = require('path')
var _ = require('lodash')
var fs = require('fs')
var app = express()
var marked = require('marked')
var serveIndex = require('serve-index')
var pygmentize = require('pygmentize-bundled')
var basicAuth = require('basic-auth-connect')

var config = {}

try {
	config = require('./config.json')
} catch (e) {
	// console.log(e)
}

var port = config.port || 8079
var host = config.host || '0.0.0.0'

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
	.use(function(req, res, next) {
		if (_.includes(req.path, 'auth')) {
			return basicAuth(config.username || 'username', config.password || 'password')(req, res, next)
		}
		next()
	})
	.use('/preview', serveIndex(path.join(__dirname, 'files')))
	.use('/preview', function(req, res, next) {
		var pathname = decodeURIComponent(req.path)
		var basename = path.basename(pathname)
		var extname = path.extname(basename)
		fs.readFile(path.join(__dirname, 'files', pathname), function(err, buf) {
			if (err) {
				return res.send(404, err)
			} else {
				var str = buf + ''
				if (_.includes(['.md', '.markdown'], extname)) {
					marked(str, _.once(function(err, content) {
						if (!err) {
							return res.render('markdown.jade', {
								markdown: content,
								title: basename
							})
						} else {
							return res.send(500, 'markdown parser fucked up')
						}
					}))
				} else {
					return res.send(str)
				}
			}
		})
	})
	.use('/public', serveIndex(path.join(__dirname, 'public')))
	.use('/public', express.static(path.join(__dirname, 'public')))
	.listen(port, host, function(err) {
		if (err) {
			console.err(err)
		} else {
			console.log('markdown server listen on %s', host + ':' + port)
		}
	})

// app.locals.pretty = true
