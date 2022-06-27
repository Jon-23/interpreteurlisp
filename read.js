function read(exp){
    const arr = exp.split(/( )/g);
    console.log(arr);
    const y = arr.reduce((res, current)=>{
        const isNumber = new RegExp('^[0-9]*$').test(current);
        if(isNumber){
            res = {type:"num", val: Number(current)}
        }
        else {
            res= {type:"var", name: current}
        }
        return res;
    },{} );
    console.log(y);

}

module.exports.read = read;