$(document).ready(Window_OnLoad);

function Window_OnLoad() {

  // Carregamento da biblioteca de tradução.
  LoadBabelScript();
  $(".lang").click(function(){jbabel.Load($(this)[0].title);});

  // Carregamento da funcionalidade do menu principal
  $("#listMenu li a").click(function(){LoadPage($(this)[0].className);});
  $("#listMenu li").mouseover(function(){if ($(this)[0].className != 'selected') $(this).addClass('hover');});
  $("#listMenu li").mouseout(function(){$(this).removeClass('hover');});
  LoadPage('about');
  
  // Define a exibição da página para ocorrer logo após o fim da última instrução
  setTimeout("$(\"#splash\").fadeOut(\"slow\")", 400);
}

function LoadBabelScript(){
  $(".about").Translate("ABOUT");
  $(".lectures").Translate("LECTURES");
  $(".projects").Translate("PROJECTS");
  $(".contact").Translate("CONTACT");
  $("#pnlBanner span").Translate("QUOTE");
  $("#lblSubtitle").Translate("WEBDEV");
  $("#about span").Translate("ABOUTTXT");
  jbabel.Load("pt");
}

function LoadPage(PsPage){
	$("#listMenu li").removeClass("selected");
	$("#listMenu li").removeClass('hover');
	$("#listMenu li a." + PsPage).parent().addClass("selected");
	$(".mainContent").css('display', 'none');
	$("#" + PsPage).css('display', 'block');
  if (PsPage=="lectures"){
    $("#pnlContainer").css('height', "700px");
    $(".mainContent").css('height', "646px");
    $("#pnlRight").css('height', "676px");
  } else {
    $("#pnlContainer").css('height', "555px");
    $(".mainContent").css('height', "496px");
    $("#pnlRight").css('height', "526px");
  }
}