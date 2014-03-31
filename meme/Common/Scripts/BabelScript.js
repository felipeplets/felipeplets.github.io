/*
 * BabelScript JavaScript Translation Library v0.0.1
 * http://plets.com.br/babelscript/
 *
 * Copyright (c) 2009 Felipe Plets
 *
 * Date: 2009-07-30 22:40:00 GMT-0300
 * Revision: 1
 */
var BabelScript = {};
BabelScript.Objs = [];
BabelScript.Libs = [];
BabelScript.Init = function (PsLang){
  if (typeof BabelScript.Libs[PsLang] == 'undefined'){
    var head= document.getElementsByTagName('head')[0];
    var oScript = document.createElement('script');
	oScript.type= "text/javascript";
    oScript.src = "Common/Scripts/BabelScript." + PsLang + '.js?' + new Date().getTime();
    head.appendChild(oScript);
  }
  else {
    for (var i = 0; i < BabelScript.Objs.length; i++) {
      BabelScript.Objs[i][0].html(BabelScript.Libs[PsLang][BabelScript.Objs[i][1]]);
    }
  }
};

(function($) { 

$.fn.Translate = function(PsResourceID) { 
	BabelScript.Objs.push([this, PsResourceID]);
	return this;
};

})(jQuery);
