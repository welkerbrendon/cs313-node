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
    const zone = request.query.zone;

    console.log("Postage type is " + postage_type);
    console.log("Postage weight is " + postage_weight);
    console.log("Zone is " + zone);

    calculatePrice(postage_type, postage_weight, zone, function(params) {
        console.log(params);
        response.render("results", params);
    });
}

function calculatePrice(type, weight, zone, handleResult){
     var cost = -1;
     switch(type){
        case "stamped":
            cost = calculateStamped(weight);
            break;
        case "metered":
            cost = calculateMetered(weight);
            break;
        case "flats":
            cost = calculateFlats(weight);
            break;
        case "first-class":
            cost = calculateFirstClass(weight, zone);
            break;
     }

     console.log(cost);
     if(type == "stamped" || type == "metered"){
         type += " letter";
     }
     else if(type == "flats"){
         type = "flat envelope";
     }
     else {
         type += " package";
     }

     cost = cost.toFixed(2);
     var zone_message = zone ? " shipped to zone " + zone + " " : "";

     const params = {type: type, weight: weight, cost: cost, zone: zone_message};
     handleResult(params);
}

function calculateStamped(weight){
    return weight <= 1 ? 0.55 : weight <= 2 ? 0.7: weight <= 3 ? 0.85: weight <= 3.5 ? 1 : -1;
}

function calculateMetered(weight){
    return weight <= 1 ? 0.5 : weight <= 2 ? 0.65: weight <= 3 ? 0.8: weight <= 3.5 ? .95 : -1;
}

function calculateFlats(weight){
    var cost = -1;
    if(weight >= 1 && weight <= 13){
        cost = 1;
        weight--;
        cost += weight * .15;
    }
    else if(weight < 1){
        cost = 1;
    }

    return cost;
}

function calculateFirstClass(weight, zone){
    console.log("weight=" + weight);
    console.log("zone=" + zone);
    if (weight <= 4){
        if(zone < 7){
            var cost = 3.66;
            return (zone - 2) > 0 ? cost + ((zone - 2) * .04) : 0;
        }
        return zone == 7 ? 3.94 : 4.06;
    }
    else if (weight <= 8){
        return zone <= 2 ? 4.39 :
               zone == 3 ? 4.44 :
               zone == 4 ? 4.49 :
               zone == 5 ? 4.53 :
               zone == 6 ? 4.57 :
               zone == 7 ? 4.69 : 4.81
    }
    else if (weight <= 12){
        return zone <= 2 ? 5.19 :
               zone == 3 ? 5.24 :
               zone == 4 ? 5.3 :
               zone == 5 ? 5.35 :
               zone == 6 ? 5.4 :
               zone == 7 ? 5.53 : 5.66;
    }
    else if (weight == 13){
        return zone <= 2 ? 5.71 :
               zone == 3 ? 5.78 :
               zone == 4 ? 5.85 :
               zone == 5 ? 5.93 :
               zone == 6 ? 5.99 :
               zone == 7 ? 6.13 : 6.27;
    }
}