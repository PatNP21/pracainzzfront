import React, {useEffect, useState} from 'react'
import Header from '../../elements/Header/Header'
import styled from 'styled-components'
import {useForm} from 'react-hook-form'
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

  const backendURL = 'http://localhost:2023'
  const socket = io('http://localhost:2023') //connect(backendURL)

  const [cookies] = useCookies()
  const {register, handleSubmit} = useForm()

  //const socketServer = io(backendURL)
  const [message, setMessage] = useState()
  const [gottenMessage, setGottenMessage] = useState()
  let messagesList = []

  let text_input
  let grid
  let MessagePlot
  let YourMessageField
  let OtherUserMessageField

  useEffect(() => {
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

  socket.on('receive_message', (data) => {
    createElements()
    if(data.author === `${cookies.loginData[0].firstname} ${cookies.loginData[0].lastname}`) {
      MessagePlot.appendChild(YourMessage(data.content))
    } else {
      MessagePlot.appendChild(OtherUserMessage(data.content))
    }
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
    data = {...data, author: `${cookies.loginData[0].firstname} ${cookies.loginData[0].lastname}`}
    createElements()
    try {
      socket.emit('send_message', data)
      text_input.value = ''
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
            {`${cookies.loginData[0].firstname} ${cookies.loginData[0].lastname}`}
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