import React, {useState} from 'react'
import styled from 'styled-components'
import {useForm} from 'react-hook-form'
import {IoMdAttach} from 'react-icons/io'
import PostHandler from '../../handlers/PostHandler'
import { useCookies } from 'react-cookie'
import { Modal, Typography, Box } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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
  const [cookies] = useCookies()
  const post_handler = new PostHandler()

  const [openSuccessModal, setOpenSuccessModal] = useState(false)
  const [openFailureModal, setOpenFailureModal] = useState(false)

  const onSubmit = (data) => {
    let postData
    console.log(data)
    postData = {...data, authorId: cookies.loginData[0].id}
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
      <form onSubmit={handleSubmit(onSubmit)} enctype="multipart/form-data">
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
      <Modal
          open={openSuccessModal}
          onClose={() => setOpenSuccessModal(false)}
      >
          <Box style={style}>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Adding finished successfully.
              </Typography>
          </Box>
      </Modal>

      <Modal
          open={openFailureModal}
          onClose={() => setOpenFailureModal(false)}
      >
          <Box style={style}>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Cannot add new post.
              </Typography>
          </Box>
      </Modal>
    </Container>
  )
}

export default PostCreator