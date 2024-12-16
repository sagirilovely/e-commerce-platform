const chai=require('chai');
chai.should();

function returnHello(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('Hello');
        },2000)
    })
}
describe('A组测试',()=>{
    it('应当返回字符串',async()=>{
        let value= await returnHello();
        value.should.be.a('string');
        value.should.exist.and.equal('hello');
    })
})
