$(document).ready(function(){
	userid = $.cookie('userid');
	truename = $.cookie('truename');
	console.log(truename);
	$('.info p').html(truename);
	wecome();
	setInterval(wecome,1000);
	
	tt();
    setInterval(tt,60000);
    
	
	$("#login_btn").click(function () {
        //获取用户名
        var username = $('#username_txt').val();
        //获取密码
        var userpass = $('#userpass_txt').val();
        if (username == "" || userpass == "") { alert("用户名密码不能为空！"); }
        else {

            //调用登录方法
            $.ajax({
                //要用post方式     
                type: "Post",
                //方法所在页面和方法名     
                url: 'http://123.56.156.91:8089/AppInterface/userLogin?params={%22userName%22:%22'+username+'%22,%22password%22:%22'+userpass+'%22}',
                dataType: "jsonp",
				jsonp: "jsonpCallback",
                success: function (data) {
					console.log(data);
					
					var datas = data.result;
					switch (datas)
					{
						case 4:
						    alert('温馨提示','用户名不存在！','info');
						    break;
						case 101:
						    alert('温馨提示','密码错误！','info');
						    break;
						case 0:
							window.location.href = "index.html";
						    break;
						
					}
                    
                },
                error: function (err) {
                    alert('系统连接错误，请重试！');
                }
            });


        }

    });
	
	$("body").keydown(function(event) {
	  if (event.keyCode == "13") {//keyCode=13是回车键
		$("#login_btn").click();
	  }
	}); 
	$(".header-btn").click(function(){
		if(confirm("你确定退出系统吗？")){
			window.location.href = "login.html";
		}else{
			return;
		}
	});
})
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

