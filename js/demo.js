//模拟数据
var mockData = [
		{
			"session" : 1,
			"actions" : [ "IV", "O", "A" ],
			"purchaseprobability" : [ [ 0.982645, 0.012454 ],
					[ 0.892675, 0.012454 ], [ 0.6662675, 0.012454 ] ]
		},
		{
			"session" : 2,
			"actions" : [ "SC", "KS" ],
			"purchaseprobability" : [ [ 0.782665, 0.012454 ],
					[ 0.662645, 0.012454 ] ]
		},
		{
			"session" : 3,
			"actions" : [ "GH", "KK" ],
			"purchaseprobability" : [ [ 0.992665, 0.012454 ],
					[ 0.332645, 0.012454 ] ]
		} ];

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

function showData(session, actions, purchaseprobabilityPercent) {
	$("#session").html(session);
	$("#actions").html(actions);
	$("#purchaseprobability").html(purchaseprobabilityPercent);
}

var refreshTask;
var currenSession = 0;
var currenAction = 0;
var currenActionLength=0;
var time = new Date().getTime();// 时间毫秒数

$(function() {
	var initData = mockData[currenSession];
	currenActionLength = initData.actions.length;
	showData(initData.session, initData.actions[currenAction],
			toPercent(initData.purchaseprobability[currenAction][0]));
	// 定时五秒刷新
	refreshTask = setInterval(refreshTaskFN, 5000);
	// clearInterval(refreshTask);//清除定时任务


	$('#chat').on('click',
			function(e) {
				var nowTime = new Date().getTime();// 时间毫秒数
				$("#message").html(
						"模拟请求后台，请求参数有当前session:"
								+ mockData[currenSession].session
								+ " 当前Action:"
								+ mockData[currenSession].actions[currenAction]
								+ " 记录停留时间:" + (nowTime - time)+"(毫秒).后台已经返回成功数据，请点击<input type=\"button\" onclick=\"nextEven();\" value=\"确定\" />进入下一个");
				clearInterval(refreshTask);
			});

});

function refreshTaskFN() {
	currenAction++;
	if (currenAction == currenActionLength) {
		currenAction = 0;
		currenSession++;
		time = new Date().getTime();// 时间毫秒数
	}
	if (currenSession == mockData.length) {
		currenSession = 0;
	}
	var data = mockData[currenSession];
	var actions = data.actions;
	currenActionLength = actions.length;
	var purchaseprobability = data.purchaseprobability;
	var purchaseprobabilityPercent = toPercent(purchaseprobability[currenAction][0]);
	showData(data.session, actions[currenAction],
			purchaseprobabilityPercent);

}

function nextEven(){
	$("#message").html("");
	currenAction=0;
	currenSession++;
	if (currenSession == mockData.length) {
		currenSession = 0;
	}
	var data = mockData[currenSession];
	var initData = mockData[currenSession];
	currenActionLength = initData.actions.length;
	time = new Date().getTime();// 时间毫秒数
	showData(initData.session, initData.actions[currenAction],
			toPercent(initData.purchaseprobability[currenAction][0]));
	// 定时五秒刷新
	refreshTask = setInterval(refreshTaskFN, 5000);
}

