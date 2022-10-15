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

  const [loaded, setLoaded] = useState(false)
  const {register, handleSubmit} = useForm()
  let searchContent = ''
  const [usersList, setUsersList] = useState() //returned users from the database
  var searchList = [] //filtered users by results entered in searchInput
  const searchListDiv = document.getElementById("searchList")

  useEffect(() => {
    chat_handler.getAllUsers().then(res => {
      console.log(res.data.rows)
      setUsersList(res.data.rows)
      console.log(usersList)
      /*searchList = usersList.map(item => {
        return `${item.firstname} ${item.lastname}`
      })
      console.log(searchList)*/
      setLoaded(true)
      return usersList
    }).catch(err => {
      console.log(err)
    })
  })

  const searchFilter = () => {
    console.log(usersList.length)
    return usersList.filter(item => {
      return item.firstname.toLowerCase().includes(searchContent) || item.lastname.toLowerCase().includes(searchContent)
    }).map(el => {
      return el.firstname + " " + el.lastname
    })
  }

  return (
    <>
      <Header/>
      <SearchForm>
        {usersList && <SearchInput 
          type="text" 
          placeholder='Search user' 
          onChange={(e) => {
            searchContent = e.target.value
          }}
        />}
        <SearchBtn type="submit" value="Search">
        </SearchBtn>
        {loaded && <SearchList usersList={usersList}/>}
      </SearchForm>
      
    </>
  )
}

export default ChatList