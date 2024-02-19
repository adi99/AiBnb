import React, { useState, useEffect } from "react";
import "../assets/css/Rentals.css";
import logo from "../assets/images/airbnbRed.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ethers, utils } from "ethers";
import RentalsMap from "../components/RentalsMap";
import { Button, CircularProgress } from "@mui/material";
import Connect from "../components/Connect";
import { NFTStorage, File } from 'nft.storage';

import DecentralAirbnb from "../artifacts/DecentralAirbnb.sol/DecentralAirbnb.json";
import { contractAddress, networkDeployedTo } from "../utils/contracts-config";
import networksMap from "../utils/networksMap.json";
import config from './config.json';
import NFT from '../assets/abis/NFT.json';

const Rentals = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState({});
  const data = useSelector((state) => state.blockchain.value);
  // const { state: searchFilters } = useLocation();
  const [rentalsList, setRentalsList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [highLight, setHighLight] = useState([]);

  const [searchFilters, setSearchFilters] = useState({
    destination: 'New York',
    checkIn: new Date(), // You can set default dates
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    guests: 1,
  });  

  const handleChange = (field, value) => {
    setSearchFilters(prevFilters => ({
      ...prevFilters,
      [field]: value,
    }));
  };
  

  const getRentalsList = async () => {
    
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const AirbnbContract = new ethers.Contract(contractAddress, DecentralAirbnb.abi, signer);

    const rentals = await AirbnbContract.getRentals();
    const items = rentals.map((r) => {
      // Assume r[7] is the image URL; use a placeholder if undefined
      const imgUrl = r[7]; // Provide a default image URL
      return {
        id: Number(r[0]),
        name: r[2],
        city: r[3],
        description: r[6],
        imgUrl: imgUrl,
        price: utils.formatUnits(r[9], "ether"),
      };
    });

    const matchedItems = items.filter((p) =>
      p.city.toLowerCase().includes(searchFilters.destination.toLowerCase())
    );

    setRentalsList(matchedItems);

    let cords = rentals.map((r) => ({
      lat: Number(r[4]),
      lng: Number(r[5]),
    }));

    setCoordinates(cords);
  };

  const bookProperty = async (_id, _price) => {
    if (data.network == networksMap[networkDeployedTo]) {
      try {
        setLoading((prev) => ({ ...prev, [_id]: true }));
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner();
        const AirbnbContract = new ethers.Contract(contractAddress, DecentralAirbnb.abi, signer);

        const _datefrom = Math.floor(searchFilters.checkIn.getTime() / 1000);
        const _dateto = Math.floor(searchFilters.checkOut.getTime() / 1000);
        const bookPeriod = (_dateto - _datefrom) / 86400; // seconds in a day
        const totalBookingPriceUSD = Number(_price) * bookPeriod;
        
        const totalBookingPriceETH = await AirbnbContract.convertFromUSD(utils.parseEther(totalBookingPriceUSD.toString()));

        const book_tx = await AirbnbContract.bookDates(_id, _datefrom, _dateto, { value: totalBookingPriceETH });
        await book_tx.wait();

        // Find the property to mint NFT
        const property = rentalsList.find(property => property.id === _id);
        if (property) {
          await mintBooking(property.imgUrl, searchFilters.checkIn, searchFilters.checkOut); // Ensure this handles the imgUrl correctly
        } else {
          console.error("Property not found or missing image URL");
        }
        
        setLoading((prev) => ({ ...prev, [_id]: false }));
        navigate("/mybooking");
      } catch (err) {
        setLoading((prev) => ({ ...prev, [_id]: false }));
        window.alert("An error has occurred, please try again");
      }
    } else {
      setLoading(false);
      window.alert(`Please switch to the ${networksMap[networkDeployedTo]} network`);
    }
  };

  const mintBooking = async (imgUrl, checkInDate, checkOutDate) => {
    try {
      const nftStorageClient = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU0QzI4N0YyYmEzMzk4NkU2OUM0OUE1ZkI0MGU5ZTk1ZGRjQTdkODgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NzAxMjgzNzk3OSwibmFtZSI6IkFkaSJ9.KLZGwXJKNxv_ijnBx5z3IEq0luZVp16BylaP6YPKaOQ" });
      const metadata = await createMetadata(nftStorageClient, imgUrl, checkInDate, checkOutDate);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const NFTContract = new ethers.Contract(config[network.chainId].nft.address, NFT, signer);

      const tx = await NFTContract.mint(metadata.url);
      await tx.wait();
      alert("Booking NFT minted successfully!");
    } catch (error) {
      console.error("Failed to mint NFT", error);
      alert("Failed to mint NFT. Please try again.");
    }
  };
  
  const createMetadata = async (client, imgUrl, checkInDate, checkOutDate) => {
    // Direct use of imgUrl in metadata assuming it's already a URL
    const metadata = {
      name: "Booking Details",
      description: "NFT representing a booked property.",
      image: imgUrl,
      properties: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
      }
    };

    const metadataFile = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const storedMetadata = await client.storeBlob(metadataFile);
    return { url: `https://ipfs.io/ipfs/${storedMetadata}` };
  };

  useEffect(() => {
    getRentalsList();
  }, [searchFilters]);

 
  return (
    <>
      <div className="topBanner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo"></img>
          </Link>
        </div>
        <div className="search-reminder">
       <div className="filter">
      <input
      type="text"
      value={searchFilters.destination}
      onChange={(e) => handleChange('destination', e.target.value)}
      placeholder="Destination"
    />
  </div>
  <div className="vl" />
  <div className="filter">
    <input
      type="date"
      value={searchFilters.checkIn.toISOString().split('T')[0]}
      onChange={(e) => handleChange('checkIn', new Date(e.target.value))}
    />
    <span> - </span>
    <input
      type="date"
      value={searchFilters.checkOut.toISOString().split('T')[0]}
      onChange={(e) => handleChange('checkOut', new Date(e.target.value))}
    />
  </div>
  <div className="vl" />
  <div className="filter">
    <input
      type="number"
      min="1"
      value={searchFilters.guests}
      onChange={(e) => handleChange('guests', parseInt(e.target.value, 10))}
      placeholder="Guests"
    />
    <span> Guest</span>
    </div>
   </div>
   <div className="lrContainers">
          <Connect />
        </div>
      </div>
      <div className="page-layout d-flex">
    <div className="sidebar">
  <nav>
    <ul>
      <li><Link to="/add-rental" className="sidebar-btn">Add Rental</Link></li>
      <li><Link to="/dashboard" className="sidebar-btn">Dashboard</Link></li>
      <li><Link to="/marketplace" className="sidebar-btn">Marketplace</Link></li>
      <li><Link to="/social" className="sidebar-btn">Social</Link></li>
      <li><Link to="/mybooking" className="sidebar-btn">My Booking</Link></li>
    </ul>
  </nav>
</div>

      <hr className="line" />
      <div className="RentalsContent">
        <div className="RentalsContent-box">
          Stays Available For Your Destination
          <hr className="line2" />
          {rentalsList.length !== 0 ? (
            rentalsList.map((e, i) => {
              return (
                <>
                  <div className="rental-div" key={i}>
                    <img className="rental-img" src={e.imgUrl}></img>
                    <div className="rental-info">
                      <div className="rental-title">{e.name}</div>
                      <div className="rental-desc">in {e.city}</div>
                      <div className="rental-desc">{e.description}</div>
                      <div className="bottomButton">
                        <Button
                          variant="contained"
                          color="error"
                          disabled={loading[e.id]}
                          onClick={() => {
                            bookProperty(e.id, e.price);
                          }}
                        >
                          {loading[e.id] ? (
                            <CircularProgress color="inherit" />
                          ) : (
                            "Book"
                          )}
                        </Button>
                        <div className="price">{e.price}$</div>
                      </div>
                    </div>
                  </div>
                  <hr className="line2" />
                </>
              );
            })
          ) : (
            <div style={{ textAlign: "center", paddingTop: "30%" }}>
              <p>No properties found for your search</p>
            </div>
          )}
        </div>
        <div className="RentalsContent-box hide">
          <RentalsMap locations={coordinates} setHighLight={setHighLight} />
        </div>
      </div>
      </div>
    </>
  );
};

export default Rentals;
