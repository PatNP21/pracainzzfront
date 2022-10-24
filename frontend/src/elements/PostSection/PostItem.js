import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import CommentSection from '../CommentSection/CommentSection'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import avatar from './../../avatar.png'
import PostHandler from '../../handlers/PostHandler'
import {HiTrash} from 'react-icons/hi'
import {AiFillEdit} from 'react-icons/ai'
import { Modal, Typography, Box } from '@mui/material';

const Container = styled.div`
    width:40vw;
    min-height:60px;
    height:fit-content;
    padding:1vh 2vw;
    border-radius:10px;
    box-shadow: 0 0 3px gray;
    margin:2vh auto;
`
const Avatar = styled.img`
    border-radius: 50%;
    width:40px;
    height:40px;
    overflow:hidden;
    display:inline-block;
    margin-right: 3vw;
`
const AuthorHeader = styled.span`
    display:inline-block;
`
const CreatingDate = styled.h4`
`
const Image = styled.img`
    margin:auto;
    width:24vw;
    height24vw:

`
const Content = styled.p`
    justify-content:center;
`
const PostOptions = styled.div`
    display:inline-block;
    margin-left:20vw;
`
const DonateButton = styled.button`
    width:fit-content;
    height:fit-content;
    margin-left:20vw;
    display:inline-block;
    border:none;
    border-radius:8px;
    padding:10px;
`
const PostOption = styled.button`
    width:fit-content;
    height:fit-content;
    float:left;
    margin:0 1vw;
    font-size:20px;
    cursor:pointer;
    background-color:#fff;
    border:none;
`

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

function PostItem(props) {

    const post_handler = new PostHandler()

    const [cookies] = useCookies()

    const navigate = useNavigate()

    const [loadedState, setLoadedState] = useState(false)

    const [author, setAuthor] = useState()
    const [openSuccessModal, setOpenSuccessModal] = useState(false)
    const [openFailureModal, setOpenFailureModal] = useState(false)

    let fromBuffer

    useEffect(() => {
        post_handler.getAuthorById(props.author).then(res => {
            console.log(res.data.rows[0])
            setAuthor(`${res.data.rows[0].firstname} ${res.data.rows[0].lastname}`)
            console.log(author)
            setLoadedState(true)
        })
        fromBuffer = btoa(String.fromCharCode(...new Uint8Array(props.multimedia)))
        console.log(props.multimedia)
        console.log(fromBuffer)
    }, [])

    const deletePost = (id) => {
        post_handler.deletePost(id).then(res => {
            setOpenSuccessModal(true)
        }).catch(err => {
            setOpenFailureModal(true)
        })
    }

    const editPost = () => {

    }

  return (
    <div>
        {loadedState && <Container>
            <Avatar src={avatar}/>
            <AuthorHeader>{author}</AuthorHeader>
            {props.author !== cookies.loginData.data.user[0].id ? 
                <DonateButton onClick={() => {
                    navigate('/myWallet/1')
                }}>
                    Donate
                </DonateButton> : 
                <PostOptions>
                    <PostOption onClick={deletePost(props.post_id)}>
                        <HiTrash className='fa fa-2x'/>
                    </PostOption>

                    <PostOption>
                        <AiFillEdit/>
                    </PostOption>
                </PostOptions>
            }
            <CreatingDate>{props.creatingDate}</CreatingDate>
            <Content>
                <img src={`${props.multimedia}:image/png;base64,${fromBuffer}`}/>
                {props.content}
            </Content>
            <CommentSection post_id={props.post_id}/>
        </Container>}
        {/*<Modal
            open={openSuccessModal}
            onClose={() => setOpenSuccessModal(false)}
        >
            <Box style={style}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    XD
                </Typography>
            </Box>
        </Modal>*/}
    </div>
  )
}

export default PostItem