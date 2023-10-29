const {ethers} = require ("hardhat")
const {expect, assert} = require ("chai")



describe("SimpleStorage",function (){
let factory, simpleStorage
beforeEach(async function (){


factory = await ethers.getContractFactory("SimpleStorage")
simpleStorage = await factory.deploy()
console.log("deployed")


})

it("should start with a fav number of 0", async function(){

const currentvalue = await simpleStorage.retrieve()
const expected= "0"

assert .equal(currentvalue.toString(), expected)
})

it("should update when store called", async function(){

 const expected= "7"
 const response = await simpleStorage.store(7)

  const currentvalue = await simpleStorage.retrieve()
  assert .equal(currentvalue.toString(), expected)
  })

  it("should add person when used", async function(){

    const person= "joe"
    const favnumber = 31
    await simpleStorage.addPerson(person,favnumber)
    
    const test2 = await simpleStorage.nameToFavoriteNumber(person)
    await console.log( test2)

   
    assert.equal(test2.toString(), favnumber.toString())
    })


})