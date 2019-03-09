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
     const params = {type: type, weight: weight, cost: cost};
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
     var cost = -1;
     if (weight <= 4){
        if(zone < 7){
            cost = 3.66;
            cost += (zone - 2) > 0 ? (zone - 2) * .04 : 0;
        }
        else if (zone = 7){
            cost = 3.94;
        }
        else {
            cost = 4.06;
        }
     }
     else if (weight <= 8){
        switch(zone){
            case 1:
            case 2:
                cost = 4.39;
                break;
            case 3:
                cost = 4.44;
                break;
            case 4:
                cost = 4.49;
                break;
            case 5:
                cost = 4.53;
                break;
            case 6:
                cost = 4.57;
                break;
            case 7:
                cost = 4.69;
                break;
            case 8:
            case 9:
                cost = 4.81;
                break;
        }
     }
     else if (weight <= 12){
        switch(zone){
            case 1:
            case 2:
                cost = 5.19;
                break;
            case 3:
                cost = 5.24;
                break;
            case 4:
                cost = 5.3;
                break;
            case 5:
                cost = 5.35;
                break;
            case 6:
                cost = 5.4;
                break;
            case 7:
                cost = 5.53;
                break;
            case 8:
            case 9:
                cost = 5.66;
                break;
        }
     }
     else if (weight == 13){
        switch(zone){
            case 1:
            case 2:
                cost = 5.71;
                break;
            case 3:
                cost = 5.78;
                break;
            case 4:
                cost = 5.85;
                break;
            case 5:
                cost = 5.93;
                break;
            case 6:
                cost = 5.99;
                break;
            case 7:
                cost = 6.13;
                break;
            case 8:
            case 9:
                cost = 6.27;
                break;
        }
     }

     return cost;
}