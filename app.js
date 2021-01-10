const express= require("express");
const https = require("https");
const bodyParser =require("body-parser");
const mongoose =require("mongoose");
const lodash= require('lodash');

const app=express();
var items=[];
var workItems=[];



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



mongoose.connect("mongodb+srv://admin-shubhrima:Sonline26@cluster0.5ptvb.mongodb.net/todolistDB",{ useNewUrlParser: true, useUnifiedTopology: true});


const itemsSchema = new mongoose.Schema({

	name:  String
});

const Item = mongoose.model("Item", itemsSchema);

const item1= new Item({
	name: "Welcome!"
});



const defaultItems=[item1];


const listSchema ={
	name: String,
	items: [itemsSchema]
};

const List= mongoose.model("List", listSchema);

app.set('view engine', 'ejs');



app.get("/",function(req,res){

	var today =new Date();
	var day ="";

	
	var options={
			weekday:"long",
			day:"numeric",
			month:"long"
		};

		let date =today.toLocaleDateString("en-US",options);

		Item.find(function(err,foundItems){

			if(foundItems.length===0){
				Item.insertMany(defaultItems, function(err){
				if(err){
					console.log(err);
				}else{
					console.log("Successfully added to list");
				}
			});
				res.redirect("/");
			}
					else{
						res.render('list', {topic: "Today", nameofday: date, itemname: foundItems})
					}
	
						
});

});
	
app.get("/:topic",function(req,res){
	let topic=lodash.capitalize(req.params.topic);

	List.findOne({name: topic},function(err,foundList){

		if(!err)
		{
			if(!foundList) 	{
			 		const list= new List({
			name: topic,
			items: defaultItems
		});

			list.save(); 
			res.redirect("/"+topic);
		}
			else { res.render('list', {topic: foundList.name, nameofday: " ", itemname: foundList.items}); }
		}
		else{
			console.log(err);
		}
	})

	
});



app.post("/",function(req,res){
		let itemName =req.body.newItem;
		let listName= req.body.list;

		const item= new Item({
			name: itemName
		});

		if(listName==="Today"){ 
		item.save();
		res.redirect("/");}
		else{
			List.findOne({name: listName}, function(err,foundList){
				foundList.items.push(item);
				foundList.save();
				res.redirect("/"+listName);
			})
		}
				
		
		
	});



	app.post("/delete", function(req,res){
		const checkedItem= req.body.checkbox;
		const listName= req.body.listName;

		var user_id = checkedItem; 

		if(listName==="Today")
		{
			Item.findByIdAndRemove(user_id, function (err, docs) { 
		    if (err){ 
		        console.log(err) 
		    } 
		    else{ 
				res.redirect("/");
		    } 
		}); 
		}
		else{

			List.findOneAndUpdate({name: listName},{$pull:{items:{_id: checkedItem}}}, function(err, foundList){
				if (!err){
					res.redirect("/"+listName);
				}
			});
		}
	});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
	console.log("Server working fine!");
})




/*
if(today.getDay()===0){

		day="Sunday";
	}
	else if(today.getDay()===1){

		day="Monday";
	}
	else if(today.getDay()===2){

		day="Tuesday";
	} 
	else if(today.getDay()===3){

		day="Wednesday";
	}
	else if(today.getDay()===4){

		day="Thursday";
	}
	else if(today.getDay()===5){

		day="Friday";
	}
	else if(today.getDay()===6){

		day="Saturday";
	}
	else{

		day="Error";
	}


	*/