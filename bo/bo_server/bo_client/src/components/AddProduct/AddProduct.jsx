import React from 'react';
import './index.css'
import axios from 'axios';

/*
  product: {
    id
    product
    date
    region
    qty
    cost
    amount
    tax
    total
    update_sync
    delete_sync
    create_sync
  }
*/

const AddProduct = () => {
  const [product, setProduct] = React.useState({
    product: '',
    date: '',
    region: '',
    qty: '',
    cost: '',
    amount: '',
    tax: '',
    total: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!product.product || !product.date || !product.region || !product.qty || !product.cost || !product.amount || !product.tax || !product.total) {
      alert('Please fill all the fields');
      return;
    }
    axios.post('/products', product)
      .then(res => {
        alert('Product added successfully');
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
        alert('Error adding product');
      }
    );
  }



  return (
    <div className='add-product'> 
      <h1>Add Product</h1>
      <form>
        <label>Product name</label>
        <input type="text" name="product" onChange={(e) => setProduct({...product, product: e.target.value})} />
        <label>Date</label>
        <input type="date" name="date" onChange={(e) => setProduct({...product, date: e.target.value})} />
        <label>Region</label>
        <input type="text" name="region" onChange={(e) => setProduct({...product, region: e.target.value})} />
        <label>Qty</label>
        <input type="float" name="qty" onChange={(e) => setProduct({...product, qty: e.target.value})} />
        <label>Cost</label>
        <input type="float" name="cost" onChange={(e) => setProduct({...product, cost: e.target.value})} />
        <label>Amount</label>
        <input type="float" name="amount" onChange={(e) => setProduct({...product, amount: e.target.value})} />
        <label>Tax</label>
        <input type="float" name="tax" onChange={(e) => setProduct({...product, tax: e.target.value})} />
        <label>Total</label>
        <input type="float" name="total" onChange={(e) => setProduct({...product, total: e.target.value})} />
        <button onClick={handleSubmit}>Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
