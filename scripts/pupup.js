
	function cargarHTML(){
		$("#popup").html(localStorage.getItem("todoElHTML"));
		agregarEventoClick();
		$("#todo_leido").click(function(){
			marcarTodoComoLeido()})
	}

	function marcarTodoComoLeido(){
		var a=$(".post");
		a.each(function(a,b){
			$bloque=$(b);
			var c=$bloque.find("input");
			localStorage.setItem(c.attr("id"),"read")
		});
		chrome.extension.sendMessage({recarga:true})
	}

	function open_item(a,b){
		localStorage.setItem(b,"read");
		chrome.tabs.create({url:a});
		chrome.extension.sendMessage({recarga:true})
	}

	function agregarEventoClick(){
		var a=$(".post");
		a.each(function(a,b){
			$bloque=$(b);
			var c=$bloque.find("input");
			$bloque.click(function(){
				open_item(c.val(),c.attr("id"))})})
	}

	$(document).ready(function(){cargarHTML()});

	chrome.extension.onMessage.addListener(function(a,b,c){
		if(a.popupListo){cargarHTML()}
	})