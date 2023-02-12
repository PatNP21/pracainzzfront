import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Header from './../../elements/Header/Header'
import {useForm} from 'react-hook-form'
import {BiSearch} from 'react-icons/bi'
import ChatHandler from '../../handlers/ChatHandler'
import ChatPosition from './ChatPosition'
import SearchList from './SearchList'

const SearchForm = styled.form`
  width:70vw;
  height:fit-content;
  margin:2vh auto;
`
const SearchInput = styled.input`
  width: 50vw;
  height:4vh;
  border:none;
  border-radius:10px;
  box-shadow:0 0 2px #000080;
  display:inline-block;
`
const SearchBtn = styled.input`
  width:7vw;
  height:4vh;
  border-radius: 8px;
  border:none;
  display:inline-block;
`

function ChatList() {

  const chat_handler = new ChatHandler()
  const [usersList, setUsersList] = useState() //returned users from the database

  useEffect(() => {
    chat_handler.getAllUsers().then(res => {
      setUsersList(res.data.rows)
    })
  })


  return (
    <>
      <Header/>
        {usersList && usersList.map(item => {
            return <ChatPosition user={item}/>
        })}
      
    </>
  )
}

export default ChatList