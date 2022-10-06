import React, {useEffect, useState} from 'react'
import Header from '../../elements/Header/Header'
import {useForm} from 'react-hook-form'
import {io} from 'socket.io-client'

function Chat() {

  const backendURL = 'http://localhost:2023'
  const socket = io('http://localhost:2023') //connect(backendURL)

  //const socketServer = io(backendURL)
  const [message, setMessage] = useState()

  useEffect(() => {
    socket.on('receive_message', (data) => {
      alert(data.message)
    })
  }, [socket])

  const sendMessage = (content) => {
    socket.emit('send_message', {message: content})
  }

  /*socketServer.on('connection', () => {
    console.log('I am connected with backend')
  })*/

  return (
    <div>
      <Header/>
      <form>
        <input type="text" placeholder="message" onChange={(e) => {setMessage(e.target.value)}}/>
        <input type="submit" onClick={() => {sendMessage(message)}} value="Send message"/>
      </form>
    </div>
  )
}

export default Chat