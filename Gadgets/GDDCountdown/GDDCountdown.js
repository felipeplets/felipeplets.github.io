
TargetDate = "06/29/2009 8:00 AM";
CountActive = true;
CountStepper = -1;
LeadingZero = true;
DisplayFormat = "%%D%% Dias<br /> %%H%% Horas<br /> %%M%% Minutos<br /> %%S%% Segundos";
FinishMessage = "Finalmente chegou o dia!";

function calcage(secs, num1, num2)
{
	s = ((Math.floor(secs/num1))%num2).toString();
	if (LeadingZero && s.length < 2)
		s = "0" + s;
	return "<b>" + s + "</b>";
}

function CountBack(secs)
{
	if (secs < 0)
	{
		document.getElementById("cntdwn").innerHTML = FinishMessage;
		return;
	}
	DisplayStr = DisplayFormat.replace(/%%D%%/g, calcage(secs,86400,100000));
	DisplayStr = DisplayStr.replace(/%%H%%/g, calcage(secs,3600,24));
	DisplayStr = DisplayStr.replace(/%%M%%/g, calcage(secs,60,60));
	DisplayStr = DisplayStr.replace(/%%S%%/g, calcage(secs,1,60));

	document.getElementById("cntdwn").innerHTML = DisplayStr;
	if (CountActive)
		setTimeout("CountBack(" + (secs+CountStepper) + ")", SetTimeOutPeriod);
}


CountStepper = Math.ceil(CountStepper);
if (CountStepper == 0)
	CountActive = false;
var SetTimeOutPeriod = (Math.abs(CountStepper)-1)*1000 + 990;
var dthen = new Date(TargetDate);
var dnow = new Date();
if(CountStepper>0)
	ddiff = new Date(dnow-dthen);
else
	ddiff = new Date(dthen-dnow);
gsecs = Math.floor(ddiff.valueOf()/1000);
CountBack(gsecs);
