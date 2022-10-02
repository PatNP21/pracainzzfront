import React from 'react'
import styled from 'styled-components'
import avatar from './../../avatar.png'
import CommentList from './CommentList'
import WriteComment from './WriteComment'

const Space = styled.div`
    width:100%;
    min-height:60px;
    height:fit-content;
    margin:0 auto;
`
function CommentSection(props) {
  
  return (
    <Space>
        <WriteComment post_id={props.post_id}/>
        <CommentList post_id={props.post_id}/>
    </Space>
  )
}

export default CommentSection