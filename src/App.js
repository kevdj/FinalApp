import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){

    super();  
    this.state = {
      title: 'Our App',
      transactions: []
    }
  }
  // used to make AJAX CALLS
  componentDidMount(){  

    console.log('Component has mounted');
    var that = this;
    fetch('http://localhost:3000/api/transactions')
      .then (function(response){
          response.json()
          .then(function(data){ 
            that.setState({
              transactions: data
            })
            console.log(data); 
          })

        })
  }

  addTransaction(event){
    event.preventDefault();
    var that = this;
    let trans_data = {
      trans_name: this.refs.trans_name.value,
      trans_price: this.refs.trans_price.value,
      trans_shop: this.refs.trans_shop.value,
      shop_name: this.refs.shop_name.value
    };

    var request = new Request('http://localhost:3000/api/new-transaction',{
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json'}),
      body: JSON.stringify(trans_data)
    });

      let transactions = that.state.transactions;
            transactions.push(trans_data)
            that.setState({
              transactions: transactions
            })

    fetch(request)
      .then(function(response){
        response.json()
          .then(function(trans_data){
            
            console.log(trans_data)
          })
      })
      .catch(function(err){
        console.log(err)
      })

  }

  render() {

    let title = this.state.title;
    let transactions = this.state.transactions;
    return (
      <div className="App">

        <h1>{title}</h1>

        <form ref="ourForm">
            <input type = "text" ref="trans_name" placeholder="Transaction Name" />
            <input type = "text" ref="trans_price" placeholder="Price" />
            <input type = "text" ref="trans_shop" placeholder="ShopID" />
            <input type = "text" ref="shop_name" placeholder="Shop name" />
            <button onClick={this.addTransaction.bind(this)}>Submit</button>
            
        </form>

        <ul>
            {transactions.map(transactions => <li key={transactions.id}>{transactions.trans_name}</li>)}
        </ul>
            

      </div>
    );
  }
}

export default App;
