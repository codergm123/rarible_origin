import * as React from "react";
import styled from "styled-components";
import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { IInternalEvent } from "@walletconnect/types";
import MEWconnect from "@myetherwallet/mewconnect-web-client"
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import Modal from "../common/modal";
import ApproveModal from './approveModal'
import { createNewCollection } from "../../api/collection"
import {
  sanitizeHex,
  verifySignature,
  hashTypedDataMessage,
  hashPersonalMessage,
} from "../../helpers/utilities";
import image1 from "../../../assets/images/image-1.jpg"
import image2 from "../../../assets/images/image-2.jpg"
import image4 from "../../../assets/images/image-4.jpg"


const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`;

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`;

const SModalParagraph = styled.p`
  margin-top: 30px;
`;

const STable = styled(SContainer as any)`
  flex-direction: column;
  text-align: left;
`;

const SRow = styled.div`
  width: 100%;
  display: flex;
  margin: 6px 0;
`;

const SKey = styled.div`
  width: 30%;
  font-weight: 700;
`;

const SValue = styled.div`
  width: 70%;
  font-family: monospace;
`;

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
  name: string;
  description: string;
  putOnSale: boolean;
  instantSalePrice: boolean;
  instantPrice: number;
  unlockOnPurchase: boolean;
  collectionCategory: string;
  position: number;
  noOfCopies: number;
  type: string;
  category: string;
  selectedFile: object;
  myItemUrl: string;
  collectionParams: object;
  showApproveModal: booleanl
}

class CollectionCreate extends React.Component<any, any> {
  public state: IAppState = {
    connector: null,
    fetching: false,
    connected: false,
    chainId: 1,
    showModal: false,
    pendingRequest: false,
    uri: "",
    accounts: [],
    address: this.props.address ? this.props.address : "",
    result: null,
    token: "",
    name: "",
    description: "",
    putOnSale: true,
    instantSalePrice: false,
    instantPrice: 0,
    unlockOnPurchase: false,
    collectionCategory: "",
    position: 1,
    noOfCopies: this.props.collection_type === 'single' ? 1 : 0,
    type: this.props.type,
    category: "",
    selectedFile: null,
    myItemUrl: this.props.my_items_url ? this.props.my_items_url : "",
    collectionParams: {},
    showApproveModal: false
  };

  componentDidMount() {
    console.log("thislprops", this.props)
    const bridge = "https://bridge.walletconnect.org";
    const connect = new WalletConnect({ bridge, qrcodeModal: QRCodeModal });
    const token = document.querySelector('[name=csrf-token]').content;

    this.setState({ connector: connect, token: token});
  }

  onFormChange = (e) => {
    switch(e.target.id) {
      case "name":
        this.setState({name: e.target.value})
        break;
      case "instant_sale_price":
        this.setState({instantSalePrice: !this.state.instantSalePrice, instantPrice: 0});
        break;
      case "instant-price":
        this.setState({instantPrice: e.target.value})
        break;
      case "description":
        this.setState({description: e.target.value})
        break;
    }
  }

  onSubmit = async (e) => {
    console.log("caretasldfjlsdkjf")
    const token = document.querySelector('[name=csrf-token]').content;
    const params = {
      name: this.state.name,
      description: this.state.description,
      instant_price: this.state.instantPrice,
      put_on_sale: this.state.putOnSale,
      unlock_on_purchase: this.state.unlockOnPurchase,
      attachment: this.state.selectedFile
    }

    this.setState({collectionParams: params})

    let formData = new FormData()
    formData.append('attachment', this.state.selectedFile)
    formData.append('name', this.state.name)
    formData.append('description', this.state.description)
    formData.append('instant_sale_price', this.state.instantPrice)
    formData.append('put_on_sale', this.state.putOnSale)
    formData.append('unlock_on_purchase', this.state.unlockOnPurchase)
    
    // const { connector, address, chainId } = this.state
    // if (!connector) return;

    // const message = "Creating new NFT Collection";
    // const hexMsg = convertUtf8ToHex(message);
    // const msgParams = [hexMsg, address];

    // try {
    //   console.log("try section", address)
    //   this.toggleModal();
    //   console.log("togglemodal crossed", connector)

    //   this.setState({ pendingRequest: true });
    //   console.log("set pending request true")

    //   // send message
    //   const result = await connector.signPersonalMessage(msgParams);
    //   console.log("result", result)

    //   // verify signature
    //   const hash = hashPersonalMessage(message);
    //   console.log("hash Message", hash)
    //   const valid = await verifySignature(address, result, hash, chainId);
    //   console.log("valid", valid)

    //   // format displayed result
    //   const formattedResult = {
    //     method: "personal_sign",
    //     address,
    //     valid,
    //     result,
    //   };

    //   // display result
    //   this.setState({
    //     connector,
    //     pendingRequest: false,
    //     result: formattedResult || null,
    //   });
    //   console.log("onsubmit setting state section")

    // } catch (error) {
    //   console.log("error section")
    //   console.error(error);
    //   this.setState({ connector, pendingRequest: false, result: null });
    // }
    
    // await createNewCollection(params, token)
    // await this.signMessage()
    
    // await this.sendTx(this.state.instantPrice)
    
    // const resp = await createNewCollection(formData, token)
    // if (resp.data && resp.data.success) {
    //   if (this.state.myItemUrl) {
    //     window.location.href = this.state.myItemUrl
    //   } else {
    //     window.location.reload()
    //   }
    // }
    this.setState({showApproveModal: true})
  }