//头部欢迎方法
function wecome() {
	var theDate = new Date();
	var _hour = theDate.getHours();
	var _year = theDate.getFullYear();
	var _month = theDate.getMonth();
	var _date = theDate.getDate();
	var _dayNum = theDate.getDay();
	var _day; switch (_dayNum) {
		case 0: _day = "星期日";
			break;
		case 1: _day = "星期一";
			break;
		case 2: _day = "星期二";
			break;
		case 3: _day = "星期三";
			break;
		case 4: _day = "星期四";
			break;
		case 5: _day = "星期五";
			break;
		case 6: _day = "星期六";
			break;
	}

	//获取系统标题
	//$('#systemName').html('<strong>' + systemName + '</strong>');

	var hello = "";
	if (_hour >= 12)
		hello = '下午好';
	else
		hello = '上午好';
	$('.header-time').html(_year + "年" + (_month + 1) + "月" + _date + "日  " + _day);
}
function tt(){
    $.ajax({
        //要用post方式
        type: "post",
        //方法所在页面和方法名
        url: 'http://123.57.162.77:8089/getBzRecordList?params={%22deviceIds%22:%22289%22}',
        dataType: "jsonp",
        jsonp: "jsonpCallback",
        success: function (data) {
            //查看返回的数据data
            //console.log(data);
            var datas = data.data[0].bzRecord.data.split(",");
            $('.header-tem').html(parseFloat(datas[16]).toFixed(1));
        },
        error: function (err) {
            //alert(err);
        }
    });
}
//var boxHeight = document.documentElement.clientHeight;
//function setScroll(){
//  $("body").slimScroll({
//      height: '100%',
//      size: '5px', //组件宽度
//      alwaysVisible: true,
//  });
//}
//
//setScroll();
//
//$(window).on("resize",setScroll);
function doublepie(id,val1,val2,max,color1,color2){
	var myChart = echarts.init(document.getElementById(id));
	var dataStyle = { //作用不明
	    normal: {
	    	//color: '#f00',
	        label: {show:false},
	        labelLine: {show:false}
//	        shadowBlur: 40,
//	        shadowColor: 'rgba(40, 40, 40, 0.5)',
	    }
	};
	var placeHolderStyle = { //作用不明  原来是这是pie图里面的
	    normal : {
	        color: 'rgba(0,0,0,0.1)',
	        label: {show:false},
	        labelLine: {show:false}
	    },
	    emphasis : {
	        color: 'rgba(0,0,0,0.1)'
	    }
	};
	var option = {
		title: {
	        text: val1,
	        textStyle : {
	            color : color1,
	            fontFamily : '微软雅黑',
	            fontSize : 20,
	            fontWeight : 'bolder'
	        },
	        subtext: val2,
	        subtextStyle: {
	        	color: color2,
	        	fontSize : 16,
	        },
	        x: 'center',
	        y: 'center',
	        itemGap: 5,//主副标题之间的间距。
	    },
	    backgroundColor: '#fff', //图表的背景颜色
	    color: [color1,color2], //每一项对应的颜色
	    //tooltip : {  //提示框组件
//	        show: true,
//	        formatter: "{b} : {c}℃ "  //正则设置格式
//	    },
//		legend: {  //图例组件
//			orient:'vertical', //图例的布局朝向
//			x:0,  //图例的位置--离左边的距离
//			y:0,  //图例的位置--离上边的距离
//			itemGap:10, //图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
//			data:['温度','设定点']
//		},
	    series : [  //系列列表
	        {
	            name:'温度',  //名字--用于tooltip的显示
	            type:'pie',    //类型--饼状图
	            clockWise:false,   //饼图的扇区是否是顺时针排布。
	            radius : [60,65], //饼图的半径，数组的第一项是内半径，第二项是外半径。 内半径是0就是一个真正的饼
	            center:['50%', '50%'], //饼图片的中心
	            itemStyle : dataStyle, //样式
	            hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果。
	            zlevel:2,
	            data:[  //系列中的数据内容数组
	                {
	                    value:val1,     //数据值总的值
	                    name:'室内温度'  //数据项名称。
	                },
	                {
	                    value:max-val1,     //剩下的值
	                    name:'invisible',
	                    itemStyle : placeHolderStyle
	                }
	
	            ],
	        },
	        {
	            name:'设定点',
	            type:'pie',
	            clockWise:false,
	            radius : [50, 55],
	            center:['50%', '50%'], //饼图片的中心
	            itemStyle : dataStyle,
	            hoverAnimation: false,
	            zlevel:100,
	            data:[
	                {
	                    value:val2,   //数据值总的值
	                    name:'温度设定点'
	                },
	                {
	                    value:max-val2,
	                    name:'invisible',
	                    itemStyle : placeHolderStyle
	                }
	            ]
	        }
	    ]
	};
	myChart.setOption(option);
}

