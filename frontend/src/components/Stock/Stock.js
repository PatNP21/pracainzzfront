import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../elements/Header/Header'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'
import {Circles} from 'react-loader-spinner'
import { FinnhubProvider, useFinnhub } from 'react-finnhub'
import Chart from './../../elements/Chart'
import styled from 'styled-components'

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
  const [stockList, setStockList] = useState([])
  let stockData
  let stockArray
  const [filteredStockList, setFilteredStockList] = useState([])
  const [showChart, updateShowChart] = useState(false)

  let stock
  //const [stock, selectStock] = useState('')
  //const apiFinnhubStock = finnhub.ApiClient.instance.authentications['api-key']
  //const finnhubClient = new finnhub.stockSymbols()

  useEffect(() => {
    finnhub.stockSymbols('US').then(res => {
      stockArray = res.data.filter(item => {
        return item//.type === 'Common Stock'
      })
      console.log(stockArray)
      setFilteredStockList(stockArray)
      console.log(filteredStockList)
      updateLoaded(true)
    }).catch(err => {
      console.log(err)
    })
    //console.log(stockArray)

    /*operateHandler.getStocks().then(res => {
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
    })*/

  }, [])

  const getAPI = (stock) => {
    console.log(stock)
    finnhub.companyBasicFinancials(stock, 'all').then(res => {
      console.log(res)
      stockData = res.data
      console.log(stockData)

      if(stockData) {
        updateShowChart(true)
      }
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
            <SearchInput type="text" onChange={(e) => {
              updateSearchContent(e.target.value)
              filteredStockList = stockArray.filter(item => {
                return item.descrption.includes(searchContent.toUpperCase())
              })
            }}/>
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
              {filteredStockList.length > 0 && filteredStockList.map(item => {
                return <option value={item.symbol}>
                  {item.descrption}
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
              navigate('/payment', {state: {stock: stock, price: stockData.metric['52WeekLow']}})
            }}>
              Invest
            </OptionButton>
          </BtnsSection>

          <Price>
            <table>
              <tr>
                <th>symbol</th>
                <th>low</th>
                <th>high</th>
                <th>volume</th>
                <th>last transaction</th>
              </tr>
              <tr>
                <td>{stockData && stockData.symbol}</td>
                <td>{stockData && stockData.metric['52WeekLow']}$</td>
                <td>{stockData && stockData.metric['52WeekHigh']}$</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </Price>
          <ChartDiv> 
            {showChart && stockData ? <Chart data={stockData}/> : <p>NONE</p>}
          </ChartDiv>
        </div>  
      }
    </>
  )
}

export default Stock