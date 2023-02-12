import React, {useState, useEffect} from 'react'
import Header from '../../elements/Header/Header'
import { useNavigate } from 'react-router-dom'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'
import { useFinnhub } from 'react-finnhub'
import {Circles} from 'react-loader-spinner'
import Chart from './../../elements/Chart'
import styled from 'styled-components'
import Loader from '../../modals/Loader'

const MenuContainer = styled.div`
  width:fit-content;
  margin:2vh auto;
  height:12vh;
`
const OptionToChoose = styled.div`
  float:left;
  width:fit-content;
  height:10vh;
  border-radius:10px;
  margin:0 1vw;
  box-shadow:0 0 3px gray;
  padding:0 2vw 2vh 2vw;
`
const BtnsSection = styled.div`
  width:fit-content;
  height:7vh;
  margin:2vh auto;
`
const OptionButton = styled.button`
  width: 10vw;
  height:7vh;
  margin:0 1vw;
  border-radius:10px;
  border:none;
  cursor:pointer;
`
const Price = styled.div`
  width: 20vw;
  height:fit-content;
  margin:auto;
  border-radius:10px;
  box-shadow:0 0 3px gray;
  padding:0 2vw;
  text-align:center;
`
const ChartDiv = styled.div`
  width:60vw;
  max-width:1000px;
  height:fit-content;
  max-height:400px;
  overflow:hidden;
  margin:auto;
  border-radius:10px;
  box-shadow:0 0 3px gray;
`

function Crypto() {

  const operateHandler = new StockCryptoHandler()

  const navigate = useNavigate()

  const [loaded, updateLoaded] = useState(false)
  const [showChart, updateShowChart] = useState(false)
  const [cryptoList, setCryptoList] = useState([])
  const [cryptoData, setCryptoData] = useState()
  const [cryptoToBuy, setCryptoToBuy] = useState()

  let crypto
  let interval
  let cryptoChart
  let cryptoArray = []

  useEffect(() => {
    operateHandler.getCryptocurrencies().then(res => {
      console.log(res.data.data)
      cryptoArray = res.data.data.filter(item => {
        return item.symbol.includes('/USD')
      })
      console.log(cryptoArray)
      setCryptoList(cryptoArray)
      updateLoaded(true)
    })

  }, [])

  const getAPI = (optCrypto) => {
    operateHandler.getAPI(optCrypto).then(res => {
      console.log(res)
      setCryptoData(res.data.data)
      console.log(cryptoData)

      if(cryptoData.length > 0) {
        updateShowChart(true)
      }
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div>
      <Header/>
      {!loaded ? 
        <Loader/> : 
        <div>
          <MenuContainer>
            <OptionToChoose>
              <p>Select course</p>
              <select
                value={crypto}
                onChange={e => {
                  crypto = e.target.value
                  console.log(crypto)
                  crypto = crypto.slice(crypto.indexOf('/')+1, crypto.length-1)
                  getAPI(crypto)
                  setCryptoToBuy(crypto)
                }}
              >
                {cryptoList && cryptoList.map(item => {
                  return <option value={item.symbol}>{item.currency_base}</option>
                })}
              </select>
            </OptionToChoose>
          </MenuContainer>

          <BtnsSection>
            <OptionButton onClick={() => {
                navigate('/payment', {state: {item: cryptoToBuy, price: cryptoData[0].open}})
            }}>
              Buy Crypto
            </OptionButton>
          </BtnsSection>
          
          <div style={{clear:'both'}}></div>
          <Price>
            <h2>
              {cryptoData && cryptoData[cryptoData.length-1].open}$ 
            </h2>
          </Price>
          <ChartDiv>
            {showChart && cryptoData ? <Chart dataToStore={cryptoData}/> : <p>Brak danych</p>}
          </ChartDiv>
        </div>
      }
      
    </div>
  )
}

export default Crypto