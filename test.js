function assertEquals(actual, expected) {
    return_value = "";
    for (var i = 0; i < actual.length; i++) {
        switch (actual[i]['type']){
            case 'string': 
                return_value +=  actual[i]['val'];
                break;
                
            case 'number':
                return_value += actual[i]['val'].toString();
                break;
            default:
                console.error("Unexpected type '" + actual[i]['type'] + "'"); 
                return false;
                break;
        } 
    }
    if (return_value === expected){
        console.info("Expected '" + return_value + "' found '" + expected+ "'");
        return true;
    }else{
        console.error("Unexpected return value '" + return_value + "' when expected '" + expected + "'");
        return false;
    }
}

module.exports.assertEquals = assertEquals;