function singlepie(id,val1,max,color1){
	var myChart = echarts.init(document.getElementById(id));
	var dataStyle = { //作用不明
	    normal: {
	    	//color: '#f00',
	        label: {show:false},
	        labelLine: {show:false}
//	        shadowBlur: 40,
//	        shadowColor: 'rgba(40, 40, 40, 0.5)',
	    }
	};
	var placeHolderStyle = { //作用不明  原来是这是pie图里面的
	    normal : {
	        color: 'rgba(0,0,0,0.1)',
	        label: {show:false},
	        labelLine: {show:false}
	    },
	    emphasis : {
	        color: 'rgba(0,0,0,0.1)'
	    }
	};
	var option = {
		title: {
	        text: val1,
	        textStyle : {
	            color : color1,
	            fontFamily : '微软雅黑',
	            fontSize : 20,
	            fontWeight : 'bolder'
	        },
	        x: 'center',
	        y: 'center',
	        itemGap: 5,//主副标题之间的间距。
	    },
	    backgroundColor: '#fff', //图表的背景颜色
	    color: [color1], //每一项对应的颜色
	    //tooltip : {  //提示框组件
//	        show: true,
//	        formatter: "{b} : {c}℃ "  //正则设置格式
//	    },
//		legend: {  //图例组件
//			orient:'vertical', //图例的布局朝向
//			x:0,  //图例的位置--离左边的距离
//			y:0,  //图例的位置--离上边的距离
//			itemGap:10, //图例每项之间的间隔。横向布局时为水平间隔，纵向布局时为纵向间隔。
//			data:['温度','设定点']
//		},
	    series : [  //系列列表
	        {
	            name:'',
	            type:'pie',
	            clockWise:false,
	            radius : [60,65], //饼图的半径，数组的第一项是内半径，第二项是外半径。 内半径是0就是一个真正的饼
	            center:['50%', '50%'], //饼图片的中心
	            itemStyle : dataStyle,
	            hoverAnimation: false,
	            zlevel:100,
	            data:[
	                {
	                    value:val1,   //数据值总的值
	                    name:''
	                },
	                {
	                    value:max-val1,
	                    name:'invisible',
	                    itemStyle : placeHolderStyle
	                }
	            ]
	        }
	    ]
	};
	myChart.setOption(option);
}
function avline(id,xlist,data,data1,data2,data3,data4,data5){
	var myChart = echarts.init(document.getElementById(id),"shine");
	option = {
		grid: {
        top: 80,
        bottom: 80,
        right: 25,
        left: 35
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        left: 'center',
        data: ['A相电压','B相电压','C相电压','A相电流','B相电流','C相电流'],
        inactiveColor: '#999',
        //selectedMode: 'single',
//      orient: 'vertical',
//      width: 150,
//      top: 50,
//      borderWidth: 2,
//      borderColor: 'blue',
        textStyle: {
            color: '#000'
        }
    },
    dataZoom: [
				{
					show: true,
					realtime: true,
					start: 0,
					end: 100,
					handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'
				}
		],
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data : xlist.map(function (str) {
						return str.replace(' ', '\n')
					}),
    },
    yAxis: [{
        type: 'value',
        name: '电压（V）',
        axisLabel: {
            formatter: '{value}'
        }
    }
    ,{
        type: 'value',
        name: '电流（A）',
        axisLabel: {
            formatter: '{value}'
        }
    }
    ],
    series: [
        {
            name:'A相电压',
            type:'line',
            data: data,
            itemStyle: {
                normal: {
                    color: '#1390d0'
                }
            }
        },
        {
            name:'B相电压',
            type:'line',
            data: data1,
//          yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#1ab2d9'
                }
            }
        },
        {
            name:'C相电压',
            type:'line',
            data: data2,
//          yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#1b719a'
                }
            }
        },
        {
            name:'A相电流',
            type:'line',
            data: data3,
            yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#428927'
                }
            }
        },
        {
            name:'B相电流',
            type:'line',
            data: data4,
            yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#6aa649'
                }
            }
        },
        {
            name:'C相电流',
            type:'line',
            data: data5,
            yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#aacca2'
                }
            }
        }
    ]
	};
	myChart.setOption(option);
//	window.addEventListener("resize",function(){
//  myChart.setOption(option);
// });
}

function glline(id,xlist,data,data1,data2,data3){
	var myChart = echarts.init(document.getElementById(id),"shine");
	option = {
		grid: {
        top: 80,
        bottom: 80,
        right: 25,
        left: 35
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        left: 'center',
        data: ['A相有功功率','B相有功功率','C相有功功率','总有功功率'],
        inactiveColor: '#999',
        //selectedMode: 'single',
//      orient: 'vertical',
//      width: 150,
//      top: 50,
//      borderWidth: 2,
//      borderColor: 'blue',
        textStyle: {
            color: '#000'
        }
    },
    dataZoom: [
				{
					show: true,
					realtime: true,
					start: 0,
					end: 100,
					handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'
				}
		],
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data : xlist.map(function (str) {
						return str.replace(' ', '\n')
					}),
    },
    yAxis: [{
        type: 'value',
        name: '功率（KW）',
        axisLabel: {
            formatter: '{value}'
        }
    }
//  ,{
//      type: 'value',
//      name: '电流（A）',
//      axisLabel: {
//          formatter: '{value}'
//      }
//  }
    ],
    series: [
        {
            name:'A相有功功率',
            type:'line',
            data: data,
            itemStyle: {
                normal: {
                    color: '#1390d0'
                }
            }
        },
        {
            name:'B相有功功率',
            type:'line',
            data: data1,
//          yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#1ab2d9'
                }
            }
        },
        {
            name:'C相有功功率',
            type:'line',
            data: data2,
//          yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#1b719a'
                }
            }
        },
        {
            name:'总有功功率',
            type:'line',
            data: data3,
            //yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#428927'
                }
            }
        }
    ]
	};
	myChart.setOption(option);
