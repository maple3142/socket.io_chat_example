	var css=document.createElement('style');
	css.id='toastCSS';
	css.innerHTML='.toast{z-index:10000000;position: absolute;background-color: #2F323A;color: #F7EDF0;font-family: Arial,sans-serif;text-align: center;vertical-align: middle;bottom: 0px;height: 40px;line-height: 40px;left: 40%;width: 20%;}.toast:hover{background-color: #1F222A;}'
	document.querySelector('head').appendChild(css);
	Element.prototype.remove = function(){
		try{
			this.parentElement.removeChild(this);
		}
		catch(e){}
	}
	function toast(text,ms,options={}){
		if(!text||!ms||typeof text!='string'||typeof ms!='number'){console.error('text(string) and ms(number) are required!');return;}
		var t=document.createElement('div');
		t.innerHTML=text;
		t.className='toast';
		if(typeof options.round=='boolean' && options.round)t.style.borderRadius='10px';
		document.querySelector('body').appendChild(t);
		t.addEventListener('click',function(e){
			e.target.remove();
			if(typeof options.onclick=='function')options.onclick(e);
			clearTimeout(time);
			rf();
		});
		var time=setTimeout(function(){
			t.remove();
			if(typeof options.onend=='function')options.onend();
			clearTimeout(time);
		},ms);
		rf();
	}
	function rf(){
		var toasts=document.querySelectorAll('.toast');
		toasts=Array.apply(null,toasts);
		var px=0;
		while(toasts.length>0){
			var e=toasts.pop();
			e.style.bottom=(px)+'px';
			px+=43;
		}
	}