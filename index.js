import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const newItem = [];
const newWorkItem = [];

app.get("/", (req,res) => {
    res.render("index.ejs",{newListItem : newItem});
})

app.get("/Work", (req,res) => {
    res.render("index_work.ejs",{newWorkListItem : newWorkItem});
})

app.post("/", (req,res) =>{
    newItem.push(req.body["item"]);
    res.redirect("/");
    console.log(newItem);
})

app.post("/Work", (req,res) =>{
    newWorkItem.push(req.body["work-item"]);
    res.redirect("/Work");
    console.log(newWorkItem);
})


app.listen(port);