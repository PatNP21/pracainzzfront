import React from 'react'
import styled from 'styled-components'
import PostCreator from './PostCreator'
import PostList from './PostList'

const Space = styled.div`
    width:48vw;
    height:80vh;
    float:left;
`

function PostPanel(props) {
  React.useEffect(() => {
    console.log(props.posts)
  })
  return (
    <Space>
        {props.section === "all" && 
         <PostCreator 
          authorid={props.authorID}
         />
        }

        <PostList postsList={props.posts}/>
    </Space>
  )
}

export default PostPanel