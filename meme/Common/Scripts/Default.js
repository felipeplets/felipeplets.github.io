$(document).ready(Window_OnLoad);

function Window_OnLoad()
{
  $("h1").Translate("TITLE");
  $(".install span").Translate("INSTALL");
  $("#titInstub").Translate("INSTUBIQ");
  $("#titInstme").Translate("INSTMEME");
  $(".footer").Translate("RIGHTS");
  $("#titAuthor").Translate("AUTHOR");
  $("#titUsing").Translate("USING");
  
  $(".lang").click(function(){BabelScript.Init($(this)[0].title);});
}