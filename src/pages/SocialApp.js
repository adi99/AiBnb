import React, { useState, useEffect } from 'react';
import { ethers } from "ethers"
import Decentragram from '../assets/abis/Decentragram.json';
import Main from './Social';
import "../assets/css/Social.css";
import { NFTStorage, File } from 'nft.storage'
import config from './config.json'


function App() {

  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState('');
  const [decentragram, setDecentragram] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buffer, setBuffer] = useState(null);

  const convertIpfsUrl = (ipfsUrl) => {
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  };

  useEffect(() => {
    const loadAccount = async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    };

    loadAccount();
  }, []);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  async function loadBlockchainData() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // This line is not necessary if you're not using the provider elsewhere
       setProvider(provider);
  
      const network = await provider.getNetwork();
      const decentragramAddress = config[network.chainId].decentragram.address;
      
      const decentragram = new ethers.Contract(decentragramAddress, Decentragram, provider);
      setDecentragram(decentragram)
  
      const imagesCount = await decentragram.imageCount();
      let images = [];
      for (let i = 1; i <= imagesCount.toNumber(); i++) {
        const image = await decentragram.images(i);
        images.push(image);
        
      }
      // Ensure sorting is done after images are pushed to the array
      images = images.sort((a, b) => b.tipAmount - a.tipAmount);
      setImages(images);
    } catch (error) {
      console.error("Failed to load blockchain data:", error);
    } finally {
      setLoading(false);
    }
  }
  
    const captureFile = event => {
      event.preventDefault();
      const file = event.target.files[0];
      if (!file) {
        console.log('No file selected');
        return;
      }
  
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
  
      reader.onloadend = () => {
        // Convert the ArrayBuffer to a Uint8Array (Buffer equivalent in the browser)
        const buffer = new Uint8Array(reader.result);
        // Update state with the new buffer
        setBuffer(buffer);
        console.log('buffer', buffer);
      };
    };
    
    async function uploadImage(description) {
      console.log("Submitting file to nft.storage...");
      const client = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU0QzI4N0YyYmEzMzk4NkU2OUM0OUE1ZkI0MGU5ZTk1ZGRjQTdkODgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzAxMjgzNzk3OSwibmFtZSI6IkFkaSJ9.KLZGwXJKNxv_ijnBx5z3IEq0luZVp16BylaP6YPKaOQ" }); // Ensure you replace 'YOUR_API_TOKEN' with your actual API token from nft.storage
      if (!buffer) return;
  
      try {
        const file = new File([buffer], 'image.png', { type: 'image/png' });
        const metadata = await client.store({
          name: 'Image',
          description: description,
          image: file
        });
        const webAccessibleUrl = convertIpfsUrl(metadata.data.image.href);
        console.log('nft.storage result', metadata);
        setLoading(true);
        const signer = provider.getSigner();
        await decentragram.connect(signer).uploadImage(webAccessibleUrl, description, { from: account }).then(() => {
          setLoading(false);
        });
      } catch (error) {
        console.error('nft.storage upload error', error);
        setLoading(false);
      }
    }

    return (
    <div>
      {loading ? (
        <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
      ) : (
        <Main
          account={account}
          setAccount={setAccount}
          images={images}
          captureFile={captureFile}
          uploadImage={uploadImage}
        />
      )}
    </div>
  );
}

export default App;
