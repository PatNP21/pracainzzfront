import React, {useState} from 'react'
import styled from 'styled-components'
import {useForm} from 'react-hook-form'
import {IoMdAttach} from 'react-icons/io'
import PostHandler from '../../handlers/PostHandler'
import { useCookies } from 'react-cookie'

const Container = styled.div`
    width:42vw;
    padding:0 1vw;
    height:15vh;
    border-radius:10px;
    box-shadow: 0 0 2px gray;
    margin:2vh auto;
    margin-left: 2.5vw;
`
const Textarea = styled.textarea`
    width:29vw;
    height: 7vh;
    border-radius: 10px;
    border:1px solid gray;
    margin: 2vh auto;
    float:left;
`
const SubmitBtn = styled.button`
  width: 8vw;
  height: 5vh;
  border-radius:10px;
  background-color:#3333b3;
  float:left;
  margin: 3vh 1vw;
  border:none;
  cursor:pointer;
`

function PostCreator(props) {

  const {register, handleSubmit} = useForm()
  const [cookies] = useCookies()
  const post_handler = new PostHandler()

  const [openSuccessModal, setOpenSuccessModal] = useState(false)
  const [openFailureModal, setOpenFailureModal] = useState(false)

  const writePost = (data) => {
    let postData
    console.log(data)
    postData = {...data, authorId: cookies.loginData.data.user[0].id}
    console.log(postData)
    post_handler.writePost(postData).then(res => {
      console.log(res)
      setOpenSuccessModal(true)
    }).catch(err => {
      console.log(err)
      setOpenFailureModal(true)
    })
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(writePost)}>
        <Textarea placeholder='Write your post' {...register('content')}/>
        <SubmitBtn>Add</SubmitBtn>
      </form>
    </Container>
  )
}

export default PostCreator