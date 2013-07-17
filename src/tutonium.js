/***************************************************************************************************************************
*									  |||			T U T O N I U M 		|||											   *
*																														   *
*										             by Ron Lucke 													       *
***************************************************************************************************************************/


function formatSuite(testSuite, filename) {
var urllist = new Array();
var header= '<!doctype html> <html lang="en"> <head> <meta charset="utf-8" />  <title>\n ';
header += options.title + '</title>\n  <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.2/themes/'+options.jQueryUIStyle+'/jquery-ui.css" />\n ';
header += buildStyle();
header += '<script src="http://code.jquery.com/jquery-1.9.1.js"></script>\n <script src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"></script>\n ';
header += '<script> $(function() {$( "#tabs" ).tabs({activate: function(event, ui) { switch ($(this).tabs("option", "active" )){';

var tablist = '<ul>\n';
var tabs = '';
var helperscript = '<script>'; 
helperscript += '\n'; 
//animation function 
helperscript += 'function aniMoveToElement(select, speed, frameIndex, tab){\n'; 
helperscript += 'var script = \'<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.2/themes/'+options.jQueryUIStyle+'/jquery-ui.css" /> <style>.ui-icon{background-size: 512px 480px; height: 32px; width: 32px; background-position: -224px -96px}</style>\';\n'; 
helperscript += 'var $head = $(\'head\', window.frames[frameIndex].document);\n'; 
helperscript += 'var $body = $(\'body\', window.frames[frameIndex].document);\n'; 
helperscript += 'var $bodyHTML = $(\'html, body\', window.frames[frameIndex].document);\n'; 
helperscript += 'var $select = $(select, window.parent.frames[frameIndex].document);\n'; 
helperscript += '$head.append(script);\n'; 
helperscript += '$body.append(\'<div id="cursorbox"><span class="ui-icon ui-icon-arrowthick-1-nw"></span></div>\');\n'; 
helperscript += 'var $cursorbox = $body.find(\'#cursorbox\');\n'; 
helperscript += '$cursorbox.css(\'width\' , 32 + \'px\').css(\'height\' , 32 + \'px\').css(\'position\' , \'absolute\').css(\'left\' , 500 + \'px\').css(\'top\' , 200 + \'px\');\n'; 
helperscript += '//change cursor \n'; 
helperscript += '$body.css("cursor", "wait");\n'; 
helperscript += '$(\'body\').css("cursor", "wait");\n'; 
helperscript += '$(\'#tabs\').fadeTo("slow", 0.3);\n'; 
helperscript += '$(\'.help\').hover(function(){ $(this).css(\'cursor\', \'wait\');});\n'; 
helperscript += '$(\'.check\').hover(function(){ $(this).css(\'cursor\', \'wait\');});		\n'; 
helperscript += '//element position\n'; 
helperscript += 'var left = parseInt($select.offset().left);\n'; 
helperscript += 'var top = parseInt($select.offset().top);\n'; 
helperscript += '// calculate distance\n'; 
helperscript += 'left -= parseInt($cursorbox.offset().left);\n'; 
helperscript += 'top -=  parseInt($cursorbox.offset().top)-5;\n'; 
helperscript += '// moving to element\n'; 
helperscript += '$cursorbox.animate({"left": "+="+left+"px", "top": "+="+top+"px"}, speed ,function(){\n'; 
helperscript += 'var $bg = $select.css(\'background\');\n'; 
helperscript += '$select.css(\'background\', \''+options.highlight+'\'); //highlight\n'; 
helperscript += 'setTimeout( function(){\n'; 
helperscript += '$select.css(\'background\', $bg);\n'; 
helperscript += '$body.css("cursor", "default");\n'; 
helperscript += '$(\'body\').css("cursor", "default");\n'; 
helperscript += '$(\'html, body\').animate({scrollTop: 0}, 500);\n'; 
helperscript += '$bodyHTML.animate({scrollTop: 0}, 500);\n'; 
helperscript += '$(\'.help\').hover(function(){ $(this).css(\'cursor\', \'pointer\');});\n'; 
helperscript += '$(\'.check\').hover(function(){ $(this).css(\'cursor\', \'pointer\');});\n'; 
helperscript += '$(\'#tabs\').fadeTo("slow", 1.0);\n'; 
helperscript += '$cursorbox.remove(); tab.addClass("help");\n'; 
helperscript += '},speed/2.5);\n'; 
helperscript += '});\n'; 
helperscript += '//scroll to element\n'; 
helperscript += '$("html, body").animate({scrollTop: 0}, 200).animate({scrollTop: top}, speed).delay(speed/2);\n'; 
helperscript += '$bodyHTML.animate({scrollTop: 0}, 200).animate({scrollTop: top}, speed).delay(speed/2);\n'; 
helperscript += '}\n'; 
// when document and external page is ready, ,listeners will be added
helperscript += '$(document).ready(function(){\n'; 
helperscript += '$("#external").load(function(){\n'; 
helperscript += 'var srcIndex = $("#external", window.parent.document).index();\n'; 


//building Tabs and listeners for each task
for (var i = 0; i < testSuite.tests.length; ++i) {

	   header +='case '+i+': document.getElementById("external").src="'+getURL(testSuite.tests[i].content)+'";break;';

	  
	   helperscript += '$("#help-tabs-'+i+'").click(function(){\n';
	   helperscript += 'if($(this).hasClass("help")){\n';
	   helperscript += '$(this).removeClass("help");';
	   helperscript += getAnimation(testSuite.tests[i].content);
	   helperscript += '}\n';
	   helperscript += '});\n';
	    
	   helperscript += '$("#check-tabs-'+i+'").click(function(){\n';
	   helperscript += 'var $checker = $(this);\n';
	   helperscript += 'if($(this).hasClass("check")){\n';
	   helperscript += '$(this).removeClass("check");';
	   helperscript += buildcheckfunction(testSuite.tests[i].content, i); //creating dialog content and conditions
	   helperscript += '$( "#dialog-'+i+'" ).dialog({closeOnEscape: false,  modal: true,  buttons: {"ok": function() {$( this ).dialog( "close" );$("#dialog").remove();$checker.addClass("check");}}});\n';
	   helperscript += '$(".ui-dialog-titlebar-close").remove();\n';
	   helperscript += '}\n';
	   helperscript += '});\n';
	   
	   tablist += '<li><a href="#tabs-'+i+'">'+testSuite.tests[i].getTitle()+'</a></li>\n';
       tabs += '<div id="tabs-'+i+'">\n'+ getTask(testSuite.tests[i].content, i) + '</div>\n';
  }
  
 header += '}}});});</script>';
 header += '</head>\n <body>\n <div id="wrapper">\n <div id="tabs">\n';
 tablist +='</ul>\n';
 tabs += '</div>';
var externalURL = getURL(testSuite.tests[0].content); 
var external = '<div id="external-wrapper"><iframe id="external" src="'+externalURL+'"></iframe></div>';
var footer ='</div>';
 //close helper
helperscript += '});	});	</script>\n'; 
footer += helperscript;
 footer += '</body></html>';

return header + tablist + tabs + external + footer;
}

