﻿$(document).ready(function() {


	var parentdiv = $(' <audio id="audio" src="common/images/waring.wav" style="opacity:0" preload="auto" controls loop hidden="true"/>  ');
	//将父div添加到body中
	parentdiv.appendTo($("body"));

	// 电量汇总
	$(".ele-count button").click(function() {
		$(this).addClass("active").siblings().removeClass("active");
	})
	$("#ele-day").click(function() {
		ele(_startD, 1);
	})
	$("#ele-week").click(function() {
		ele(_startW, 7);
	})
	$("#ele-month").click(function() {
		ele(_startM, 30);
	})

	//影厅及空调机组列表
	var li_list = $(".inner");

	//console.log(li_list);
	//加载设备信息
	selectdeveic();
	//setInterval(selectdeveic,60000);
	//获取最新设备信息（设备表联动设备记录表）
	function selectdeveic() {

		//加载用户列表数据
		$.ajax({
			//要用post方式
			type: "post",
			//方法所在页面和方法名,%22syncTime%22:%222017-07-25 00:00:00%22
			url: 'http://123.56.156.91:8089/getBzRecordList?params={%22deviceIds%22:%22266,268,274,280,284,282,276,264,262,260,278,272,290,270,286,288,301,302,303,304,305,306,307,308,309%22}',
			dataType: "jsonp",
			jsonp: "jsonpCallback",
			success: function(data) {
				var con = data.data;
				var device = [con[3], con[4], con[7], con[10], con[12], con[11], con[8], con[2], con[1], con[0], con[9], con[6], con[15], con[5], con[13], con[14], con[16], con[17], con[18], con[19], con[20], con[21], con[22], con[23], con[24]];
				//console.log(device);
				var status_count = 0;
				var alarm_count = 0;
				var hall_count = 0;
				for(var i = 0; i < 16; i++) {
					var devicename = device[i].deviceInfo.deviceName;
					name = devicename.substring(0, devicename.length - 2);
					var attributes = device[i].attributes.split(",");
					var datas = device[i].bzRecord.data.split(",");

					if(parseFloat(datas[15]) > 5) {
						status_count++;
					}
					//名称
					li_list.eq(i).find(".name").html(name);
					//风机速度反馈小于5停止，大于等于5运行
					if(parseFloat(datas[15]) < 5) {
						li_list.eq(i).find(".airstatus").addClass("stop");
					} else {
						li_list.eq(i).find(".airstatus").removeClass("stop");
					}
					//风机速度反馈和风机速度相减的绝对值大于等于5故障
					var alarm = Math.abs(parseFloat(datas[15]) - parseFloat(datas[14]));
					if(alarm >= 5) {
						alarm_count++;
						li_list.eq(i).find(".alarmstatus").addClass("alarm");
					} else {
						li_list.eq(i).find(".alarmstatus").removeClass("alarm");
					}

					//送风温度
					li_list.eq(i).find(".indoortem").html(datas[6] + "℃");
					li_list.eq(i).find(".suptem").html(datas[0] + "℃");
				}
				$('.status_run').html(status_count);
				$('.status_stop').html(16 - status_count);
				$('.alarm_run').html(alarm_count);
				if(alarm_count > 0) {
					$("#audio").play();
				}
				$('.alarm_stop').html(16 - alarm_count);

				//影厅放映的数据
				for(var j = 16; j < 25; j++) {
					li_list.eq(j - 7).find(".hallp").hide();

					var halldatas = device[j].bzRecord.data.split(',');
					var sync = device[j].bzRecord.syncTime;
					var nowTimeMs = new Date().getTime() + 28800000;
					var dd = sync.split(" ");
					var ddp = dd[0].split("-");
					var ddn = dd[1].split(":");
					var lastTimeMs = Date.UTC(ddp[0], (ddp[1] - 1), ddp[2], ddn[0], ddn[1], ddn[2]);
					var changeTime = nowTimeMs - lastTimeMs;

					var time = halldatas[4];
					if(time === '0') {
						hall_count++;
						li_list.eq(j - 16).find(".hallstatus").html('空闲');
					} else {
						li_list.eq(j - 16).find(".hallstatus").html('放映');
					}
					// 10分钟
					if(changeTime > 1800000) {
						li_list.eq(j - 16).find(".hallstatus").addClass("red");
					} else {
						li_list.eq(j - 16).find(".hallstatus").removeClass("red");
					}
					$('.hall_run').html(9 - hall_count);
					$('.hall_stop').html(hall_count);
				}

			},
			error: function(err) {
				//alert(err);
			}
		});
	}

	// 将中国标准时间格式化为（2017-06-06 15:05:04）
	function formatDateTime(theDate) {

		var _hour = theDate.getHours();

		var _minute = theDate.getMinutes();

		var _second = theDate.getSeconds();

		var _year = theDate.getFullYear()

		var _month = theDate.getMonth();

		var _date = theDate.getDate();

		if(_hour < 10) {
			_hour = "0" + _hour;
		}

		if(_minute < 10) {
			_minute = "0" + _minute;
		}

		if(_second < 10) {
			_second = "0" + _second;
		}

		_month = _month + 1;
		if(_month < 10) {
			_month = "0" + _month;
		}

		if(_date < 10) {
			_date = "0" + _date;
		}

		return _year + "-" + _month + "-" + _date + " " + _hour + ":" + _minute + ":" + _second;

	}
	var second = new Date().getTime();
	var _end = formatDateTime(new Date());
	var _startD = formatDateTime(new Date(second - (1 * 24 * 60 * 60 * 1000)));
	var _startW = formatDateTime(new Date(second - (7 * 24 * 60 * 60 * 1000)));
	var _startM = formatDateTime(new Date(second - (30 * 24 * 60 * 60 * 1000)));

	// 电量的查询方法
	ele(_startD, 1);
	//setInterval(ele,5000);
	function ele(start, day) {
		var eleAryE = [];
		var eleAry = [];
		var eleAryM = [];
		var sum = 0;
		//实时总电量
		$.ajax({
			//要用post方式     
			type: "post",
			//方法所在页面和方法名     
			url: 'http://123.56.156.91:8089/getBzRecordList?params={%22deviceIds%22:%22267,269,275,281,285,283,277,265,263,261,279,273,291,271,287,289%22}',
			dataType: "jsonp",
			jsonp: "jsonpCallback",
			success: function(data) {

				var con1 = data.data;
				// console.log(con1);
				var device1 = [con1[3], con1[4], con1[7], con1[10], con1[12], con1[11], con1[8], con1[2], con1[1], con1[0], con1[9], con1[6], con1[15], con1[5], con1[13], con1[14]];

				// console.log(device1);
				var allele;
				var sumall = 0;
				for(var j = 0; j < 16; j++) {
					allele = parseInt(device1[j].bzRecord.data.split(",")[0]);
					li_list.eq(j).find(".allele").html(allele + 'KWH');
					eleAryE.push(allele);
					sumall += allele;
				}
				$('.eleall').html(sumall);
				//开始时间用电量
		$.ajax({
			//要用post方式     
			type: "post",
			//方法所在页面和方法名     
			url: 'http://123.56.156.91:8089/getBzRecordList?params={%22deviceIds%22:%22267,269,275,281,285,283,277,265,263,261,279,273,291,271,287,289%22,%22syncTime%22:%22' + start + '%22}',
			dataType: "jsonp",
			jsonp: "jsonpCallback",
			success: function(data) {
				//console.log(data);
				var con1 = data.data;

				var device1 = [con1[3], con1[4], con1[7], con1[10], con1[12], con1[11], con1[8], con1[2], con1[1], con1[0], con1[9], con1[6], con1[15], con1[5], con1[13], con1[14]];

				// console.log(device1);
				var alleleM;
				for(var j = 0; j < 16; j++) {
					alleleM = parseInt(device1[j].bzRecord.data.split(",")[0]);
					eleAryM.push(alleleM);
				}
				//console.log(eleAryM+"  /"+eleAryE);
				if(eleAry.length > 0 || eleAryM.length > 0) {
					for(var i = 0; i < 16; i++) {
						eleAry[i] = eleAryE[i] - eleAryM[i];
						sum += eleAry[i]
					}
					console.log(22);
				} else {
					console.log(11);
				}
				//柱形图和饼形图
				bar(eleAry);
				pie(eleAry);
				var sort = eleAry.sort(function(a, b) {
					return a - b;
				})
				//总用电量
				$('.eleall1').html(sum + 'KWH');
				$('.elemax').html(sort[15] + 'KWH');
				$('.elemin').html(sort[0] + 'KWH');
				$('.eleave').html(parseInt(sum / day) + 'KWH');
			},
			error: function(err) {
				//alert(err);
			}
		});
				//console.log(sumall);
			},
			error: function(err) {
				//alert(err);
			}
		});
		
	}

})

