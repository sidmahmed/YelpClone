var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

// Connect to database
mongoose.connect('mongodb://localhost:27017/yelp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(`Error connecting to server: ${err}`);
    });

var data = [
	{
		name: "Redwood National Park", 
		image:"https://images.unsplash.com/photo-1534880606858-29b0e8a24e8d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80", 
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		price: 25,
		location: "Redwood County, Texas"
	},
	{
		name: "Dharmashala",
		image : "https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80",
		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		price: 12,
		location: "Himachal, India"

	},
	{
		name: "Sugarloaf Provincial Park",
		image: "https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1388&q=80",
		description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
		price: 30,
		Location: "Sugarloaf, New South Wales"
	}
	
]

const seedDB = async () => {
	for(let camp of data) {
		const campground = new Campground(camp);
		const comment = new Comment({
			text: "This is a great place",
			author: "Homer"
		});
		campground.comments.push(comment);
		await campground.save();
		await comment.save();
		
		console.log("campground created")

	}
}

seedDB();

module.exports = seedDB;