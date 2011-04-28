var charlist = 'abcdefghijklmnopqrstuvwxyz';
var bool_readonly;
var liu_enable;
var liu_shift;
var liu_shiftwithkey;
var app_url = "http://cloud-liu-ime.appspot.com"
var liu_open;
var liu_CHlogo = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAB3RJTUUH2wQUAxYtxdd3vwAAAM5JREFUeJztVkEOxCAItE3/VZ9Of7aHTQgZERDbroflZAVmBAW6EVF5Uva4aa3ngwQ59FLKYfgTXTlQhcAWpo/HwYc71F0JlE6OQtDKF30mV9Ylz6M7BIxe6ymvARLYU/kEt7yigUJblMCvA7UIINegkrldIEV8HKIL1j3VGMGk/Al+TxDqpvZaVfFbejeCthfO97tQBNyHR3s1EkB9smf8vGPzALh7KPbg29lfWvAnYEWuBFxCEfRwYV8184d+QqSjP5OHXmprvC30d52TD1TEdIQH8O04AAAAAElFTkSuQmCC)';
var liu_ENlogo = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAB3RJTUUH2wQUAxYiVWhqLgAAANNJREFUeJzVVVsSwiAMDI73KkdfT6YfONiGdElAnLrTn0KySx6EBEBW4kb2ct5y3rh/14YJfAX/LyAARJ7OL2oMYHkEibRpaQ/gQfy7NhcrsudmKNzJHk+O00YLeA7IbZTk8hrYKToLnPeMGdnFukh8lZ8SiCIgEL0BBe9RMebMUZL5qzb1lM4z+1p4IxjOYSxF9fh+PTbsKhRd+a2LPGnswVHUe6I2gjOZ/otG/D0ytkCXmivtXT4CZt1CTWkeKwGYpyYaelSM8bYyhwjmGQmWz6IXj1KL3MdkidkAAAAASUVORK5CYII%3D)';
var liu_logo;
var bhoffset;
var winscroll;
var liu_active_elem;

function win_scroll()
{
	var bh=document.body.scrollTop;
	var wh = window.innerHeight;
	var liuime_Bar = document.getElementById("liuime_Menu");
	if (!liuime_Bar.style.left)
	{
		liuime_Bar.style.left = '20px';
	}
	if (!liuime_Bar.style.top && !winscroll)
	{
		liuime_Bar.style.top = (bh+wh-50).toString()+"px";
	}
	else
	{
		if (!bhoffset)
		{
			bhoffset = 0;
		}
		var top1 = liuime_Bar.style.top;		
		var idx1 = top1.indexOf('px');
		top1 = parseInt(top1.substr(0,idx1));		
		liuime_Bar.style.top = (bh-bhoffset+top1).toString()+'px';
		bhoffset = document.body.scrollTop;
	}
}

function init()
{
	liu_scan(document.body.childNodes);
	document.addEventListener("DOMSubtreeModified",function(c)
	{	
		if (liu_open)
		{
			liu_scan(document.body.childNodes);
		}
	},false)
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
		if (request.msg==true || request.msg==false)
		{
			liu_open = request.msg;
			if(liu_open)
			{
				liu_scan(document.body.childNodes);
			}
			liu_toogle();
		}
		if (request.word)
		{
			var elem = document.activeElement;
			if (elem.type=="text"||elem.type=="textarea")
			{
				var start_pos = elem.selectionStart;
				var end_pos = elem.selectionEnd;
				var word_f = elem.value.slice(0,start_pos);
				var word_b = elem.value.slice(end_pos);
				elem.value = word_f+request.word+word_b;
				start_pos++;
				elem.setSelectionRange(start_pos,start_pos);
			}
			else if (liu_active_elem.type==undefined)
			{
				if(liu_active_elem.execCommand)
				{					
					liu_active_elem.execCommand("insertHTML",false,request.word);
				}
				else
				{
					document.execCommand("insertHTML",false,request.word);
				}				
			}
			else if (liu_active_elem.type=="text"||liu_active_elem.type=="textarea")
			{
				var start_pos = liu_active_elem.selectionStart;
				var end_pos = liu_active_elem.selectionEnd;
				var word_f = liu_active_elem.value.slice(0,start_pos);
				var word_b = liu_active_elem.value.slice(end_pos);
				liu_active_elem.value = word_f+request.word+word_b;
				start_pos++;
				liu_active_elem.setSelectionRange(start_pos,start_pos);
			}
			
		}				
	});

	document.onscroll = function()
	{
		winscroll = true;
		win_scroll();
	}
// Creat New Div with given ID
	var div=document.createElement("span");	
	var span1 = document.createElement("span");
	span1.id = "liuime_word"
	div.appendChild(span1);
	var span2 = document.createElement("span");
	span2.id = "liuime_check"
	div.appendChild(span2);
	document.body.appendChild(div);
}

