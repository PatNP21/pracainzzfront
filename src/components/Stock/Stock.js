import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../elements/Header/Header'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'
import {Circles} from 'react-loader-spinner'
import { FinnhubProvider, useFinnhub } from 'react-finnhub'
import Chart from './../../elements/Chart'
import styled from 'styled-components'
import Loader from '../../modals/Loader'

const MenuContainer = styled.div`
  width:fit-content;
  margin:2vh auto;
  height:8vh;
`
const SearchInput = styled.input`
  display:block;
`
const Select = styled.select`
  border-radius:8px;
  border:none;
  box-shadow:0 0 3px gray;
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
  width:fit-content;
  max-width:800px;
  height:fit-content;
  margin:2vh auto;
  border-radius:10px;
  box-shadow:0 0 3px gray;
  padding:0 2vw;
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

function Stock() {

  const operateHandler = new StockCryptoHandler()

  const navigate = useNavigate()


  const [loaded, updateLoaded] = useState(false)
  let stockList = []
  const [stockData, setStockData] = useState()
  const [stockPrice, setStockPrice] = useState()
  let array
  const [list, setList] = useState([])
  const [showChart, updateShowChart] = useState(false)

  let stock
  const [selectedStock, selectStock] = useState('')

  useEffect(() => {
    operateHandler.getStocks().then(res => {
      array = res.data.data.filter(item => {
        return item.type === 'Common Stock' && item.country === "United States" && item.exchange === "NASDAQ"
      })
      console.log(array)
      if(array.length > 0) {
        setList(array)
        updateLoaded(true)
      }
    }).catch(err => {
      console.log(err)
    })
    console.log(list.length)

  }, [])

  const getAPI = (stock) => {
    console.log(stock)
    operateHandler.getAPI(stock).then(res => {
      console.log(res.data.rows)
      //setStockData(1000)
      setStockData({
        high: res.data.values[0].high,
        low: res.data.values[0].low,
        open: res.data.values[0].open,
        close: res.data.values[0].close,
        volume: res.data.values[0].volume,
        stockPrice: Number(Math.random()*(Number(res.data.values[0].high)-Number(res.data.values[0].low)))+Number(res.data.values[0].low)
      })
      console.log(stockData)
      setStockPrice(res.data.values)

      if(stockPrice) {

        updateShowChart(true)
      }
    }).catch(err => {
      console.log(`coś poszło nie tak: ${err}`)
    })
  }

  return (
    <>
      <Header/>
      {!loaded ? 
        <Loader/> : 
        <div>
          <MenuContainer>
            <select
              value={stock}
              onChange={(e) => {
                  stock = e.target.value
                  selectStock(stock)
                  console.log(stock)
                  console.log(selectedStock)
                  getAPI(selectedStock)
                }
              }
            >
              {list.length && list.map(item => {
                return <option value={item.symbol}>{item.name}</option>
              })}
            </select>
          </MenuContainer>

          <BtnsSection>
            <OptionButton onClick={() => {
              navigate('/payment', {state: {item: selectedStock, price: stockData.open}})
            }}>
              Invest
            </OptionButton>
          </BtnsSection>

          <Price>
            <table>
              <tr>
                <th>symbol</th>
                <th>open</th>
                <th>low</th>
                <th>high</th>
                <th>close</th>
                <th>volume</th>
              </tr>
              <tr>
                <td>{selectedStock}</td>
                <td>{stockData && stockData.open}$</td>
                <td>{stockData && stockData.low}$</td>
                <td>{stockData && stockData.high}$</td>
                <td>{stockData && stockData.close}$</td>
                <td>{stockData && stockData.volume}</td>
              </tr>
            </table>
          </Price>
          <Price>{stockData && Number(stockData.stockPrice)} $</Price>
          <ChartDiv>
            {showChart && stockData ? <Chart dataToStore={stockPrice}/> : <p>N/A</p>}
          </ChartDiv>
        </div>  
      }
    </>
  )
}

export default Stock