//	window.addEventListener("resize",function(){
//  myChart.setOption(option);
// });
}
function glysline(id,xlist,data,data1,data2,data3){
	var myChart = echarts.init(document.getElementById(id),"shine");
	option = {
		grid: {
        top: 80,
        bottom: 80,
        right: 25,
        left: 35
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        left: 'center',
        data: ['A相功率因数','B相功率因数','C相功率因数','总功率因数'],
        inactiveColor: '#999',
        //selectedMode: 'single',
//      orient: 'vertical',
//      width: 150,
//      top: 50,
//      borderWidth: 2,
//      borderColor: 'blue',
        textStyle: {
            color: '#000'
        }
    },
    dataZoom: [
				{
					show: true,
					realtime: true,
					start: 0,
					end: 100,
					handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'
				}
		],
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data : xlist.map(function (str) {
						return str.replace(' ', '\n')
					}),
    },
    yAxis: [{
        type: 'value',
        name: '功率因数',
        axisLabel: {
            formatter: '{value}'
        }
    }
//  ,{
//      type: 'value',
//      name: '电流（A）',
//      axisLabel: {
//          formatter: '{value}'
//      }
//  }
    ],
    series: [
        {
            name:'A相功率因数',
            type:'line',
            data: data,
            itemStyle: {
                normal: {
                    color: '#1390d0'
                }
            }
        },
        {
            name:'B相功率因数',
            type:'line',
            data: data1,
//          yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#1ab2d9'
                }
            }
        },
        {
            name:'C相功率因数',
            type:'line',
            data: data2,
//          yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#1b719a'
                }
            }
        },
        {
            name:'总功率因数',
            type:'line',
            data: data3,
            //yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#428927'
                }
            }
        }
    ]
	};
	myChart.setOption(option);
//	window.addEventListener("resize",function(){
//  myChart.setOption(option);
// });
}

function eletime(id,xlist,data,data1){
	var myChart = echarts.init(document.getElementById(id),"shine");
	option = {
		grid: {
        top: 60,
        bottom: 80,
        right: 25,
        left: 45
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        left: 'center',
        data: ['总有功电能','空调运行时间'],
        inactiveColor: '#999',
        //selectedMode: 'single',
//      orient: 'vertical',
//      width: 150,
//      top: 50,
//      borderWidth: 2,
//      borderColor: 'blue',
        textStyle: {
            color: '#000'
        }
    },
    dataZoom: [
				{
					show: true,
					realtime: true,
					start: 0,
					end: 100,
					handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'
				}
		],
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data : xlist.map(function (str) {
						return str.replace(' ', '\n')
					}),
    },
    yAxis: [{
        type: 'value',
        name: '电量（KWH）',
        axisLabel: {
            formatter: '{value}'
        }
    }
    ,{
        type: 'value',
        name: '时间（h）',
        axisLabel: {
            formatter: '{value}'
        }
    }
    ],
    series: [
        {
            name:'总有功电能',
            type:'line',
            data: data,
            itemStyle: {
                normal: {
                    color: '#1390d0'
                }
            }
        },
        {
            name:'空调运行时间',
            type:'line',
            data: data1,
            yAxisIndex: 1,
            itemStyle: {
                normal: {
                    color: '#1ab2d9'
                }
            }
        }
    ]
	};
	myChart.setOption(option);
//	window.addEventListener("resize",function(){
//  myChart.setOption(option);
// });
}