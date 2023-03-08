import * as React from "react";
import styled from "styled-components"
// Object.defineProperty(exports, "__esModule", { value: true });
// import type { WalletConnect } from "@walletconnect/client"
// import type WalletConnect from "@walletconnect/client"
import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"
import { convertUtf8ToHex } from "@walletconnect/utils"
import { IInternalEvent } from "@walletconnect/types"
import { apiGetAccountAssets, apiGetGasPrices, apiGetAccountNonce } from "../helpers/api"
import { createUserSession, destroyUserSession } from "../api/user"


const Button = styled.button`
  background: palevioletred;
  border-radius: 3px;
  border: none;
  color: white;
`

const GreenButton = styled.button`
  background: #26881b;
  border-radius: 3px;
  border: none;
  color: white;
`
interface IAppState {
  connector: WalletConnect | null;
  fetching: boolean;
  connected: boolean;
  chainId: number;
  showModal: boolean;
  pendingRequest: boolean;
  uri: string;
  accounts: string[];
  address: string;
  result: any | null;
  token: string;
}

const INITIAL_STATE: IAppState = {
  connector: null,
  fetching: false,
  connected: false,
  chainId: 1,
  showModal: false,
  pendingRequest: false,
  uri: "",
  accounts: [],
  address: "",
  result: null,
  token: ""
};

class Header extends React.Component<any, any> {
  public state: IAppState = {
    ...INITIAL_STATE,
  };

  componentDidMount() {
    const token = document.querySelector('[name=csrf-token]').content;
    this.setState({token: token})
  }

  public walletConnectInit = async () => {
    const bridge = "https://bridge.walletconnect.org";
    const connector = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    await this.setState({ connector });

    if (!connector.connected) {
      await connector.createSession();
    }
    await this.subscribeToEvents();
  }

  public subscribeToEvents = () => {
    const { connector } = this.state;

    if (!connector) {
      return;
    }

    connector.on("session_update", async (error, payload) => {
      console.log(`connector.on("session_update")`);

      if (error) {
        throw error;
      }

      const { chainId, accounts } = payload.params[0];
      this.onSessionUpdate(accounts, chainId);
    });

    connector.on("connect", (error, payload) => {
      console.log(`connector.on("connect")`);

      if (error) {
        throw error;
      }

      this.onConnect(payload);
    });

    connector.on("disconnect", (error, payload) => {
      console.log(`connector.on("disconnect")`);

      if (error) {
        throw error;
      }

      this.onDisconnect();
    });

    if (connector.connected) {
      const { chainId, accounts } = connector;
      const address = accounts[0];
      this.setState({
        connected: true,
        chainId,
        accounts,
        address,
      });
      this.onSessionUpdate(accounts, chainId);
    }

    this.setState({ connector });
  };

  public killSession = async () => {
    console.log("On kill this.state", this.state)
    const { connector, address } = this.state;
    const token = document.querySelector('[name=csrf-token]').content;
    await destroyUserSession(address, token)

    if (connector) {
      connector.killSession();
    }
    this.resetApp();
  };

  public resetApp = async () => {
    await this.setState({ ...INITIAL_STATE });
  };

  public onConnect = async (payload: IInternalEvent) => {
    const { chainId, accounts } = payload.params[0];
    const address = accounts[0];
    const token = document.querySelector('[name=csrf-token]').content;
    await createUserSession(address, token)
    await this.setState({
      connected: true,
      chainId,
      accounts,
      address,
      token
    });
    this.getAccountAssets();
  };

  public onDisconnect = async () => {
    if (this.state.address) {
      const token = document.querySelector('[name=csrf-token]').content;
      await destroyUserSession(this.state.address, token)
    }
    this.resetApp();
  };

  public onSessionUpdate = async (accounts: string[], chainId: number) => {
    const address = accounts[0];
    await this.setState({ chainId, accounts, address });
    await this.getAccountAssets();
  };

  public getAccountAssets = async () => {
    const { address, chainId } = this.state;
    this.setState({ fetching: true });
    try {
      // get account balances
      const assets = await apiGetAccountAssets(address, chainId);
      console.log("getAccountAssets", assets)

      await this.setState({ fetching: false, address, assets });
    } catch (error) {
      console.error(error);
      await this.setState({ fetching: false });
    }
  };

  public toggleModal = () => this.setState({ showModal: !this.state.showModal });

  // public testSendTransaction = async () => {
  //   const { connector, address, chainId } = this.state;

  //   if (!connector) {
  //     return;
  //   }

