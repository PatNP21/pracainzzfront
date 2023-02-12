import React from 'react'
import styled from 'styled-components'
import Header from '../../elements/Header/Header'
import {useLocation} from 'react-router-dom'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'

const Container = styled.div`
  border-radius: 10px;
  box-shadow: 0 0 2px gray;
  width:35vw;
  height: 20vh;
  margin: 10vh auto;
`

function ExtendedOwnedItem(props) {
  const stock_crypto_handler = new StockCryptoHandler()
  const {state} = useLocation()

  return (
    <>
      <Header/>
      <Container>
        <h2>{state.item}</h2>
        <p>Volume: {state.quantity}</p>
      </Container>
      {state.level === 'donate' && <button onClick={() => {
        if(state.itemtype === 'stock') {
          stock_crypto_handler.updateStock()
        }
        else if(state.itemtype === 'crypto') {
          stock_crypto_handler.updateCrypto()
        }
      }}>Sell</button>}
    </>
  )
}

export default ExtendedOwnedItem