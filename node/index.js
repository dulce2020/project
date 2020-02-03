var getdbdata = require('./models/getdbdata');
var express = require("express");
var io = require("socket.io");
var sport = require("serialport");
var sport2 = require("serialport");
var MongoC = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var router = express.Router();
var assert = require('assert');
var app = express();
app.use(express.static(__dirname + '/public'),('/', router));
app.set('view engine', 'ejs');
var server = app.listen(3000, function () {
  console.log("埠3000已啟動");
});
var sio = io.listen(server);
var Rline = sport.parsers.Readline;
var Rline2 = sport2.parsers.Readline;
var serialPort = new Rline();
var serialPort2 = new Rline2();
var nsport = new sport("COM3", 9600);
var nsport2 = new sport2("COM6", 9600);

nsport.pipe(serialPort);
nsport2.pipe(serialPort);//解決斷值
//-------DBTEST-----------//
//---------------------------//
var pm25="14",pm10="32",CO2="455",CO="7",CH4="8",dbdata="",worco2="",worco="",worch4="",worpm25="",worpm10="",str="",test=1000,a="",chwdata=1,tttt="",epm25="",epm10="",eco2="",eco="",ech4="",count0=0,count1=0,count2=0,count3=0,count4=0;

//---------------------------//

//-----------------------------//
serialPort.on("data", function(d){
		if (d != 00){
		if(String(d).substring(0,1)==1){
			CO2s = String(d).substring(1,6);
			COs = String(d).substring(6,10);
			CH4s = String(d).substring(10,13);
			CO2 = parseInt(CO2s)
			CO = parseInt(COs)
			CH4 = parseInt(CH4s)
		}
		if(String(d).substring(0,1)==0){
			pm25S = String(d).substring(1,3);
			pm25 = parseInt(pm25S)
			pm10S = String(d).substring(3,5);
			pm10 = parseInt(pm10S)
		}	
		//console.log(CO2);
		//console.log(CO);
		//console.log(NH4);

				console.log("CH4:"+CH4.toString()+" "+"CO:"+CO.toString()+" "+"CO2:"+CO2.toString()+" "+"PM2.5:"+pm25.toString()+" "+"PM10:"+pm10.toString()+" "+",\t"+Time());
		}		
});
setInterval(function(){
				MongoC.connect(url,function(err, client)
			{
			if(err) throw err;
			var db = client.db('ltu');
			
			db.collection("ltua58c090",function(err, collection){
			
				collection.insert({pm25:pm25, pm10:pm10,CO2:CO2,CO:CO,CH4:CH4,Time:Time()});
        });

			client.close();			
});
},1000)
//------test-------//
router.get('/mobile', function(req, res) {
	
});

//------test----------//


