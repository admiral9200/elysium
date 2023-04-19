import { ethers } from "ethers";
import { acceptHMRUpdate, defineStore } from "pinia";
import contractABI from "../artifacts/contractABI/NFTMarketplace.json";
import { ref } from "vue";
import axios from "axios";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
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

  const mintNFT = async (tokenURI, price) => {
    try {
      if (window.ethereum != null) {
        // create provider object from ethers library, using ethereum object injected by metamask
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const marketContract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          signer
        );
        const listingPrice = await marketContract.getListingPrice();
        const overrides = {
          value: listingPrice,
        }; //use to pay the listing price
        const tokenTxn = await marketContract.createToken(
          tokenURI,
          ethers.parseUnits(price, "ether"),
          overrides
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
          contractAddress,
          contractABI.abi,
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

  const getMyNFTs = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const marketContract = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          signer
        );
        const res = await marketContract.fetchMyNFTs();
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
          contractAddress,
          contractABI.abi,
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

  const getTokenMeta = async (tokenHash) => {
    try {
      const res = await axios.get("https://ipfs.io/ipfs/" + tokenHash);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    account,
    // setLoader,
    loading,
    // market,
    connectWallet,
    uploadFileToIPFS,
    uploadJSONToIPFS,
    mintNFT,
    getAllListedNFTs,
    getMyNFTs,
    getListedNFTs,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMarketStore, import.meta.hot));
