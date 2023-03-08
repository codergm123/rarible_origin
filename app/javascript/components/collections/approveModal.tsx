import React, { useState, useEffect } from "react";
import MEWconnect from "@myetherwallet/mewconnect-web-client"
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import { createNewCollection } from "../../api/collection"

const ApproveModal = (props) => {
  const [open, setOpen] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [hash, setHash] = useState(null);
  const [approveLoader, setApproveLoader] = useState(false);
  const [approveLoaderDone, setApproveLoaderDone] = useState(false);
  const [mintLoader, setMintLoader] = useState(false);
  const [mintLoaderDone, setMintLoaderDone] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const address = props.address
  const collectionParams = props.collectionParams
  const amount = props.amount

  useEffect(() => {
    document.getElementById("test-button-click").click()
  }, [])

  const sendTx = async (address: any, price: any, collectionParams: any) => {
    const token = document.querySelector('[name=csrf-token]').content;
    setApproveLoader(true)

    let formData = new FormData()
    formData.append('attachment', collectionParams.attachment)
    formData.append('name', collectionParams.name)
    formData.append('description', collectionParams.description)
    formData.append('instant_sale_price', collectionParams.instant_price)
    formData.append('put_on_sale', collectionParams.put_on_sale)
    formData.append('unlock_on_purchase', collectionParams.unlock_on_purchase)


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

    await web3.eth.getBalance(address).then(bal => 100);
    await web3.eth.getGasPrice().then(async gasPrice => {
      await web3.eth.getTransactionCount(address).then(async nonce => {
        await web3.eth
          .sendTransaction({
            from: address,
            to: address,
            nonce,
            value: new BigNumber(amount)
              .times(new BigNumber(10).pow(18))
              .toFixed(),
            gasPrice: gasPrice,
            gas: 21000
          })
          .once('transactionHash', async hash => {
            console.log(['Hash', hash]);
            setTransactionId(hash)
            setApproveLoaderDone(true)
            setMintLoader(true)
            await createNewCollection(formData, token)
            setMintLoaderDone(true)

            // this.partialReset();
          })
          .once('receipt', res => {
            console.log(['Receipt', res]);
          })
          .on('error', err => {
            console.log(['Error', err]);
            setIsRejected(true)
          })
          .then(txhash => console.log('THEN: ', txhash));
      });
    });
  }

  const getSendTransactionLabel = (approveLoader, doneApprove) => {
    const approveLabel = approveLoader ? "In Progress" : "Start"
    return doneApprove ? "Done" : approveLabel
  }

  const getStatusIcon = (loader, doneLoader) => {
    if (!doneLoader && !loader) {
      return (
        <div className="follow-step-icon lite-grey-txt">
          <i className="fa fa-check-circle"></i>
        </div>
      )
    } else if (!doneLoader && loader) {
      return (
        <div className="follow-step-icon">
          <div className="loader"></div>
        </div>
      )
    } else {
      return (
        <div className="follow-step-icon">
          <i className="fa fa-check-circle"></i>
        </div>
      )
    }
  }

  return (
    <>
      {/* <button style={{visibility: "hidden"}} onClick={() => setOpen(!open)} id="test-button-click" type="button" className="btn btn-primary" data-toggle="modal" data-target={`#test-modal`}>
        test-modal
      </button> */}

      <button style={{visibility: "hidden"}} id="test-button-click" onClick={() => setOpen(!open)} type="button" className="btn btn-primary" data-toggle="modal" data-target={`#test-modal`}>
        test-modal
      </button>
      {/* If open is true show your <div /> */}
      {/* {open && ( */}
        <div
          className="modal fade"
          data-backdrop="static" data-keyboard="false" id="test-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Follow steps</h4>
              </div>
              <div className="modal-body">
                { !isRejected &&
                <div className="follow-step-block">
                  <div className="follow-step-icon">
                    { getStatusIcon(approveLoader, approveLoaderDone) }
                  </div>
                  <div className="follow-step-content">
                    <h4>Approve</h4>
                    <p className="para-color">Checking balance and approving</p>
                  </div>
                  <div className="follow-step-button">
                      { !approveLoaderDone && !approveLoader &&
                        <a onClick={() => sendTx(address, amount, collectionParams)}>{getSendTransactionLabel(approveLoader, approveLoaderDone)}</a>
                      }
                      { !approveLoaderDone && approveLoader &&
                        <a>{getSendTransactionLabel(approveLoader, approveLoaderDone)}</a>
                      }
                    </div>
                </div>
                }

                { !isRejected &&
                <div className="follow-step-block">
                  <div className="follow-step-icon">
                  { getStatusIcon(mintLoader, mintLoaderDone) }
                  </div>
                  <div className="follow-step-content">
                    <h4>Upload files & Mint token</h4>
                    <p className="para-color">Checking balance and approving</p>
                  </div>
                  <div className="follow-step-button themeBG">
                      { !mintLoaderDone && mintLoader &&
                        <a>{getSendTransactionLabel(mintLoader, mintLoaderDone)}</a>
                      }
                    </div>
                </div>
                }

                { !isRejected && mintLoaderDone && mintLoader &&
                  <div className="follow-step-block">
                    <div className="follow-step-icon">
                      <i className="fa fa-check-circle"></i>
                    </div>
                    <div className="follow-step-content">
                      <h4>Collection</h4>
                      <p className="para-color">Successfully minted</p>
                    </div>
                    <div className="follow-step-button themeBG">
                      <a href="/my_items">Go to My Items</a>
                    </div>
                  </div>
                }

                { isRejected &&
                  <div className="follow-step-block">
                    <div className="follow-step-icon">
                      <i className="fa fa-times-circle"></i>
                    </div>
                    <div className="follow-step-content">
                      <h4>Collection Create</h4>
                      <p className="para-color">Rejected</p>
                    </div>
                    <div className="follow-step-button themeBG">
                      <a href="/">Go to Dashboard</a>
                      </div>
                  </div>
                }
              </div>
            </div>
          </div>

        </div>
      {/* )} */}
    </>
  );
}


export default ApproveModal