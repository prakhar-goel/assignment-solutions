function compress(stringText){
	if(stringText.length==0){
		return "";
	}
	var compressedString = "";
	var lastChar = stringText[0];
	var charCount = 1;
	for(var i=1; i<stringText.length; i++){
		if(stringText[i] == lastChar){
			charCount += 1;
		}
		else{
			compressedString += lastChar+charCount;
			charCount = 1
		}
		lastChar = stringText[i];
	}
	compressedString += lastChar+charCount;
	return compressedString;
}

function getURIComponents(uri){
	// uri = "http://abc.com/drill/further/../down/./foo.html"; //http://www.breakingnewsexpress.com/%E0%A4%B5%E0%A4%BF%E0%A4%B6%E0%A5%87%E0%A4%B7/%E0%A4%AF%E0%A5%81%E0%A4%B5%E0%A4%BE%E0%A4%93%E0%A4%82-%E0%A4%A8%E0%A5%87-%E0%A4%95%E0%A5%80-%E0%A4%AF%E0%A5%81%E0%A4%B5%E0%A4%BE-%E0%A4%B5%E0%A4%95%E0%A5%8D%E0%A4%A4%E0%A4%BE-%E0%A4%B6%E0%A4%BF/
	// var uri = "https://uname:passwd@host.com:80/%E0%A4%B5%E0%A4%BF%E0%A4%B6%E0%A5%87%E0%A4%B7/%7Efoo/../down/./foo/bar.html?key1=value1&key2=value2";
	// var uri = "http://uname:passwd@host.com/foo/bar.html";
	
	if(!uri || uri.length==0){
		return [];
	}

	uri = decodeURI(uri);

	// Breaking into basic components
	var re = /^([^:\/?#]+:\/\/)?([^\/?#]*)?([^?#]*)(\?([^#]*))?/
	var breakup = uri.match(re);

	// PROTOCOL
	var protocol=breakup[1]
	if(!protocol || protocol == null){
		protocol = "http://";
	}
	protocol = protocol.toLowerCase();

	// USERNAME, PASSSORD, HOST, PORT
	// var re = "/^(([^:@\/]+):)?(([^:@\/]+)@)?([^:@\/]+)(:[\d]+)?/"
	var uname="", passwd="", host="", port=80;
	var rawBase = breakup[2];
	if(rawBase){
		if(rawBase.indexOf("@") != -1){
			var creds = rawBase.split("@")[0];
			if(creds.indexOf(":") != -1){
				creds = creds.split(":");
				uname = creds[0];
				passwd = creds[1];
			}
			else{
				uname = creds;
			}
			rawBase = rawBase.split("@")[1];
		}
		if(rawBase.indexOf(":") != -1){
			host = rawBase.split(":")[0].toLowerCase();
			port = rawBase.split(":")[1];
		}
		else{
			host = rawBase.toLowerCase();
		}
	}
	
	// PATH
	var fullPath = breakup[3];
	var finalPath = new Array();
	if(fullPath){
		var pathComponents = fullPath.split("/");
		finalPath.push(pathComponents[0]);
		for(var i=1; i<pathComponents.length;i++){
			if(pathComponents[i] == "..") finalPath.pop();
			else if(pathComponents[i] == ".") continue;
			else finalPath.push(pathComponents[i]);
		}
	}
	finalPath = finalPath.join("/");

	// PARAMETERS
	var parameters = breakup[5], parametersDict = {};
	if(typeof parameters === 'string' && parameters.length>0){
		parameters = parameters.split("&");
		for(var i=0; i<parameters.length; i++){
			var pair = parameters[i].split("=");
			var key = pair[0], value=pair[1];
			parametersDict[key] = value;
		}
	}
	return [
		["protocol",protocol],
		["username",uname],
		["passwd",passwd],
		["host",host],
		["port",port],
		["path",finalPath],
		["parameters",parametersDict]
	]
}

function basicObjectComparison(a, b) {
    var aProperties = Object.getOwnPropertyNames(a);
    var bProperties = Object.getOwnPropertyNames(b);

    if (aProperties.length != bProperties.length) {
        return false;
    }

    for (var i = 0; i < aProperties.length; i++) {
        var propName = aProperties[i];

        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    return true;
}

function shortenStringButton(){
	var stringText = document.getElementById("stringText").value;
	if(/^[a-z]+$/.test(stringText)){
		document.getElementById("shortenedString").innerHTML=compress(stringText);
	}
	else{
		document.getElementById("shortenedString").innerHTML="Input string does not match regex [a-z]+";	
	}
	
}

function compareURIButton(){
	var uri1 = document.getElementById("uri1Text").value;
	var uri2 = document.getElementById("uri2Text").value;
	var uriBreakUp1 = getURIComponents(uri1);
	var uriBreakUp2 = getURIComponents(uri2);
	var verdictEle = document.getElementById("uriCompareVerdictString");
	verdictEle.style.display = "block";

	if(uriBreakUp1.length == 0 || uriBreakUp2.length == 0 ){
		verdictEle.innerHTML = "Please enter both the URIs to compare.";
		return;
	}
	var table = document.getElementById("URIComparisonTable");
	table.style.display = "block";

	var tbody = table.getElementsByTagName('tbody')[0];
	tbody.innerHTML = "";
	var isMatch = true;

	for(var i=0;i<uriBreakUp1.length;i++){
		var newRow   = tbody.insertRow(tbody.rows.length);
		
		var newCell1  = newRow.insertCell(0);
		var newCell2  = newRow.insertCell(1);
		var newCell3  = newRow.insertCell(2);
		var newCell4  = newRow.insertCell(3);

		newCell1.innerHTML = uriBreakUp1[i][0];

		if(uriBreakUp1[i][0] == "parameters"){
			newCell2.innerHTML = "<pre>"+JSON.stringify(uriBreakUp1[i][1], null, '\t')+"</pre>";
			newCell3.innerHTML = "<pre>"+JSON.stringify(uriBreakUp2[i][1], null, '\t')+"</pre>";
			newCell4.innerHTML = basicObjectComparison(uriBreakUp1[i][1], uriBreakUp2[i][1])?"<b>True</b>":"<b>False</b>";
			isMatch &= basicObjectComparison(uriBreakUp1[i][1], uriBreakUp2[i][1]);
		}
		else{
			newCell2.innerHTML = uriBreakUp1[i][1];
			newCell3.innerHTML = uriBreakUp2[i][1];
			newCell4.innerHTML = uriBreakUp1[i][1]==uriBreakUp2[i][1]?"<b>True</b>":"<b>False</b>";
			isMatch &= uriBreakUp1[i][1]==uriBreakUp2[i][1];
		}
		
	}

	verdictEle.innerHTML = "The URIs are "+(isMatch?"":"<b>NOT</b> ")+"Equal.";

}