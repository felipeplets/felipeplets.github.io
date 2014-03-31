/*
 * meme ubiquity extension v0.0.1
 * http://plets.com.br/meme/
 *
 * Copyright (c) 2009 Felipe Plets
 *
 * Date: 2009-07-30 22:40:00 GMT-0300
 * Revision: 1
 */
CmdUtils.CreateCommand({
  names: ['meme'],
  icon: "http://l.yimg.com/cc/img/global/1248811071/favicon.ico",
  homepage: "http://meme.yahoo.com/",
  author: {name: "Felipe Plets", email: "fsplets@gmail.com"},
  license: "GPL",
  description: "Utilize facilmente o Meme",
  help: "Digite Meme e em seguida o conteudo da sua mensagem.",
  arguments: [ {role: 'object', nountype: noun_arb_text, label: 'text'}, 
			   {role: 'alias', nountype: noun_arb_text, label: 'user'}],
  preview: function(pblock, args) {
     pblock.innerHTML = "Adding text to your meme";
   },
   execute: function(args) {
     var data = {};
     data.text = args.object.text;
     data.user = args.alias.text;
     displayMessage(CmdUtils.renderTemplate(
                          "meming ${text} as ${user}.",
                      data));
	$.ajax({url: "http://meme.yahoo.com/" + args.alias.text + "/dashboard/",
           cache: false,
           success: function(html){
		   	
			// Cleaning the HTML
		   	var indexOffset = html.indexOf('<form id="textpostform"');
			html = html.substr(indexOffset, html.length);
		   	indexOffset = html.indexOf('</form>')+1;
			html = html.substr(0, indexOffset);

		     var myObject = jQuery(html).find("input[name='.crumb']");
			 if (myObject.length == 0)
			 {
			 	displayMessage("Error");
			 	return;
			 }
			 
			 $.post("http://meme.yahoo.com/" + args.alias.text + "/dashboard/text/",
                    { ".crumb" : myObject.val(), 
                      "tabid"  : "add-1",
			          "text_content" : args.object.text 
		            },
                    function(data){
                      displayMessage(data); 
		            }, 
		            "json");
			 
      }
    });
	
	

   }
});
