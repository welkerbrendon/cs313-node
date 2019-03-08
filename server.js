const express = require("express");
const app = express();

const port = process.env.PORT || 5000;

app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/calculate", calculateResults);

app.listen(port, function() {
    console.log("Now Listenging on port number " + port);
});

function calculateResults(request, response){
    console.log("Calculating results.");

    const postage_type = request.query.postage_type;
    const postage_weight = request.query.weight;

    console.log("Postage type is " + postage_type);
    console.log("Postage weight is " + postage_weight);
}