//模拟数据
var mockData = [
		{
			"SessionIndex" : 1,
			"Actions" : [ "KS" ,  "CS" ,  "IV" ,  "RV" ,  "OV" ,  "C" ,  "CHAT" ,  "AB" ,  "VB" ,  "SC" ,  "SI" ,  "SS" ,  "CMT" ,  "O" ],
//			"Actions" : [ "KS" ,  "CS" , ],
			"TruePurchaseLabel" : "P",
			"PurchasePrediction" : [ "NP" ,  "P" ,  "NP" ,  "NP" ,  "P" ,  "NP" ,  "P" , "NP" ,  "P" ,  "NP" ,  "P" ,  "NP" , "NP" ,  "P" ],
//			"PurchasePrediction" : [ "NP" ,  "P" ],
			"PurchaseProbability" : [0.9800000,0.17000000, 0.9100000 , 0.1700000 , 0.97000000 , 0.1700000 , 0.1700000 , 0.17000000 , 0.1800000 , 0.1900000 , 0.47000000 , 0.9100000 , 0.4800000 , 0.97000000]
//		"PurchaseProbability" : [0.9800000,0.17000000]
		},
		{
			"SessionIndex" : 2,
			"Actions" : [ "CS" , "KS" , "IV" ,  "RV" ,  "OV" ,  "C" ,  "CHAT" ,  "AB" ,  "VB" ,  "SC" ,  "SI" ,  "SS" ,  "CMT" ,  "O" ],
			"TruePurchaseLabel" : "NP",
			"PurchasePrediction" : [ "NP" ,  "P" ,  "NP" ,  "NP" ,  "P" ,  "NP" ,  "P" , "NP" ,  "P" ,  "NP" ,  "P" ,  "NP" , "NP" ,  "P" ],
			"PurchaseProbability" : [0.9800000,0.17000000, 0.9100000 , 0.1700000 , 0.97000000 , 0.1700000 , 0.1700000 , 0.17000000 , 0.1800000 , 0.1900000 , 0.47000000 , 0.9100000 , 0.4800000 , 0.97000000]
		}
	];

var actionName = {
		"KS":"Keyword Search",
		"CS":"Category Seach",
		"IV":"Item View",
		"RV":"Repeated View",
		"OV":"Order History View",
		"C":"Compare Price/Products",
		"CHAT":"Chat / Inquiring",
		"AB":"Add to Basket",
		"VB":"View Basket",
		"SC":"Search Coupons",
		"SI":"Search Sales Information",
		"SS":"Search Specific Discount",
		"CMT":"Write Comments",
		"O":"Other Actions"
	}

/**
 * 小数转化为百分数 (四舍五入保留两位小数)
 * 
 * @param point
 * @returns
 */
function toPercent(point) {
	var str = Number(point * 100).toFixed(2);
	str += "%";
	return str;
}

function showCurrentActionImage(name){
	$("#currentActionImage").attr("src","../image/"+name+".png");
}

function showData(currentSessionIndex, totalSessionCount,currenActionIndex,currentAction, currentPurchasePrediction, currentPurchaseProbability) {
	var process= toPercent(currentSessionIndex+1/totalSessionCount);
	$("#process").attr("style","width: "+process+";");
	
	$("#CurrentSessionCount").html(currentSessionIndex+1);
	$("#totalSessionCount").html(totalSessionCount);
	showCurrentActionImage(currentAction[currenActionIndex]);
	$("#currentActionName").html(actionName[currentAction[currenActionIndex]]);
//	$("#currentActionOrder").html(orderIndexName[currenActionIndex+1]);
	$("#currentActionPrediction").html(currentPurchasePrediction+","+currentPurchaseProbability);
}