function format(testCase, name){
var msg = "Testcase export is not supported. Please export the Testsuite";
alert(msg);
return msg;
}


function buildcheckfunction(testCaseContent, tabnum){
	var checkfunction = '';
	// gathering conditions
	var conditions =  new Array(); 
	//vars for selenium commands
	
	var target = '';
    var targetPath = '';
	var targetElement = '';
	var targetTextPresent = '';
	var verifyTextTarget = '';
	var verifyTextValue = '';
	var select = '';
	var selectVal = '';
	var selectCheck = '';
		
	
	//grab selenium commands and store them
	var commands = testCaseContent.commands;
		for (var i =0; i < commands.length; i++){
			var command = commands[i];
			if (command.type == 'command'){
				switch(command.command){
					case 'verifyLocation': target = command.target; break; //Zeil URL
                    case 'verifyPath': targetPath = command.target; break; //Ziel Pfad
					case 'verifyElementPresent' : targetElement = command.target; break; //Element das vorhanden sein soll
					case 'verifyTextPresent' : targetTextPresent = command.target; break; //Text der vorhanden sein soll
					case 'verifyText' : verifyTextTarget = command.target; verifyTextValue = command.value; break; //Text der an einer bestimmten Stelle vorhanden sein soll
					case 'select' : select = command.target; selectVal = command.value; break; //id des Dropdown und Wert der in einem Dropdown ausgewaehlt wurde	
				}
			}
		}
		
	//process select 
	var selectQuery = ''; 
	
	switch (select.split('=')[0]){
		case 'id': selectQuery = '#' + select.split('=')[1]; break;
		case 'name': selectQuery = '*[name='+select.split('=')[1]+']'; break;
		case 'css': selectQuery = select.split('=')[1]; break;
	
	}
		
	selectVal = selectVal.split('=')[1]; //Wert aus String auswerten
		
	if ((selectQuery != '')&&(selectVal != ''))	conditions.push("$('html, body', window.frames[srcIndex].document).find('"+selectQuery+" option:selected').text() === '"+selectVal+"'");
	
	
	//process verifyElementPresent 
	var elementQuery = '';
	var elementPair = new Array(targetElement.split('=')[0], targetElement.split('=')[1]);
	for (var j=2; j<targetElement.split('=').length; j++){	elementPair.push(elementPair.pop()+'='+targetElement.split('=')[j]);}

	
	switch (elementPair[0]){
		case 'name' : elementQuery = conditions.push("$('html, body', window.frames[srcIndex].document).find('*[name=\""+ elementPair[1] +"\"]').html() !== undefined"); break;
		case 'link' : elementQuery = conditions.push("$('html, body', window.frames[srcIndex].document).find('a:contains(\""+ elementPair[1] +"\")').html() !== undefined"); break;
		case 'id' : elementQuery = conditions.push("$('html, body', window.frames[srcIndex].document).find('#"+ elementPair[1] +"').html() !== undefined"); break;
		case 'css' : elementQuery = conditions.push("$('html, body', window.frames[srcIndex].document).find('"+ elementPair[1] +"').html() !== undefined"); break;
				
	}
	
	
	//process text
	if(targetTextPresent != '') conditions.push("$('html, body', window.frames[srcIndex].document).html().indexOf('"+targetTextPresent+"') != -1");
	if((verifyTextTarget != '')&&(verifyTextValue != '') )conditions.push("$('html, body', window.frames[srcIndex].document).find('"+verifyTextProcessing(verifyTextTarget)+"').html().indexOf('"+verifyTextValue+"') != -1");
		
	//process path and location
	if(target != '') conditions.push('(document.getElementById("external").contentDocument.baseURI == \"'+ target +'\")');
	if (targetPath != '') conditions.push('(document.getElementById("external").contentDocument.baseURI.indexOf("'+targetPath+'", document.getElementById("external").contentDocument.baseURI.length - "'+targetPath+'".length) !== -1)');

	
	//build all conditions
	var condition = '';
	if (conditions.length != 0) condition += conditions[0];
	for(var c=1; c < conditions.length; c++ ) {
		condition += '||'+conditions[c];
	
	}

	//set dialogtext
	var right = options.success_text;
	var wrong = options.mistake_text;
	var title = options.checker_title;
	
	//bulding function string
	
	checkfunction += 'if('+condition+') $(this).append(\'<div id="dialog-'+tabnum+'" title="'+title+'">'+right+'</div>\');\n';
	checkfunction += 'else $(this).append(\'<div id="dialog-'+tabnum+'" title="'+title+'">'+wrong+'</div>\');\n';
	

	return checkfunction;
}


