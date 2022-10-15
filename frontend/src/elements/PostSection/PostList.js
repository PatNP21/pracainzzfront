import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import PostItem from './PostItem'
import PostHandler from '../../handlers/PostHandler'

const Container = styled.div`
    width:47vw;
    height:fit-content;
    max-height:60vh;
    overflow-y:scroll;
`

function PostList(props) {

  //const post_handler = new PostHandler()
  const [posts, getPosts] = useState()

  useEffect(() => {
    getPosts(props.postsList)
    console.log(posts)
  }, [])

  return (
    <Container>
        {posts && posts.map(item => {
          return <PostItem 
            post_id={item.post_id}
            author={item.authorid}
            creatingDate={item.creating_date}
            content={item.content}
          />
        })}
    </Container>
  )
}

export default PostList