import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FetchData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Products</h1>
      {data && (
        <ul>
          {data.products.map((product, index) => (
            <li key={index}>
              <p>{product.title}</p>
              <img src={product.image.src} alt={product.title} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FetchData;