//-----------------------------//  
sio.on("connection", function(socket){	
  setInterval(function(){	//setInterval持續觸發
		socket.emit("pm", {'CH4S':CH4.toString(),'COS':CO.toString(),'CO2S':CO2.toString(),'pm25':pm25.toString(), 'pm10':pm10.toString()}); //傳送資料到前端
		//console.log("CH4:"+CH4.toString()+" "+"CO:"+CO.toString()+" "+"CO2:"+CO2.toString()+" "+"PM2.5:"+pm25.toString()+" "+"PM10:"+pm10.toString()+" "+",\t"+Time());		
	}, 1000);//1秒後做一次
	//------------emit到android----------------------//
	//-----------------------------------------------//
	setInterval(function(){
		if(CO>=100){			
			count0++;
			if(count0==1){
				worco=5;
			}else{
				worco=0;
				count0=0;
				};
			};				
			if(count0>=120){
				count0=0;
			};
		//--------------------------
		if(CO2>=1000){			
			count1++;
			if(count1==1){
				worco2=1;
			}else{
				worco2=0;
				count1=0;
				};
			};				
			if(count1>=120){
				count1=0;
			};
			
		//---------------------------
		if(CH4>=1000){			
			count2++;
			if(count2==1){
				worch4=2;
			}else{
				worch4=0;
				count2=0;
				};
			};				
			if(count2>=120){
				count2=0;
			};
		//---------------------------
		if(pm25>=35){			
			count3++;
			if(count3==1){
				worpm25=3;
			}else{
				worpm25=0;
				count3=0;
				};
			};				
			if(count3>=120){
				count3=0;
			};
		//---------------------------
		if(pm10>=75){			
			count4++;
			if(count4==1){
				worpm10=4;
			}else{
				worpm10=0;
				count4=0;
				};
			};
			
			if(count4>=120){
				count4=0;
			};
		//---------------------------
		socket.emit("WORR",{'worrco':worco.toString(),'worrco2':worco2.toString(),'worrch4':worch4.toString(),'worrpm25':worpm25.toString(),'worrpm10':worpm10.toString()});

	}, 1000);

	socket.on("xyz", function (data){		//index那邊會有socket.emit，對應xyz
		if(data.c != null){fun(data.c);data.c = null;}
		});

	
//-------------Surch-Data------------------//	
	socket.on("chwordata", function (data){		//index那邊會有socket.emit，對應xyz
		tttt=data.chdata;	
		if (tttt==1){epm25=65;}
		if (tttt==2){epm10=125;}
		if (tttt==3){eco2=1000;}
		if (tttt==4){eco=200;}
		if (tttt==5){ech4=50;}
	});
});

router.get('/data', function(req, res) {
	if(tttt==1){
	getdbdata.find()
	.gte('pm25', epm25)
	.select('-_id') //不顯示id和V欄位
	.sort({'Time': -1})
    .exec(function(err, docs){ 
		res.render('data',{docs:docs})
	   });
	}if(tttt==2){
	getdbdata.find()
	.gte('pm10', epm10)
	.select('-_id') 
	.sort({'Time': -1})
    .exec(function(err, docs){ 
		res.render('data',{docs:docs})
	   });
	}if(tttt==3){
	getdbdata.find()
	.gte('CO2', eco2)
	.select('-_id')
	.sort({'Time': -1})
    .exec(function(err, docs){ 
		res.render('data',{docs:docs})
	   });
	}if(tttt==4){
	getdbdata.find()
	.gte('CO', eco)
	.select('-_id')
	.sort({'Time': -1})
    .exec(function(err, docs){ 
		res.render('data',{docs:docs})
	   });
	}if(tttt==5){
	getdbdata.find()
	.gte('CH4', ech4)
	.select('-_id')
	.sort({'Time': -1})
    .exec(function(err, docs){ 
		res.render('data',{docs:docs})
	   });
	}
	if(tttt==6){
	getdbdata.find()
	.select('-_id')
	.limit(100)
	.sort({'Time': -1})
    .exec(function(err, docs){ 
		res.render('data',{docs:docs})
	   });
	}else{
	getdbdata.find()
	.limit(100)
	.select('-_id')//不顯示id和V欄位
	.sort({'Time': -1})
    .exec(function(err, docs){ 
		res.render('data',{docs:docs})
	   });
	}
});
		

//-----T------E------S-------T-------//
function Time(){
	var x = new Date();
	var Tstr = x.getFullYear()+"年"+(((x.getMonth()+1)<10)?("0"+(x.getMonth()+1)):(x.getMonth()+1))+"月"+
	((x.getDate()<10)?("0"+x.getDate()):x.getDate())+"日"+((x.getHours()<10)?("0"+x.getHours()):x.getHours())+"時"+
	((x.getMinutes()<10)?("0"+x.getMinutes()):x.getMinutes())+"分"+((x.getSeconds()<10)?("0"+x.getSeconds()):x.getSeconds())+"秒";
	return Tstr;
}

function fun(c){(c == "0") ? nsport.write("0"):nsport.write("1");}