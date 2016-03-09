requirejs.config({
	bathUrl:'scripts',
	paths:{
		jquery:'lib/jquery-1.11.3'
	}
});
require(['waiting'],function(waiting){
			waiting.justWaiting.show('half');
		});
require(['jquery'],function($){
	$('body').css('background','#ffc');
})

// console.log(typeof define)