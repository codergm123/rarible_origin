import React, { useState, useEffect } from "react";
// import mewConnect from '@myetherwallet/mewconnect-web-client';
import MEWconnect from "@myetherwallet/mewconnect-web-client"
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import PopUpCreator from '../../../../node_modules/@myetherwallet/mewconnect-web-client/src/connectWindow/popUpCreator.js';
import BigNumber from 'bignumber.js';

import { createUserSession, destroyUserSession } from "../../api/user"
import image1 from "../../../assets/images/MyEtherWallet.svg"

const Connect = (props) => {
  const [address, setAddress] = useState(props.address ? props.address : null)
  const [token, setToken] = useState(null)

  const providerOptions = {
    mewconnect: {
      package: MEWconnect,
      options: {
        infuraId: 'be9c076272484b11a0d7fae52193f281'
      }
    },
  }

  const web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: true,
    providerOptions
  });

  useEffect(() => {
    const currentToken = document.querySelector('[name=csrf-token]').content;
    if (currentToken) {
      setToken(currentToken)
    }

    const fetchAccount = async () => {
    }

    fetchAccount()
  }, [])
    
  const connect = async () => {
    const connect = new MEWconnect.Provider({infuraId: '859569f6decc4446a5da1bb680e7e9cf'});
    const ethereum = connect.makeWeb3Provider(1)
    const web3 = new Web3(ethereum);

    ethereum.enable().then((accounts) => {
      console.log(`User's address is ${accounts[0]}`)
      setAddress(accounts[0])
      createUserSession(accounts[0], token, "myEatherWallet")
      window.location.reload();
    })
  }

  // const disconnect = () => {
  //   ethereum.disconnect()
  // }

  // const getAccount = () => {
  //   ethereum.send('eth_requestAccounts').then(accounts => {
  //     console.log(`User's address is ${accounts[0]}`);
  //   });
  // }

  // const getBalance = () => {
  //   web3.eth.getBalance(userAddress).then(bal => setBalance(bal));
  // }

  // Web Extension Connector
  const webConnect = async () => {
    const provider = await web3Modal.connect();

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: string[]) => {
      console.log("accountsChanged", accounts);
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      console.log("chainChanged", chainId);
    });

    // Subscribe to provider connection
    provider.on("connect", (info: { chainId: number }) => {
      console.log("connect", info);
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error: { code: number; message: string }) => {
      console.log("disconnect", error);
    });

    const newWeb3 = new Web3(provider);
    console.log("newWeb3", newWeb3)
    const accounts = await newWeb3.eth.getAccounts()
    const balance = await newWeb3.eth.getBalance(accounts[0])
    setAddress(accounts[0])
    await createUserSession(accounts[0], token, newWeb3.utils.fromWei(balance), "myEatherWallet")
    window.location.reload();
  }

  const webDisconnect = async (e: any) => {
    // let provider = await web3Modal.connect();
    // await provider.close();
    await web3Modal.clearCachedProvider();
    // provider = null;

    // if (provider.close) {
    //   console.log("inside the provider close function")
    //   await provider.close();
    //   await web3Modal.clearCachedProvider();
    //   provider = null;
    // }
    await destroyUserSession(address, token)
    e.preventDefault()
    window.location.reload();
  }

  // Web Extension Connector End



  return (
    <React.Fragment>
      { address &&
        <a onClick={webDisconnect}>Disconnect</a>
      }

      { !address &&
        <React.Fragment>
          <div className="box-item-wallet">
            <span>
              <img src={image1} className="img-responsive img-wallet" />
            </span>
            <span className="content-connect-wallet" onClick={webConnect}>MEWconnect DAPP</span>
          </div>
          <div className="box-item-wallet">
            <span>
              <img src={image1} className="img-responsive img-wallet" />
            </span>
            <span className="content-connect-wallet" onClick={connect}>MyEther Wallet</span>
          </div>
        </React.Fragment>
      }
    </React.Fragment>
  )
}

export default Connect