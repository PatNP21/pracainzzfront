import React, {useState, useEffect} from 'react'
import Header from '../../elements/Header/Header'
import styled from 'styled-components'
import FriendsHandler from '../../handlers/FriendsHandler'
import ProfileHandler from '../../handlers/ProfileHandler'
import { useCookies } from 'react-cookie'

const Section = styled.div`
  float:left;
  width:40vw;
  height:70vh;
  margin:5vh 5vw;
  border-radius:10px;
  box-shadow:0 0 3px gray;
`
const SectionHeader = styled.div`
  width:100%;
  height:6vh;
  text-align:center;
`
const List = styled.div`
  width:100%;
  height:60vh;
`
const FriendItem = styled.div`
  margin:1vh auto;
  width:90%;
  height:5vh;
  border-radius:10px;
  box-shadow:0 0 3px gray;
`
const RequestItem = styled.div`
  margin:1vh auto;
  width:90%;
  height:5vh;
  border-radius:10px;
  box-shadow:0 0 3px gray;
`
const SpanSender = styled.span`
  max-width:50%;
  width:fit-content;
  height:90%;
  float:left;
`
const Btn = styled.button`
  border-radius:10px;
  border:none;
  width:fit-content;
  margin:1vh 1vw;
  height:3vh;
  box-shadow:none;
  background-color:gray;
  display:inline-block;
`

function Friends() {

  const friends_handler = new FriendsHandler()
  const profile_handler = new ProfileHandler()

  const [cookies] = useCookies()

  const [friendsList, setFriendsList] = useState()
  const [requestsList, setRequestList] = useState()

  useEffect(() => {
    friends_handler.getFriends(cookies.loginData[0].id)
    .then(res => {
      console.log(res.data.rows)
      setFriendsList(res.data.rows)
    }).catch(err => {
      console.log(err)
    })

    friends_handler.getRequests(cookies.loginData[0].id)
    .then(res => {
      console.log(res.data.rows)
      setRequestList(res.data.rows)
    }).catch(err => {
      console.log(err)
    })
  })

  const getUser = (id) => {
    let gottenSender = false
    let sender
    profile_handler.getUser(id).then(res => {
      console.log(res.data.rows[0].firstname)
      gottenSender = true
      sender = res.data.rows[0].firstname + " " + res.data.rows[0].lastname
      console.log(`sender: ${sender}`)
    }).catch(err => {
      console.log(err)
      gottenSender = false
      sender = null
    })

    return sender
  }

  return (
    <div>
        <Header/>
        <Section>
          <SectionHeader>
            Your Friends
          </SectionHeader>
          <List>
            {friendsList && friendsList.map(item => {
                return (
                  <FriendItem>
                    <SpanSender>{item.second_partner}</SpanSender>
                    <Btn>ViewProfile</Btn>
                    <Btn>Delete</Btn>
                    <Btn>Block</Btn>
                  </FriendItem>
                )
            })}
          </List>
        </Section>
            
        <Section>
          <SectionHeader>
            Invites for you
          </SectionHeader>
          <List>
            {requestsList && requestsList.map(item => {
                let data = getUser(item.sender)
                return(
                  <RequestItem>
                    <SpanSender>{item.sender}</SpanSender>
                    <Btn onClick={() => {
                      console.log('-------------------------------------')
                      friends_handler.addFriend({first_partner: cookies.loginData[0].id, second_partner: item.sender}).then(res => {
                        console.log(res)
                        friends_handler.undoRequest({sender: item.sender, receiver: cookies.loginData[0].id})
                      })
                    }}>Accept</Btn>
                    <Btn onClick={() => {
                      friends_handler.undoRequest({sender: item.sender, receiver: cookies.loginData[0].id})
                    }}>Deny</Btn>
                  </RequestItem>
                )
              })}
          </List>
        </Section>
    </div>
  )
}

export default Friends