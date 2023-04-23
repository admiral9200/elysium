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
  //   console.log("setloader", value);
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

  const getAllListedNFTs = async () => {
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
        const res = await marketContract.fetchMarketItems();
        if (res.length > 0) {
          const nfts = await Promise.all(
            res.map(async (i) => {
              const tokenHash = await marketContract.tokenURI(i.tokenId);
              const meta = await getTokenMeta(tokenHash);
              const imgHash = meta.image;
              let price = ethers.formatUnits(i.price.toString(), "ether");
              let nft = {
                seller: i.seller,
                owner: i.owner,
                price,
                tokenId: i.tokenId.toString(),
                tokenUri: "https://ipfs.io/ipfs/" + imgHash,
                tokenName: meta.name,
                tokenDescription: meta.description,
                tokenRoyalty: meta.royalty,
              };
              return nft;
            })
          );
          return nfts;
        } else return null;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getListedNFTs = async () => {
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
        const res = await marketContract.fetchItemsListed();
        if (res.length > 0) {
          const nfts = await Promise.all(
            res.map(async (i) => {
              const tokenHash = await marketContract.tokenURI(i.tokenId);
              const meta = await getTokenMeta(tokenHash);
              const imgHash = meta.image;
              let price = ethers.formatUnits(i.price.toString(), "ether");
              let nft = {
                seller: i.seller,
                owner: i.owner,
                price,
                tokenId: i.tokenId.toString(),
                tokenUri: "https://ipfs.io/ipfs/" + imgHash,
                tokenName: meta.name,
                tokenDescription: meta.description,
                tokenRoyalty: meta.royalty,
              };
              return nft;
            })
          );
          return nfts;
        } else return null;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buyNFT = async () => {
    const tokenTxn = await marketContract.createToken(
      tokenURI,
      ethers.parseUnits(price, "ether"),
      { value: listingPrice }
    );
  };

  return {
    account,
    // setLoader,
    loading,
    // market,
    connectWallet,
    uploadFileToIPFS,
    uploadJSONToIPFS,
    createNFTCollection,
    getMyCollection,
    mintNFT,
    getOwnedNFTs,
    listNFT,
    getAllListedNFTs,
    getListedNFTs,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMarketStore, import.meta.hot));
