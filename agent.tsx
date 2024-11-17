import React, { useEffect, useState } from 'react';
import { Agent, TTS, DefaultPrompts, Prompt } from 'react-agents';

interface Deal {
  name: string;
  regularPrice: string;
  salePrice: string;
  discount: string;
  productUrl: string;
  image: string;
}

const JOKE_API_URL = 'https://official-joke-api.appspot.com/random_joke';

export default function MyAgent() {
  const [deals, setDeals] = useState<Deal[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [userQuery, setUserQuery] = useState<string | null>(null);
  const [joke, setJoke] = useState<string | null>(null);

  useEffect(() => {
    console.log("Disclaimer: I am a virtual assistant. I help you find the best shopping deals aligned with your preferences!");
  }, []);

  // Hardcoded list of deals (replace with your own product data)
  const sampleDeals: Deal[] = [
    {
      name: 'Sony Noise Cancelling Headphones',
      regularPrice: '$349',
      salePrice: '$279',
      discount: '20% Off',
      productUrl: 'https://www.bestbuy.com/site/sony-headphones',
      image: 'https://images.bestbuy.com/sony-headphones.jpg',
    },
    {
      name: 'Apple iPhone 14 Pro',
      regularPrice: '$999',
      salePrice: '$899',
      discount: '10% Off',
      productUrl: 'https://www.bestbuy.com/site/apple-iphone-14-pro',
      image: 'https://images.bestbuy.com/iphone14pro.jpg',
    },
    {
      name: 'Samsung 4K Smart TV',
      regularPrice: '$599',
      salePrice: '$499',
      discount: '16.7% Off',
      productUrl: 'https://www.bestbuy.com/site/samsung-4k-tv',
      image: 'https://images.bestbuy.com/samsung-tv.jpg',
    },
  ];

  // Function to simulate fetching deals based on user query
  const fetchDeals = (query: string) => {
    setLoading(true);
    setUserQuery(query); // Store the user query to show it in the response message
    setJoke(null); // Reset joke before fetching new one

    // Fetch a joke every time a query is made
    fetch(JOKE_API_URL)
      .then(response => response.json())
      .then(data => setJoke(`${data.setup} ${data.punchline}`))
      .catch(() => setJoke("Oops! I couldn't fetch a joke right now."));

    setTimeout(() => {
      // Filter deals based on the user's query
      const filteredDeals = sampleDeals.filter(deal =>
        deal.name.toLowerCase().includes(query.toLowerCase())
      );
      setDeals(filteredDeals);
      setLoading(false);
    }, 100); // Simulate an API delay
  };

  return (
    <Agent>
      {showDisclaimer}

      <DefaultPrompts />
      <Prompt>Can you find me the best deals on Sony Noise Cancelling Headphones?</Prompt>
      
      <button onClick={() => fetchDeals('Sony Noise Cancelling Headphones')}>Find Deals on Sony Noise Cancelling Headphones</button>
      <button onClick={() => fetchDeals('Apple iPhone 14 Pro')}>Find Deals on Apple iPhone 14 Pro</button>
      <button onClick={() => fetchDeals('Samsung 4K Smart TV')}>Find Deals on Samsung 4K Smart TV</button>

      {loading && <p>Loading deals for {userQuery}...</p>}

      {joke && !loading && (
        <div>
          <p>Here's a joke for you: {joke}</p>
        </div>
      )}

      {deals && !loading && deals.length > 0 && (
        <div>
          <h3>Here are the best deals for {userQuery}:</h3>
          <ul>
            {deals.map((deal, index) => (
              <li key={index}>
                <h4>{deal.name}</h4>
                <p>
                  Regular Price: {deal.regularPrice} <br />
                  Sale Price: {deal.salePrice} <br />
                  Discount: {deal.discount} <br />
                  <a href={deal.productUrl} target="_blank" rel="noopener noreferrer">View Deal</a>
                </p>
                <img src={deal.image} alt={deal.name} style={{ width: '200px' }} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {!deals && !loading && !userQuery && <p>Ask me for some deals, and I'll find the best options for you!</p>}
    </Agent>
  );
}