function showActionsHistory(currenActionIndex,data){
	var actionsHistoryimgList = $("[id^='actionsimg']");
	var actionsHistoryNumList = $("[id^='actionsNum']");
	var actionsHistoryinfoList = $("[id^='actionsinfo']");
	if(currenActionIndex==0){
		for(var i=0;i<actionsHistoryimgList.length;i++){
			$(actionsHistoryimgList[i]).removeAttr("title");
			$(actionsHistoryimgList[i]).css("border","1px solid #ccc");
			$(actionsHistoryimgList[i]).empty();
		}
		for(var i=0;i<actionsHistoryNumList.length;i++){
			$(actionsHistoryNumList[i]).empty();
		}
		for(var i=0;i<actionsHistoryinfoList.length;i++){
			$(actionsHistoryinfoList[i]).empty();
		}
	}else{
		var action=data.Actions;
		var index=currentActionIndex-1;
		var p= data.PurchasePrediction[index];
		var pl= toPercent(data.PurchaseProbability[index]);
		var imghtml='<img alt="no image" src="../image/'+action[index]+'.png">';
		$("#actionsimg"+(index)).append(imghtml);
		$("#actionsimg"+(index)).attr("title",actionName[action[index]]);
		if(index>9){
			$("#actionsimg"+(index)).css("border","1px solid red");
		}
		$("#actionsNum"+(index)).html(orderIndexName[currenActionIndex]);
		$("#actionsinfo"+(index)).html(p+"&nbsp;"+pl);
	}
	
}

var userName="Jimmy";

var refreshTask;

var totalSessionCount=0;
var currentTruePurchaseLabel='';

var currentSessionIndex = 0;
var currentActionIndex = 0;
var currentActionLength=0;

var time = new Date().getTime();// 时间毫秒数

var totalpoint=0;
var correct=0;
var Wrong=0;
var Missed=0;
function getUrlParam(name){
	var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
	var r=window.location.search.substr(1).match(reg);
	if(r&&r!=null){
		return decodeURI(r[2]);
	}
	return "";
}


$(function() {
	var userName_url = getUrlParam("userName");
	if(userName_url&&""!=userName_url){
		userName=userName_url;
	}
	$("#userName").html(userName);
	totalSessionCount=mockData.length;
	var initData = mockData[currentSessionIndex];
	currentTruePurchaseLabel=initData.TruePurchaseLabel;
	currentActionLength = initData.Actions.length;
	showData(currentSessionIndex,totalSessionCount,currentActionIndex,initData.Actions,initData.PurchasePrediction[currentActionIndex],toPercent(initData.PurchaseProbability[currentActionIndex]));
	showActionsHistory(currentActionIndex,initData);
	var timeUnit=3000;
	// 定时3秒刷新
	refreshTask = setInterval(refreshTaskFN, timeUnit);
	// clearInterval(refreshTask);//清除定时任务

	
	var submitTask=setInterval(submitTaskFN,timeUnit);
	var submitTimeOut=1;
	function submitTaskFN(){
		var text="Submit my Prediction("+(10-submitTimeOut)+")";
		$("#submitBTN").val(text);
		if(submitTimeOut==10){
			clearInterval(submitTask);
			$("#submitBTN").val("Submit my Prediction");
			$("#submitBTN").removeAttr("disabled");
			$("#submitBTN").attr("onclick","submitEven()");
			$("#submitBTN").css("background","black");
		}
		submitTimeOut++;
	}

});

function refreshTaskFN() {
	currentActionIndex++;
	if (currentActionIndex == currentActionLength) {
		
		$("#submitBTN").removeAttr("onclick");
		$("#submitBTN").attr("disabled","disabled");
		$("#submitBTN").css("background","#bfbfbf");
		
		showActionsHistory(currentActionIndex,mockData[currentSessionIndex]);
		currentActionIndex = 0;
		currentSessionIndex++;
		time = new Date().getTime();// 时间毫秒数
		clearInterval(refreshTask);
		//超时弃权
		setTimeout(function(){
			var timeOutMessage="";
			if("P"==currentTruePurchaseLabel){
				timeOutMessage="Customer purchased products and Left！You missed your chance to predict !";
			}else{
				timeOutMessage="Customer didn't purchase anything and Left! You missed your chance to predict !";
			}
			$("#timeOutMessage").html(timeOutMessage);
			Missed++;
			$("#Missed").html(Missed);
			$("#timeOutDiv").show();
		},1000);
		return;

	}
	if (currentSessionIndex == mockData.length) {
		currentSessionIndex = 0;
		clearInterval(refreshTask);
		return;
	}
	var data = mockData[currentSessionIndex];
	currentTruePurchaseLabel=data.TruePurchaseLabel;
	var actions = data.Actions;
	currentActionLength = actions.length;
	showData(currentSessionIndex,totalSessionCount,currentActionIndex,actions,data.PurchasePrediction[currentActionIndex],toPercent(data.PurchaseProbability[currentActionIndex]));
	showActionsHistory(currentActionIndex,data);

}