  //   // from
  //   const from = address;

  //   // to
  //   const to = address;

  //   // nonce
  //   const _nonce = await apiGetAccountNonce(address, chainId);
  //   const nonce = sanitizeHex(convertStringToHex(_nonce));

  //   // gasPrice
  //   const gasPrices = await apiGetGasPrices();
  //   const _gasPrice = gasPrices.slow.price;
  //   const gasPrice = sanitizeHex(convertStringToHex(convertAmountToRawNumber(_gasPrice, 9)));

  //   // gasLimit
  //   const _gasLimit = 21000;
  //   const gasLimit = sanitizeHex(convertStringToHex(_gasLimit));

  //   // value
  //   const _value = 0;
  //   const value = sanitizeHex(convertStringToHex(_value));

  //   // data
  //   const data = "0x";

  //   // test transaction
  //   const tx = {
  //     from,
  //     to,
  //     nonce,
  //     gasPrice,
  //     gasLimit,
  //     value,
  //     data,
  //   };

  //   try {
  //     // open modal
  //     this.toggleModal();

  //     // toggle pending request indicator
  //     this.setState({ pendingRequest: true });

  //     // send transaction
  //     const result = await connector.sendTransaction(tx);

  //     // format displayed result
  //     const formattedResult = {
  //       method: "eth_sendTransaction",
  //       txHash: result,
  //       from: address,
  //       to: address,
  //       value: "0 ETH",
  //     };

  //     // display result
  //     this.setState({
  //       connector,
  //       pendingRequest: false,
  //       result: formattedResult || null,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     this.setState({ connector, pendingRequest: false, result: null });
  //   }
  // };

  // public testSignPersonalMessage = async () => {
  //   const { connector, address, chainId } = this.state;

  //   if (!connector) {
  //     return;
  //   }

  //   // test message
  //   const message = "My email is john@doe.com - 1537836206101";

  //   // encode message (hex)
  //   const hexMsg = convertUtf8ToHex(message);

  //   // personal_sign params
  //   const msgParams = [hexMsg, address];

  //   try {
  //     // open modal
  //     this.toggleModal();

  //     // toggle pending request indicator
  //     this.setState({ pendingRequest: true });

  //     // send message
  //     const result = await connector.signPersonalMessage(msgParams);

  //     // verify signature
  //     const hash = hashPersonalMessage(message);
  //     const valid = await verifySignature(address, result, hash, chainId);

  //     // format displayed result
  //     const formattedResult = {
  //       method: "personal_sign",
  //       address,
  //       valid,
  //       result,
  //     };

  //     // display result
  //     this.setState({
  //       connector,
  //       pendingRequest: false,
  //       result: formattedResult || null,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     this.setState({ connector, pendingRequest: false, result: null });
  //   }
  // };

  // public testSignTypedData = async () => {
  //   const { connector, address, chainId } = this.state;

  //   if (!connector) {
  //     return;
  //   }

  //   const message = JSON.stringify(eip712.example);

  //   // eth_signTypedData params
  //   const msgParams = [address, message];

  //   try {
  //     // open modal
  //     this.toggleModal();

  //     // toggle pending request indicator
  //     this.setState({ pendingRequest: true });

  //     // sign typed data
  //     const result = await connector.signTypedData(msgParams);

  //     // verify signature
  //     const hash = hashTypedDataMessage(message);
  //     const valid = await verifySignature(address, result, hash, chainId);

  //     // format displayed result
  //     const formattedResult = {
  //       method: "eth_signTypedData",
  //       address,
  //       valid,
  //       result,
  //     };

  //     // display result
  //     this.setState({
  //       connector,
  //       pendingRequest: false,
  //       result: formattedResult || null,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     this.setState({ connector, pendingRequest: false, result: null });
  //   }
  // };

  public render = () => {
    const {
      assets,
      address,
      connected,
      chainId,
      fetching,
      showModal,
      pendingRequest,
      result,
    } = this.state;
    console.log("render address", address)
    return (
      <React.Fragment>
        {address && 
          <Button onClick={this.killSession}>Disconnect</Button>
        }

        { !address && <GreenButton onClick={this.walletConnectInit} fetching={fetching}>Connect</GreenButton> }
        {/* { !address && <a href="#" className="connect-wallet" type="button" onClick={this.walletConnectInit} data-toggle="modal" data-target="#connect-wallet-modal">Connect Wallet</a> } */}
      </React.Fragment>
    );
  };
}

export default Header;