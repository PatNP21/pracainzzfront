import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import Header from '../../elements/Header/Header'
import PostPanel from '../../elements/PostSection/PostPanel'
import NewsWidget from '../../elements/Widgets/NewsWidget'
import ProfileWidget from '../../elements/Widgets/ProfileWidget'
import Widget from '../../elements/Widgets/Widget'
import {useCookies} from 'react-cookie'
import PostHandler from '../../handlers/PostHandler'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'
import News from '../News/News'

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

function Dashboard() {

  const navigate = useNavigate()
  const post_handler = new PostHandler()
  const stock_crypto_handler = new StockCryptoHandler()
  const [cookies, setCookie] = useCookies()

  //posts
  const [posts, getPosts] = useState()

  useEffect(() => {
    console.log(cookies)
    post_handler.getPosts().then(res => {
      console.log(res.data.rows)
      getPosts(res.data.rows)
    })

    /*stock_crypto_handler.getStocks().then(res => {
      console.log(res.data.data)
    })

    stock_crypto_handler.getCryptocurrencies().then(res => {
      console.log(res.data.data)
    })*/

  })

  return (
    <div>
      <Header/>
      <LeftNav>
        <Btn onClick={() => {
            navigate(`/profile/${cookies.loginData[0].id}`)
        }}>
          <ProfileWidget firstname={cookies.loginData[0].firstname}/>
        </Btn>

        <Btn onClick={() => {
            navigate('/stock')
          }}>
          <Widget/>
        </Btn>

        <Btn onClick={() => {
            navigate('/crypto')
          }}>
          <Widget/>
        </Btn>

        <Btn onClick={() => {
            navigate('/newsList')
          }}>
            <NewsWidget/>
        </Btn>
        
      </LeftNav>
      {posts && <PostPanel posts={posts}/>}
      <RightNav>
        <Widget/>
      </RightNav>
    </div>
  )
}

export default Dashboard