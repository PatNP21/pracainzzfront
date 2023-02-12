import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import CommentItem from './CommentItem'
import PostHandler from '../../handlers/PostHandler'

const Container = styled.div`
    width:100%;
    min-height:0;
    height:fit-content;
    max-height:25vh;
    overflow-y:scroll;
`

function CommentList(props) {

  const post_handler = new PostHandler()
  const [commentsList, setCommentsList] = useState()

  useEffect(() => {
    console.log(props.post_id)
    post_handler.getComments(props.post_id).then(res => {
      console.log(res)
      setCommentsList(res.data.rows)
      console.log(commentsList)
    })
  },[])

  return (
    <Container>
        {commentsList && commentsList.map(item => {
          return <CommentItem
            author={item.author}
            content={item.content}
            creating_date={item.creating_date}
          />
        })}
        
    </Container>
  )
}

export default CommentList