import React, { useRef, useState, useEffect } from 'react';
import Identicon from 'identicon.js';
import { db } from './firebase-config'; // Ensure you have this Firebase config set up
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import Connect from "../components/Connect";
import logo from "../assets/images/airbnbRed.png";
import { Link } from "react-router-dom";

const Main = ({ account, setAccount, images, uploadImage, captureFile }) => {
  const imageDescriptionRef = useRef(null);
  const [selectedImageId, setSelectedImageId] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState({});

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      // Assuming setAccount is now passed as a prop
      if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };
  
    window.ethereum.on('accountsChanged', handleAccountsChanged);
  
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [account, setAccount]); // Add setAccount to the dependency array if it's coming from props
  
  useEffect(() => {
    const fetchComments = async () => {
      let commentsByImage = {};
      for (let image of images) {
        // Ensure image.id is converted to a string, assuming image.id is a BigNumber
        const imageIdStr = image.id.toString();
        const q = query(collection(db, "comments"), where("imageId", "==", imageIdStr), orderBy("timestamp"));
        const querySnapshot = await getDocs(q);
        commentsByImage[image.id] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      setComments(commentsByImage);
    };

    if (images.length > 0) {
      fetchComments();
    }
  }, [images]); // Re-fetch comments when images array changes

  const handlePostComment = async (imageId) => {
    if (!comment.trim()) return; // Prevent posting empty comments
    const imageIdStr = imageId.toString(); // Convert BigNumber to string for Firestore
  
    try {
      const docRef = await addDoc(collection(db, "comments"), {
        imageId: imageIdStr,
        text: comment,
        timestamp: new Date(),
        author: account // Assuming account holds the user ID or similar identifier
      });
  
      // Optimistically add the new comment to the UI
      const newComment = {
        id: docRef.id,
        imageId: imageIdStr,
        text: comment,
        timestamp: new Date(), // This will be the local timestamp; adjust as needed
        author: account
      };
  
      // Update the state with the new comment
      setComments(prevComments => ({
        ...prevComments,
        [imageId]: [...(prevComments[imageId] || []), newComment]
      }));
  
      setComment(""); // Reset comment input
      setSelectedImageId(''); // Optional: close the comment input box after posting
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const description = imageDescriptionRef.current.value;
    uploadImage(description);
  };

  return (
    <div className="container-fluid mt-5">
      <div className="topBanner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo"></img>
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
      <li><Link to="/marketplace" className="sidebar-btn">Marketplace</Link></li>
      <li><Link to="/mybooking" className="sidebar-btn">My Booking</Link></li>
    </ul>
  </nav>
</div>
      {/* Upload Section */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Share Image</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="file" className="form-control-file" id="fileInput" accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={captureFile} required />
            </div>
            <div className="form-group">
              <input id="imageDescription" type="text" ref={imageDescriptionRef} className="form-control" placeholder="Describe your image..." required />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Upload Image</button>
          </form>
        </div>
      </div>

     {/* Images & Comments Section */}
<div className="row">
  {images.map((image, key) => (
    <div className="col-12 mb-4 d-flex justify-content-center" key={key}> {/* Changed from col-md-4 to col-12 */}
      <div className="card" style={{ width: '50%' }}>
        <div className="card-header">
          <img className='mr-2'
               width='30'
               height='30'
               src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
           />        
          <small className="text-muted">{image.author}</small>
        </div>
        <img src={image.hash} className="card-img-top" alt="Uploaded content" />
        <div className="card-body">
          <h5 className="card-title">Image Description</h5>
          <p className="card-text">{image.description}</p>
          <button className="btn btn-primary" onClick={() => setSelectedImageId(image.id.toString())}>Comment</button>
          
          {selectedImageId === image.id.toString() && (
            <div className="mt-3">
              <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="form-control mb-2" placeholder="Add a comment..." />
              <button onClick={() => handlePostComment(image.id)} className="btn btn-secondary">Post Comment</button>
            </div>
          )}

          <div className="mt-3">
            <h6>Comments:</h6>
            {comments[image.id] && comments[image.id].map((comment, index) => (
              <p key={index}>
                <img
                className='mr-2'
                width='30'
                height='30'
                src={`data:image/png;base64,${
                  comment.author && comment.author.startsWith('0x') && comment.author.length === 42
                    ? new Identicon(comment.author, 30).toString()
                    : '' // Provide a default or empty string if not a valid address
                }`}
                alt="Commenter Identicon"
              />
              <strong>{comment.author || 'Anonymous'}:</strong> {comment.text}</p>
            ))}
            {!comments[image.id] || comments[image.id].length === 0 ? <p>No comments yet.</p> : null}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
    </div>
  );
};

export default Main;
