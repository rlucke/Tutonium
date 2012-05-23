/***************************************************************************************************************************************************
 *						T U T O N I U M  H E L P E R
 *
 * @author Ron Lucke
 ***************************************************************************************************************************************************/

/*
 * Dient dem Aufruf des helpers in der Tutorial Datei. Es wird in das zweite Frame ein div "cursorbox" mit einem Image eingepflanzt.
 *@param frameIndex Ziel Frame in dem der Curser eingebettet werden soll
 */
function startHelper(frameIndex){
$(document).ready(function(){
			//Cursor in das andere Frame einpflanzen
			$('body', window.parent.frames[frameIndex].document).append('<div id="cursorbox"><img style="position: absolute; z-index: 100;" id="cursor" src="../tutorial/cursor.png"/></div>');
			
			//Position des Cursors bestimmen
			var x;
			var y;
			if (typeof window.innerWidth != 'undefined'){
				x = window.innerWidth,
				y = window.innerHeight
			}
			else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0){
			    x = document.documentElement.clientWidth,
				y = document.documentElement.clientHeight
			}
			else{
				x = document.getElementsByTagName('body')[0].clientWidth,
				y = document.getElementsByTagName('body')[0].clientHeight
			}
			x = x/2; y = y/2;
			$('#cursor', window.parent.frames[frameIndex].document).css('left' , x + 'px');
			$('#cursor', window.parent.frames[frameIndex].document).css('top' , y + 'px');
});
}


/*
 * Animiert den Cursor im zweiten Frame zu dem gewuenschtem Objekt.
 * Der richtige Cursor wird in den wait Zustand veraendert.
 * 
 *@param select jQuery Ausdruck um Element auszuwählen
 *@param speed Geschwindigkeit in der die Animation ablaufen soll
 *@param frameIndex Ziel Frame in dem der Curser eingebettet werden soll
 */
function aniMoveToElement(select, speed, frameIndex)
{
	//element position
	var pos = $(select, window.parent.frames[frameIndex].document).offset();	// left and top
	var left = parseInt(pos.left);
	var top = parseInt(pos.top);
	
	//cursor position
	var cursorPos =  $('#cursor', window.parent.frames[frameIndex].document).offset();	// left and top
	
	// calculate distance
	left -= parseInt(cursorPos.left);
	top -=  parseInt(cursorPos.top)-10;
	
	
	//change cursor
		$('body', window.parent.frames[frameIndex].document).css("cursor", "wait");
		$('body').css("cursor", "wait");
		$('body').fadeTo("slow", 0.3);
		$('.help').hover(function(){ $(this).css('cursor', 'wait');});
		$('.check').hover(function(){ $(this).css('cursor', 'wait');});
	
	
	// moving to element
	$('#cursor', window.parent.frames[frameIndex].document).animate({"left": "+="+left+"px", "top": "+="+top+"px"}, speed);
	//highlight element
	$(select, window.parent.frames[frameIndex].document).delay(speed).effect("highlight", {color:'#0073ea'}, speed/2);
	//scroll to element
	$('html, body', window.parent.frames[frameIndex].document).animate({scrollTop: top}, speed).delay(speed/2);
	
	
	
	
}
/*
 * laesst der Cursor verschwinden und stellt die normalen eigenschaften des richtigen Cursors wieder her
 */

function killCursor(frameIndex){
	$('body', window.parent.frames[frameIndex].document).css("cursor", "default");
	$('body').css("cursor", "default");
	$('.help').hover(function(){ $(this).css('cursor', 'pointer');});
	$('.check').hover(function(){ $(this).css('cursor', 'pointer');});
	//$('html, body', window.parent.frames[frameIndex].document).animate({scrollTop: 0}, 500);
	$('body').fadeTo("slow", 1.0);
	$('#cursorbox', window.parent.frames[frameIndex].document).remove();

}