function toGoodHTML(text){

		text = text.trim();
		if(!text) return '';
		text = text.replace(/&/g,"&amp;");
		
		var new_text = '';

		for(var i = 0; i < text.length; i++) {
			var c = text.charCodeAt(i);
			if(c < 128) {
				new_text += String.fromCharCode(c);
			}
			else {
				new_text += '&#' + c +';';
			}
		}
		
		
		return new_text.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\\/g,"<br>");
		
	
		
}

function getURL(testCaseContent){
var start = '';
var commands = testCaseContent.commands;
	for (var i =0; i < commands.length; i++){
		if ((commands[i].type == 'command')&&(commands[i].command == 'open'))start = commands[i].target;
			
	}
	
return start;

}
//build tab content
function getTask(testCaseContent, id){
	//vars for selenium commands
	var tasktext = '';
	var helper = false;
	var checker = false;
	var body = '';
	
	//grab selenium commands and store them
	var commands = testCaseContent.commands;
	for (var i =0; i < commands.length; i++){
		var command = commands[i];
		if (command.type == 'command'){
			switch(command.command){
				case 'storeText' : tasktext = toGoodHTML(command.value); break;
				//helper
				case 'clickAndWait': helper = true; break;
				case 'click' : helper = true; break;
				//checker
				case 'verifyLocation': checker = true; break;
                case 'verifyPath': checker = true; break;
				case 'verifyElementPresent' : checker = true; break;
				case 'verifyTextPresent' : checker = true; break;
				case 'verifyText' : checker = true; break; 
				//both
				case 'select' : helper = true; checker = true; break;
			}
		}
	}
	
	body  += '<p>'+ tasktext +'</p>\n';
	if (helper)	body  += '<div id="help-tabs-'+id+'" class="help"><span class="ui-icon ui-icon-circle-triangle-e"></span><span class="helptext" >'+options.helper_text+'</span></div>\n';
	if (checker) body  += '<div id="check-tabs-'+id+'" class="check"><span class="ui-icon ui-icon-check"></span><span class="checktext" >'+options.checker_text+'</span></div>\n';
	
	return body;
	
}

