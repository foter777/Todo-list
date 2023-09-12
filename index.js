//import express from "express";
//import bodyParser from "body-parser";
//import mongoose from 'mongoose';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});

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
    const availableList = await List.findOne({name:customListName});
    if (!availableList){
        const list = new List({
            name: customListName,
            items:[]
        });
        list.save();
    }
    const foundItems = await List.find({});
    const foundList = await List.findOne({name:customListName});
    res.render("index.ejs",{newListItem: foundItems, name:customListName, itemList: foundList.items});
    
})

app.get("/:customListName", async (req,res) => {
    const customListName = req.params.customListName;
    const foundList = await List.findOne({name:customListName});
    const foundItems = await List.find({});
    res.render("index.ejs",{newListItem: foundItems, name:foundList.name, itemList: foundList.items});

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
    if (listName == "Home"){
        res.redirect("/");
    }
    else{
        res.redirect("/" + listName);
    }
    
})

app.post("/NewList", async (req,res) =>{
    const listName = req.body.item;
    if (! await List.findOne({name:listName})){
    const list = new List({
        name:listName,
        items:[]
    });
    list.save();
    }
    res.redirect("/"+listName);
})

app.post("/Delete", async (req,res) =>{
    const itemID = req.body.checkbox;
    const listName = req.body.listName;

    await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemID}}});
    res.redirect("/" + listName);


})


app.listen(port);