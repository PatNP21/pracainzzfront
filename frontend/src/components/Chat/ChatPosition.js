import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  width:45vw;
  height:8vh;
  margin:0.5vw auto;
  border-radius:10px;
  box-shadow:0 0 2px gray;
  cursor:pointer;
`

function ChatPosition(props) {
  const navigate = useNavigate()

  useEffect(() => {
    console.log(props.user)
  })

  return (
    <Container onClick={() => {
      navigate(`/chat/${props.user.id}`)
    }}>
      {props.user.firstname} {props.user.lastname}
    </Container>
  )
}

export default ChatPosition