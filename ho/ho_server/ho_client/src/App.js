import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '/products';
function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // get products from API
    axios.get(API_URL)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);


  return (
    <div className="App">
      <h1>Head Office</h1>
      <h3>Products</h3>
      <table>
      <thead>
          <tr>
            <th>id</th>
            <th>product</th>
            <th>date</th>
            <th>region</th>
            <th>qty</th>
            <th>cost</th>
            <th>amount</th>
            <th>tax</th>
            <th>total</th>
            <th>source office</th>
            <th>id from source</th>
          </tr>
        </thead>
        <tbody>
          {/* map products to rows */}
          {products.map(product => {
            return (
              <tr key={product.id} className={'synced'}>
                <td>{product.id}</td>
                <td>{product.product}</td>
                <td>{product.date}</td>
                <td>{product.region}</td>
                <td>{product.qty}</td>
                <td>{product.cost}</td>
                <td>{product.amount}</td>
                <td>{product.tax}</td>
                <td>{product.total}</td>
                <td>{product.source_office}</td>
                <td>{product.id_from_source}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      
    </div>
  );
}

export default App;

