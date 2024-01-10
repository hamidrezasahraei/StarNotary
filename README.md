# StarNotary Dapp

## Introduction
StarNotary is a decentralized application (Dapp) designed for registering and transferring the ownership of stars on the Ethereum blockchain. This project uses Hardhat for smart contract development and React for the front-end interface, all within a single repository.

## Name And Symbol
Star Notary Token - SNT

## Prerequisites
Before starting, ensure you have the following installed:
- Node.js (v12 or later)
- npm (Node Package Manager)
- Git (optional, for cloning the repository)

## Installation
To set up the project locally, follow these steps:

1. **Clone the Repository**
```
git clone [repository-url]
cd starnotary
```

2. **Install Hardhat Dependencies**

```
npm install
```

3. **Install Front-end Dependencies**

```
cd front
npm install
```


## Hardhat Installation
If Hardhat is not installed globally, run the following command in the project root:

```
npm install --save-dev hardhat
```


## Configuration
- **Hardhat Configuration**: Ensure `hardhat.config.js` in the root directory is correctly set up.
- **React Configuration**: Check `package.json` in the 'front' directory is set up correctly.

## Running the Dapp
To run the StarNotary Dapp:

1. **Start a Local Ethereum Node**
```
npx hardhat node
```

2. **Compile and Deploy Smart Contracts**
```
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```

Note the deployed contract address.

3. **Update Contract Address in Front-end**
In `front/src/ethereum/starNotary.js`, update the contract address with the one from deployment.

4. **Start the Front-end Application**
```
cd front
npm start
```


## Testing
- For smart contract tests, in the project root:
```
npx hardhat test
```


## Interacting with the Dapp
After starting the front-end, interact with the Dapp through the web interface. Ensure you have a web3 wallet like MetaMask installed and connected to the `localhost` network.

## Adding Hardhat Local Network to MetaMask
To interact with the Dapp using MetaMask, you need to add the Hardhat local network. Use the following details to set it up:

- Network Name: `Hardhat Local`
- New RPC URL: `http://127.0.0.1:8545` (default Hardhat network RPC URL)
- Chain ID: `31337` (default Hardhat network chain ID)
- Currency Symbol: `ETH`

Don't forget to add accounts with provided data of running HardHat node.

### Steps to Add the Network:
1. Open MetaMask and click on the network selection dropdown at the top.
2. Select "Add Network" or "Custom RPC" at the bottom of the dropdown.
3. In the "Add a Network" form, enter the above details.
4. Click "Save" to add the network.

Now your MetaMask is configured to interact with the Hardhat local network.

## Troubleshooting
If you encounter issues, verify that:
- Node.js and npm are correctly installed and updated.
- All dependencies are installed in the project root and 'front' directories.
- Ethereum network configuration is correct in both MetaMask and Hardhat.

## Contributing
Contributions are welcome! Please create a new issue or pull request for any features or bug fixes.

## License
This project is licensed under the ISC License.
