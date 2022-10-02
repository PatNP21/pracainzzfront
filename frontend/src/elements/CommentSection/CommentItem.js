import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import avatar from './../../avatar.png'
import PostHandler from '../../handlers/PostHandler'

const Container = styled.div`
    width:30vw;
    min-height:50px;
    height:fit-content;
    padding:0 1vw;
    border-radius:10px;
    box-shadow: 0 0 3px gray;
    margin:1vh auto;
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
const Content = styled.h5`
    justify-content:center;
`

function CommentItem(props) {
    const post_handler = new PostHandler()
    
    const [loadedState, setLoadedState] = useState(false)
    const [author, setAuthor] = useState()

    useEffect(() => {
        post_handler.getAuthorById(props.author).then(res => {
            setAuthor(`${res.data.rows[0].firstname} ${res.data.rows[0].lastname}`)
            console.log(author)
            setLoadedState(true)
        })
    })

  return (
    <div>
        {loadedState && 
        <Container>
            <Avatar src={avatar}/>
            <AuthorHeader>{author}</AuthorHeader>
            <CreatingDate>{props.creating_date}</CreatingDate>
            <Content>{props.content}</Content>
        </Container>}
    </div>
  )
}

export default CommentItem