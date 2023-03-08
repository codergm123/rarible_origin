import React, { useState, useEffect } from "react";

const Header = (props) => {
  const [token, setToken] = useState(null)
  const [address, setAddress] = useState(props.address ? props.address : null)

  useEffect(() => {
    const currentToken = document.querySelector('[name=csrf-token]').content;
    if (currentToken) {
      setToken(currentToken)
    }
  }, [])

  return (
    <React.Fragment>
    </React.Fragment>
  )
}

export default Header