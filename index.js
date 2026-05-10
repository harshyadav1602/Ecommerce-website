const express=require("express");
const mongoose=require("mongoose");
const Listing=require("./Models/model1.js");
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const app=express();
const port=process.env.PORT || 8080;

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.listen(port,()=>{
    console.log(`server is listening at port ${port}`);
});


//database
main().then((res)=>{
    console.log("connection to mongoDB is successful");
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/E-Commerce');
}



//root
app.get("/",(req,res)=>{
    res.send('this is root page');
});

//home route
app.get("/home",async(req,res)=>{
    try {
        let listings=await Listing.find({});
        res.render("allPages/home.ejs",{listings});
    } catch (err) {
        console.log(err);
        res.send("Error loading listings");
    }
});

//show route
app.get("/show/:id",async(req,res)=>{
    try {
        let {id}=req.params;
        let listing=await Listing.findById(id);
        if (!listing) {
            return res.send("Listing not found");
        }
        res.render("allPages/show.ejs",{listing});
    } catch (err) {
        console.log(err);
        res.send("Error loading listing");
    }
});


//edit route
app.get("/edit/:id",async(req,res)=>{
    try {
        let {id}=req.params;
        let listing=await Listing.findById(id);
        if (!listing) {
            return res.send("Listing not found");
        }
        res.render("allPages/edit.ejs",{listing});
    } catch (err) {
        console.log(err);
        res.send("Error loading listing");
    }
});

//new route
app.get("/new",(req,res)=>{
    res.render("allPages/new.ejs");
});

//create route
app.post("/",async(req,res)=>{
    try {
        let newListing=new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/home");
    } catch (err) {
        console.log(err);
        res.send("Error creating listing");
    }
});

//update route
app.put("/:id",async(req,res)=>{
    try {
        let {id}=req.params;
        let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if (!listing) {
            return res.send("Listing not found");
        }
        res.redirect(`/show/${id}`);
    } catch (err) {
        console.log(err);
        res.send("Error updating listing");
    }
});

//delete route
app.delete("/:id",async(req,res)=>{
    try {
        let {id}=req.params;
        let listing = await Listing.findByIdAndDelete(id);
        if (!listing) {
            return res.send("Listing not found");
        }
        res.redirect("/home");
    } catch (err) {
        console.log(err);
        res.send("Error deleting listing");
    }
});




