import React, {useEffect, useState} from 'react'
import ProfileHandler from '../../handlers/ProfileHandler'
import Header from '../../elements/Header/Header'
import styled from 'styled-components'
import ChatHandler from '../../handlers/ChatHandler'
import {useForm} from 'react-hook-form'
import {useParams} from 'react-router-dom'
import {useCookies} from 'react-cookie'
import {io} from 'socket.io-client'
import './Chat.css'

const Container = styled.div`
  width:60vw;
  height:80vh;
  margin:4vh auto;
  border-radius:10px;
  box-shadow: 0 0 3px gray;
  overflow:hidden;
`
const ConverserPanel = styled.div`
  width:100%;
  overflow:hidden;
  height:10vh;
`
const Converser = styled.h4`
  width:fit-content;
  margin:3vh 2vw;  
`
const Grid = styled.div`
  width:100%;
  height:60vh;
  overflow:scroll;
`
const MessagePlot = styled.div`
  width:100%;
  min-height:8vh;
  height:fit-content;
`
const YourMessageField = styled.div`
  width:40%;
  height:fit-content;
  background-color: #000080;
  color:#ffffff;
  border-radius: 8px;
  margin-left:52%;
`
const OtherUserMessageField = styled.div`
  width:40%;
  height:fit-content;
  background-color: #efefef;
  border-radius: 8px;
  margin-left:2%;
`
const InputPlot = styled.div`
  width:100%;
  height:10vh;
`
const InputForm = styled.form`
  margin: 1vh auto;
  width:fit-content;
  height:fit-content;
`
const TextInput = styled.input`
  width:30vw;
  height:4vh;
  border-radius:8px;
  box-shadow:0 0 1px #000080;
  display:inline-block;
  border:none;
  margin:0 1vw;
`
const SubmitInput = styled.input`
  width:10vw;
  height:4vh;
  border-radius:8px;
  box-shadow:0 0 1px #000080;
  display:inline-block;
  border:none;
  margin:0 1vw;
`

function Chat() {

  const profile_handler = new ProfileHandler()
  const chat_handler = new ChatHandler()

  const backendURL = 'http://localhost:2023'
  const socket = io(backendURL) //connect(backendURL)

  const [cookies] = useCookies()
  const {userID} = useParams()
  const {register, handleSubmit} = useForm()

  const [converser, setConverser] = useState()
  let messagesList = []

  let text_input
  let grid
  let MessagePlot
  let YourMessageField
  let OtherUserMessageField

  useEffect(() => {
    profile_handler.getUser(userID).then(res => {
      setConverser(`${res.data.rows[0].id}`)
      //socket.auth = converser
      
      console.log(converser)
    }).catch(err => {
      console.log(err)
    })
    socket.connect()
    socket.emit('new-chat', `${cookies.loginData.data.user[0].firstname} ${cookies.loginData.data.user[0].lastname}`)
    
  }, [])

  const createElements = () => {
    text_input = document.getElementById('text_input')
    grid = document.getElementById('chatGrid')

    MessagePlot = document.createElement('div')
    MessagePlot.setAttribute('class', 'messagePlot')
    console.log('element created')
  }
  socket.on('receive_message', (data) => {
      createElements()
      MessagePlot.appendChild(OtherUserMessage(data.content))
      
      //messagesList.push(MessagePlot)
      grid.appendChild(MessagePlot)
  })


  const YourMessage = (content) => {
    let messageItemDiv = document.createElement('div')
    messageItemDiv.style.width = 'fit-content'
    messageItemDiv.style.height = 'fit-content'
    messageItemDiv.style.backgroundColor = '#000080'
    messageItemDiv.style.color = '#ffffff'
    messageItemDiv.style.padding = '5px'
    messageItemDiv.style.borderRadius = '10px'
    messageItemDiv.style.margin = '2vh 1vw 0 50%'
    messageItemDiv.innerHTML = content
    return messageItemDiv
  }

  const OtherUserMessage = (content) => {
    let messageItemDiv = document.createElement('div')
    messageItemDiv.style.width = 'fit-content'
    messageItemDiv.style.height = 'fit-content'
    messageItemDiv.style.backgroundColor = '#efefef'
    messageItemDiv.style.padding = '5px'
    messageItemDiv.style.borderRadius = '10px'
    messageItemDiv.style.margin = '2vh 1vw'
    messageItemDiv.innerHTML = content
    return messageItemDiv
  }

  const sendMessage = (data) => {
    data = {...data, author: cookies.loginData.data.user[0].id, receiver: converser}
    createElements()
    socket.emit('send_message', data.content)
    MessagePlot.appendChild(YourMessage(data.content))
    chat_handler.saveChatMessage(data)
  }

  return (
    <div>
      <Header/>
      <Container>
        <ConverserPanel>
          <Converser>
            {converser}
          </Converser>
        </ConverserPanel>
        <Grid id="chatGrid">
        </Grid>
        <InputPlot>
          <InputForm onSubmit={handleSubmit(sendMessage)}>
            <TextInput type="text" id="text_input" {...register('content')} placeholder="message"/>
            <SubmitInput type="submit" value="Send"/>
          </InputForm>
        </InputPlot>
      </Container>
    </div>
  )
}

export default Chat