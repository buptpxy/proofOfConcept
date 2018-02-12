import React, { Component } from 'react';
import Admins from '../../components/admins.js'
import RoomInfo from '../../components/room-details.js'
import TotalSupply from '../../components/total-supply.js';
import '../../App.css';
import Web3 from 'web3';
import AddRoomForm from '../../components/Add-Room.js';
import ChangeOfficersForm from '../../components/change-admins.js';
import OwnerOf from '../../components/ownerOf.js';
import Transfer from '../../components/Transfer.js';
import TransferFrom from '../../components/Transfer-From.js';
import Approve from '../../components/Approve.js';
import BalanceOf from '../../components/Balance-Of.js';
import CheckAvailable from '../../components/Check-Available.js';
import Reserve from '../../components/Reserve.js';
import Access from '../../components/Access.js';
import Settle from '../../components/Settle.js';
import CancelReservation from '../../components/Cancel-Reservation.js';
import GetCurrentTime from '../../components/Get-Current-Time.js';
import ChangeMinRental from '../../components/Change-Min-Rental.js';
import ChangeNumBeds from '../../components/Change-Num-Beds.js';
import TextInput from '@aragon/ui';
import Field from '@aragon/ui';

let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"))

let RBAbi = require('../../../abis/RoomBaseAbi.js');
let RBAddress = '0x8273e4b8ed6c78e252a9fca5563adfcc75c91b2a';
let RB = web3.eth.contract(RBAbi).at(RBAddress);

// let ROAbi = require('../../../abis/RoomOwnershipAbi.js');
// let ROAddress = '0x8f0483125fcb9aaaefa9209d8e9d7b9c8b9fb90f';
// let RO = web3.eth.contract(ROAbi).at(ROAddress);

let RRAbi = require('../../../abis/RoomRentingAbi.js');
let RRAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
let RR = web3.eth.contract(RRAbi).at(RRAddress);

let balance = web3.fromWei(web3.eth.getBalance(web3.eth.coinbase)).toString();
let ceo = RR.ceo();
let cfo = RR.cfo();
let coo = RR.coo();
let totalSupply = RR.totalSupply().toString();
console.log("totalSupply: " + totalSupply + " " + typeof totalSupply);
// @dev add error handling here: if there are no rooms this method will fail.
// TODO: Refactor such that we don't use RB, just RR.
let roomInfo = RB.rooms(Number(totalSupply) - 1);
let roomId = Number(totalSupply) - 1;
let hotelId = String(roomInfo[0]).split(',');
let roomNumber = String(roomInfo[1]).split(',');
let minRentTime = String(roomInfo[2]).split(',');
let numBeds = String(roomInfo[3]).split(',');

web3.eth.defaultAccount = web3.eth.accounts[0];

class HotelFrontDesk extends Component {
  constructor(props){
    super(props)
    this.state = {
      ceo: '',
      cfo: '',
      coo: '',
      balance: '',
      totalSupply: 0,
      roomId: 0,
      hotelId: 0,
      roomNumber: 0,
      numBeds: 0,
      addHotelId: 0,
      addRoomNumber: 0,
      addNumBeds: 0,
      roomInfo: roomInfo
    }
    this.getBalance = this.getBalance.bind(this);
    this.getCeo = this.getCeo.bind(this);
    this.getCfo = this.getCfo.bind(this);
    this.getCoo = this.getCoo.bind(this);
    this.getTotalSupply = this.getTotalSupply.bind(this);
    this.getroomInfo = this.getRoomInfo.bind(this);
  }

  getBalance = () => {
  balance = web3.fromWei(web3.eth.getBalance(web3.eth.coinbase)).toString();
  }
  getCeo = () => {
    ceo = RR.ceo();
  }
  getCfo = () => {
    cfo = RR.cfo();
  }
  getCoo = () => {
    coo = RR.coo();
  }
  getTotalSupply = () => {
    totalSupply = RR.totalSupply().toString();
  }
  getRoomId = () => {
    roomId = Number(totalSupply)-1;
  }
  getRoomInfo = () => {
    if (roomId >= 0){
      console.log("getroomInfo fired!");
      roomInfo = RR.rooms(roomId);
      console.log(typeof roomInfo);
      console.log(roomInfo);
      hotelId = String(roomInfo[0]).split(',');
      roomNumber = String(roomInfo[1]).split(',');
      minRentTime = String(roomInfo[2]).split(',');
      numBeds = String(roomInfo[3]).split(',');
      this.setState({
        hotelId: hotelId,
        roomNumber: roomNumber,
        minRentTime: minRentTime,
        numBeds: numBeds,
      })
    } else {
      console.log("error at Home.js getroomInfo()");
    }
  }
  textInput = () => (
    <TextInput type="text" />
  )
  fieldLabel = () => (
    <Field label="Enter name here:">
      <input />
    </Field>
  )

  render() {
    const gridWrapper={
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 2fr)',
      gridAutoRow: '60px 60px 60px',
      gridAutoColumn: '90px 90px 90px',
      gridAutoFlow: 'row',
      alignItems: 'start',
      justifyItems: '',
      gridTemplateAreas: '',
      alignContent: 'center',
      /*
      gridColumnStart: '',
      gridColumnEnd: '',
      gridRowStart: '',
      gridRowEnd: '',
      gridTemplateRows: '',
      gridColumnGap: '1em',
      gridRowGap: '',
      */
}

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>BookLocal Homepage</h1>
            <p>The page is being modified to read and write to the Truffle testRpc.</p>

            // TODO: call data from blockchain here.

            <div style={gridWrapper} className="Container">
              <TotalSupply
                getTotalSupply={this.getTotalSupply}
                totalSupply={totalSupply}
              />
              <RoomInfo
                getRoomId={this.getRoomId}
                roomId={roomId}
                getRoomInfo={this.getRoomInfo}
                hotelId={hotelId}
                roomNumber={roomNumber}
                minRentTime={minRentTime}
                numBeds={numBeds}
              />
              <Approve />
              <ChangeMinRental />
              <ChangeNumBeds />
              <Access />
              <Settle />
              <GetCurrentTime />
              <CheckAvailable />
              <Reserve />
              <CancelReservation />
            </div>
            <img id="loader" src='https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif' role="presentation"/>
            // end data call.
          </div>
        </div>
      </main>
    )
  }
}

export default HotelFrontDesk
