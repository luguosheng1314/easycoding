// node index output  xxx
// node index config  set path=xxx
// node index see -l  -v  -h


var fs=require("fs");
var path=require("path");
var ncp=require("copy-paste");

var setting,templateList=[];
function logHelp(){
	console.log("1.output  [-html]|[-js]     templateName");
	console.log("2.config  set path=xxx      配置输出路径");
	console.log("3.see     [-l]|[-v]|[-h]    查看列表|版本|帮助文档");
	console.log("4.input   [-ashtml]|[-asjs] d:\\test.html  newfileName")
}
//读取配置文件
function readSettingFile(callback){
   fs.readFile(__dirname+'/setting.json',{flag:'r+',encoding:'utf8'},function(err,data){
   		if(err){
   			console.error(err);
   			return;
   		}
   		// console.log(setting);
   		setting=JSON.parse(data);
   		if(typeof callback=="function"){
   			callback(setting);
   		}
   })
}
//读取模板文件
function readTemplateFile(file,type){
   fs.readFile(__dirname+'/demo/'+type+'/'+file+'.'+type,{flag:'r+',encoding:'utf8'},function(err,data){
   		if(err){
   			console.error(err);
   			return;
   		}
   		copyIn(data);
   })
}
//保存配置
function saveSettingFile(str){  
    fs.writeFile(__dirname+'/setting.json', str, function(err){  
        if(err)  
            console.log("fail " + err);  
        else  
            console.log("write success");  
    });  
}
//添加模板
function addTemplate(dir,type,name){
	 fs.readFile(dir,{flag:'r+',encoding:'utf8'},function(err,data){
   		if(err){
   			console.error(err);
   			return;
   		}
   		fs.writeFile(__dirname+"/demo/"+type+"/"+name,data,function(){
   			if(err){
   				console.error(err);
   				return;
   			}
   			console.log("save success!");
   		})
   })
}
//读取模板列表
var loadCount=0;
function readDirList(dir,s){
	loadCount++;
	var dirPath=__dirname+'/'+dir;
	fs.readdir(dirPath, function(err, list) {
	    if (err) {
	        console.log("fail " + err); 
	    }
	     var pending = list;
	    // console.log(list);
		loadList(list);
		 // console.log(templateList);
	    function loadList(list){
	    	loadCount--;
	    	var tag=true;
	    	for(var i=0,len=list&&list.length||0;i<len;i++){
	    		if(list[i]){
		    		if(/^\w+$/.test(list[i])){
		    			tag=false;
		    			readDirList(dir+list[i]+"/",true);
		    		}else{
		    			templateList.push(dir+list[i]);
		    		}
	    		}
	    	}
	    	if(loadCount==0){
	    		console.log(templateList);
	    	}  	
	    }
    });
}


function readHtml(fileName){
	readTemplateFile(fileName,"html");
}
function readJs(fileName){
	readTemplateFile(fileName,"js");
}

function readList(){
	readDirList('demo/');
}

function copyIn(text){
   ncp.copy(text,function(){console.log("模板已经为您复制到剪切板！")});
}
function saveHtml(dir,name){
	addTemplate(dir,"html",name)
}
//行动列表
var actionObj={
	"see":{
		"-l":function(){
			readList();
		},
		"-v":function(){
			 readSettingFile(function(setting){
				console.log(setting.version);
	       	  });
		},
		"-h":function(){
			 logHelp();
		}

	},
	"output":{
         "-html":function(name){
         	readHtml(name);
         },
         "-js":function(name){
         	readJs(name)
         }
	},
	"input":{
		"-ashtml":function(dir,name){
              saveHtml(dir,name);  
		}
	}
}
//别名
actionObj["o"]=actionObj.output;

//执行命令
var command=process.argv;
var temp=actionObj;
for(var i=2;i<command.length;i++){
   temp=temp[command[i]];
   if(typeof temp=="function"){
   	  temp.apply({},command.slice(i+1));
   	  break;
   }

}
