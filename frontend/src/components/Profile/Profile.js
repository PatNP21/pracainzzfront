import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Header from '../../elements/Header/Header'
import PostPanel from '../../elements/PostSection/PostPanel'
import Widget from '../../elements/Widgets/Widget'
import avatar from './../../avatar.png'
import PostHandler from '../../handlers/PostHandler'
import ProfileHandler from '../../handlers/ProfileHandler'
import FriendsHandler from '../../handlers/FriendsHandler'
import {useCookies} from 'react-cookie'
import { useParams } from 'react-router-dom'

const LeftNav = styled.div`
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
  height:40vh;
  box-shadow: 0 0 2px gray;
  margin: 5vh auto;
  border-radius:10px;
`
const BackgroundAvatar = styled.div`
  width:100%;
  height:30vh;
  overflow:hidden;
`
const BackgroundImg = styled.img`
  width:100%;
  height:100%;
`
const ProfileData = styled.div`
  width:100%;
  height:10vh;
  overflow:hidden;
`
const PanelSpace = styled.div`
  width:fit-content;
  margin:0 auto;
`

//btns
const Btn = styled.button`
  float:left;
`

function Profile() {

  const [cookies] = useCookies()
  const post_handler = new PostHandler()
  const profile_handler = new ProfileHandler()
  const friends_handler = new FriendsHandler()
  const {userID} = useParams()

  const [userData, setUserData] = useState()
  const [userPostslist, setUserPostslist] = useState()

  //RelationsControls
  const [requestState, setRequestState] = useState(false) //defaultly: not requested

  useEffect(() => {
    //params = new URLSearchParams(window.location.search)
    console.log(userID)
    console.log(cookies.loginData[0].id)
    profile_handler.getUser(userID).then(res => {
      console.log(res.data.rows[0])
      setUserData(res.data.rows[0])

      post_handler.getUserPosts(userID).then(data => {
        console.log(data)
        setUserPostslist(data.data.rows)
      })
    }).catch(err => {
      console.log(err)
      return
    })
  }, [])

  const sendRequest = (el) => {
    friends_handler.sendRequest(el).then(res => {
      console.log(el)
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  const undoRequest = (el) => {
    friends_handler.undoRequest(el).then(res => {
      console.log(el)
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div>
      <Header/>
      <LeftNav>
        <Widget/>
        <Widget/>
      </LeftNav>

      <MainSpace>
        <ProfileView>
          <BackgroundAvatar>
            <BackgroundImg src={avatar}/>
          </BackgroundAvatar>

          <ProfileData>
            {userData && <p>{userData.firstname} {userData.lastname}</p>}
            {userID != cookies.loginData[0].id && !requestState && 
              <Btn onClick={() => {
                setRequestState(true)
                sendRequest({
                  sender: cookies.loginData[0].id,
                  receiver: Number(userID)
                })
              }}>
                Add relation
              </Btn>
            }
            {userID != cookies.loginData[0].id && requestState &&
              <Btn onClick={() => {
                setRequestState(false)
                undoRequest({
                  sender: cookies.loginData[0].id,
                  receiver: Number(userID)
                })
              }}>
                Undo request
              </Btn>
            }
          </ProfileData>
        </ProfileView>
        <PanelSpace>
          <PostPanel posts={userPostslist}/>
        </PanelSpace>
      </MainSpace>
    </div>
  )
}

export default Profile