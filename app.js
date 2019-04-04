var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var express = require("express");
var app = express();

// app config
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {
    useNewUrlParser: true
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
// method override
var methodOverride = require("method-override");
app.use(methodOverride("_method")); //argument tells app.js what to look for : ours is _method


// MONGOOSE/ MODEL config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now()
    }
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Laptop Essentials",
//     image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "This is my Setup"
// });

// RESTful Routes
app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX route
app.get("/blogs", function (req, res) {
    Blog.find({}, function (error, allBlogs) {
        if (error) {
            console.log(error);
        } else {
            res.render("index", {
                blogs: allBlogs
            });
        }
    });
});

// NEW route
app.get("/blogs/new", function (req, res) {
    res.render("new");
});

// CREATE route
app.post("/blogs", function (req, res) {
    // create blog
    Blog.create(req.body.blog, function (error, newBlog) {
        if (error) {
            alert("Failed to created new Blog");
            res.render("new");
        } else {
            // redirect
            res.redirect("/blogs")
        }
    })
});

// SHOW route
app.get("/blogs/:id", function (req, res) {
    // Find the blog with the provided ID
    // Blog.findById(id,callback function)
    Blog.findById(req.params.id, function (error, foundBlog) {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.render("show", {
                blog: foundBlog
            });
        }
    });
});

// EDIT route
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (error, foundBlog) {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {
                editBlog: foundBlog
            });
        }
    });
});

// UPDATE  route
app.put("/blogs/:id", function (req, res) {
    // Blog.findByIdAndUpdate(id,newData, callback)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (error, updatedBlog) {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE route
app.delete("/blogs/:id", function (req, res) {
    // res.send("You have reached the destroy route");

    //Destroy blog
    Blog.findByIdAndRemove(req.params.id, function (error) {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
    // Redirect
});

// TESTING

// CONNECT
app.listen(3000, process.env.IP, function (req, res) {
    console.log("Server has started");
})