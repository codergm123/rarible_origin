import * as React from "react";
// Object.defineProperty(exports, "__esModule", { value: true });
// import type { WalletConnect } from "@walletconnect/client"
// import type WalletConnect from "@walletconnect/client"
import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"
import { convertUtf8ToHex } from "@walletconnect/utils"
import { IInternalEvent } from "@walletconnect/types"
import { apiGetAccountAssets, apiGetGasPrices, apiGetAccountNonce } from "../../helpers/api"
import { createUserSession, destroyUserSession } from "../../api/user"
import walletConnectImage from "../../../assets/images/WalletConnet.svg"

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

class Wallet extends React.Component<any, any> {
  // public state: IAppState = {
  //   ...INITIAL_STATE,
  // };

  public state: IAppState = {
    connector: null,
    fetching: false,
    connected: false,
    chainId: 1,
    showModal: false,
    pendingRequest: false,
    uri: "",
    accounts: [],
    address: this.props && this.props.props && this.props.props.address ? this.props.props.address : "",
    result: null,
    token: ""
  };


  componentDidMount() {
    const token = document.querySelector('[name=csrf-token]').content;
    this.setState({token: token})
    if (this.props && this.props.props && this.props.props.address) {
      this.walletConnectInit();
    }
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
      if (error) {
        throw error;
      }

      const { chainId, accounts } = payload.params[0];
      this.onSessionUpdate(accounts, chainId);
    });

    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      this.onConnect(payload);
    });

    connector.on("disconnect", (error, payload) => {
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
    const { connector, address } = this.state;
    const token = document.querySelector('[name=csrf-token]').content;
    await destroyUserSession(address, token)

    if (connector) {
      connector.killSession();
    }
    this.resetApp();
    window.location.reload();
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
    window.location.reload()
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
      await this.setState({ fetching: false, address, assets });
    } catch (error) {
      console.error(error);
      await this.setState({ fetching: false });
    }
  };

  public toggleModal = () => this.setState({ showModal: !this.state.showModal });

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

    return (
      <React.Fragment>
        {/* {this.props && this.props.props && this.props.props.address &&  */}
        {address && 
          <a href="" onClick={this.killSession}>Disconnect</a>
        }

        {/* { !address && <GreenButton onClick={this.walletConnectInit} fetching={fetching}>Connect</GreenButton> } */}
        { !address &&
          <div className="box-item-wallet">
            <a href="#" type="button" data-dismiss="modal" onClick={this.walletConnectInit}>
              <span><img src={walletConnectImage} className="img-responsive img-wallet" /></span>
              <span className="content-connect-wallet">Wallet Connet</span>
            </a>
          </div>
        }
      </React.Fragment>
    )
  }
}

export default Wallet