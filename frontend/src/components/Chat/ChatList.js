import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import Header from './../../elements/Header/Header'
import {useForm} from 'react-hook-form'
import {BiSearch} from 'react-icons/bi'
import ChatHandler from '../../handlers/ChatHandler'

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
const SearchList = styled.div`
  width:90vw;
  height:70vh;
  margin:0 auto;
`
const SearchItem = styled.div`
  width:45vw;
  height:8vh;
  margin:0.5vw auto;
  border-radius:10px;
  box-shadow:0 0 2px gray;
`

function ChatList() {

  const chat_handler = new ChatHandler()

  const [loaded, setLoaded] = useState(false)
  const {register, handleSubmit} = useForm()
  let searchContent = ''
  const [usersList, setUsersList] = useState() //returned users from the database
  const [searchList, setSearchList] = useState() //filtered users by results entered in searchInput

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
    }).catch(err => {
      console.log(err)
    })
  },[])

  const searchFilter = () => {
    return usersList.filter(item => {
      return item.firstname.toLowerCase().includes(searchContent) || item.lastname.toLowerCase().includes(searchContent)
    }).map(el => {
      return el.firstname + " " + el.lastname
    })
  }

  return (
    <>
      <Header/>
      {loaded && <><SearchForm>
        {usersList && <SearchInput 
          type="text" 
          placeholder='Search user' 
          onChange={(e) => {
            searchContent = e.target.value
            console.log(searchFilter())
            setSearchList(searchFilter())
          }}
        />}
        <SearchBtn type="submit" value="Search">
        </SearchBtn>
      </SearchForm>
      <SearchList>
        {/*searchList && searchList.map(item => {
          return <p>item</p>
        })*/}
        {usersList && usersList.length > 0 ? usersList.map(item => {
          return <p>{item}</p>
        }) : <p>{usersList.length}</p>}
      </SearchList></>}
    </>
  )
}

export default ChatList