  saveCollection = async () => {
    const resp = await createNewCollection(this.state.collectionParams, this.state.token)
    if (resp.data && resp.data.success) {
      if (this.state.myItemUrl) {
        window.location.href = this.state.myItemUrl
      } else {
        window.location.reload()
      }
    }
  }

  sendTx = async (price) => {
    console.log("SendTx section", price)
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
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);

    // web3.eth.getBalance(this.state.address).then(bal => 100);
    await web3.eth.getGasPrice().then(gasPrice => {
      web3.eth.getTransactionCount(this.state.address).then(nonce => {
        web3.eth
          .sendTransaction({
            from: this.state.address,
            to: this.state.address,
            nonce,
            value: new BigNumber(10)
              .times(new BigNumber(10).pow(18))
              .toFixed(),
            gasPrice: gasPrice,
            gas: 21000
          })
          .once('transactionHash', hash => {
            console.log(['Hash', hash]);
            const tokenTxHash = hash;
            // this.partialReset();
          })
          .once('receipt', res => {
            console.log(['Receipt', res]);
          })
          .on('error', err => {
            console.log(['Error', err]);
          })
          .then(txhash => console.log('THEN: ', txhash));
      });
    });
    return true
  }


  signMessage = async () => {
    // const connect = new MEWconnect.Provider({infuraId: '859569f6decc4446a5da1bb680e7e9cf'});
    // const ethereum = connect.makeWeb3Provider(1)
    // const web3 = new Web3(ethereum);

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
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);

    await web3.eth
      .sign("Create collection", this.state.address)
      .then(_signedMessage => {
        const signature = JSON.stringify(
          {
            address: this.state.address,
            msg: "Create collection",
            sig: _signedMessage,
            version: '3',
            signer: 'MEWconnect'
          },
          null,
          2
        );
      })
      .catch(e => {
        console.log(e);
      });
    return true
  }


  onFileChange = (e) => {
    console.log("onFileChange", e.target.files)
    this.setState({selectedFile: e.target.files[0]})
  };

  handleClick = (e) => {
      e.target.value = null
  };

  public toggleModal = () => this.setState({ showModal: !this.state.showModal });

  public render = () => {
    const {
      name,
      description,
      instantPrice,
      instantSalePrice,
      noOfCopies,
      showModal,
      pendingRequest,
      result
    } = this.state;

    return (
      <React.Fragment>
        <section className="pt-50 pb-50 collectible-section">
          <div className="container-fluid collectible-padding-responsive">
            <div className="row">
              <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="heading">
                  <h3 className="mt-0">Create ${this.props.collection_type} collectible</h3>
                </div>
              </div>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="pull-right">
                  <a href="create-wallet.html">Manage collectible type</a>        
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 float-resp-left">
                <div className="terminal-head">
                  <h4 className="font-weight-600">Upload file</h4>
                </div>
                <div className="upload-form">

                  <form onChange={this.onFormChange}>
                    <div className="row mb-15">
                      <div className="col-md-12">
                        <div className="codrops-header">
                          <div className="box">
                            <span className="placeholder" id="placeholder">PNG, GIF,WEBP, MP4 or MP3. Max 30mb.</span>
                            <input type="file" onChange={this.onFileChange} onClick={this.handleClick} name="file-1[]" id="file-1" className="inputfile inputfile-1" data-multiple-caption="{count} files selected" multiple />
                            <label id="choose_file_selected" htmlFor="file-1"><span>Choose file</span></label>
                            <div id="imagePreviewRes"></div>
                            <div className="close-preview-button" id="close-preview-button">
                              <span>X</span>
                            </div>
                          </div>
                          
                        </div>          
                      </div>
                    </div>

                    <div className="row mb-15">
                      <div className="col-md-8 col-sm-8 col-xs-8">
                        <label>Put on sale</label>
                        <p className="para-color">You’ll receive bids on this item</p>
                      </div>
                      <div className="col-md-4 col-sm-4 col-xs-4">
                        <label className="switch">
                          <input type="checkbox" name="put_sale" defaultChecked />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="row mb-15">
                      <div className="col-md-8 col-sm-8 col-xs-8">
                        <label>Instant sale price</label>
                        <p className="para-color">Enter the price for which the item will be instantly sold</p>
                      </div>
                      <div className="col-md-4 col-sm-4 col-xs-4">
                        <label className="switch">
                          <input type="checkbox" id="instant_sale_price" name="instant_sale_price" />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>

                    { instantSalePrice &&
                      <div className="row mb-15">
                        <div className="col-md-12">
                          <div className="form-group">
                            <input type="text" className="form-control input-custom" id="instant-price" placeholder="Enter price for one piece" />
                          </div>
                        </div>
                      </div>
                    }

                    <div className="row mb-15">
                      <div className="col-md-8 col-sm-8 col-xs-8">
                        <label>Unlock once purchased</label>
                        <p className="para-color">Content will be unlocked after successful transaction</p>
                      </div>
                      <div className="col-md-4 col-sm-4 col-xs-4">
                        <label className="switch">
                          <input type="checkbox" name="unlock_once_purchased" />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>

                    <div className="row mb-15">
                      <div className="col-md-12">
                        <label>Choose Collection</label>
                      </div>
                      <div className="col-md-12">
                        <label className="radio-img">
                          <input type="radio" name="chooseCollection" value="create" />
                          <div className="image">
                            <div className="icon-style-choose-collection">
                              <span>+</span>
                            </div>
                            <div className="label-style-choose-collection">
                              <label>Create</label>
                            </div>
                            <div className="para-style-choose-collection">
                              <p className="para-color">ERC-721</p>
                            </div>
                          </div>
                        </label>
                        <label className="radio-img">
                          <input type="radio" name="chooseCollection" value="nft" />
                          <div className="image">
                            <div className="icon-style-choose-collection">
                              <span>N</span>
                            </div>
                            <div className="label-style-choose-collection">
                              <label>NFT</label>
                            </div>
                            <div className="para-style-choose-collection">
                              <p className="para-color">NFT</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="row mb-15">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="name">Name</label>
                          <input type="text" className="form-control input-custom" id="name" placeholder="e. g. &quot;Redeemable T-Shirt with logo&quot;" required />
                        </div>
                      </div>
                    </div>

                    <div className="row mb-15">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="description">Description <span className="para-color">(Optional)</span></label>
                          <input type="text" className="form-control input-custom" id="description" placeholder="e. g. &quot;After purchasing you’ll be able to get the real T-Shirt&quot;" required />
                        </div>
                      </div>
                    </div>

                    <div className="row mb-15">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="royalties">Royalties</label>
                          <input type="text" className="form-control input-custom" id="royalties" placeholder="10" />
                          <p className="para-color mt-5 ml-10">Suggested: 10%, 20%, 30%</p>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-15">
                      <div className="col-md-12">
                        <label>Properties <span className="para-color">(Optional)</span></label>
                      </div>
                      <div className="col-md-6 col-sm-6 col-xs-12">
                        <input type="text" className="form-control input-custom" id="mini" placeholder="e. g. .Size " />
                      </div>
                      <div className="col-md-6 col-sm-6 col-xs-12">
                        <input type="text" className="form-control input-custom" id="max" placeholder="e. g. .M " />
                      </div>
                    </div>

                    <div className="row pt-40 pb-25">
                      <div className="col-md-12 col-sm-12 col-xs-12 text-right create-cancel-btn">
                        {/* <a href="#" onClick={this.onSubmit} className="connect-wallet create-item" type="button">Create Item</a> */}
                        <button onClick={this.onSubmit} className="connect-wallet create-item" type="button">Create Item</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6 float-resp-left" id="preview-part">
                <div className="terminal-head">
                  <h4 className="font-weight-600">Preview</h4>
                </div>
                <div className="preview-details">
                  <div className="image_placement">
                    <div className="image-fav">
                      <div className="hot-bid-auth-img">
                        <img src={image1} className="img-responsive" />
                        <img src={image2} className="img-responsive" />
                        <img src={image4} className="img-responsive" />
                        <i className="fa fa-check-circle" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div id="my-preview-section"></div>
                    <div className="content-fav">
                      <h4>{name}</h4>
                      { noOfCopies > 0 &&
                        <p>{`${instantPrice > 0 ? `${instantPrice} ETH` : 'Auction' } ${noOfCopies} of ${noOfCopies}`}</p>
                      }

                      <p>No bids yet</p>
                      <p>{description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Modal show={showModal} toggleModal={this.toggleModal}>
          {pendingRequest ? (
            <SModalContainer>
              <SModalTitle>{"Pending Call Request"}</SModalTitle>
              <SContainer>
                {/* <Loader /> */}
                <SModalParagraph>{"Approve or reject request using your wallet"}</SModalParagraph>
              </SContainer>
            </SModalContainer>
          ) : result ? (
            <SModalContainer>
              <SModalTitle>{"Call Request Approved"}</SModalTitle>
              <STable>
                {Object.keys(result).map(key => (
                  <SRow key={key}>
                    <SKey>{key}</SKey>
                    <SValue>{result[key].toString()}</SValue>
                  </SRow>
                ))}
              </STable>
            </SModalContainer>
          ) : (
            <SModalContainer>
              <SModalTitle>{"Call Request Rejected"}</SModalTitle>
            </SModalContainer>
          )}
        </Modal>

        {this.state.showApproveModal &&
          <ApproveModal
            collectionParams={this.state.collectionParams}
            address={this.state.address}
            amount={this.state.instantPrice}
          />
        }
      </React.Fragment>
    )
  }
}

export default CollectionCreate