//模拟数据
var mockData = [
		{
			"SessionIndex" : 1,
			"Actions" : ['O', 'KS', 'IV', 'IV', 'C', 'RV', 'IV', 'O', 'CS', 'CS', 'CS', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'O', 'SI', 'SI', 'C', 'C'],
			"TruePurchaseLabel" : "NP",
			"PurchasePrediction" : ['NI', 'NI', 'NI', 'NI', 'NI', 'NI', 'NI', 'NI', 'NI','NI', 'NI', 'I', 'I', 'NI', 'I', 'NI', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I'],
			"PurchaseProbability" : [0.9798, 0.9974, 0.9440, 0.9089, 0.9683, 0.8913, 0.94196, 0.8532, 0.7913, 0.7147, 0.5814, 0.5913, 0.6101, 0.6281, 0.5470, 0.5612, 0.6921, 0.7862, 0.8316, 0.8931, 0.8308, 0.8024, 0.7841, 0.8993]
		},
		{
			"SessionIndex" : 2,
			"Actions" : ['O', 'KS', 'KS', 'KS', 'KS', 'IV', 'KS', 'C', 'KS', 'C', 'C', 'C', 'KS', 'KS', 'C', 'C', 'KS', 'O', 'KS', 'C', 'C', 'KS', 'C'],
			"TruePurchaseLabel" : "NP",
			"PurchasePrediction" : ['NI', 'NI', 'NI', 'NI', 'NI', 'NI', 'NI', 'NI', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I'],
			"PurchaseProbability" : [0.8780, 0.8469, 0.9016, 0.8106, 0.8315, 0.7925, 0.6926, 0.5241, 0.5391, 0.7041, 0.7466, 0.7931, 0.7699, 0.8024, 0.8145, 0.8931, 0.8531, 0.8742, 0.8517, 0.7976, 0.8026, 0.8578, 0.8241]
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
	if("NI"==name){
		$("#currentActionImage").attr("src","../image/predict-NI.png");
		$("#currentActionPrediction").css("color","#d13959");
	}else{
		$("#currentActionImage").attr("src","../image/predict-I.png");
		$("#currentActionPrediction").css("color","#2ca02c");
	}
	
}

function showData(currentSessionIndex, totalSessionCount,currenActionIndex,currentAction, currentPurchasePrediction, currentPurchaseProbability) {
	var process= toPercent((currentSessionIndex+1)/totalSessionCount);
	$("#process").attr("style","width: "+process+";");
	
	$("#CurrentSessionCount").html(currentSessionIndex+1);
	$("#totalSessionCount").html(totalSessionCount);
	showCurrentActionImage(currentPurchasePrediction);
//	$("#currentActionName").html(actionName[currentAction[currenActionIndex]]);
	$("#currentActionPrediction").html(currentPurchaseProbability);
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
	var timeUnit=2000;
	// 定时2秒刷新
	refreshTask = setInterval(refreshTaskFN, timeUnit);
	// clearInterval(refreshTask);//清除定时任务

});

function refreshTaskFN() {
	currentActionIndex++;
	if (currentActionIndex == currentActionLength) {
		
		showActionsHistory(currentActionIndex,mockData[currentSessionIndex]);
		
		clearInterval(refreshTask);
		//不点击时
		setTimeout(function(){
			var confidentradio=25;
			if("P"==currentTruePurchaseLabel){
				totalpoint+=totalpoint+parseInt(confidentradio);
				$("#totalpoint").html(totalpoint);
				correct++;
				$("#correct").html(correct);
				//显示弹窗
				$(".cuo").show();
				$(".dui").hide();
				$(".missed").hide();
				$("#ResultMessage").html("Finally the customer purchased products !");
				$("#Result").html("Gain&nbsp;"+confidentradio);
				$("#modal").show();
				
			}else{
				totalpoint=totalpoint-parseInt(confidentradio);
				$("#totalpoint").html(totalpoint);
				Missed++;
				$("#Missed").html(Missed);
				
				//显示弹窗
				$(".cuo").hide();
				$(".dui").hide();
				$(".missed").show();
				$("#ResultMessage").html("The customer didn’t purchase and left !");
				$("#Result").html("Lost&nbsp;"+confidentradio);
				$("#modal").show();
			}
		},1000);
		sendData(userName,mockData[currentSessionIndex].SessionIndex,currentActionIndex,mockData[currentSessionIndex].PurchasePrediction[currentActionIndex-1],"NI",25);
		
		currentActionIndex = 0;
		time = new Date().getTime();// 时间毫秒数
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

function showConfident(){
	$("#submitBTN").removeAttr("onclick");
	clearInterval(refreshTask);
	$("#ConfidenceLevel").show();
}

function submitEven(){
	var confidentradio = $("input[name='confidentradio']:checked").val();
	if(!confidentradio||""==confidentradio){
		alert('How confident are you ?');
		return;
	}
	var data = mockData[currentSessionIndex];
	var sysPurchasePrediction=data.PurchasePrediction[currentActionIndex];//NI I
	var sysPurchaseProbability=toPercent(data.PurchaseProbability[currentActionIndex]);
	if("NP"==currentTruePurchaseLabel&&"I"==sysPurchasePrediction){
		totalpoint=totalpoint+parseInt(confidentradio);
		$("#totalpoint").html(totalpoint);
		correct++;
		$("#correct").html(correct);
		
		//显示弹窗
		$(".cuo").hide();
		$(".dui").show();
		$(".missed").hide();
		$("#ResultMessage").html("Customer liked to talk with you!");
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
		$(".missed").hide();
		$("#ResultMessage").html("Customer feel you are annoying!");
		$("#Result").html("Lost&nbsp;"+confidentradio);
		$("#modal").show();
	}
	$("input[name='confidentradio']").prop("checked",false);
	$("#ConfidenceLevel").hide();
	
	sendData(userName,data.SessionIndex,currentActionIndex+1,sysPurchasePrediction,"I",confidentradio);
	
}

function nextEven(ele){
	$("#"+ele).hide();
	$("input[name='confidentradio']").prop("checked",false);
	
	currentActionIndex=0;
	if("modal"==ele){
		currentSessionIndex++;
	}
	if (currentSessionIndex == mockData.length) {
		//结束循环
		//currentSessionIndex = 0;
		window.location.href="last.html?userName="+userName+"&totalpoint="+totalpoint+"&correct="+correct+"&Wrong="+Wrong+"&Missed="+Missed;
		return;
	}
	
	$("#submitBTN").attr("onclick","showConfident()");
	var initData = mockData[currentSessionIndex];
	currentTruePurchaseLabel=initData.TruePurchaseLabel;
	currentActionLength = initData.Actions.length;
	time = new Date().getTime();// 时间毫秒数
	
	showData(currentSessionIndex,totalSessionCount,currentActionIndex,initData.Actions,initData.PurchasePrediction[currentActionIndex],toPercent(initData.PurchaseProbability[currentActionIndex]));
	showActionsHistory(currentActionIndex,initData);
	var timeUnit=2000;
	// 定时2秒刷新
	refreshTask = setInterval(refreshTaskFN, timeUnit);
	// clearInterval(refreshTask);//清除定时任务
	
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

//send system data
function sendData(user_id,session_index,action_index,intervention_prediction,user_prediction,confidence){
//	1 当前⽤户的ID user_id
//	2 当前session的序号 session_index : 数字
//	3 当前action（第⼏个action）：action_index： 数字 （这个是我要收集的数据，
//	储存后台就好。）
//	4 当前展示的intervention_prediction：字⺟ I 或 NI
//	5 ⽤户预测 user_prediction = I（因为用户点击了按钮 该数据直接标记为I,没有点击按钮时为NI）
//	6 用户自信度confidence： 数字10、20、30、40（没有点击时为25）
	
	console.log("user_id:"+user_id);
	console.log("session_index:"+session_index);
	console.log("action_index:"+action_index);
	console.log("intervention_prediction:"+intervention_prediction);
	console.log("user_prediction:"+user_prediction);
	console.log("confidence:"+confidence);
	console.log(">>>>>>>>>>>>>>");

}

