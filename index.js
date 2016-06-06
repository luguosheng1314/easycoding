var fs=require("fs");
var path=require("path");

function readModel(file){
   fs.readFile(__dirname+'/demo/html/'+file+'.html',{flag:'r+',encoding:'utf8'},function(err,data){
   		if(err){
   			console.error(err);
   			return;
   		}
   		console.log(data);
   		console.log(process.argv[0]);
   		console.log(process.argv[1]);
   		console.log(process.argv[2]);
   })
}
if(process.argv[2]){
	readModel(process.argv[2]);
}