function getAnimation(testCaseContent){
	//vars selenium commands
	var task = '';
	var clicks = new Array(); 
	var select = '';
	var selectQuery = ''; 
	
		
	
	//grab selenium commands and store them
	var commands = testCaseContent.commands;
		for (var i =0; i < commands.length; i++){
			var command = commands[i];
			if (command.type == 'command'){
				switch(command.command){
					case 'clickAndWait': clicks.push(command.target); break; 
					case 'click' : clicks.push(command.target); break; 
					case 'select' : select = command.target;  break; 
				}
			}
		}
	
	//das clicks Array durchlaufen und die passenden Jquery Ausdrücke erzeugen
	var helperArray =  new Array();
	for (var h=0; h<clicks.length; h++){
		helperArray.push(clickProcessing(clicks[h]));
	}
	
	var helper = false;
    if (helperArray.length > 0) helper = true;
			
	
	switch (select.split('=')[0]){
		case 'id': selectQuery = '#' + select.split('=')[1]; break;
		case 'name': selectQuery = '*[name='+select.split('=')[1]+']'; break;
		case 'css': selectQuery = select.split('=')[1]; break;
	
	}
		
		
	if (selectQuery != ''){
		helperArray.push(selectQuery);	
		helper = true;
	}
	
	
	task += '\n//animations\n'; 
	
	if (helper){
		var anitime = 2000; 
		var timeout = anitime; 
		task += 'aniMoveToElement(\"'+helperArray[0]+'\",'+anitime+', srcIndex, $(this));\n';
		
		for(var k = 1; k < helperArray.length; k++){
			task +=	'setTimeout(function(){aniMoveToElement(\"'+helperArray[k]+'\", '+anitime+', srcIndex, $(this));} , '+timeout+');\n';
			timeout = timeout*2;
		}
	}
	
	return task;

}


function buildStyle(){
	var style = '<style type="text/css">';
	style += '*{ margin: 0; padding: 0; }';
	style += 'body{ background: '+options.bgcolor+';}';
	style += '#wrapper{ width: '+options.width+'px; margin: 0 auto;}';
	style += '';
	style += '#tabs{margin: 15px 0px; font-size: 12px;}';
	style += '#external {width: 100%;height: 600px;	border: solid 1px #DDD;	border-radius: 6px;	}';
	style += '.helptext , .checktext{color: '+options.textcolor+';vertical-align:top;	margin-left: 5px;}';
	style += '.ui-icon{	display: inline-block;}';
	style += '.check, .help{cursor: pointer;}';
	style += '.hidden{	visibility: hidden;}';
	style += '.dialog{	font-size: 0.75em;}';	
	style += '</style>';
	return style;

}

