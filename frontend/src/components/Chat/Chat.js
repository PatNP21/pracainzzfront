import React, {useEffect, useState} from 'react'
import ProfileHandler from '../../handlers/ProfileHandler'
import Header from '../../elements/Header/Header'
import styled from 'styled-components'
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

  const backendURL = 'http://localhost:2023'
  const socket = io(backendURL, { autoConnect: false }) //connect(backendURL)

  const [cookies] = useCookies()
  const {userID} = useParams()
  const {register, handleSubmit} = useForm()

  const [converser, setConverser] = useState()
  const [status, setStatus] = useState()
  let messagesList = []

  let text_input
  let grid
  let MessagePlot
  let YourMessageField
  let OtherUserMessageField

  useEffect(() => {
    profile_handler.getUser(userID).then(res => {
      setConverser(`${res.data.rows[0].firstname} ${res.data.rows[0].lastname}`)
      socket.onAny((event, ...args) => {
        console.log(event, args);
      });
      //socket.auth = converser
      socket.connect()
      console.log(converser)
    }).catch(err => {
      console.log(err)
    })

    let count = 0
    let firstname, lastname
    if(count === 0 && firstname !== cookies.loginData[0].firstname && lastname !== cookies.loginData[0].lastname) {
      socket.emit('new-chat', `${cookies.loginData[0].firstname} ${cookies.loginData[0].lastname}`)
      firstname = cookies.loginData[0].firstname
      lastname = cookies.loginData[0].lastname
      count++
    } else {
      return
    }
    
  }, [])

  const createElements = () => {
    text_input = document.getElementById('text_input')
    grid = document.getElementById('chatGrid')

    MessagePlot = document.createElement('div')
    MessagePlot.setAttribute('class', 'messagePlot')
  }
  let count = 0
  socket.on('receive_message', (data) => {
    if(data.receiver === `${cookies.loginData[0].firstname} ${cookies.loginData[0].lastname}` || data.author === `${cookies.loginData[0].firstname} ${cookies.loginData[0].lastname}`) {
      createElements()
      if(data.author === `${cookies.loginData[0].firstname} ${cookies.loginData[0].lastname}`) {
        MessagePlot.appendChild(YourMessage(data.content))
      } else {
        MessagePlot.appendChild(OtherUserMessage(data.content))
      }
      //messagesList.push(MessagePlot)
      grid.appendChild(MessagePlot)
      count = 0
    }
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
    data = {...data, author: `${cookies.loginData[0].firstname} ${cookies.loginData[0].lastname}`, receiver: converser}
    createElements()
    try {
      socket.emit('send_message', data)
      text_input.value = ''
      console.log('message sent')
    } catch(err) {
      console.log(err)
    }
    
    
  }

  /*socketServer.on('connection', () => {
    console.log('I am connected with backend')
  })*/

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
          {messagesList && messagesList.map(item => {
            return item
          })}
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