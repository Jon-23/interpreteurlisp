
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
function lispEvalToString(object){
    // console.log(object);
    texte = "";
    object_temp = []
    if ((object).constructor.name === "Array"){
        object_temp = object
    }else if ((object).constructor.name == "Number"){
        texte += "\n" + object;
    }else if ((object).constructor.name === "String"){
        texte += '\n "' + object + '"';
    }else if((object).constructor.name === "Object"){
        object_temp.push(object);
    }else{
        return "Error";
    }
    // for(var i=0; i<object.length; i++){
    //     // console.log(i);
    //     local_object = object[i];
    //     if(typeof(local_object.value) == "undefined" || typeof(local_object.value) == "undefined" || typeof(local_object.name) == "undefined"){
    //         continue;
    //     }else{
    //         if(texte != ""){
    //             texte += "\n";
    //         }
    //         local_object.type = local_object.type.toLowerCase();
    //         if(local_object.type == "string"){
    //             local_object.value = '"'+local_object.value+'"';
    //         }
    //         texte += capitalizeFirstLetter(local_object.type) + " " + local_object.name + " = " + local_object.value + ";";
    //     }
    // }
    for(var i=0; i<object.length; i++){
        // console.log(i);
        local_object = object[i];
        if(typeof(local_object.value.type) == "undefined" || typeof(local_object.value.value) == "undefined" || typeof(local_object.name) == "undefined"){
            if(typeof(local_object.type) != "undefined"){
                // console.log(local_object.type);
                if(local_object.type == "num"){
                    if(texte != ""){
                        texte += "\n";
                    }
                    texte += local_object.value;
                }else if(local_object.type == "str"){
                    if(texte != ""){
                        texte += "\n";
                    }
                    texte +=  local_object.value + '"';
                }else{
                    continue;
                }
            }else{
                continue;
            }
            
        }else{
            if(texte != ""){
                texte += "\n";
            }
            local_object.value.type = local_object.value.type.toLowerCase();
            if(local_object.value.type == "str"){
                local_object.value.value = '"'+local_object.value.value+'"';
            }
            texte += capitalizeFirstLetter(local_object.value.type) + " " + local_object.name + " = " + local_object.value.value + ";";
        }
    }
    return texte;
}


function printf(elements){
    console.log("Debut print:");
    console.log(lispEvalToString(elements));
}

module.exports.printf = printf;