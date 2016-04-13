var marked = require('marked')

$(function() {
	var raw = $('#raw').html()
	var html = marked(raw)
	var $preview = $('<div>')
	$preview.html(html)
	$('body').append($preview)
})

