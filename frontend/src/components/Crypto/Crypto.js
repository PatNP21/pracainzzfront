import React, {useState, useEffect} from 'react'
import Header from '../../elements/Header/Header'
import { useNavigate } from 'react-router-dom'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'
import {Circles} from 'react-loader-spinner'
import Chart from './../../elements/Chart'
import styled from 'styled-components'

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
  width:80vw;
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

  useEffect(() => {
    operateHandler.getCryptocurrencies().then(data => {
      updateLoaded(true)
      setCryptoList(data.data.data.filter(item => {
        return item.symbol.includes('/USD')
      }))
      console.log(data.data.data)
      /*operateHandler.getCryptoAPI(data.data.data[0].symbol).then(res => {
        console.log(res)
        cryptoData = res.data.values
        console.log(cryptoData)
      })*/
    })
  }, [])

  const getAPI = (optCrypto, optInterval) => {
    operateHandler.getCryptoAPI(optCrypto, optInterval).then(res => {
      console.log(res.data.values)
      setCryptoData(res.data.values)
      //console.log(data)

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
        <Circles color="#00BFFF" height={80} width={80}/> : 
        <div>
          <MenuContainer>
            <OptionToChoose>
              <p>Select course</p>
              <select
                value={crypto}
                onChange={e => {
                  crypto = e.target.value
                  console.log(crypto)
                  getAPI(crypto, interval)
                  setCryptoToBuy(crypto)
                }}
              >
                {cryptoList && cryptoList.map(item => {
                  return <option value={item.symbol}>{item.currency_base}</option>
                })}
              </select>
            </OptionToChoose>

            <OptionToChoose>
              <p>Select period</p>
              <select
                value={interval}
                defaultValue="1min"
                onChange={e => {
                  interval = e.target.value
                  console.log(interval)
                  getAPI(crypto, interval)
                }}>
                <option value="1min">1M</option>
                <option value="5min">5M</option>
                <option value="15min">15M</option>
                <option value="30min">30M</option>
                <option value="45min">45M</option>
                <option value="1h">1H</option>
                <option value="2h">2H</option>
                <option value="4h">4H</option>
                <option value="8h">8H</option>
                <option value="1day">1D</option>
                <option value="1week">1W</option>
              </select>
            </OptionToChoose>
          </MenuContainer>

          <BtnsSection>
            <OptionButton onClick={() => {
                navigate('/cryptoPayment', {state: {cryptocurrency: cryptoToBuy, price: cryptoData[0].open}})
            }}>
              Buy Crypto
            </OptionButton>
            <OptionButton>Sell Crypto</OptionButton>
          </BtnsSection>
          
          <div style={{clear:'both'}}></div>
          <Price>
            <h2>
              {cryptoData && cryptoData[cryptoData.length-1].open}$ 
            </h2>
            {crypto && <p>You can buy {} {crypto} for 100$</p>}
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