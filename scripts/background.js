function show(){
	var a=window.webkitNotifications.createHTMLNotification("notification.html");
	a.show();
	setInterval(function(){a.cancel()},15e3)
}

function parse_post(a){
	var b=new Object;
	b.title=$(a).find("title").text();
	b.id=$(a).find("guid").text();
	b.url=$(a).find("link").text();
	b.description=$(a).find("description").text();
	b.img=$(a).find("image").text();
	console.log(b.img);return b
}

function actualizarBadgeText(a){
	localStorage.setItem("unread",a);
	if(a>0)
		chrome.browserAction.setBadgeText({text:a.toString()});
	else chrome.browserAction.setBadgeText({text:""})
}

function traerFeed(){
	fetch_feed("ulr-xml-test.xml")
}

function display_stories(a){
	var b=0;var c=$.parseXML(a);
	$xml=$(c);
	var d=$xml.find("item");
	var e='<div id="logo"><img src="images/logo.png" /><button type="button" id="todo_leido">Marcar todo como leído</button></div>';
	var f=0;
	d.each(function(a,c){
		var d=parse_post(c);
		var g="";var h="";
		if(localStorage.getItem(d.id)=="read"){
			g+='<div class="post read">'
		}
		else{
			b++;
			g+='<div class="post">'
		}
		g+="<h4>"+d.title+'</h4>				<span class="description"><img src="'+d.img+'" />'+d.description+'...</span>				<input id="'+d.id+'" type="hidden" value="'+d.url+'?utm_source=chrome&utm_medium=popup&utm_campaign=ChromeApp">			</div>';
		if(f==0){
			if(localStorage.getItem("ultima-title")!=d.title){
				localStorage.setItem("ultima",g);
				localStorage.setItem("ultima-title",d.title);
				show();
				chrome.browserAction.setBadgeText({text:"1"})
			}
			f++
		}
		e+=g
	});

	localStorage.setItem("todoElHTML",e);
	actualizarBadgeText(b);
	chrome.extension.sendMessage({popupListo:true})
}

function fetch_feed(a,b){
	var c=new XMLHttpRequest;
	c.onreadystatechange=function(a){
		if(c.readyState==4){
			if(c.status==200){
				var a=c.responseText;
				display_stories(a)
			}else{
				display_stories(null)}
			}
		};
		c.open("GET",a,true);
		c.send()
}

var txt="";
if(localStorage.getItem("unread")>0)
	txt=localStorage.getItem("unread");

chrome.browserAction.setBadgeText({text:txt});

chrome.extension.onMessage.addListener(function(a,b,c){
	if(a.recarga)traerFeed()
});

traerFeed();

setInterval(function(){traerFeed()},18e5)