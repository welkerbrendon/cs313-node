function setMaxOz(type){
    var max = type == "stamped" || type == "metered" ? 3.5 : 13;

    var input_element = document.getElementById("weight");
    input_element.setAttribute("max", max);

    checkValue(input_element.value);
    if(type == "first-class"){
        addZone();
    }
    else {
        removeZone();
    }
}

function checkValue(input_element, max){
    if (input_element.value > max){
        input_element.value = max;
    }
}

function addZone(){
    var div = document.getElementById("input_elements");

    var p = document.createElement("p");
    p.setAttribute("id", "zone_p");

    var new_input_element = document.createElement("input");
    new_input_element.setAttribute("type", "number");
    new_input_element.setAttribute("min", 1);
    new_input_element.setAttribute("max", 9);
    new_input_element.setAttribute("step", 1);
    new_input_element.setAttribute("name", "zone");
    new_input_element.setAttribute("onchange", "checkValue(this, 9)");

    var label = document.createElement("label");
    label.setAttribute("for", "zone");
    
    var textNode = document.createTextNode("Zone to be delivered to: ");
    label.appendChild(textNode);

    p.appendChild(label);
    p.appendChild(new_input_element);

    div.appendChild(p);
}

function removeZone() {
    var p = document.getElementById("zone_p");
    if(p){
        var div = document.getElementById("input_elements");
        div.removeChild(p);
    }
}