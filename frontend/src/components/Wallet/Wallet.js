import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
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
  overflow:hidden;
`
const TitleHeader = styled.div`
  width:100%;
  height:6vh;
  text-align:center;
`
const Button = styled.button`
  border:none;
  border-radius:10px;
  margin:auto;
  padding:1vh 1vw;
  cursor:pointer;
`

function Wallet() {

  const stock_crypto_handler = new StockCryptoHandler()
  const {userID} = useParams()

  const [ownedCryptoList, setOwnedCryptoList] = useState([])

  useEffect(() => {
    console.log(`userId: ${userID}`)
    /*stock_crypto_handler.getBoughtStock(userID)
    .then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })*/

    stock_crypto_handler.getBoughtCrypto(userID)
    .then(res => {
      console.log(res.data.rows)
      setOwnedCryptoList(res.data.rows)
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
          <Button>
            Sell
          </Button>
        </Group>

        <Group>
          <TitleHeader>
            Crypto
          </TitleHeader>
          {ownedCryptoList && ownedCryptoList.map(item => {
              return (<OwnedItem>
                <p>{item.item}</p>
                <p>{item.quantity}</p>
              </OwnedItem>)
            })}
          <Button>
            Sell
          </Button>
        </Group>
      </Container>
    </>
  )
}

export default Wallet