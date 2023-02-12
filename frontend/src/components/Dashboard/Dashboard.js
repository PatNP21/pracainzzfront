import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Header from '../../elements/Header/Header'
import PostPanel from '../../elements/PostSection/PostPanel'
import NewsWidget from '../../elements/Widgets/NewsWidget'
import ProfileWidget from '../../elements/Widgets/ProfileWidget'
import Widget from '../../elements/Widgets/Widget'
import {useCookies} from 'react-cookie'
import {useFinnhub} from 'react-finnhub'
import PostHandler from '../../handlers/PostHandler'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'

const LeftNav = styled.div`
  width:25vw;
  float:left;
  height: 70vh;
`
const RightNav = styled.div`
  width:25vw;
  float:left;
  height: 70vh;
`
const Btn = styled.div`
  border:none;
  width:fit-content;
  height:fit-content;
  cursor:pointer;
  border-radius: 10px;
  margin:2vh auto;
`
const RightWidgetBtn = styled.button`
  margin:2vh 1vw;
  width: 80%;
  height: 3vh;
  padding:3px 2px;
  border:none;
  border-radius:10px;
  cursor:pointer;
`
//headertoWidgets
const WidgetHeader = styled.div`
  width:100%;
  height:14px;
  padding:2px 0;
  text-align:center;
  font-size:0.8em;
`

//imageToNewsWidget
const Image = styled.img`
  width:100%;
  height:14vh;
`


function Dashboard() {

  const navigate = useNavigate()
  const post_handler = new PostHandler()
  const stock_crypto_handler = new StockCryptoHandler()
  const [cookies] = useCookies()
  const finnhub = useFinnhub()
  const [newsWidgetItem, setNewsWidgetItem] = useState()
  const [stockItem, setStockItem] = useState()
  const [cryptoItem, setCryptoItem] = useState()
  const [stockPrice, setStockPrice] = useState()
  const [cryptoPrice, setCryptoPrice] = useState()
  const [boughtStocks, setBoughtStocks] = useState(0)
  const [boughtCryptos, setBoughtCryptos] = useState(0)

  //posts
  const [posts, getPosts] = useState()

  useEffect(() => {
    console.log(cookies)
    post_handler.getPosts().then(res => {
      console.log(res.data.rows)
      getPosts(res.data.rows)
    })

    /*finnhub.marketNews('merger').then(res => {
      //res.data - Array
      //console.log(res.data)
      setNewsWidgetItem(res.data[Math.floor(Math.random()*(res.data.length))-1])
      console.log(newsWidgetItem)
    }).catch(err => {
      console.log(err)
    })*/

    /*stock_crypto_handler.getStocks().then(res => {
      console.log(res.data)
      setStockItem(res.data[Math.floor(Math.random()*(res.data.length))-1])
      console.log(stockItem)
      stock_crypto_handler.getAPI(stockItem.symbol).then(data => {
        setStockPrice(data.data.values[0].open)
      })
    }).catch(err => {
      console.log(err)
    })

    stock_crypto_handler.getCryptocurrencies().then(res => {
      console.log(res.data)
      setCryptoItem(res.data[Math.floor(Math.random()*(res.data.length))-1])
      console.log(cryptoItem)
      stock_crypto_handler.getCryptoAPI(cryptoItem.displaySymbol, '1min').then(data => {
        setCryptoPrice(data.data.values[0].open)
      })
    }).catch(err => {
      console.log(err)
    })*/

    stock_crypto_handler.getAmountOfStock(cookies.loginData.data.user[0].id).then(data => {
      console.log(data)
      setBoughtStocks(data.data.rows[0].count)
    })

    stock_crypto_handler.getAmountOfCrypto(cookies.loginData.data.user[0].id).then(data => {
      console.log(data)
      setBoughtCryptos(data.data.rows[0].count)
    })
  }, [])

  return (
    <div>
      <Header/>
      <LeftNav>
        <Btn onClick={() => {
            navigate(`/profile/${cookies.loginData.data.user[0].id}`)
        }}>
          <ProfileWidget firstname={cookies.loginData.data.user[0].firstname}/>
        </Btn>

        <Btn onClick={() => {
            navigate('/stock')
          }}>
          <Widget>
            <WidgetHeader>
              Stock
            </WidgetHeader>
            {stockItem ? 
            <>
              <p>{stockItem.description}</p>
              <p>{stockPrice}</p>
            </> 
              : 'null'}
          </Widget>
        </Btn>

        <Btn onClick={() => {
            navigate('/crypto')
          }}>
          <Widget>
            <WidgetHeader>
              Crypto
            </WidgetHeader>
            {cryptoItem ? 
            <>
              <p>{cryptoItem.description}</p>
              <p>{cryptoPrice}</p>
            </> : 'null'}
          </Widget>
        </Btn>
        
      </LeftNav>
      {posts && <PostPanel posts={posts} section="all"/>}
      <RightNav>

        <Btn onClick={() => {
          navigate(`/myWallet/${cookies.loginData.data.user[0].id}`, {state: {level: 'visit'}})
        }}>
          <Widget>
            <WidgetHeader>
              Wallet
            </WidgetHeader>
            <p>Stock: {boughtStocks} items</p>
            <p>Crypto: {boughtCryptos} items</p>
          </Widget>
        </Btn>
      
        <Btn onClick={() => {
            navigate('/newsList')
          }}
        >
            <NewsWidget>
              {newsWidgetItem !== undefined ? 
                <div>
                  <p>
                    {newsWidgetItem.headline}
                  </p>
                  <Image src={newsWidgetItem.image}/>
                </div>
                   : 
                "NewsWidget"
              }
            </NewsWidget>
        </Btn>
      </RightNav>
    </div>
  )
}

export default Dashboard