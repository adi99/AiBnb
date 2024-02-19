import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button, Modal, Form } from 'react-bootstrap'
import Connect from "../components/Connect";
import logo from "../assets/images/airbnbRed.png";
import { Link } from "react-router-dom";

import NFT from '../assets/abis/NFT.json'
import Market from '../assets/abis/Market.json'
import config from './config.json'

function MyPurchases() {
  const [loading, setLoading] = useState(true)
  const [nfts, setNfts] = useState([])
  const [nft, setNFT] = useState({})
  const [provider, setProvider] = useState(null)
  const [marketplace, setMarketplace] = useState({}) 
  const [showModal, setShowModal] = useState(false);
  const [selectedNft, setSelectedNft] = useState({});
  const [price, setPrice] = useState('');
  const [account, setAccount] = useState(null)
  const [signer, setSigner] = useState(null);
  const [nftAddress, setNftAddress] = useState('');

  const loadNFTs = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const network = await provider.getNetwork()
    const nftAddress = config[network.chainId].nft.address
    setNftAddress(nftAddress)
    const nftContract = new ethers.Contract(nftAddress, NFT, provider)
    setNFT(nftContract)
    const marketplaceAddress = config[network.chainId].marketplace.address;
    const marketplace = new ethers.Contract(marketplaceAddress, Market, provider);
    setMarketplace(marketplace);
    
    const signer = provider.getSigner();
    setSigner(signer);
    const account = await signer.getAddress();
    setAccount(account);
    // Use tokenCount to determine the number of NFTs to fetch
    const totalNFTs = await nftContract.tokenCount()

    const items = []
    for (let i = 1; i <= totalNFTs; i++) {
      const owner = await nftContract.ownerOf(i);
      if (owner === account) { // Only add the NFT if the current user is the owner
        const uri = await nftContract.tokenURI(i);
        const response = await fetch(uri);
        const metadata = await response.json();

        items.push({
          tokenId: i,
          name: metadata.name,
          description: metadata.description,
          image: (metadata.image),
          // Assuming 'properties' is part of your metadata for booking details
          checkIn: metadata.properties?.checkIn,
          checkOut: metadata.properties?.checkOut,
        });
      }
    }

    setNfts(items)
    setLoading(false)
  }
  const handleList = async (nft) => {
    const priceInWei = ethers.utils.parseUnits(price, 'ether');
    const signer = await provider.getSigner()
    await marketplace.connect(signer).makeItem(nftAddress, nft.tokenId, priceInWei);
    // Close the modal and clear the state
    setShowModal(false);
    setPrice('');
  };

  useEffect(() => {
    loadNFTs()
  }, [])

  if (loading) return <div>Loading...</div>
  return (
    <div className="container-fluid mt-5">
      <div className="topBanner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
        </div>
        <div className="lrContainers">
          <Connect />
        </div>
      </div>
      <div className="d-flex">
        <div className="sidebar">
          <nav>
            <ul>
              <li><Link to="/rentals" className="sidebar-btn">Rentals</Link></li>
              <li><Link to="/add-rental" className="sidebar-btn">Add Rental</Link></li>
              <li><Link to="/dashboard" className="sidebar-btn">Dashboard</Link></li>
              <li><Link to="/marketplace" className="sidebar-btn">Marketplace</Link></li>
              <li><Link to="/social" className="sidebar-btn">Social</Link></li>
            </ul>
          </nav>
        </div>
        <div className="content flex-grow-1">
          {loading ? (
            <div>Loading...</div>
          ) : nfts.length > 0 ? (
            <div className="px-5 container">
              <Row xs={1} md={2} lg={4} className="g-4 py-5">
                {nfts.map((nft, idx) => (
                  <Col key={idx} className="overflow-hidden">
                    <Card>
                      <Card.Img variant="top" src={nft.image} />
                      <Card.Body>
                        <Card.Title>{nft.name}</Card.Title>
                        <Card.Text>{nft.description}</Card.Text>
                        <Card.Text>Check-in: {nft.checkIn}</Card.Text>
                        <Card.Text>Check-out: {nft.checkOut}</Card.Text>
                        <Button variant="primary" onClick={() => { setSelectedNft(nft); setShowModal(true); }}>List NFT</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          ) : (
            <div>No NFTs found</div>
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>List your NFT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Price (in ETH)</Form.Label>
              <Form.Control type="text" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Form.Group>
            <Button variant="primary" onClick={() => handleList(selectedNft)}>
              Submit Listing
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
  
  }

export default MyPurchases
