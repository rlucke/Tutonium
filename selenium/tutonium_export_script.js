//Selenium Tutorial Custom Format

function format(testCase, name){

	//Variablen fuer die Selenium Kommandos
	var task = '';
	var start = '';
	var clicks = new Array(); 
	var target = '';
    var targetPath = '';
	var targetElement = '';
	var title = '';
	var tasktext = '';
	var targetTextPresent = '';
	var targetText = '';
	var select = '';
	var selectVal = '';
	var selectCheck = '';
		
	
	//selenium Kommandos abgreifen und zuordnen
	var commands = testCase.commands;
		for (var i =0; i < commands.length; i++){
			var command = commands[i];
			if (command.type == 'command'){
				switch(command.command){
					case 'open': start = command.target; break; //Anfangs URL der Aufgabe
					case 'clickAndWait': clicks.push(command.target); break; //Clickevent fuer den helper
					case 'click' : clicks.push(command.target); break; //Clickevent fuer den helper
					case 'verifyLocation': target = command.target; break; //Zeil URL
                    case 'verifyPath': targetPath = command.target; break; //Ziel Pfad
					case 'storeTitle': title = toGoodHTML(command.value); break; //Titel der Aufgabe
					case 'storeText' : tasktext = toGoodHTML(command.value); break; //Beschreibungstext der Aufgabe
					case 'verifyElementPresent' : targetElement = command.target; break; //Element das vorhanden sein soll
					case 'verifyTextPresent' : targetTextPresent = command.target; break; //Text der vorhanden sein soll
					case 'verifyText' : targetText = command.target; break; //Text der an einer bestimmten Stelle vorhanden sein soll
					case 'select' : select = command.target; selectVal = command.value; break; //id des Dropdown und Wert der in einem Dropdown ausgewaehlt wurde
					
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

		
	//select Verarbeitung
	var selectQuery = ''; 
	
	switch (select.split('=')[0]){
		case 'id': selectQuery = '#' + select.split('=')[1]; break;
		case 'name': selectQuery = '*[name='+select.split('=')[1]+']'; break;
		case 'css': selectQuery = select.split('=')[1]; break;
	
	}
		
	selectVal = selectVal.split('=')[1]; //Wert aus String auswerten
		
	if ((selectQuery != '')&&(selectVal != '')){
		selectCheck = 'else if($(\''+selectQuery+' :selected\', window.parent.frames[frameIndex].document).text() == \''+selectVal+'\') alert(\'richtig\');\n';
		helperArray.push(selectQuery);	helper = true;
	}
	
	
	//verifyElementPresent verarbeiten
	var elementQuery = '';
	var elementPair = new Array(targetElement.split('=')[0], targetElement.split('=')[1]);
	for (var j=2; j<targetElement.split('=').length; j++){	elementPair.push(elementPair.pop()+'='+targetElement.split('=')[j]);}
	
	
	switch (elementPair[0]){
		case 'name' : elementQuery = '*[name='+elementPair[1]+']'; break;
		case 'link' : elementQuery = 'a:contains(\'' + elementPair[1] + '\')'; break;
		case 'id' : elementQuery = '#'+elementPair[1]; break;
		case 'css' : elementQuery = elementPair[1]; break;
				
	}
	// falls kein verifyElementPresent ...
	if (elementQuery == ''){
		if(targetTextPresent != '') elementQuery = "body:contains(\""+targetTextPresent+"\")"; //aber verifyTextPresent
		if(targetText != '') elementQuery = verifyTextProcessing(targetText); // aber verifyText
		
	}
		
	//Zielbedingung
	var ifTarget = '';
	if(target != '') ifTarget = 'if(frame.document.URL == \"'+ target +'\")';
	if (targetPath != '') ifTarget = 'if(frame.document.location.pathname == \"'+ targetPath +'\")';

	//HTML erzeugen
	
	//header der Aufgabendatei. Script und schliessendes html Tag im footer
	
	var header = '<!DOCTYPE html>\n<html>\n<head>\n'+
	'<script type="text/javascript" src="js/jquery-1.6.2.min.js"></script>\n'+
	'<script type="text/javascript" src="js/jquery-ui-1.8.17.custom.min.js"></script>\n </head>\n';
	
	//body fuer die Aufgabe. Darf wegen der Tabs nur ein DIV auf oberster Ebene enthalten
	
	var body = '<body>\n'+
			   '<div id="'+ title +'"><br>\n'+
			   '<p>\n'+tasktext+ '\n</p>\n';
			   
	//soll der helper verfuegbar sein oder nicht
	if(helper) body += '<div class="help" id="help-'+title+'">Klicken Sie hier um sich helfen zu lassen.</div>\n'; //"Button" fuer den helper

	//doll Pruefung moeglich sein oder nicht
	if((elementQuery != '')||(ifTarget != '')||(selectCheck != '')) body +=	   '<div class="check" id="check-'+title+'">pr&uuml;fen</div>\n'+//"Button" zum pruefen ob die Aufgabe geloest wurde
			   '</div><br>\n';
	body +=	   '</body>\n';
	
	// footer enthaelt das Script um die funktionalitaet der Aufgabe zu gewaehrleisten
	var footer = '<script type="text/javascript">\n'+
				//Zielframe
				'var frameIndex = $("#main", window.parent.document).index();'+
				'var frame = window.parent.frames[frameIndex];'+
				
				//Laden der Anfangs URL fuer die Aufgabe
				'frame.location.href ="'+start+'";\n';

	var targetKillCursor = '';
	if (ifTarget != '') targetKillCursor = '	'+ifTarget+'{killCursor(frameIndex);$(this).addClass("help");\n}';	//helper entfernen falls Ziel URL oder Pfad erreicht	
	else targetKillCursor = 'if(\'\');';
	
	//soll der helper verfuegbar sein oder nicht
	if(helper) {
			var anitime = 2000; //Animation 2 Sekunden
			var timeout = anitime; 
			footer +=	'$("#help-'+title+'").click(function(){\n'+		
						'if($(this).hasClass("help")) {\n'+		//mehrfaches Aufruden des helpers verhindern
						'	$(this).removeClass("help");\n'+		
						'	startHelper(frameIndex);\n'+	
						targetKillCursor +
						'else{	aniMoveToElement(\"'+helperArray[0]+'\",'+anitime+', frameIndex);\n';	//Animation zum ersten Element
			for(var k = 1; k < helperArray.length; k++){
					
					footer +=	'setTimeout(function(){aniMoveToElement(\"'+helperArray[k]+'\", '+anitime+', frameIndex);} , '+timeout+');\n';
					timeout = timeout*2;
			}
			
			footer +=	'	setTimeout(function(){killCursor(frameIndex); $("#help-'+title+'").addClass("help");},'+(timeout+1000)+');}\n}'+	//1 Sekunde nach Animation alles wieder zuruecksetzen	
						'});\n';
	}


    var rightTarget = '';
	if(ifTarget != '') rightTarget = ifTarget+ 'alert("richtig");\n' ;//Ziel URL oder Pfad erreicht
	else rightTarget = 'if(1 == 2);';

	if((elementQuery != '')||(ifTarget != '')||(selectCheck != '')) footer += '$("#check-'+title+'").click(function(){\n'+
							rightTarget+ //Ziel URL oder Pfad erreicht
							 'else if($(\''+ elementQuery +'\', frame.document).length !=0)alert("richtig");\n'+ //Element gefunden
							 selectCheck+ //Auswahl stattgefunden
							 'else alert("falsch");\n'+ //Aufgabe nicht geloest
							 '});\n';
	footer +=	'</script>\n</html>\n';
	
	//HTML zusammenfuegen 
	task = header + body + footer;

	
	return task;
}

//clickAndWait verarbeiten (noetig fuer den helper)
	function clickProcessing(click){
		var clickQuery = '';
		if (click == '') {}
		else{
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
	
	//verifyText verarbeiten
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
					temp[1] = parseInt(temp[1])-1;
					textArray[i] = temp[0]+':eq('+temp[1]+')';
				}
				targetText += textArray[i]+' ';
			}
		}
		else targetText = '';		
	
		return targetText;
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
		return new_text.replace(/</g,"&lt;").replace(/>/g,"&gt;");
		
	
		
	}


String.prototype.startsWith = function(str){return (this.match("^"+str)==str)}
	
function parse(testCase, source){
	//to do?!
}

function formatCommands(commands){

}
