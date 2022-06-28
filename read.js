function read(exp){
    const isNumber = new RegExp("^[0-9]*$").test(exp);
    return isNumber
        ? { type: "num", val: Number(exp) }
        : { type: "var", name: exp };

}

module.exports.read = read;