import React, { useState, useEffect } from "react";
import MEWconnect from "@myetherwallet/mewconnect-web-client"
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import { userLike, userUnlike } from "../../api/user"

const Like = (props) => {
  const likes = props.likes
  const address = props.address
  const collectionId = props.collectionId
  const likes_count = props.likes_count
  const isCollectionPage = props.isCollectionPage ? props.isCollectionPage : props.isCollectionPage
  const [liked, setLiked] = useState(likes.includes(collectionId));
  const [likesCount, setlikesCount] = useState(likes_count);

  useEffect(() => {
  }, [])

  const like = async () => {
    const token = document.querySelector('[name=csrf-token]').content
    // const providerOptions = {
    //   mewconnect: {
    //     package: MEWconnect,
    //     options: {
    //       infuraId: 'be9c076272484b11a0d7fae52193f281'
    //     }
    //   },
    // }
  
    // const web3Modal = new Web3Modal({
    //   network: 'mainnet',
    //   cacheProvider: true,
    //   providerOptions
    // });
    // const provider = await web3Modal.connect();
    // const web3 = new Web3(provider);

    // const webOut = await web3.eth
    // .sign("Like collectible", address)
    // .then(_signedMessage => {
    //   console.log("_signedMessage", _signedMessage)
    //   const signature = JSON.stringify(
    //     {
    //       address: address,
    //       msg: "Like collectible",
    //       sig: _signedMessage,
    //       version: '3',
    //       signer: 'MEWconnect'
    //     },
    //     null,
    //     2
    //   );
    // })
    // .catch(e => {
    //   console.log(e);
    // });
    // console.log("webOut", webOut)
    await userLike(address, collectionId, token)
    setLiked(true)
    setlikesCount(likesCount+1);
  }

  const unlike = async () => {
    const token = document.querySelector('[name=csrf-token]').content
    await userUnlike(address, collectionId, token)
    setLiked(false)
    setlikesCount(likesCount-1);
  }

  const initLike = async () => {
    if (liked) {
      await unlike()
    } else {
      await like()
    }
    // e.preventDefault()
  }


  return (
    <React.Fragment>
      {!isCollectionPage &&
          <button  onClick={initLike} className={`card__likes heart ${liked ? 'is-active' : ''}`}>
                       <i className="far fa-heart"></i>
                       <i className="fas fa-heart"></i>
                             <span>{likesCount}</span>
              </button>
      }

      {isCollectionPage &&
        <button  onClick={initLike} className={`card__likes heart ${liked ? 'is-active' : ''}`}>
                              <i className="far fa-heart"></i>
                              <i className="fas fa-heart"></i>
                                    <span>{likesCount}</span>
                     </button>
      }
    </React.Fragment>
  );
}


export default Like