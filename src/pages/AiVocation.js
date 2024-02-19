import React, { useState } from 'react';
import { OpenAI } from 'openai';
import "../assets/css/Vocation.css";
import main from "../assets/images/movieboss.png";
import sendb from "../assets/images/send-btn-icon.png";
import { title } from 'process';
import Connect from "../components/Connect";
import logo from "../assets/images/airbnbRed.png";
import { Link } from "react-router-dom";

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [movieBossText, setMovieBossText] = useState('');
  const [loading, setLoading] = useState(false);
  const [synopsis, setSynopsis] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  
  const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true,
  });

  const fetchBotReply = async (outline) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { "role": "system", "content": "Generate a short message to enthusiastically say this sounds interesting and that you need some minutes to think about it. Mention one aspect of the sentence." },
        { "role": "user", "content": outline }
      ]
    });
    console.log(response);
    setMovieBossText(response.choices[0].message.content);
  };

  const fetchLocationStay = async (outline) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { "role": "system", "content": "FInd all the flight routes and Homestay in the location" },
        { "role": "user", "content": outline }
      ]
    });
      console.log(response);
      const synopsis = response.choices[0].message.content;
      setSynopsis(synopsis);
  };

  const fetchItinerary = async (outline) => {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-0125-preview',
        messages: [{
          "role": "system",
          "content": "Also build Itinerary for this location"
        }, {
          "role": "user",
          "content": outline
        }]
      });
      const title = response.choices[0].message.content;
      console.log(title)
      setItinerary(title);

    }

    const fetchImageUrl = async (outline) => {
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: outline,
        n: 1,
        size: "256x256",
        response_format: 'b64_json'
      });
      // Assuming response.data[0].b64_json correctly holds the base64 string
      setImageBase64(response.data[0].b64_json);
    };

  const handleSendClick = () => {
    if (userInput) {
      setLoading(true);
      setMovieBossText(`Ok, just wait a second while my digital brain digests that...`);
      fetchBotReply(userInput);
      fetchLocationStay(userInput);
      fetchItinerary(userInput);
      fetchImageUrl(userInput);
      // Assuming fetchMoveCode and fetchFrontend are similar async functions
      // You would call them here as needed, updating the state appropriately
    }
  };

  return (
    <>
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
      </div>
      <div className="page-layout d-flex">
    <div className="sidebar">
  <nav>
    <ul>
      <li><Link to="/rentals" className="sidebar-btn">Rentals</Link></li>
      <li><Link to="/add-rental" className="sidebar-btn">Add Rental</Link></li>
      <li><Link to="/dashboard" className="sidebar-btn">Dashboard</Link></li>
      <li><Link to="/marketplace" className="sidebar-btn">Marketplace</Link></li>
      <li><Link to="/social" className="sidebar-btn">Social</Link></li>
      <li><Link to="/mybooking" className="sidebar-btn">My Booking</Link></li>
    </ul>
  </nav>
</div>
      <main>
        <section id="setup-container">
          <div className="setup-inner">
            <img src={main} alt="" />
            <div className="speech-bubble-ai" id="speech-bubble-ai">
              <p id="movie-boss-text">{movieBossText}</p>
            </div>
          </div>
          <div className="setup-inner setup-input-container" id="setup-input-container">
            <textarea 
              id="setup-textarea" 
              placeholder="I am planning a trip to New york. Can you build Itinerary for it" 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button className="send-btn" id="send-btn" aria-label="send" onClick={handleSendClick}>
              <img src={sendb} alt="send" />
            </button>
          </div>
        </section>
        <section className="output-container" id="output-container">
          <div id="output-img-container" className="output-img-container">{imageBase64 && <img src={`data:image/jpeg;base64,${imageBase64}`} alt="Generated" />}</div>
          <h1 id="output-title"></h1>
          <h2 id="output-stars"></h2>
          <div id="output-text" dangerouslySetInnerHTML={{ __html: synopsis.replace(/\n/g, '<br />') }}></div>
          <div id="output-text1" dangerouslySetInnerHTML={{ __html: itinerary.replace(/\n/g, '<br />') }}></div>
        </section>
      </main>
      </div>
     
    </>
  );
};

export default App;
