/*************************************************************************
Coeficiente de Correla��o de Pearson

Par�metros:
  PaScoreA - Array: [0..N]
  PaScoreB - Array: [0..N]

Resultado:
  Coeficiente de Correla��o de Pearson


Copyright 04.01.2010 - Felipe Plets - http://www.plets.com.br/
*************************************************************************/
function CoeficientePerson(PaScoreA, PaScoreB){

  // Tamanho de cada array
  var iScoreALength = PaScoreA.length;
  var iScoreBLength = PaScoreB.length;
    
  // Vari�vel utilizada para manter o resultado
  var iResult = 0;
  
  // Vari�veis contendo a m�dia das avalia��es 
  var iMeanA = 0;
  var iMeanB = 0;
  
  // Vari�veis auxiliar para realizar o calculo
  var iNumerator = 0;
  var iDenominatorAuxA = 0;
  var iDenominatorAuxB = 0;
  var iAuxA = 0;
  var iAuxB = 0;

  // Caso alguns dos dois arrays possua apenas 1 ou nenhum elemento ent�o 
  // n�o ser� poss�vel aplicar o calculo do coeficiente
  if (iScoreALength <=1 || iScoreBLength <= 1){
    return 0;
  }

  // M�dia das avalia��es do Array A
  for(var i=0; i<=iScoreALength-1; i++){
    iMeanA = iMeanA+PaScoreA[i];
  }
  iMeanA = iMeanA/iScoreALength;

  // M�dia das avalia��es do Array B
  for(var i=0; i<=iScoreBLength-1; i++){
    iMeanB = iMeanB+PaScoreB[i];
  }
  iMeanB = iMeanB/iScoreBLength;
            
  // Calcula os dados do numerador e do denominador
  for(var i=0; i<=iScoreALength-1; i++){
    iAuxA  = PaScoreA[i]-iMeanA; // Valor auxiliar relacionado ao Array A
    iAuxB  = PaScoreB[i]-iMeanB; // Valor auxiliar relacionado ao Array B
    iDenominatorAuxA += Math.pow(iAuxA,2); // Soma ao valor auxiliar A para calcular o denominador
    iDenominatorAuxB += Math.pow(iAuxB,2); // Soma ao valor auxiliar B para calcular o denominador
    iNumerator += iAuxA*iAuxB; // Soma ao resultado do numerador
  }
  
  // Numerador dividido pela raiz quadrada do resultado da 
  // multiplica��o do denominador auxiliar de A pelo denominador auxiliar de B
  iResult = iNumerator/Math.sqrt(iDenominatorAuxA*iDenominatorAuxB);

  // Retorna o coeficiente
  return iResult;
}

// Lista de scores inicial
var ScoreList = [];
// Adiciona na ScoreList um objeto dizendo o usu�rio e seus scores
ScoreList.push({"UserName": "Arthur Dent",       "Score": [3,4,3,2]});
ScoreList.push({"UserName": "Ford Prefect",      "Score": [4,4,4,2]});
ScoreList.push({"UserName": "Zaphod Beeblebrox", "Score": [5,1,5,4]});
ScoreList.push({"UserName": "Tricia McMillan",   "Score": [4,3,3,3]});
ScoreList.push({"UserName": "Marvin",            "Score": [1,0,2,0]});