function liu_toogle()
{
	chrome.extension.sendRequest({msg: "Check"}, function(response) {
		liu_open = response.check;
		if(liu_open)
		{			
			var liuime_Bar = document.getElementById("liuime_Menu");
			liuime_Bar.style.visibility = 'visible';
			liu_enable = (liu_enable!=true?true:false);
			var imelang = document.getElementById("liuime_Lang")
			liu_logo = (liu_logo!=liu_CHlogo?liu_CHlogo:liu_ENlogo);
			imelang.style.backgroundImage = liu_logo;
			clearbar();	
			bool_readonly=false;
			liu_shift = false;			
		}
		else
		{
			var liuime_Bar = document.getElementById("liuime_Menu");
			liuime_Bar.style.visibility = 'hidden';
			liu_enable = false;
			var imelang = document.getElementById("liuime_Lang")
			liu_logo = liu_ENlogo;
			imelang.style.backgroundImage = liu_logo;
			clearbar();	
			bool_readonly=false;
			liu_shift = false;			

		}
	});	
}

function clearbar()
{
	var bar1 = document.getElementById("liuime_Selection");
	var bar2 = document.getElementById("liuime_CodeBuffer");
	bar1.innerHTML = "";
	bar2.innerHTML = "";
}

function clearcode()
{
	var scblock1 = document.getElementById("liuime_word");
	scblock1.innerHTML="";
	var scblock2 = document.getElementById("liuime_check");
	scblock2.innerHTML="";
}

function code2word_old(code)
{
	var scblock = document.getElementById("liuime_word");
	var script1 = document.createElement("script");
	script1.type="text/javascript";
	script1.charset="utf-8";
	script1.src=app_url+'/liutrans?codes='+code;
	scblock.innerHTML="";
	scblock.appendChild(script1);
}

function code2word(code)
{
	chrome.extension.sendRequest({code: code}, function(response) {
	})
}

function code2check(code)
{
	if (code==1)
	{
		var scblock = document.getElementById("liuime_check");
		scblock.innerHTML="";
	}
	else
	{
		var scblock = document.getElementById("liuime_check");
		var script1 = document.createElement("script");
		script1.type="text/javascript";
		script1.charset="utf-8";
		script1.src=app_url+'/check?codes='+code;
		scblock.innerHTML="";
		scblock.appendChild(script1);
	}
}

function addbar()
{
	var table1 = document.createElement("Table");
	table1.id = "liuime_Menu";
	table1.innerHTML = '<tbody>\
		<tr id="liuime_Menu1">\
				<td id="liuime_Lang"></td>\
				<td id="liuime_Selection"></td>\
				<td id="liuime_CodeBuffer"></td></tr>\
		</tbody>'
	document.body.appendChild(table1);
	win_scroll();
	liu_toogle();
	var imelang = document.getElementById("liuime_Lang");
	imelang.onclick = function()
	{
		liu_toogle();
	}
	table1.onmouseover = function()
	{
		table1.style.cursor = "move";
		imelang.style.cursor = "pointer";
	}
	table1.onmousedown = function()
	{
		
		var mX = event.clientX + document.body.scrollTop;
		var mY = event.clientY + document.body.scrollTop;
		var startX = table1.style.left;
		var startY = table1.style.top;;
		var idx1 = startX.indexOf('px'); 
		var idx2 = startY.indexOf('px');
		startX = parseInt(startX.substr(0,idx1));
		startY = parseInt(startY.substr(0,idx2));
		var devX = startX - mX;
		var devY = startY - mY;
		
		document.onmousemove = function()
		{
			var tempX = event.clientX + document.body.scrollTop;
			var tempY = event.clientY + document.body.scrollTop;
			table1.style.left = (tempX+devX).toString()+'px';
			table1.style.top = (tempY+devY).toString()+'px';			
		}
		table1.onmouseup = function()
		{
			var endX = event.clientX + document.body.scrollTop;
			var endY = event.clientY + document.body.scrollTop;
			table1.style.left = (endX+devX).toString()+'px';
			table1.style.top = (endY+devY).toString()+'px';
			document.onmousemove="";
		}		
	}
}
var count = 0;
var iframe;
function liu_scan(nodes)
{
	count++;
	var node;
	for (var i=0;i<nodes.length;i++)
	{		
		node = nodes[i];
		if (node.nodeType==1)
		{
			if (node.install)
			{
				continue;
			}
			if ((node.type=="text" || node.type=='textarea') && iframe)
			{
				node.onkeypress=function(event){
					liu_keypress(event,node);
				}
				node.onkeydown = function(event){
					liu_keydown2(event,node);
				}
				node.onkeyup = function(event){
					liu_keyup2(event,node);
				}
				node.install = true;
			}
			else if (node.type=="text" || node.type=='textarea' && !iframe)
			{
				node.onfocus = function(event){					
					click_info(event,node);
				}
				node.install = true;
			}
			else if (node!=null)
			{
				if (node.tagName=="IFRAME")
				{
					if(node.contentDocument)
					{
						var liu_frame = node.contentDocument;
						var m
						if (liu_frame.body!=null)
						{
							m = liu_frame.body.getAttribute("contenteditable");
						}
						if ((m ||liu_frame.body.isContentEditable)&& !liu_frame.install)
						{
							liu_frame.onkeypress=function(event){
								liu_keypress(event,liu_frame);
							}
							liu_frame.onkeydown = function(event){
								liu_keydown2(event,liu_frame);
							}
							liu_frame.onkeyup = function(event){
								liu_keyup2(event,liu_frame);
							}
							liu_frame.install = true;
						}
						else
						{
							iframe = true;
							liu_scan(liu_frame.childNodes);
							iframe = false;
						}
					}					
				}
				else if (node!=null)
				{
					var m = node.getAttribute("contenteditable");
					if ((m || node.isContentEditable) && !iframe)
					{
						node.onfocus = function(event){
							click_info(event,node);
						}
						node.install = true;						
					}
					else
					{
						if(node.childNodes.length>0)
						{
							liu_scan(node.childNodes);
						}
					}
				}
				
			}
		}
	}	
}

