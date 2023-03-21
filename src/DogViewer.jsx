import React, { useState, useEffect } from 'react';
import { API_KEY, API_URL } from './config';


const DogViewer = () => {
  const [dog, setDog] = useState(null);
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchDog();
  }, []);

  const fetchDog = async () => {
    const response = await fetch(`${API_URL}/images/search?api_key=${API_KEY}`);
    const [data] = await response.json();
    setDog(data);
  };

  const handleBanAttribute = (attribute) => {
    setBannedAttributes([...bannedAttributes, attribute]);
  };

  const handleNewDog = async () => {
    const response = await fetch(`${API_URL}/images/search?api_key=${API_KEY}`);
    const [data] = await response.json();
    if (!bannedAttributes.some(attr => data.breeds.some(breed => breed.name === attr))) {
      setDog(data);
      setHistory([...history, data]);
    } else {
      handleNewDog();
    }
  };

  if (!dog) {
    return <div>Loading...</div>;
  }

  const { breeds, url } = dog;

  return (
    <div className='dog-container'>
      <img  className='dog-image' src={url} alt="A cute dog" />
      <ul className='dog-attributes'>
        {breeds.map(breed => (
          <li key={breed.id} className='dog-breed'>
            {breed.name} ({breed.life_span})
            <button onClick={() => handleBanAttribute(breed.name)} className='ban-button'>Ban</button>
          </li>
        ))}
      </ul>
      <button onClick={handleNewDog} className='new-dog-button'>New dog</button>
      <h2>History</h2>
      <ul className='history-layout'>
        {history.map(dog => (
          <li key={dog.id}>
            <img  className='dog-image' src={dog.url} alt="A cute dog" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DogViewer;
