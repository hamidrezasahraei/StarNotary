const { expect } = require("chai");
const hre = require("hardhat");

describe("StarNotary contrcat", function() {
    // Global vars
    let instance;
    let owner;
    let user1;
    let user2;

    this.beforeEach(async function () {
        instance = await ethers.deployContract("StarNotary");
        [owner, user1, user2] = await hre.ethers.getSigners();
    });

    it('can Create a Star', async function () {
        let tokenId = 1;
        await instance.createStar("Awesome Star!", tokenId)
        expect(await instance.tokenIdToStarInfo(tokenId)).to.equal("Awesome Star!")
    })

    it('lets owner put up their star for sale', async function () {
        let starId = 2;
        let starPrice = 10;
        await instance.createStar('Second Awesome Star!', starId);
        await instance.putStarUpForSale(starId, starPrice);
        expect(await instance.starsForSale(starId)).to.equal(starPrice);
    })

    it('lets owner get the funds after the sale', async() => {
        let starId = 3;
        let starPrice = hre.ethers.parseEther("10"); // Convert 10 Ether to Wei
        await instance.createStar('awesome star', starId);
        await instance.putStarUpForSale(starId, starPrice);

        // Owner approves user1 to transfer the star
        await instance.connect(owner).approve(user1.address, starId);

        let balanceOfOwnerBeforeTransaction = await hre.ethers.provider.getBalance(owner.address);
        
        // Send Ether along with the transaction
        await instance.connect(user1).buyStar(starId, { value: starPrice });
    
        let balanceOfOwnerAfterTransaction = await hre.ethers.provider.getBalance(owner.address);

        let value1 = balanceOfOwnerBeforeTransaction + starPrice;
        let value2 = balanceOfOwnerAfterTransaction;
        expect(value1).to.equal(value2);
    });

    it('lets user2 buy a star, if it is put up for sale', async() => {
        let starId = 4;
        let starPrice = hre.ethers.parseEther("10");
        await instance.createStar('awesome star', starId);
        await instance.putStarUpForSale(starId, starPrice);
        await instance.approve(user2.address, starId);
        await instance.connect(user2).buyStar(starId, {value: starPrice});
        expect(await instance.ownerOf(starId)).to.equal(user2);
    });
    
    it('lets user2 buy a star and decreases its balance in ether', async() => {
        let starId = 5;
        let starPrice = hre.ethers.parseEther("10");
        let gasPrice = 88529167n
        await instance.createStar('awesome star', starId);
        await instance.putStarUpForSale(starId, starPrice);
        await instance.approve(user2.address, starId);
    
        const balanceOfUser2BeforeTransaction = await hre.ethers.provider.getBalance(user2.address);
        const tx = await instance.connect(user2).buyStar(starId, {value: starPrice, gasPrice: gasPrice});
        const receipt = await tx.wait();

        const gasUsed = receipt.gasUsed * gasPrice;

        const balanceAfterUser2BuysStar = await hre.ethers.provider.getBalance(user2.address);
        const totalCost = starPrice + gasUsed;
        const balanceChange = balanceOfUser2BeforeTransaction - balanceAfterUser2BuysStar;
    
        expect(balanceChange).to.equal(totalCost);
    });

    it('can add the star name and star symbol properly', async() => {
        expect(await instance.name()).equal("Star Notary Token")
        expect(await instance.symbol()).equal("SNT")
    });

    it('lets 2 users exchange stars', async() => {
        let starId1 = 12;
        let starId2 = 21;
        await instance.connect(user1).createStar('awesome star 12', starId1);
        await instance.connect(user2).createStar('awesome star 21', starId2);
    
        expect(await instance.ownerOf(starId1)).to.equal(user1);
        expect(await instance.ownerOf(starId2)).to.equal(user2);
    
        await instance.connect(user1).approve(user2, starId1);
        await instance.connect(user2).approve(user1, starId2);
    
        await instance.connect(user1).exchangeStars(starId1, starId2);
    
        expect(await instance.ownerOf(starId1)).to.equal(user2);
        expect(await instance.ownerOf(starId2)).to.equal(user1);
    });

    it('lets a user transfer a star', async() => {
        let starId1 = 1;
        await instance.connect(user1).createStar('awesome star', starId1);
        expect(await instance.ownerOf(starId1)).to.equal(user1);
        await instance.connect(user1).transferStar(user2, starId1);
        expect(await instance.ownerOf(starId1)).to.equal(user2);
    });
})