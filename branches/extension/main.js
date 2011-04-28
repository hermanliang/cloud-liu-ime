var liu_open;
var iconpath;
var title;
var liu_status;
var app_url = "http://cloud-liu-ime.appspot.com"
var liu_word_count = 0;

/*Initializing*/
liu_status = window.localStorage.getItem('liu_status');
for (var i=0;i<10;i++)
{
	var span1 = document.createElement("span");
	span1.id = "liuime_word_"+i.toString();
	document.head.appendChild(span1);
}
if (liu_status==null)
{
	liu_status = 'enable';
	window.localStorage.setItem('liu_status',liu_status);
	liu_open = true;
}
else
{
	if (liu_status=='enable')
	{
		liu_open = true;
		iconpath = "liuime32.ico";
		title = "LIU:ON";
		chrome.browserAction.setIcon({path: iconpath});
		chrome.browserAction.setTitle({title: title});
	}
	else if (liu_status=='disable')
	{
		liu_open = false;
		iconpath = "liuime32gray.ico";
		title = "LIU:OFF";
		chrome.browserAction.setIcon({path: iconpath});
		chrome.browserAction.setTitle({title: title});
	}
}

chrome.browserAction.onClicked.addListener(function(tab) {
	liu_open_toogle();	
	chrome.browserAction.setIcon({path: iconpath});
	chrome.browserAction.setTitle({title: title});
	window.localStorage.setItem('liu_status',liu_status);
	action_test(tab);
});

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse)
	{
		if (request.msg=="Check")
		{
			sendResponse({check: liu_open});
		}
		if (request.code)
		{
			var code  = request.code;
			if (liu_word_count>9){liu_word_count=0;}
			var scblock = document.getElementById("liuime_word_"+liu_word_count.toString());
			var script1 = document.createElement("script");
			script1.type="text/javascript";
			script1.charset="utf-8";
			script1.src=app_url+'/liutrans?codes='+code;
			scblock.innerHTML="";
			scblock.appendChild(script1);
			liu_word_count++;
		}
	}
);

function action_test(tab)
{
	chrome.tabs.getAllInWindow(null,function(tabs)
	{
		for (var i=0;i<tabs.length;i++)
		{
			chrome.tabs.sendRequest(tabs[i].id, {msg:liu_open}, function(response){});
		}		
	});	
}

function liu_open_toogle()
{
	liu_open = (liu_open!=false?false:true);
	iconpath = (iconpath!="liuime32gray.ico"?"liuime32gray.ico":"liuime32.ico");
	title = (title!="LIU:OFF"?"LIU:OFF":"LIU:ON");
	liu_status = (liu_status!="disable"?"disable":"enable");
}