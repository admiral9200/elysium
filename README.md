# Elysium

The project is a NFT marketplace that is built on the Ethereum blockchain. It is my final year project for my Bachelor of Computer Science (Software Engineering) with Honour at the Universiti Malaysia Sarawak.

## Project Description

User Guide:

- [User Guide](https://elysium-user-guide.vercel.app/)

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
VITE_MARKET_CONTRACT_ADDRESS="0x583a9Bd3E45501e034235A12D10B7935A8Cd129E"
VITE_FACTORY_CONTRACT_ADDRESS="0x716F7A753dc50310Fb25AeADaA7f699A708C7Db0"
# setup a pinata account using https://pinata.cloud/
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

email: lion9200.world@gmail.com
