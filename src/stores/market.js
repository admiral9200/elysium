import { ethers } from "ethers";
import { acceptHMRUpdate, defineStore } from "pinia";
import marketContractABI from "../artifacts/contractABI/ElysiumNFTMarketplace.json";
import factoryContractABI from "../artifacts/contractABI/ElysiumNFTFactory.json";
import nftContractABI from "../artifacts/contractABI/ElysiumNFT.json";
import { ref } from "vue";
import axios from "axios";

const marketContractAddress = import.meta.env.VITE_MARKET_CONTRACT_ADDRESS;
const factoryContractAddress = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS;
const apiKey = import.meta.env.VITE_PINATA_API_KEY;
const apiSecret = import.meta.env.VITE_PINATA_API_SECRET;

export const useMarketStore = defineStore("user", () => {
  const account = ref(null);
  const loading = ref(false);

  // function setLoader(boolean) {
  //   console.log("setLoader", value);
  //   loading.value = value;
  // }

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Must connect to MetaMask!");
        return;
      }
      const myAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", myAccounts[0]);
      account.value = myAccounts[0];
    } catch (error) {
      console.log(error);
    }
  };

  const linkCollection = async (user_address, address) => {
    let newCollections = await getLinkedCollection(user_address);
    if (newCollections.length > 0) {
      if (newCollections.includes(address)) {
        return "Already Linked";
      } else {
        newCollections.push(address);
      }
    } else {
      newCollections = address;
    }
    const data = {
      user_address: user_address,
      nft_collection: newCollections,
    };
    console.log(newCollections);

    try {
      const res = await axios.put("/api/collection/", data);
      if (res.data === "404") {
        const newCollection = await axios.post("/api/collection/", data);
        console.log("new collection", newCollection);
      }
      return 200;
    } catch (err) {
      console.log(err);
      return "Something went wrong...";
    }
  };

  const getLinkedCollection = async (user_address) => {
    try {
      const res = await axios.get("/api/collection/" + user_address);
      if (res.status === 200) return res.data;
    } catch (err) {
      if (err.response.status === 404) {
        return [];
      }
      console.log(err);
    }
  };

  const getAllLinkedCollection = async () => {
    try {
      const res = await axios.get("/api/collection/");
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
      if (err.response.status === 404) {
        return [];
      }
      console.log(err);
    }
  };

  const unlinkCollection = async (user_address, tokenIndex) => {
    let newCollections = await getLinkedCollection(user_address);
    newCollections.splice(tokenIndex, 1);
    const data = {
      user_address: user_address,
      nft_collection: newCollections,
    };
    try {
      const res = await axios.put("/api/collection/", data);
      console.log("res", res);
      return 200;
    } catch (err) {
      console.log(err);
      return "Something went wrong...";
    }
  };

  const uploadFileToIPFS = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      }
    );

    return res.data;
  };

  const uploadJSONToIPFS = async (json) => {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      json,
      {
        headers: {
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      }
    );
    return res.data;
  };

  const getTokenMeta = async (tokenHash) => {
    try {
      const res = await axios.get("https://ipfs.io/ipfs/" + tokenHash);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createNFTCollection = async (
    name,
    symbol,
    royaltyFee,
    royaltyRecipient
  ) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const factoryContract = new ethers.Contract(
          factoryContractAddress,
          factoryContractABI.abi,
          signer
        );
        console.log("contract", factoryContractAddress);

        const collectionTxn = await factoryContract.createNFTCollection(
          name,
          symbol,
          royaltyFee,
          royaltyRecipient
        );

        return await collectionTxn.wait();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMyCollection = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const factoryContract = new ethers.Contract(
          factoryContractAddress,
          factoryContractABI.abi,
          signer
        );

        return await factoryContract.getOwnCollections();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCollectionDetails = async (collectionAddress) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const nftContract = new ethers.Contract(
          collectionAddress,
          nftContractABI.abi,
          provider
        );
        const totalSupply = await nftContract.totalSupply();
        let cover = "";
        if (totalSupply > 0) {
          cover = await getCollectionCover(collectionAddress);
        }
        const royaltyFee = await nftContract.getRoyalty();
        const collection = {
          address: collectionAddress,
          cover: cover,
          owner: await nftContract.owner(),
          name: await nftContract.name(),
          symbol: await nftContract.symbol(),
          royalty: BigInt(royaltyFee).toString(),
          royaltyRecipient: await nftContract.getRoyaltyRecipient(),
          totalSupply: totalSupply.toString(),
        };
        console.log("collection", collection);
        return collection;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCollectionCover = async (tokenAddress) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const nftContract = new ethers.Contract(
          tokenAddress,
          nftContractABI.abi,
          provider
        );
        const tokenId = await nftContract.tokenByIndex(0);
        const tokenHash = await nftContract.tokenURI(tokenId);
        const meta = await getTokenMeta(tokenHash);
        const imgHash = meta.image;
        return "https://ipfs.io/ipfs/" + imgHash;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mintNFT = async (ownerAddress, collectionAddress, tokenURI) => {
    console.log("collection", collectionAddress);
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(
          collectionAddress,
          nftContractABI.abi,
          signer
        );
        nftContract.on("Transfer", (from, to, tokenId) => {
          console.log(`Token ${tokenId} transferred from ${from} to ${to}`);
        });
        const tokenTxn = await nftContract.safeMint(ownerAddress, tokenURI);
        const receipt = await tokenTxn.wait();
        const tokenId = receipt.logs[0].topics[3];
        console.log(`TokenId: ${tokenId}`);
        return tokenId;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOwnedNFTs = async (address) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const linkedCollection = await getLinkedCollection(address);

        const nfts = [];
        for (const tokenAddress of linkedCollection) {
          const nftContract = new ethers.Contract(
            tokenAddress,
            nftContractABI.abi,
            provider
          );
          const balance = await nftContract.balanceOf(address);
          console.log("Total NFTs owned:", balance.toString());
          const royaltyFee = await nftContract.getRoyalty();
          for (let i = 0; i < balance; i++) {
            const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
            const owner = await nftContract.ownerOf(tokenId);
            const tokenHash = await nftContract.tokenURI(tokenId);
            console.log("Getting nft #" + i + " meta data...");
            const meta = await getTokenMeta(tokenHash);
            const imgHash = meta.image;
            let nft = {
              owner: owner,
              collection: tokenAddress,
              tokenId: tokenId.toString(),
              tokenUri: "https://ipfs.io/ipfs/" + imgHash,
              tokenName: meta.name,
              tokenDescription: meta.description,
              royalty: royaltyFee.toString(),
            };
            nfts.push(nft);
          }
        }
        if (nfts.length > 0) {
          return nfts;
        } else return null;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCollectionNFTs = async (tokenAddress) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const nfts = [];
        const nftContract = new ethers.Contract(
          tokenAddress,
          nftContractABI.abi,
          provider
        );
        const totalSupply = await nftContract.totalSupply();
        console.log("Total NFTs in collection:", totalSupply.toString());
        const royaltyFee = await nftContract.getRoyalty();
        for (let i = 0; i < totalSupply; i++) {
          const tokenId = await nftContract.tokenByIndex(i);
          const owner = await nftContract.ownerOf(tokenId);
          const tokenHash = await nftContract.tokenURI(tokenId);
          console.log("Getting nft #" + i + " meta data...");
          const meta = await getTokenMeta(tokenHash);
          const imgHash = meta.image;
          let nft = {
            owner: owner,
            collection: tokenAddress,
            tokenId: tokenId.toString(),
            tokenUri: "https://ipfs.io/ipfs/" + imgHash,
            tokenName: meta.name,
            tokenDescription: meta.description,
            royalty: royaltyFee.toString(),
          };
          nfts.push(nft);
        }
        if (nfts.length > 0) {
          return nfts;
        } else return null;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const listNFT = async (tokenAddress, tokenId, price) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const marketContract = new ethers.Contract(
          marketContractAddress,
          marketContractABI.abi,
          signer
        );
        const nftContract = new ethers.Contract(
          tokenAddress,
          nftContractABI.abi,
          signer
        );
        const approveTxn = await nftContract.approve(
          marketContractAddress,
          tokenId
        );
        console.log("Approving transaction...");
        await approveTxn.wait();
        console.log("Approved!");
        const tokenTxn = await marketContract.listNft(
          tokenAddress,
          tokenId,
          ethers.parseUnits(price, "ether")
        );
        return await tokenTxn.wait();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unListNFT = async (tokenAddress, tokenId) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const marketContract = new ethers.Contract(
          marketContractAddress,
          marketContractABI.abi,
          signer
        );
        const tokenTxn = await marketContract.cancelListNFT(
          tokenAddress,
          tokenId
        );
        return await tokenTxn.wait();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getListedNFTs = async (collectionAddress) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const marketContract = new ethers.Contract(
          marketContractAddress,
          marketContractABI.abi,
          provider
        );
        const nftContract = new ethers.Contract(
          collectionAddress,
          nftContractABI.abi,
          provider
        );
        const nfts = [];
        const balance = await nftContract.balanceOf(marketContractAddress);
        console.log("Total NFTs listed:", balance.toString());
        const royaltyFee = await nftContract.getRoyalty();
        for (let i = 0; i < balance; i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(
            marketContractAddress,
            i
          );
          const marketItem = await marketContract.getListedNFT(
            collectionAddress,
            tokenId
          );
          const tokenHash = await nftContract.tokenURI(tokenId);
          console.log("Getting nft #" + i + " meta data...");
          const meta = await getTokenMeta(tokenHash);
          const imgHash = meta.image;
          let nft = {
            seller: marketItem.seller,
            tokenId: tokenId.toString(),
            price: ethers.formatUnits(marketItem.price.toString(), "ether"),
            tokenUri: "https://ipfs.io/ipfs/" + imgHash,
            tokenName: meta.name,
            tokenDescription: meta.description,
            collection: collectionAddress,
            royalty: royaltyFee.toString(),
          };
          nfts.push(nft);
        }
        if (nfts.length > 0) {
          return nfts;
        } else return null;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserListedNFTs = async (address) => {
    let allNfts = [];
    let nfts = [];
    const collectionAddress = await getLinkedCollection(address);
    for (const collection of collectionAddress) {
      const res = await getListedNFTs(collection);
      if (res) {
        allNfts = allNfts.concat(res);
      }
    }
    if (allNfts.length > 0) {
      for (const nft of allNfts) {
        console.log("Searching for nfts listed by user...");
        if (nft.seller.toLowerCase() === address.toLowerCase()) {
          nfts.push(nft);
        }
      }
      return nfts;
    } else return null;
  };

  const getCartNFTs = async (cartContent) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const marketContract = new ethers.Contract(
          marketContractAddress,
          marketContractABI.abi,
          provider
        );
        const nfts = [];
        for (const item of cartContent) {
          const nftContract = new ethers.Contract(
            item.collection,
            nftContractABI.abi,
            provider
          );
          const marketItem = await marketContract.getListedNFT(
            item.collection,
            item.tokenId
          );
          const tokenHash = await nftContract.tokenURI(item.tokenId);
          const meta = await getTokenMeta(tokenHash);
          const imgHash = meta.image;
          let nft = {
            collectionAddress: item.collection,
            collectionName: await nftContract.name(),
            seller: marketItem.seller,
            tokenId: item.tokenId,
            price: ethers.formatUnits(marketItem.price.toString(), "ether"),
            tokenUri: "https://ipfs.io/ipfs/" + imgHash,
            tokenName: meta.name,
            tokenDescription: meta.description,
          };
          nfts.push(nft);
        }
        if (nfts.length > 0) {
          return nfts;
        } else return null;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const buyNFT = async (tokenAddress, tokenId, tokenPrice) => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const marketContract = new ethers.Contract(
        marketContractAddress,
        marketContractABI.abi,
        signer
      );
      const price = ethers.parseUnits(tokenPrice, "ether");
      try {
        const tokenTxn = await marketContract.buyNFT(tokenAddress, tokenId, {
          value: price,
        });
        console.log(tokenTxn);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const checkoutNFTs = async (cartItems, totalPrice) => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const marketContract = new ethers.Contract(
        marketContractAddress,
        marketContractABI.abi,
        signer
      );
      const tokenAddresses = [];
      const tokenIds = [];
      const tokenPrices = [];

      for (const item of cartItems) {
        tokenAddresses.push(item.collectionAddress);
        tokenIds.push(item.tokenId);
        tokenPrices.push(ethers.parseUnits(item.price, "ether"));
      }

      const price = ethers.parseUnits(totalPrice, "ether");

      try {
        const tokenTxn = await marketContract.buyBulkNFTs(
          tokenAddresses,
          tokenIds,
          {
            value: price,
          }
        );
        await tokenTxn.wait();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getPlatformFee = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const marketContract = new ethers.Contract(
        marketContractAddress,
        marketContractABI.abi,
        provider
      );
      const fee = await marketContract.getPlatformFee();
      return ethers.formatUnits(fee.toString(), "ether");
    }
  };

  const getPlatformFeeRecipient = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const marketContract = new ethers.Contract(
        marketContractAddress,
        marketContractABI.abi,
        provider
      );
      return await marketContract.getFeeRecipient();
    }
  };
  const updatePlatformFee = async (newPlatformFee) => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const marketContract = new ethers.Contract(
        marketContractAddress,
        marketContractABI.abi,
        signer
      );
      return await marketContract.updatePlatformFee(
        ethers.parseUnits(newPlatformFee.toString(), "ether")
      );
    }
  };
  const changeFeeRecipient = async (newFeeRecipient) => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const marketContract = new ethers.Contract(
        marketContractAddress,
        marketContractABI.abi,
        signer
      );
      return await marketContract.changeFeeRecipient(newFeeRecipient);
    }
  };

  return {
    account,
    // setLoader,
    loading,
    // market,
    connectWallet,
    linkCollection,
    getLinkedCollection,
    getAllLinkedCollection,
    unlinkCollection,
    uploadFileToIPFS,
    uploadJSONToIPFS,
    createNFTCollection,
    getMyCollection,
    getCollectionDetails,
    mintNFT,
    getOwnedNFTs,
    getCollectionNFTs,
    listNFT,
    unListNFT,
    getListedNFTs,
    getUserListedNFTs,
    getCartNFTs,
    buyNFT,
    checkoutNFTs,
    getPlatformFee,
    getPlatformFeeRecipient,
    updatePlatformFee,
    changeFeeRecipient,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMarketStore, import.meta.hot));
