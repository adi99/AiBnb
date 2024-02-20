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

The dapp is built around the DecentralAirbnb.sol contract, which contains all the app logic and has the following features:

<h4>Core functions:</h4>
<ul>
  <li><b>AIVocationPlanner:</b> Utilizes AI to recommend personalized vacation plans.</li>
  <li><b>Booking Portal:</b> An intuitive platform for users to book accommodations.</li>
  <li><b>Property Upload:</b> Enables property owners to list their spaces easily.</li>
  <li><b>MyBooking Page:</b> Displays travel bookings as NFT and option to list them on Marketplace.</li>
  <li><b>Marketplace:</b> Allows owners to list their bookings for sale or trade.</li>
  <li><b>Dashboard:</b> Provides a centralized view of owned and booked properties.</li>
</ul>

<h4>Admin functions: (admin is the only one that can call this functions)</h4>
<ul>
  <li><b>changeListingFee:</b> change the fee charged when adding new rental</li>
  <li><b>withdrawBalance:</b> the admin is able to withdraw th contract balance which is accumulated from the charged listing fee</li>
</ul>
<h4>ChainLink price feed:</h4>This project was started with Chainlink Goerli's Price Feed. Chainlink does not have a public price feed for Avalanche Fuji Network.

As ETH or MATIC are both volatile currencies, the user need to set the renting price in $ and this price is converted using chainlink price feeds when a user is excuting the booking transaction.


### User interface
The app allows users to rent any place in the world and pay in crypto, it's structured in 4 pages:

* The home page is the landing page of the app, By entering the city, the duration of the holiday and the number of guest the user is able to check all the available properties and can compare their prices, and the different facilities.

* The Rentals page is where the user is redirected after entering the holiday information, it contains a list of all the properties that match the user 
requirements, and also shows the location of these on a map provided by Google-maps

![Capture d’écran 2022-05-12 à 23 16 45](https://user-images.githubusercontent.com/83681204/168185991-4dfd9476-e905-4ae0-bf85-cc84397db436.png)

* Each user has their own Dashboard, it can be accessed by clicking on the account button in the top of the page, this dashboard shows all the user properites listed for renting and the reservations he has booked.

![Capture d’écran 2022-05-12 à 23 18 10](https://user-images.githubusercontent.com/83681204/168186740-54ce2a06-8c8d-4a85-89dc-4c205ef2d33c.png)

* In the Dashboard page there is a button "Add rental", which redirect the user to the AddRental page where he can list a new rental by providing a set of metadata (property name, city, latitude, longitude, description, maximum number of guests, rent price per day in $), note that it's really important to give the exact property (latitude, longitude) as they are later used to show the location on the Google map

![Capture d’écran 2022-05-12 à 23 15 13](https://user-images.githubusercontent.com/83681204/168187290-846d2123-3bb0-49fb-90b1-74a96fec1b88.png)


<p align="right">(<a href="#top">back to top</a>)</p>


