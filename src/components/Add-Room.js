import React, { Component } from 'react';
import Web3 from 'web3';

let web3 = window.web3
// stolen code zone vvv

if (typeof web3 !== 'undefined') {
  // Use Mist/MetaMask's provider
  web3 = new Web3(window.web3.currentProvider);
  console.log("first case");
} else {
  console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
}

// let RBAbi = require('../../../abis/RoomBaseAbi.js');
// let RBAddress = '0x8273e4b8ed6c78e252a9fca5563adfcc75c91b2a';
// let RB = web3.eth.contract(RBAbi).at(RBAddress);

// let ROAbi = require('../../../abis/RoomOwnershipAbi.js');
// let ROAddress = '0x4e71920b7330515faf5ea0c690f1ad06a85fb60c';
// let RO = web3.eth.contract(ROAbi).at(ROAddress);

let RRAbi = require('../../abis/RoomRentingAbi.js');
let RRAddress = require('../../Contract-Addresses/Rinkeby-Address.js');
let RR = web3.eth.contract(RRAbi).at(RRAddress);

class AddRoomForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      numBeds : '',
    }
    this.handleTextChange=this.handleTextChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
  }

  handleTextChange = (event) => {
    if(this.state[event.target.id] !== undefined){
      this.setState({[event.target.id]: event.target.value});
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log("handleSubmit fired!");
    let numBeds = Number(this.state.numBeds);
    RR.addRoom(numBeds, {from: web3.eth.accounts[0], gas: 3000000}, (err,res)=>{
      if(err){
        console.log("there is an error with the callback");
      }
      console.log("success!");
      console.log(res);
    });
    console.log("RR.addRoom fired!");
    this.setState({
      numBeds : '',
    })
  }

  render() {
    const style={
      backgroundColor: '#4D4D4D',
      padding: '10px',
      fontWeight: 'bold',
      width: '420px',
      marginTop: '5px',
      marginBottom: '5px',
      /*
      color: '',
      textAlign: '',
      border: '',
      margin: '',
      display: '',
      clear: '',
      float: '',
      paddingTop: '',
      paddingRight: '',
      paddingBottom: '',
      paddingLeft: ''
      */
    }
    const fieldset={
      border: '2px solid #F4BE41'
    }
    const addStyle={
      textDecoration: 'overline underline',
      border: '10px #F4BE41',
      borderWidth: '10px',
      backgroundColor: 'white',
      textAlign: 'center',
      fontSize: '40px',
      color: '#3973B5'
    }
    const labelStyle={
      border: "2px solid #383838",
      borderTop: "2px solid red",
      backgroundColor: "white"
    }
    const formStyle = {
      "backgroundColor": "",
      "flexGrow": 1,
    };
    return (
      <div style={style} className="AddRoomForm">
        <fieldset style={fieldset}>
          <legend style={addStyle}>Add Room</legend>
          <form style={formStyle}>
            <label>
            <div style={labelStyle}> Beds: </div>
              <input id="numBeds" onChange={this.handleTextChange} type="text" value={this.state.numBeds} />
            </label>
            <hr />
            <input id="submit" type="submit" value="Submit" onClick={this.handleSubmit}/>
          </form>
        </fieldset>
      </div>
    );
  }
}

export default AddRoomForm
