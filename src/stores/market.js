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
      const { ethereum } = window;
      if (!ethereum) {
        alert("Must connect to MetaMask!");
        return;
      }
      const myAccounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", myAccounts[0]);
      account.value = myAccounts[0];
    } catch (error) {
      console.log(error);
    }
  };

  const linkCollection = async (user_address, address) => {
    let exist = false;
    let newCollections = await getLinkedCollection(user_address);
    if (newCollections.length > 0) {
      if (newCollections.includes(address)) {
        console.log("Already Linked");
        exist = true;
      } else {
        newCollections.push(address);
      }
    } else {
      newCollections = address;
    }
    if (!exist) {
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
        console.log("update collection", res);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getLinkedCollection = async (user_address) => {
    try {
      const res = await axios.get("/api/collection/" + user_address);
      if (res.data === "404") return [];
      else return res.data;
    } catch (err) {
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
    } catch (err) {
      console.log(err);
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
      if (window.ethereum != null) {
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
      if (window.ethereum != null) {
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

  const mintNFT = async (ownerAddress, collectionAddress, tokenURI) => {
    console.log("collection", collectionAddress);
    try {
      if (window.ethereum != null) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(
          collectionAddress,
          nftContractABI.abi,
          signer
        );
        const tokenTxn = await nftContract.safeMint(ownerAddress, tokenURI);
        return await tokenTxn.wait();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOwnedNFTs = async (address) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const nftAddress = await getMyCollection();
        const signer = await provider.getSigner();
        const nftContract = new ethers.Contract(
          nftAddress[0],
          nftContractABI.abi,
          signer
        );

        const nfts = [];
        const balance = await nftContract.balanceOf(address);
        for (let i = 0; i < balance; i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
          const owner = await nftContract.ownerOf(tokenId);
          const tokenHash = await nftContract.tokenURI(tokenId);
          const meta = await getTokenMeta(tokenHash);
          const imgHash = meta.image;
          let nft = {
            owner: owner,
            collection: nftAddress[0],
            tokenId: tokenId.toString(),
            tokenUri: "https://ipfs.io/ipfs/" + imgHash,
            tokenName: meta.name,
            tokenDescription: meta.description,
            tokenRoyalty: meta.royalty,
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
      if (window.ethereum != null) {
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
        console.log(signer, await nftContract.ownerOf(tokenId));
        const approveTxn = await nftContract.approve(
          marketContractAddress,
          tokenId
        );
        await approveTxn.wait();
        console.log("approveTxn", approveTxn);
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

  const getListedNFTs = async (collectionAddress) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const marketContract = new ethers.Contract(
          marketContractAddress,
          marketContractABI.abi,
          signer
        );
        const nftContract = new ethers.Contract(
          collectionAddress,
          nftContractABI.abi,
          signer
        );
        const nfts = [];
        const balance = await nftContract.balanceOf(marketContractAddress);
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
          const meta = await getTokenMeta(tokenHash);
          const imgHash = meta.image;
          let nft = {
            seller: marketItem.seller,
            tokenId: tokenId.toString(),
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

  const getAllListedNFTs = async (collectionAddress) => {
    let nfts = [];
    for (const collection of collectionAddress) {
      const res = await getListedNFTs(collection);
      if (res) {
        nfts = nfts.concat(res);
      }
    }
    if (nfts.length > 0) {
      return nfts;
    } else return null;
  };

  //TODO getAllListedNFTs by a single seller

  const getCartNFTs = async (cartContent) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const marketContract = new ethers.Contract(
          marketContractAddress,
          marketContractABI.abi,
          signer
        );
        const nfts = [];
        for (const item of cartContent) {
          const nftContract = new ethers.Contract(
            item.collection,
            nftContractABI.abi,
            signer
          );
          const marketItem = await marketContract.getListedNFT(
            item.collection,
            item.tokenId
          );
          const tokenHash = await nftContract.tokenURI(item.tokenId);
          const meta = await getTokenMeta(tokenHash);
          const imgHash = meta.image;
          let nft = {
            seller: marketItem.seller,
            tokenId: cartContent.tokenId,
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

  const buyNFT = async (tokenAddress, tokenId, tokenRoyalty, tokenPrice) => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const marketContract = new ethers.Contract(
        marketContractAddress,
        marketContractABI.abi,
        signer
      );
      const price = ethers.parseUnits(tokenPrice, "ether");
      try {
        const tokenTxn = await marketContract.buyNFT(
          tokenAddress,
          tokenId,
          price,
          {
            value: price,
          }
        );
        console.log(tokenTxn);
      } catch (err) {
        console.log(err);
      }
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
    unlinkCollection,
    uploadFileToIPFS,
    uploadJSONToIPFS,
    createNFTCollection,
    getMyCollection,
    mintNFT,
    getOwnedNFTs,
    listNFT,
    getListedNFTs,
    getAllListedNFTs,
    getCartNFTs,
    buyNFT,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMarketStore, import.meta.hot));