const {
    latestBlock,
} = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time")
const { ethers, run, network } = require("hardhat")

async function main() {
    // Start deployment, returning a promise that resolves to a contract object
    const SimpleStorageFactory =
        await ethers.getContractFactory("SimpleStorage")
    console.log("Deploying SimpleStorage...")

    // The `deploy` function returns a promise; make sure to `await` it.
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.waitForDeployment() // waiting for the deploy transaction

    // Check the transaction status. A status of 0 indicates that the transaction failed.
    // A status of 1 indicates success.
    const contractAddress = simpleStorage.target
    console.log("SimpleStorage deployed to:" + contractAddress)
    await sleep(2000)
    let currentblock = await ethers.provider.getBlockNumber()
    //console.log(await (network.config.chainId))
   
    if (network.config.chainId != 31337) {
        await blockwait(2)
        await verify(contractAddress, [])
    } else {
        console.log("It has been deployed to hardhat network, not verifying.")
    }

    const currentvalue = await simpleStorage.retrieve()
    console.log("current value is:" + currentvalue)
    sleep(2000)
    const transactionresponse = await simpleStorage.store(3)
    if (network.config.chainId != 31337) {
        await blockwait(2)
    }
    const updatedvalue = await simpleStorage.retrieve()
    console.log("current value:" + updatedvalue)
}
async function verify(contractAddress, args) {
    console.log("Trying to Verify contract")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
        console.log("verified")
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("already verified")
        } else {
            console.log(e)
        }
    }
}

async function blockwait(blocks) {
    const currentblock = await ethers.provider.getBlockNumber()
    while ((await ethers.provider.getBlockNumber()) != currentblock + blocks) {
        console.clear()
        console.log(
            "Current block:           " +
                ((await ethers.provider.getBlockNumber()) +
                    "\nCode will wait till:     " +
                    (currentblock + blocks)),
        )
        await sleep(2000)
    }
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