function liu_keypress(event,elem)
{
	var keyn = event.keyCode;
	if (liu_enable&&!liu_shiftwithkey) // Liu Input Mode
	{	
		var cb = document.getElementById("liuime_CodeBuffer");
		if ((keyn>=65 && keyn <=90)||(keyn>=97 && keyn<=122)||keyn==39||keyn==44||keyn==46||keyn==91||keyn==93)
		{			
			if (keyn>=65 && keyn<=90)
			{
				var word = charlist.charAt(keyn-65);
			}
			if (keyn>=97 && keyn<=122)
			{
				var word = charlist.charAt(keyn-97);
			}
			if (keyn==44){var word = ",";}
			if (keyn==46){var word = ".";}
			if (keyn==39){var word = "'";}
			if (keyn==91){var word = "[";}
			if (keyn==93){var word = "]";}
			if (cb.innerHTML.length < 5)
			{
				cb.innerHTML = cb.innerHTML + word.toUpperCase();
				code2check(cb.innerHTML);
			}
			event.returnValue=false;
			bool_readonly=true;
		}
		// number, space, backspace 
		if (bool_readonly && (keyn>=48 && keyn<=57) || keyn==32)
		{
			if (bool_readonly)
			{
				liu_active_elem = elem;
				var code = cb.innerHTML;				
				code2check(1);
				if (keyn!=48 && keyn!=32)
				{
					var number = keyn-48;
					code2word(code+number.toString());
				}
				else
				{
					code2word(code);
				}
				clearbar();
				event.returnValue=false;
				bool_readonly=false;
			}
			else
			{
				clearbar();
			}	
		}
	}
}

function liu_keydown2(event,elem)
{
	var keyn = event.keyCode;
	if (keyn==16 || keyn==17) //shift & ctrl press
	{
		liu_shift=true;	
		liu_shiftwithkey=false;
	}
	if (liu_shift & keyn!=16)
	{
		liu_shiftwithkey=true;
	}
	if (liu_enable && !liu_shiftwithkey)
	{		
		if (bool_readonly && keyn==8)
		{
			event.returnValue=false;
			var cb = document.getElementById("liuime_CodeBuffer");
			if (cb.innerHTML.length>1)
			{
				cb.innerHTML = cb.innerHTML.substr(0,cb.innerHTML.length-1);
				code2check(cb.innerHTML);
			}
			else
			{
				clearbar();
				bool_readonly = false;
			}
		}		
		if (keyn==27 || keyn==13 || (keyn>=35 && keyn<=40)) //esc, arrow, enter: clear
		{
			clearbar();
			bool_readonly = false;
		}
	}
	
	
}

function liu_keyup2(event,elem){
	var keyn = event.keyCode;
	if (liu_enable && !liu_shiftwithkey)
	{
		if (keyn==16) //shift: switch chinese/english input
		{			
			liu_toogle();
		}
	}
	else if (!liu_enable && !liu_shiftwithkey)
	{
		if (keyn==16) //shift: switch chinese/english input
		{			
			liu_toogle();
		}
	}
	else if ((keyn==16 || keyn==17) && liu_shiftwithkey)
	{
		liu_shift = false;
		liu_shiftwithkey = false;
	}
}

function click_info(e,elem)
{	
	var actelem = document.activeElement;
	if (actelem!=elem)
	{
		elem = actelem;
	}
	if (elem.type==undefined)
	{		
		elem.onkeypress=function(event){
			liu_keypress(event,elem);
		}
		elem.onkeydown = function(event){
			liu_keydown2(event,elem);
		}
		elem.onkeyup = function(event){
			liu_keyup2(event,elem);
		}
	}
	else if (elem.type=='text'||elem.type=='textarea')
	{
		elem.onkeypress=function(event){
			liu_keypress(event,elem);
		}
		elem.onkeydown = function(event){
			liu_keydown2(event,elem);
		}
		elem.onkeyup = function(event){
			liu_keyup2(event,elem);
		}
	}
}
init();
addbar();