//Variáveis globais utilizadas para armazenar os elementos da tela
var ddlUser1, 
    ddlUser2,
    pnlCoeficientReult;

// Função responsável por carregar os dados quando a tela for iniciada
window.onload = function(){  
  // Cria os elementos da tela e atribui eventos
  document.body.appendChild(document.createElement("BR"));
  ddlUser1 = LoadDropDownList("ddlUser1"); // Cria o primeiro combo com os usuários
  ddlUser1.onchange = RemoveUserFromDropDown; // Evento que remove o usuário do DropDown2
  ddlUser2 = LoadDropDownList("ddlUser2"); // Cria o segundo combo com os usuários
  ddlUser2.onchange = CalculaCoeficiente; // Evento que dispara o calculo do coeficiente
  document.body.appendChild(document.createElement("BR"));
  document.body.appendChild(document.createElement("BR"));
  
  // Cria o painel responsável por exibir o resultado do pearson
  pnlCoeficientReult = document.body.appendChild(document.createElement("DIV"));
  
  // Esconde o primeiro usuário do segundo DropDown
  RemoveUserFromDropDown();

  // Configura estilo da página
  document.body.style.backgroundColor = "#CCC";
  document.body.style.margin = "15px";
  document.body.style.color = "#333";
  document.body.style.fontSize = "24px";
  document.body.style.textAlign = "center";
  ddlUser1.style.fontSize = "14px";
  ddlUser2.style.fontSize = "14px";
}

// Função que cria os dois combos com os nomes dos usuários que podem ser comparados e suas respectivas notas
function LoadDropDownList(PsElementID){
  var oCombo = document.createElement("SELECT");
  oCombo.id = PsElementID;
  for (var i = 0; i < ScoreList.length; i++) {
    var oOption = document.createElement("OPTION");
    oOption.value = i;
    oOption.appendChild(document.createTextNode(ScoreList[i].UserName + " [" + ScoreList[i].Score.toString() + "]"));
    oCombo.appendChild(oOption);
  }
  return document.body.appendChild(oCombo);
}

// Cria o primeiro combo com os usuários para que o usuário não possa selecionar duas vezes
function RemoveUserFromDropDown(){
  for (var i = 0; i < ScoreList.length; i++) {
    if (ddlUser1.value == i){
      ddlUser2.childNodes[i].style.display = "none";
      if (ddlUser2.value == i)
      {
        if(ddlUser2.value != ScoreList.length-1){
          ddlUser2.value = parseInt(ddlUser2.value)+1;
      	} else {
          ddlUser2.value = 0;
        }
      }
    } else {
      ddlUser2.childNodes[i].style.display = "block";
    }
  }
  // Calcula o coeficiente
  CalculaCoeficiente();
}

// Executa o calculo do coeficiente e mostra na tela
function CalculaCoeficiente(){
  // Calcula e mostra na tela o coeficiente de Pearson entre os usuários selecionados
  pnlCoeficientReult.innerHTML = "";
  pnlCoeficientReult.appendChild(document.createTextNode("Coeficiente = " + 
                                   CoeficientePerson(ScoreList[ddlUser1.value].Score, ScoreList[ddlUser2.value].Score)));
}