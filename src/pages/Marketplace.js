import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import Connect from "../components/Connect";
import logo from "../assets/images/airbnbRed.png";
import { Link } from "react-router-dom";
import "../assets/css/Sidebar.css";

import NFT from '../assets/abis/NFT.json'
import Market from '../assets/abis/Market.json'
import config from './config.json'

const Marketplace = () => {
    
  const [provider, setProvider] = useState(null)  
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({}) 
  const [items, setItems] = useState([])

  const convertIpfsUrl = (ipfsUrl) => {
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  };

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    await provider.send("eth_requestAccounts", []); // Request account access if needed
    const signer = provider.getSigner();

    const network = await provider.getNetwork()

    const nftAddress = config[network.chainId].nft.address;
    const marketplaceAddress = config[network.chainId].marketplace.address;

    const nft = new ethers.Contract(nftAddress, NFT, provider);
    setNFT(nft);

    const marketplace = new ethers.Contract(marketplaceAddress, Market, provider);
    setMarketplace(marketplace);

    loadMarketplaceItems(marketplace, nft);
  }

  const loadMarketplaceItems = async (marketplace, nft) => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i)
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        const imageUrl = convertIpfsUrl(metadata.image)
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: imageUrl
        })
      }
    }
    setLoading(false)
    setItems(items)
  }

  const buyMarketItem = async (item) => {
    const signer = await provider.getSigner()
    await (await marketplace.connect(signer).purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    loadMarketplaceItems(marketplace, nft)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
 // Assuming this is a functional component within your React app
// Ensure props are correctly passed
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
    <div className="page-layout d-flex">
    <div className="sidebar">
  <nav>
    <ul>
      <li><Link to="/rentals" className="sidebar-btn">Rentals</Link></li>
      <li><Link to="/add-rental" className="sidebar-btn">Add Rental</Link></li>
      <li><Link to="/dashboard" className="sidebar-btn">Dashboard</Link></li>
      <li><Link to="/social" className="sidebar-btn">Social</Link></li>
      <li><Link to="/mybooking" className="sidebar-btn">My Booking</Link></li>
    </ul>
  </nav>
</div>

      <div className="content flex-grow-1">
        {items.length > 0 ? (
          <div className="px-5 container">
            <Row xs={1} md={2} lg={4} className="g-4 py-5">
              {items.map((item, idx) => (
                <Col key={idx} className="overflow-hidden">
                  <Card>
                    <Card.Img variant="top" src={item.image} />
                    <Card.Body color="secondary">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <div className='d-grid'>
                        <Button onClick={() => buyMarketItem(item)} variant="primary" size="lg">
                          Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                        </Button>
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
      </div>
    </div>
  </div>
);

}

export default Marketplace