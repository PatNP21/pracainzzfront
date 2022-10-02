import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import CommentSection from '../CommentSection/CommentSection'
import avatar from './../../avatar.png'
import PostHandler from '../../handlers/PostHandler'

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

function PostItem(props) {

    const post_handler = new PostHandler()
    const [loadedState, setLoadedState] = useState(false)

    const [author, setAuthor] = useState()

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

  return (
    <div>
        {loadedState && <Container>
            <Avatar src={avatar}/>
            <AuthorHeader>{author}</AuthorHeader>
            <CreatingDate>{props.creatingDate}</CreatingDate>
            <Content>
                <img src={`${props.multimedia}:image/png;base64,${fromBuffer}`}/>
                {props.content}
            </Content>
            <CommentSection post_id={props.post_id}/>
        </Container>}
    </div>
  )
}

export default PostItem