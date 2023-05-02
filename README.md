# Elysium

The project is a NFT marketplace that is built on the Ethereum blockchain. It is my final year project for my Bachelor of Computer Science (Software Engineering) with Honour at the Universiti Malaysia Sarawak.

## Project Description

Front End:

- [elysium](https://github.com/davidbong-05/elysium.git)

Back End:

- [elysium-mongodb-api](https://github.com/davidbong-05/elysium-mongodb-api.git)
- [elysium-smart-contract](https://github.com/davidbong-05/elysium-smart-contract.git)
- [MongoDB](https://www.mongodb.com/)
- [Pinata](https://pinata.cloud/)

The project is built using the following technologies:

- [Solidity](https://docs.soliditylang.org/en/v0.8.4/)
- [Vite](https://vitejs.dev/)
- [Vue 3](https://v3.vuejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/en/)
- [ethers.js](https://docs.ethers.io/v6/)

## Project Setup

Step 1: Clone the repository

```bash
git clone https://github.com/davidbong-05/elysium.git
```

Step 2: Install dependencies

```bash
npm install
```

Step 3: Rename the .env.example file to .env and fill in the required information

```bash
# .env.example
#the smart contract are deployed to Sepolia testnet
VITE_MARKET_CONTRACT_ADDRESS="0xffD0Cb3C6df61284756beC02F7C74a2012149a6f"
VITE_FACTORY_CONTRACT_ADDRESS="0xf7730c30525deA223cE5F50633B54B9D376b1F7f"
VITE_PINATA_API_KEY="<your pinata api key>"
VITE_PINATA_API_SECRET="<your pinata api secret>"
# setup the back end using https://github.com/davidbong-05/elysium-mongodb-api.git
ELYSIUM_API_URL = <your elysium api url>
```

Step 4: Run the project

```bash
npm run dev
```

Step 5: Open the project in your browser

```bash
http://localhost:5173/
```

This project requires the following to be setup as well:

- [elysium-mongodb-api](https://github.com/davidbong-05/elysium-mongodb-api.git)

Attention: The project is still under development and is not ready for production.

## Contact

email: davidbong05@gmail.com
