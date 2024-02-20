<div id="top"></div>

<!-- ABOUT THE PROJECT -->
## Decentral AiBnb

AIbnb is a decentralized application designed to revolutionize the way individuals plan vacations and manage property bookings. Built on blockchain technology, it features an AI-based vacation planner, an Airbnb-like booking portal, property upload capabilities, and a unique booking system where transactions generate NFTs. Property owners have the flexibility to list bookings on the marketplace for various reasons, such as cancellation plans. The dashboard provides a comprehensive view of listed properties and bookings made.
 <p align="center">
  <img alt="Dark" src="https://github.com/adi99/AiBnb/blob/main/AIVocation.jpg" width="100%">
</p>
<!-- Working EXAMPLES -->
## How it Works

### contracts
 <p align="center">
  <img alt="Dark" src="https://github.com/adi99/AiBnb/blob/main/Particle-auth.jpg" width="100%">
</p>
The dapp is built around the DecentralAirbnb.sol, NFT.sol, Marketplace.sol, Decentragram.sol contract and Particle Auth as wallet, which contains all the app logic and has the following features:


<h4>Core functions:</h4>
<ul>
  <li><b>AIVocationPlanner:</b> Utilizes OpenAI api to recommend personalized vacation plans.</li>
  <li><b>Booking Portal:</b> An intuitive platform for users to book accommodations.</li>
  <li><b>Property Upload:</b> Enables property owners to list their spaces easily.</li>
  <li><b>MyBooking Page:</b> Displays travel bookings as NFT and option to list them on Marketplace.</li>
  <li><b>Marketplace:</b> Allows owners to list their bookings(as NFT) for sale or trade.</li>
  <li><b>Social:</b> Allows People to share pictures and comment on them</li>
  <li><b>Dashboard:</b> Provides a centralized view of owned and booked properties.</li>
</ul>

<h4>Admin functions: (admin is the only one that can call this functions)</h4>
<ul>
  <li><b>changeListingFee:</b> change the fee charged when adding new rental</li>
  <li><b>withdrawBalance:</b> the admin is able to withdraw th contract balance which is accumulated from the charged listing fee</li>
</ul>
<h4>ChainLink price feed:</h4>This project was started with Chainlink Goerli's Price Feed. Chainlink does not have a public price feed for Avalanche Fuji Network.

### User interface
The app allows users to rent any place in the world and pay in crypto, it's structured in 4 pages:

* The home page is the landing page of the app, It is based on OpenAI api used to plan presonalized travels, intinerary and suggestion for Vocation
  ![Capture d’écran 2022-05-12 à 23 16 45](https://github.com/adi99/AiBnb/blob/main/AIVocation.jpg)
  
* The Rentals page is where the user is entering the accomodation information, it contains a list of all the properties that match the user 
requirements, and also shows the location of these on a map provided by Google-maps

![Capture d’écran 2022-05-12 à 23 16 45](https://github.com/adi99/AiBnb/blob/main/rentals.jpg)

* The Mybooking page made to display your booked accomodation as NFTs. Every time User books accomodation from Rentals page it is then minted into user's wallet. It has feature of listing the NFT (real world accomodation) on Marketplace if plan is cancelled or any other reason.

![Capture d’écran 2022-05-12 à 23 16 45](https://github.com/adi99/AiBnb/blob/main/Mybooking.jpg)
  
* The Marketplace page shows the NFTs (real world accommodation) which anybody can buys and become owner of real world accommodation, using NFTs. Later We will add more real world assets to sell on this Marketplace.

![Capture d’écran 2022-05-12 à 23 16 45](https://github.com/adi99/AiBnb/blob/main/Marketplace.jpg)
  
* The Social Page let Users showcase their Travels to world and people can Comment on that. User will upload any Image and it will be uploaded to ipfs using NFT.storage.

  ![Capture d’écran 2022-05-12 à 23 16 45](https://github.com/adi99/AiBnb/blob/main/Social.jpg)

* Each user has their own Dashboard, it can be accessed by clicking on the account button in the top of the page, this dashboard shows all the user properites listed for renting and the reservations he has booked.

![Capture d’écran 2022-05-12 à 23 18 10](https://github.com/adi99/AiBnb/blob/main/Dashboard.png)

* In the Dashboard page there is a button "Add rental", which redirect the user to the AddRental page where he can list a new rental by providing a set of metadata (property name, city, latitude, longitude, description, maximum number of guests, rent price per day in $), note that it's really important to give the exact property (latitude, longitude) as they are later used to show the location on the Google map

![Capture d’écran 2022-05-12 à 23 15 13](https://github.com/adi99/AiBnb/blob/main/Add-Rental.jpg)


<p align="right">(<a href="#top">back to top</a>)</p>


