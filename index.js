const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://foter777:corsair777@cluster0.5ieun9d.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};

const listSchema = {
    name:String,
    items:[itemsSchema]
};

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);


app.get("/", async (req,res) => {
    const customListName = "Home";
    res.redirect("/" + customListName);
 
})

app.get("/:customListName", async (req,res) => {
    const customListName = req.params.customListName;
    if (! await List.findOne({name:customListName})){
        const list = new List({
            name:customListName,
            items:[]
        });
        list.save();
        res.redirect("/"+ customListName);
        }
    else{
        const foundList = await List.findOne({name:customListName});
        const foundItems = await List.find({});
        res.render("index.ejs",{newListItem: foundItems, name:foundList.name, itemList: foundList.items});
    }
})

app.post("/", async (req,res) =>{
    const itemName = req.body.item;
    const listName = req.body.list;
    const newItem = new Item({
        name: itemName
    });
    const foundList = await List.findOne({name:listName});
    foundList.items.push(newItem);
    foundList.save();
    res.redirect("/" + listName);
    
})

app.post("/NewList", async (req,res) =>{
    const listName = req.body.item;
    res.redirect("/"+listName);
})

app.post("/Delete", async (req,res) =>{
    const itemID = req.body.checkbox;
    const listName = req.body.listName;
    await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemID}}});
    res.redirect("/" + listName);
})


app.listen(port);