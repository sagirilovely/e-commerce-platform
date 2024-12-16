function sum(){
    let sum=0;
    for(let i of arguments){
        sum=sum+i;
    }
    return sum;
}
module.exports=sum;