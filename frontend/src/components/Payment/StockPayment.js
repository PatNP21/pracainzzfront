import React from 'react'
import Header from '../../elements/Header/Header'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'

function StockPayment() {

    const stock_crypto_handler = new StockCryptoHandler()

  return (
    <>
        <Header/>
    </>
  )
}

export default StockPayment