function bar(barAry) {
	var dom1 = document.getElementById("bar");
	var myChart = echarts.init(dom1);
	option = {
		//		title: {
		//          left: 'center',
		//          text: name,
		//          //subtext: '数据提供 蔚蓝城市 有限公司'
		//      },
		//		legend: {
		//		    left: 'left',
		//          data:['用电量','运行时间']
		//      },
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			left: '0',
			right: '0',
			bottom: '20px',
			top: '25px',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data: ['1#', '2#', '3#', '4#', '5#', '6#', '7#', '8#', '9#', '大堂', '北1', '北2', '南1', '南2', '放映区', '办公室'],
			axisLabel: {
				interval: 0, //0是强制显示所有标签，1是隔一个显示
				rotate: 45, //倾斜度 -90 至 90 默认为0  
				inside: false, //标签在网格外
				//margin:2, //标签与轴线的距离，默认是8 
				textStyle: {
					fontWeight: "bolder",
					color: "#000000"
				}
			},
		}],
		yAxis: [{
				type: 'value',
				name: 'KWH',
				axisLabel: {
					formatter: '{value}'
				}
			}
			//          ,
			//          {
			//              type: 'value',
			//              name: '运行时间（h）',
			//              axisLabel: {
			//                  formatter: '{value} '
			//              }
			//          }
		],
		series: [{
				name: '用电量',
				type: 'bar',
				barWidth: '60%',
				data: barAry,
				label: {
					normal: {
						show: true, //是否展示  
						position: 'top',
						textStyle: {
							//                          fontWeight:'bolder',  
							fontSize: '12',
							fontFamily: '微软雅黑',
							color: '#333'
						}
					}
				},
				itemStyle: {
					normal: {
						color: '#00c0ef', //柱形图的颜色
						opacity: 0.8
					}
				}
			}
			//			,
			//          {
			//              name:'运行时间',
			//              type:'line',
			//              yAxisIndex: 1,
			//              data: runTime
			//          }
		]
	};
	myChart.setOption(option, true);
}

