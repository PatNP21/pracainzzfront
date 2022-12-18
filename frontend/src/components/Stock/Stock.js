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
  width:80vw;
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

  const finnhub = useFinnhub()

  const [loaded, updateLoaded] = useState(false)
  const [searchContent, updateSearchContent] = useState('')
  let stockList = []
  const [stockData, setStockData] = useState()
  const [stockPrice, setStockPrice] = useState()
  let stockArray
  const [filteredStockList, setFilteredStockList] = useState([])
  const [showChart, updateShowChart] = useState(false)

  let stock
  const [selectedStock, selectStock] = useState('')

  useEffect(() => {
    finnhub.stockSymbols('US').then(res => {
      stockArray = res.data.filter(item => {
        return item.type === 'Common Stock'
      })
      console.log(stockArray)
      stockList = stockArray
      console.log(stockList)
      if(stockList.length > 0) {
        updateLoaded(true)
      }
      setFilteredStockList(stockList)
    }).catch(err => {
      console.log(err)
    })
    console.log(filteredStockList.length)

  }, [])

  const getAPI = (stock) => {
    console.log(stock)
    operateHandler.getAPI(stock).then(res => {
      console.log(res.data.values)
      setStockData(res.data.values)
      console.log(stockData)

      console.log(Number(stockData[0].low))
      console.log(Number(stockData[0].high))

      setStockPrice((Math.random()*(Number(stockData[0].high)-Number(stockData[0].low)))+Number(stockData[0].low))
      console.log(stockPrice)
      if(stockData) {

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
              {filteredStockList.length && filteredStockList.map(item => {
                return <option value={item.displaySymbol}>{item.description}</option>
              })}
            </select>
          </MenuContainer>

          <BtnsSection>
            <OptionButton onClick={() => {
              navigate('/payment', {state: {stock: selectedStock, price: stockData[0].open}})
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
                <td>{stockData && stockData[0].open}$</td>
                <td>{stockData && stockData[0].low}$</td>
                <td>{stockData && stockData[0].high}$</td>
                <td>{stockData && stockData[0].close}$</td>
                <td>{stockData && stockData[0].volume}</td>
              </tr>
            </table>
          </Price>
          <Price>{stockPrice} $</Price>
          <ChartDiv>
            {showChart && stockData ? <Chart dataToStore={stockData}/> : <p>Brak danych</p>}
          </ChartDiv>
        </div>  
      }
    </>
  )
}

export default Stock