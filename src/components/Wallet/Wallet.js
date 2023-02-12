import React, {useState, useEffect} from 'react'
import { useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Header from '../../elements/Header/Header'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'
import OwnedItem from './OwnedItem'

const Container = styled.div`
  width:fit-content;
  height:fit-content;
  margin:3vh auto;
`
const Group = styled.div`
  float:left;
  margin:2vw;
  width:40vw;
  height:70vh;
  border-radius:10px;
  box-shadow:0 0 3px #000080;
  overflow:scroll;
`
const TitleHeader = styled.div`
  width:100%;
  height:6vh;
  text-align:center;
`
const WidgetBtn = styled.div`
  width:90%;
  height:fit-content;
  margin:auto;
`
const Button = styled.button`
  border:none;
  border-radius:10px;
  margin-left:10vw;
  padding:1vh 1vw;
  cursor:pointer;
`

function Wallet() {

  const stock_crypto_handler = new StockCryptoHandler()
  const {userID} = useParams()
  const navigate = useNavigate()
  const {state} = useLocation()

  const [ownedCryptoList, setOwnedCryptoList] = useState([])
  const [ownedStockList, setOwnedStockList] = useState([])

  useEffect(() => {
    console.log(`userId: ${userID}`)

    stock_crypto_handler.getBoughtCrypto(userID)
    .then(res => {
      console.log(res.data.rows)
      setOwnedCryptoList(res.data.rows)
    }).catch(err => {
      console.log(err)
    })

    stock_crypto_handler.getBoughtStock(userID)
    .then(res => {
      console.log(res.data.rows)
      setOwnedStockList(res.data.rows)
    }).catch(err => {
      console.log(err)
    })
  },[])

  return (
    <>
      <Header/>
      <Container>
        <Group>
          <TitleHeader>
            Stock
          </TitleHeader>
          {ownedStockList && ownedStockList.map(item => {
              return (
                <WidgetBtn onClick={() => {
                  navigate(`/item`, {state: {level: state.level, itemtype: 'stock', item: item.item, quantity: item.item}})
                }}>
                  <OwnedItem>
                    <p>{item.item}</p>
                    <p>{item.quantity}</p>
                  </OwnedItem>
                </WidgetBtn>)
            })}
        </Group>

        <Group>
          <TitleHeader>
            Crypto
          </TitleHeader>
          {ownedCryptoList && ownedCryptoList.map(item => {
              return (
                <WidgetBtn onClick={() => {
                  navigate(`/item`, {state: {level: state.level, itemtype: 'crypto', item: item.item, quantity: item.item}})
                }}>
                  <OwnedItem>
                    <p>{item.item}</p>
                    <p>{item.quantity}</p>
                  </OwnedItem>
                </WidgetBtn>
              )
            })}
        </Group>
      </Container>
    </>
  )
}

export default Wallet