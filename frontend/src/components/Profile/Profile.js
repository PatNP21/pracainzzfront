import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Header from '../../elements/Header/Header'
import PostPanel from '../../elements/PostSection/PostPanel'
import Widget from '../../elements/Widgets/Widget'
import avatar from './../../avatar.png'
import PostHandler from '../../handlers/PostHandler'
import ProfileHandler from '../../handlers/ProfileHandler'
import StockCryptoHandler from '../../handlers/StockCryptoHandler'
import {useCookies} from 'react-cookie'
import { useParams } from 'react-router-dom'

const LeftNav = styled.div`
  width:25vw;
  float:left;
  height: 85vh;
`
const RightNav = styled.div`
  width:25vw;
  float:left;
  height: 85vh;
`
const MainSpace = styled.div`
  float:left;
  width:fit-content;
  height:fit-content;
`
const ProfileView = styled.div`
  width:45vw;
  height:10vh;
  text-align:center;
  box-shadow: 0 0 2px gray;
  margin: 5vh auto;
  border-radius:10px;

`
const ProfileData = styled.div`
  width:100%;
  height:10vh;
  overflow:hidden;
`
const PanelSpace = styled.div`
  width:fit-content;
  height:fit-content;
  margin:0 auto;
`
const WidgetHeader = styled.div`
  width:100%;
  height:14px;
  padding:2px 0;
  text-align:center;
  font-size:0.8em;
`

//btns
const Btn = styled.button`
  float:left;
`

function Profile() {

  const [cookies] = useCookies()
  const post_handler = new PostHandler()
  const profile_handler = new ProfileHandler()
  const stock_crypto_handler = new StockCryptoHandler()
  const {userID} = useParams()

  const [userData, setUserData] = useState()
  const [userPostslist, setUserPostslist] = useState()

  const [boughtStocks, setBoughtStocks] = useState()
  const [boughtCryptos, setBoughtCryptos] = useState()

  //RelationsControls
  const [requestState, setRequestState] = useState(false) //defaultly: not requested

  useEffect(() => {
    //params = new URLSearchParams(window.location.search)
    console.log(userID)
    console.log(cookies.loginData.data.user[0].id)
    profile_handler.getUser(userID).then(res => {
      console.log(res.data.rows[0])
      setUserData(res.data.rows[0])

      post_handler.getUsersPosts(userID).then(data => {
        console.log(data)
        setUserPostslist(data.data.rows)
      })

      stock_crypto_handler.getAmountOfStock(userID).then(data => {
        console.log(data)
        setBoughtStocks(data.data.rows[0].count)
      })
  
      stock_crypto_handler.getAmountOfCrypto(userID).then(data => {
        console.log(data)
        setBoughtCryptos(data.data.rows[0].count)
      })
    }).catch(err => {
      console.log(err)
      return
    })
  }, [])

  return (
    <div>
      <Header/>
      <LeftNav>
        <Widget>
          <WidgetHeader>
              Joined
          </WidgetHeader>
          <p>{userData && new Date(userData.joining_date).toLocaleDateString('en-CA')}</p>
        </Widget>
        <Widget>
          <WidgetHeader>
              Email
          </WidgetHeader>
          <p>{userData && userData.email}</p>
        </Widget>
        <Widget>
          <WidgetHeader>
              Date of birth
          </WidgetHeader>
          <p>{userData && new Date(userData.dateofbirth).toLocaleDateString('en-CA')}</p>
        </Widget>
      </LeftNav>

      <MainSpace>
        <ProfileView>

          <ProfileData>
            {userData && <p>{userData.firstname} {userData.lastname}</p>}
          </ProfileData>
        </ProfileView>
        <PanelSpace>
          {userPostslist && <PostPanel posts={userPostslist} section="one"/>}
        </PanelSpace>
      </MainSpace>

      <RightNav>
        <Widget>
          <WidgetHeader>
            Wallet
          </WidgetHeader>
          <p>Stock: {boughtStocks} items</p>
          <p>Crypto: {boughtCryptos} items</p>
        </Widget>
      </RightNav>
    </div>
  )
}

export default Profile