function submitEven(){
	var purchaseradio = $("input[name='purchaseradio']:checked").val();
	if(!purchaseradio||""==purchaseradio){
		alert('What`s your prediction ?');
		return;
	}
	var confidentradio = $("input[name='confidentradio']:checked").val();
	if(!confidentradio||""==confidentradio){
		alert('How confident are you ?');
		return;
	}
	clearInterval(refreshTask);
	var data = mockData[currentSessionIndex];
	var sysPurchasePrediction=data.PurchasePrediction[currentActionIndex];
	var sysPurchaseProbability=toPercent(data.PurchaseProbability[currentActionIndex]);
	$("#JRPrediction").html(sysPurchasePrediction+",&nbsp"+sysPurchaseProbability);
	$("#youPrediction").html(purchaseradio+",&nbsp"+$("input[name='confidentradio']:checked").attr("context"));
	$("#truth").html(currentTruePurchaseLabel);
	if(currentTruePurchaseLabel==purchaseradio){
		totalpoint+=totalpoint+parseInt(confidentradio);
		$("#totalpoint").html(totalpoint);
		correct++;
		$("#correct").html(correct);
		
		//显示弹窗
		$(".cuo").hide();
		$(".dui").show();
		$("#Result").html("Gain&nbsp;"+confidentradio);
		$("#modal").show();
		
		
	}else{
		totalpoint=totalpoint-parseInt(confidentradio);
		$("#totalpoint").html(totalpoint);
		Wrong++;
		$("#Wrong").html(Wrong);
		
		//显示弹窗
		$(".cuo").show();
		$(".dui").hide();
		$("#Result").html("Lost&nbsp;"+confidentradio);
		$("#modal").show();
		
		
	}
	
}

function nextEven(ele){
	$("#"+ele).hide();
	
	$("#submitBTN").removeAttr("onclick");
	$("#submitBTN").attr("disabled","disabled");
	$("#submitBTN").css("background","#bfbfbf");
	$("#submitBTN").val("Submit my Prediction(10)");
	
	$("input[name='purchaseradio']").prop("checked",false);
	$("input[name='confidentradio']").prop("checked",false);
	
	
	currentActionIndex=0;
	if("modal"==ele){
		currentSessionIndex++;
	}
	if (currentSessionIndex == mockData.length) {
		currentSessionIndex = 0;//暂时循环
		window.location.href="last.html?userName="+userName+"&totalpoint="+totalpoint+"&correct="+correct+"&Wrong="+Wrong+"&Missed="+Missed;
		return;
	}
	var initData = mockData[currentSessionIndex];
	currentTruePurchaseLabel=initData.TruePurchaseLabel;
	currentActionLength = initData.Actions.length;
	time = new Date().getTime();// 时间毫秒数
	
	showData(currentSessionIndex,totalSessionCount,currentActionIndex,initData.Actions,initData.PurchasePrediction[currentActionIndex],toPercent(initData.PurchaseProbability[currentActionIndex]));
	showActionsHistory(currentActionIndex,initData);
	var timeUnit=3000;
	// 定时3秒刷新
	refreshTask = setInterval(refreshTaskFN, timeUnit);
	// clearInterval(refreshTask);//清除定时任务

	
	var submitTask=setInterval(submitTaskFN,timeUnit);
	var submitTimeOut=1;
	function submitTaskFN(){
		var text="Submit my Prediction("+(10-submitTimeOut)+")";
		$("#submitBTN").val(text);
		if(submitTimeOut==10){
			clearInterval(submitTask);
			$("#submitBTN").val("Submit my Prediction");
			$("#submitBTN").removeAttr("disabled");
			$("#submitBTN").attr("onclick","submitEven()");
			$("#submitBTN").css("background","black");
		}
		submitTimeOut++;
	}
	
}

var orderIndexName={
	"1":"1 st",
	"2":"2 nd",
	"3":"3 rd",
	"4":"4 th",
	"5":"5 th",
	"6":"6 th",
	"7":"7 th",
	"8":"8 th",
	"9":"9 th",
	"10":"10 th",
	"11":"11 th",
	"12":"12 th",
	"13":"13 th",
	"14":"14 th",
	"15":"15 nd",
	"16":"16 th",
	"17":"17 th",
	"18":"18 th",
	"19":"19 th",
	"20":"20 th",
	"21":"21 st",
	"22":"22 nd",
	"23":"23 rd",
	"24":"24 th"
}

