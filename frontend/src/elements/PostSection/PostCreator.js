import React from 'react'
import styled from 'styled-components'
import {useForm} from 'react-hook-form'
import {IoMdAttach} from 'react-icons/io'
import PostHandler from '../../handlers/PostHandler'

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
const Attachment = styled.div`
  width:fit-content;
  height:fit-content;
  float:left;
  font-size:2rem;
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
  const post_handler = new PostHandler()

  const onSubmit = (data) => {
    let postData
    console.log(data)
    postData = {...data, authorId: props.authorid}
    console.log(postData)
    post_handler.writePost(postData).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
      alert('error')
    })
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textarea placeholder='Write your post' {...register('content')}/>
        <Attachment>
          <label htmlFor="attachmentInput">
            <IoMdAttach/>
          </label>
          <input 
            id="attachmentInput" 
            style={{display:'none'}} 
            type="file" 
            onChange={(e) => URL.createObjectURL(e.target.files[0])} 
            accept="[video/*, image/*]"
            {...register('multimedia')}
          />
        </Attachment>
        <SubmitBtn>Add</SubmitBtn>
      </form>
    </Container>
  )
}

export default PostCreator