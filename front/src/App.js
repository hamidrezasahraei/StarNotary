import React, { useState, useEffect } from 'react';
import './App.css';
import starNotaryContract from './ethereum/starNotary';
import './StarNotary.css';
const { ethers } = require("ethers");

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [starName, setStarName] = useState('');
  const [starId, setStarId] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        let currentProvider;
        if (window.ethereum) {
          currentProvider = new ethers.BrowserProvider(window.ethereum);
          await currentProvider.send("eth_requestAccounts", []);
        } else {
          console.warn("No web3 detected. Falling back to http://127.0.0.1:8545.");
          currentProvider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
        }
        const currentSigner = await currentProvider.getSigner();
        const currentContract = starNotaryContract(currentProvider);

        console.info("Signer is: ", currentSigner);

        setProvider(currentProvider);
        setSigner(currentSigner);
        setContract(currentContract);
      } catch (error) {
        console.error("Could not connect to contract or chain:", error);
      }
    };

    init();
  }, []);

  const createStar = async () => {
    if (!contract || !starName || !starId) return;
    try {
      const transaction = await contract.connect(signer).createStar(starName, starId);
      await transaction.wait();
      setStatus(`New Star Owner is ${await signer.getAddress()}.`);
    } catch (error) {
      console.error("Error creating star:", error);
      setStatus("Error creating star. See console for details.");
    }
  };

  const lookupStar = async () => {
    if (!contract || !lookupId) return;
    try {
      const starInfo = await contract.lookUptokenIdToStarInfo(lookupId)
      if (!starInfo || starInfo.toString().trim(starInfo) === '') {
        setStatus("There is no star with this ID");
      } else {
        setStatus(`Star name is ${starInfo}.`);
      }
    } catch (error) {
      console.error("Error looking up star:", error);
      setStatus("Error getting star info. See console for details.");
    }
  };

  return (
    <div className="App">
      <h1>StarNotary Token DAPP</h1>
      <hr />

      <div className="create-star-section">
        <h2>Create a Star</h2>
        <label htmlFor="starName">Star Name:</label>
        <input
          type="text"
          id="starName"
          value={starName}
          onChange={(e) => setStarName(e.target.value)}
        />
        <label htmlFor="starId">Star ID:</label>
        <input
          type="text"
          id="starId"
          value={starId}
          onChange={(e) => setStarId(e.target.value)}
        />
        <button onClick={createStar}>Create Star</button>
      </div>

      <div className="lookup-star-section">
        <h2>Look Up a Star</h2>
        <label htmlFor="lookupId">Star ID:</label>
        <input
          type="text"
          id="lookupId"
          value={lookupId}
          onChange={(e) => setLookupId(e.target.value)}
        />
        <button onClick={lookupStar}>Look Up a Star</button>
      </div>

      <div className="status-display">
        <span>{status}</span>
      </div>
    </div>
  );
};

export default App;