//饼形图
function pie(pieAry) {
	var dom = document.getElementById('elePie');
	var myChart2 = echarts.init(document.getElementById('elePie'));
	option2 = {
		tooltip: {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		//		legend: {
		//			//orient: 'vertical',
		//			left: 'center',
		//			bottom: 0,
		//			data: ['照明总电量','空调机组总电量']
		//		},
		//		grid: {
		//			top: '30px'
		//		},
		color: ["#00c0ef", "#00a65a", "#dd4b39", "#f39c12"],
		series: [{
			name: '电量能耗',
			type: 'pie',
			radius: '75%', //大小
			//radius : [20, 110],
			center: ['50%', '52%'], //中心点
			//roseType : 'radius',
			data: [{
					value: pieAry[0],
					name: '1#'
				},
				{
					value: pieAry[1],
					name: '2#'
				},
				{
					value: pieAry[2],
					name: '3#'
				},
				{
					value: pieAry[3],
					name: '4#'
				},
				{
					value: pieAry[4],
					name: '5#'
				},
				{
					value: pieAry[5],
					name: '6#'
				},
				{
					value: pieAry[6],
					name: '7#'
				},
				{
					value: pieAry[7],
					name: '8#'
				},
				{
					value: pieAry[8],
					name: '9#'
				},
				{
					value: pieAry[9],
					name: '大堂'
				},
				{
					value: pieAry[10],
					name: '北1'
				},
				{
					value: pieAry[11],
					name: '北2'
				},
				{
					value: pieAry[12],
					name: '南1'
				},
				{
					value: pieAry[13],
					name: '南2'
				},
				{
					value: pieAry[14],
					name: '放映区'
				},
				{
					value: pieAry[15],
					name: '办公室'
				},
			],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};
	if(option2 && typeof option2 === "object" && myChart2) {
		myChart2.setOption(option2);
	}
}
console.log(document.documentElement.clientHeight);
//resizefun();
//window.addEventListener('resize', function() {
//	resizefun();
//})
//
//function resizefun() {
//	pingHeight = document.documentElement.clientHeight;
//	pingWidth = document.documentElement.clientWidth;
//	add_lin();
//	$(".qqq").css({
//		"height": pingHeight - 142
//	})
//	$(".requtu").css({
//		"maxHeight": pingHeight - 298
//	})
//	$(".content-wrapper").css({
//		"height": pingHeight - 101
//	})
//	$(".sidebar-menu").css({
//		"height": pingHeight - 98
//	})
//	$(".login").css({
//		"left": (pingWidth - 537) / 2
//	})
//	$(".login").css({
//		"top": (pingHeight - 458) / 2
//	})
//
//	var linyi = $(".xg_right").height();
//	var liner = $(".ssjc_right").height();
//	if(linyi < pingHeight - 166) {
//		linyi = pingHeight - 166
//	}
//	if(liner < pingHeight - 166) {
//		liner = pingHeight - 166
//	}
//	if(pingWidth > 990) {
//		$(".ssjc_left").css({
//			"minHeight": liner
//		})
//	} else {
//		$(".ssjc_left").css({
//			"minHeight": 'auto'
//		})
//	}
//	if(pingWidth > 1200) {
//		$(".xj_left").css({
//			"height": linyi
//		})
//	} else {
//		$(".xj_left").css({
//			"height": 'auto'
//		})
//	}
//	$(".sidebar-menu").css({
//		"overflow": 'hidden'
//	})
//	$(".yxjc_info_right").css({
//		"width": ($(".yxjc").width() - 145)
//	})
//}
//
//// 为适应屏幕高度过高加入的兼容代码
//add_lin();
//
//function add_lin() {
//	if(pingHeight < 750) {
//		$(".gao").addClass("xian")
//		$(".lin_kongxian").css({
//			"display": "none"
//		})
//		$(".xtjc .row").css({
//			"paddingTop": 0
//		})
//		$(".yxjc img").css({
//			"paddingTop": 0
//		})
//	}
//	if(pingHeight > 750) {
//		$(".gao").removeClass("xian")
//		$(".lin_kongxian").css({
//			"display": "block"
//		})
//		$(".xtjc .row").css({
//			"paddingTop": "7%"
//		})
//		$(".yxjc img").css({
//			"paddingTop": "7%"
//		})
//	}
//}


//	$(".qqq").niceScroll({
//		touchbehavior: false,
//		cursorcolor: "#000", //内侧滚动条的颜色
//		cursoropacitymax: 0.7, //滚动条的透明度
//		cursorwidth: 5, //滚动条的宽度
//		horizrailenabled: false,
//		cursorborderradius: 1, //滚动轴的圆角
//		autohidemode: true, //自动隐藏滚动条
//		background: '#333', //滚动条的背景色
//		cursorborder: 'solid 1px #fff' //滚动条的边框样式
//	})
//	$(".sidebar-menu").niceScroll({
//		touchbehavior: false,
//		cursorcolor: "#000", //内侧滚动条的颜色
//		cursoropacitymax: 0.7, //滚动条的透明度
//		cursorwidth: 5, //滚动条的宽度
//		horizrailenabled: false,
//		cursorborderradius: 1, //滚动轴的圆角
//		autohidemode: true, //自动隐藏滚动条
//		background: '#333', //滚动条的背景色
//		cursorborder: 'solid 1px #fff' //滚动条的边框样式
//	})
