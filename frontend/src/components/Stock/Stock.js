import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../elements/Header/Header'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'
import {Circles} from 'react-loader-spinner'
import { FinnhubProvider, useFinnhub } from 'react-finnhub'
import styled from 'styled-components'

const MenuContainer = styled.div`
  width:fit-content;
  margin:2vh auto;
  height:8vh;
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
  const [stockList, setStockList] = useState([])
  const [stockData, setStockData] = useState()

  let stock
  //const [stock, selectStock] = useState('')


  useEffect(() => {
    console.log(finnhub.companyNews())
    
    operateHandler.getStocks().then(res => {
      updateLoaded(true)
      //console.log(res.data.data)
      let stockArray = res.data.data
      console.log(typeof stockArray)
      //console.log(stockArray)
      let properList = stockArray.filter(item => {
        return (item.currency.includes('USD') && item.type.includes('Common Stock') && item.country.includes("United States"))
      })
      //console.log(properList)
      setStockList(properList.slice(0, 99))
      console.log(stockList)
    })
  })

  const getAPI = (stock) => {
    console.log(stock)
    finnhub.companyBasicFinancials(stock, 'all').then(res => {
      console.log(res)
    }).catch(err => {
      console.log(`coś poszło nie tak: ${err}`)
    })
    /*operateHandler.getAPI(stock).then(res => {
      console.log(res)
      setStockData(res.data.values)
      console.log(`stock: ${stock}`)
      return stock
    }).catch(err => {
      console.log(err)
    })*/
  }

  return (
    <>
      <Header/>
      {!loaded ? 
        <Circles color="#00BFFF" height={80} width={80}/> : 
        <div>
          <MenuContainer>
            <Select
              value={stock}
              onChange={(e) => {
                  stock = e.target.value
                  console.log(stock)
                  getAPI(stock)
                  return stock
                }
              }
            >
              {stockList && stockList.map(item => {
                return <option value={item.symbol}>
                  {item.name}
                </option> 
              })}
            </Select>
          </MenuContainer>

          <BtnsSection>
            <OptionButton onClick={() => {
              navigate('/payment')
            }}>
              Sell
            </OptionButton>
            <OptionButton onClick={() => {
              navigate('/payment')
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
                <th>last transaction</th>
              </tr>
              <tr>
                <td>{getAPI(stock)}</td>
                <td>{stockData && stockData[0].open}$</td>
                <td>{stockData && stockData[0].low}$</td>
                <td>{stockData && stockData[0].high}$</td>
                <td>{stockData && stockData[0].close}$</td>
                <td>{stockData && stockData[0].volume}</td>
                <td>{stockData && stockData[0].datetime}</td>
              </tr>
            </table>
          </Price>
          <ChartDiv>

          </ChartDiv>
        </div>  
      }
    </>
  )
}

export default Stock