/*
 * jbabel JavaScript Translation Library v0.0.2
 * http://plets.com.br/jbabel/
 *
 * Copyright (c) 2013 Felipe Plets
 *
 * Date: 2013-06-06 10:09:00 GMT-0300
 * Revision: 2
 */

var jbabel = {
	// Default language is english
	DefaultLanguage: 'en',
	// Add XML and ASP.NET RESOURCE
  	ResourceType: 'json',
	// Resource path, default is the same from the HTML file
  	ResourcePath: 'resource/',
	// Array of lib objects that contain terms to translate
  	Objs: [],
	// Array of language resources
  	ResourceList: [],
	// Array of current language resources
  	CurrentTranslation: [],
	// Library used on this app
  	Library: 'jQuery',
	
	// Function that load ResourceList to objects
	Load: function (PsLang){
		// If don't have PsLang than set default language.
		if (!PsLang)
			PsLang = jbabel.DefaultLanguage;
		// If language lib is not loaded than load it
		if (typeof jbabel.ResourceList[PsLang] == 'undefined'){
			jbabel.LoadResourceLib(PsLang);
		} else { // If language lib is loaded than just translate all terms
		  	// Get library that will be used into translation
			jbabel.CurrentTranslation = jbabel.ResourceList[PsLang];
			jbabel.TranslateAll();
		}
	},
	
	// Load resource library
	LoadResourceLib: function(PsLang){
		// Get head element
		var head = document.getElementsByTagName('head')[0];
		// Create an Script element
		var oScript = document.createElement('script');
		oScript.type= 'text/javascript';
		// Set the ResourcePath + file name
		oScript.src = jbabel.ResourcePath + 'jbabel.' + PsLang + '.js?' + new Date().getTime();
		head.appendChild(oScript);
	}, 

	GetTranslation: function(PsResourceID){
		return jbabel.CurrentTranslation[PsResourceID];
	},

	Translate: function(PoObject, PsResourceID, PsAttribute){
		// String translated
	  	var sTranslation = jbabel.GetTranslation(PsResourceID);
		// do the translation
		if (PsAttribute) {
			PoObject.attr(PsAttribute, sTranslation);
		} else {
			PoObject.html(sTranslation);
		}
	},

	TranslateAll: function(){
		// Pass throught all objects setting the translation into it
		for (var i = 0; i < jbabel.Objs.length; i++) {
			// Get object to be translated 
			var oObject      = jbabel.Objs[i];
			// Call the translation for each object
			jbabel.Translate(oObject[0], oObject[1], oObject[2]);
		}	
	}
};

// jQUery extension that sets the translation resource ID to each object
(function($) { 
  $.fn.Translate = function(PsResourceID, PsAttribute) {
	jbabel.Objs.push([this, PsResourceID, PsAttribute]);
	jbabel.Translate(this, PsResourceID, PsAttribute);
	return this;
  };
})(jQuery);

// Load the default language 
jbabel.Load();

// Glossary
// Translation Resource ID
// Translation Resource
