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

function PostItem(props) {

    const post_handler = new PostHandler()

    const [cookies] = useCookies()

    const navigate = useNavigate()

    const [loadedState, setLoadedState] = useState(false)

    const [author, setAuthor] = useState()
    const [id, setId] = useState()
    const [openSuccessModal, setOpenSuccessModal] = useState(false)
    const [openFailureModal, setOpenFailureModal] = useState(false)

    useEffect(() => {
        post_handler.getAuthorById(props.author).then(res => {
            console.log(res.data.rows[0])
            setAuthor(`${res.data.rows[0].firstname} ${res.data.rows[0].lastname}`)
            setId(Number(res.data.rows[0].id))
            console.log(author)
            setLoadedState(true)
        })
    }, [])
    
  return (
    <div>
        {loadedState && <Container>
            <Avatar src={avatar}/>
            <AuthorHeader>{author}</AuthorHeader>
            {props.author !== cookies.loginData.data.user[0].id &&
                <DonateButton onClick={() => {
                    navigate(`/myWallet/${cookies.loginData.data.user[0].id}`, {state: {level: 'donate', receiver: id}})
                }}>
                    Donate
                </DonateButton>
            }
            <CreatingDate>{new Date(props.creatingDate).toLocaleDateString('en-CA')}</CreatingDate>
            <Content>
                {props.content}
            </Content>
            <CommentSection post_id={props.post_id}/>
        </Container>}
    </div>
  )
}

export default PostItem