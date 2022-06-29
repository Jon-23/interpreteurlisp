function evalLsp(elements){
    if((elements).constructor.name == "Object"){
        if(typeof(elements.type) != "undefined"){

        }else{
            console.error("Error: undefined")
        }
    }else{
        console.error("Error: Invalid type: " + elements.constructor.name)
        return elements
    }
}