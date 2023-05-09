import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddProduct from './components/AddProduct/AddProduct';
import UpdateProduct from './components/UpdateProduct/UpdateProduct';

const ENDPOINT = '/products';

function App() {

  const [products, setProducts] = useState([]);
  const [syncedProducts, setSyncedProducts] = useState(0);
  
  useEffect(() => {
    // Access-Control-Allow-Origin: *
    getProducts();

  }, []);

  const getProducts = () => {
    axios.get(ENDPOINT, 
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          mode: 'no-cors',
        }
      })
    .then(res => {
      console.log("products", res.data);
      setProducts(res.data);
      setSyncedProducts(
        res.data.filter(product => isSynced(product)).length
      );
    })
    .catch(err => {
      console.log("Error While Fetching Products: ", err);
    })
  }

  const [responseSync, setResponseSync] = useState('');

  const syncData = (e) => {
    e.preventDefault();
    axios.get(ENDPOINT + '/sync',
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          mode: 'no-cors',
        }
      })
    .then(res => {
      setResponseSync(res.data);
      getProducts();
    })
    .catch(err => {
      setResponseSync( err.response.data.toString());
      console.log("Error While Syncing Products: ", err.response.data);
    })
  }

  const isSynced = (product) => {
    return product.update_sync === 0 && product.delete_sync === 0 && product.create_sync === 0;
  }

  const updateProduct = (id) => {

  }

  const deleteProduct = (id) => {
    axios.delete(ENDPOINT + '/' + id,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          mode: 'no-cors',
        }
      })
    .then(res => {
      alert("Product Deleted Successfully!");
      getProducts();
      
    })
    .catch(err => {
      alert( err.response.data.toString());
      console.log("Error While Deleting Product: ", err.response.data);
    })
  }



  return (
    <div className="App">
      {/* table containing products: id product date region qty cost amount tax total update_sync delete_sync */}
      <div className='header'>
        <div className='header-info'>
          <h1>Total: {products.length } Products</h1>
          <div className='sync-info'>
            <p>Synchronized:
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
              <span className='green'>
                {syncedProducts}
              </span> 
              Products
            </p>
            <p>Not Synchronized: 
              <span className='red'>
                {products.length - syncedProducts}
              </span> 
              Products
            </p>
          </div>
          <button onClick={(e) => syncData(e)}>Sync with <i>Head office</i></button>
          <h6  className='response'>{responseSync}</h6>
        </div>
        <div className='vertical-sep'/>
        <AddProduct />
        <div className='vertical-sep'/>
        <UpdateProduct />
      </div>
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
            <th>update_sync</th>
            <th>delete_sync</th>
            <th>create_sync</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {/* map products to rows */}
          {products.map(product => {
            return (
              <tr key={product.id} className={isSynced(product) ? 'synced' : 'not-synced'}>
                <td>{product.id}</td>
                <td>{product.product}</td>
                <td>{product.date}</td>
                <td>{product.region}</td>
                <td>{product.qty}</td>
                <td>{product.cost}</td>
                <td>{product.amount}</td>
                <td>{product.tax}</td>
                <td>{product.total}</td>
                <td>{product.update_sync}</td>
                <td>{product.delete_sync}</td>
                <td>{product.create_sync}</td>
                <td className='update-btn'>
                  <button onClick={(e) => updateProduct(product.id)}>Update</button>
                </td>
                <td className='delete-btn'>
                  <button onClick={(e) => deleteProduct(product.id)}>Delete</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
