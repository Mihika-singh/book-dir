const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const app=express();
const port=process.env.PORT || 3000;
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/bookDB",{useNewURLParser:true});
const bookSchema=new mongoose.Schema({
    name:String,
    price:Number,
    desc:String
})
const Book=mongoose.model("Book",bookSchema);
 app.get("/books",function(req,res){
     Book.find(function(err,foundBook){
       if(!err){
        res.send(foundBook);
       }  else{
           res.send(err);
       }
     })
 });
app.post("/books",function(req,res){
     const newBook=new Book({
        name:req.body.name,
        price:req.body.price,
        desc:req.body.desc
    })
    newBook.save(function(err){
        if(!err){
            res.send("successfully added");
        }
    })
})
app.route("/books/:bookName")
.get(function(req,res){
    Book.findOne({name:req.params.bookName},function(err,foundBook){
        if(foundBook){
            res.send(foundBook)
        }else{
            res.send(err)
        }
    })
})
 
.patch(function(req,res){
    Book.updateOne(
    {name:req.params.bookName},
    {$set:req.body},
    function(err){
        if(!err){
res.send("successfully updated")
        }else{
            res.send(err);
        }
    })
})
.delete(function(req,res){
    Book.deleteOne(
        {name:req.params.bookName},
        function(err){
            if(!err){
                res.send("successfully deleted");
            }else{
                res.send(err)
            }
        })
})
app.listen(4000,function(){
    console.log("server at 4000");
})