function clickProcessing(click){
	var clickQuery = '';
	if (click != '') {
		var clickPair = new Array(click.split('=')[0], click.split('=')[1]);
		for (var i=2; i<click.split('=').length; i++){	clickPair.push(clickPair.pop()+'='+click.split('=')[i]);}
		
		switch (clickPair[0]){
			case 'name' : clickQuery = '*[name='+clickPair[1]+']'; break;
			case 'link' : clickQuery = 'a:contains(\'' + clickPair[1] + '\')'; break;
			case 'id' : clickQuery = '#'+clickPair[1]; break;
			case 'css' : clickQuery = clickPair[1]; break;
						 
		}
		
	}
	return clickQuery;
}
	

function verifyTextProcessing(targetText){
	
	if(targetText.startsWith('css=')) targetText =  targetText.slice(4);
	if(targetText.startsWith('//')) {
		targetText =  targetText.slice(2);
		var textArray = targetText.split('/');
		targetText = '';
		for (var i = 0; i < textArray.length; i++){
			if(textArray[i].indexOf('@id') != -1){
				textArray[i] = '#'+textArray[i].substring(textArray[i].indexOf("'")+1,textArray[i].lastIndexOf("'"));
			}
			if((textArray[i].indexOf('[') != -1)&&(textArray[i].indexOf('@id') == -1)) {
				var temp = textArray[i].split('[');
				temp[1] = temp[1].substring(0, temp[1].length-1);
				temp[1] = parseInt(temp[1]);
				textArray[i] = temp[0]+':eq('+temp[1]+')';
			}
			targetText += textArray[i]+' ';
		}
	}
	else targetText = '';		

	return targetText;
}
String.prototype.startsWith = function(str){return (this.match("^"+str)==str)}

function defaultExtension() {
  return this.options.defaultExtension;
}

/*
 * Optional: The customizable option that can be used in format/parse functions.
 */
this.options = {
	title: "Tutonium",

	width: "1024",
	
	bgcolor: "#2779AA",
	
	textcolor: "#2779AA",
	
	jQueryUIStyle: "cupertino",
	
	highlight: "red",
	
	helper_text: "Klicken Sie hier um sich helfen zu lassen.",
	
	checker_text: "pr&uuml;fen",
	
	checker_title: "&Uuml;berpr&uuml;fung",
	
	success_text: "<p>Super!</p><p>Sie haben diese Aufgabe richtig gel&ouml;st.</p>",
	
	mistake_text: "<p>Leider nicht richtig!</p><p>Versuchen Sie es noch einmal.</p>",

	defaultExtension: "html"

};

this.configForm = 
	'<description>Hello and wellcome at Tutonium for Selenium IDE</description>'+
	'<separator class="groove"/>' +
	'<description>title:</description>' +
	'<textbox id="options_title" flex="1"/>' +
	'<separator class="thin"/>'+
	'<description>width in px:</description>' +
	'<textbox id="options_width" flex="1"/>' +
	'<separator class="thin"/>'+
	'<description>background color:</description>' +
	'<textbox id="options_bgcolor" flex="1"/>' +
	'<separator class="thin"/>'+
	'<description>helper and checker text color:</description>' +
	'<textbox id="options_textcolor" flex="1"/>' +
	'<separator class="thin"/>'+
	'<description>highlight color:</description>' +
	'<textbox id="options_highlight" flex="1"/>' +
	'<separator class="thin"/>'+
	'<description>jQuery UI style (like: cupertino, start, smoothness etc.):</description>' +
	'<textbox id="options_jQueryUIStyle" flex="1"/>' +
	'<separator class="thin"/>'+
	'<description>helper text:</description>' +
	'<textbox id="options_helper_text" flex="1"/>' +
	'<separator class="thin"/>'+
	'<description>checker text:</description>' +
	'<textbox id="options_checker_text" flex="1"/>' +
	'<separator class="thin"/>'+
	'<description>checker title:</description>' +
	'<textbox id="options_checker_title" flex="1"/>' +
	'<separator class="thin"/>'+
	'<description>success text:</description>' +
	'<textbox id="options_success_text" flex="1"/>' +
	'<separator class="thin"/>'+
	'<description>mistake text:</description>' +
	'<textbox id="options_mistake_text" flex="1"/>' +
	'<separator class="thin"/>';

