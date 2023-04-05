const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { param } = require("express/lib/request");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true});


const articleSchema=new mongoose.Schema({
    title:String,
    content:String
});

const Article=mongoose.model("Article",articleSchema);

///////////////////////////////////////request targeting all articles////////////////////////////////

app.route("/articles")
.get(function(req,res){
    Article.find()
    .then(function(foundArticles){
        res.send(foundArticles);
    })
    .catch(function(err){
        console.log(err);
    })
})
.post(function(req,res){
    const newArticle=new  Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save()
    .catch(function(err){
        console.log(err);
    });
})
.delete(function(req,res){
    Article.deleteMany()
    .then(function(){
        console.log("succcessfully deleted all data");
    })
    .catch(function(err){
        console.log(err);
    })
});

///////////////////////////////////////request targeting a specfic article////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle})
    .then(function(article){
        res.send(article);
    })
    .catch(function(err){
        res.send("no article matching that title was found.");
    })
})
.put(function(req,res){
    Article.findOneAndUpdate(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content}
        )
        .then(function(){
            res.send("Seccessfully updated article.");
            res.send("Seccessfully updated article.");
        })
        .catch(function(err){
            console.log(err);
        })
    })
    .patch(function(req,res){
        Article.updateOne({title:req.params.articleTitle},
            req.body
            )
    .then(function(){                
        res.send("Seccessfully updated article.");
    })
    .catch(function(err){
        console.log(err);
    });
})
.delete(function(req,res){
    Article.findOne({title:req.params.articleTitle})
    .then(function(article){
        if(article){
            Article.deleteOne({title:req.params.articleTitle})
            .then(function(){
                res.send("succesfully deleted");
            })
            .catch(function(err){
                console.log(err);
            })
        }
        else{
            res.send("not found");
        }
    })
    .catch(function(err){
        console.log(err);
    })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});




/* data
[
    {
        "_id": "642d50751a07c43ae252fce1",
        "title": "REST",
        "content": "rest is short form of represtational state Transfer,Its an architectural style for designing APIs"
    },
    {
        "_id": "5c139771d79ac8eac11e754a",
        "title": "API",
        "content": "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
    },
    {
        "_id": "5c1398aad79ac8eac11e7561",
        "title": "Bootstrap",
        "content": "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
    },
    {
        "_id": "5c1398ecd79ac8eac11e7567",
        "title": "DOM",
        "content": "The Document Object Model is like an API for interacting with our HTML"
    },
    {
        "_id": "642d6ef615ca420c8d911ddf",
        "title": "jack Bauer",
        "content": "lsdjhf sdjf hd hf dh dsh kdsh kfh sdklfhsd fklhlsdjhf sdjf hd hf dh dsh kdsh kfh sdklfhsd fklhlsdjhf sdjf hd hf dh dsh kdsh kfh sdklfhsd fklhlsdjhf sdjf hd hf dh dsh kdsh kfh sdklfhsd fklh",
        "__v": 0
    }
]

*/