import React from 'react'
import styled from 'styled-components'
import {IoMdAttach} from 'react-icons/io'
import {useForm} from 'react-hook-form'
import {useCookies} from 'react-cookie'
import PostHandler from '../../handlers/PostHandler'

const Container = styled.div`
    width:100%;
    height: 5vh;
`
const Textarea = styled.textarea`
    width: 70%;
    height:4vh;
    border-radius:10px;
    float:left;
`
const SumbmitButton = styled.button`
  float:left;
  width:5vw;
  height:4vh;
  border-radius:10px;
  margin-left:2vw;
`

function WriteComment(props) {

  const post_handler = new PostHandler()

  const {register, handleSubmit} = useForm()
  const [cookies] = useCookies()

  const onSubmit = (data) => {
    console.log(props.post_id)
    const commentJSON = {...data, post: props.post_id, author: cookies.loginData.data.user[0].id}
    console.log(commentJSON)
    post_handler.writeComment(commentJSON).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textarea 
          placeholder='Write your comment'
          {...register('content')}
        />
        <SumbmitButton>Submit</SumbmitButton>
      </form>
    </Container>
  )
}

export default WriteComment