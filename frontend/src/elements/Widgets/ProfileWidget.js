import React from 'react'
import styled from 'styled-components'
import avatar from './../../avatar.png'

const Container = styled.div`
    width:15vw;
    height:10vh;
    border-radius: 10px;
    box-shadow: 0 0 3px gray;
`
const Avatar = styled.img`
    width: 40px;
    height:40px;
    border-radius:50%;
    overflow:hidden;
    display:inline-block;
    float:left;
`
const UserFirstName = styled.h4`
  margin:auto;
  float:left;
`

function ProfileWidget(props) {
  return (
    <Container>
        <Avatar src={avatar}/>
        <UserFirstName>{props.firstname}</UserFirstName>
    </Container>
  )
}

export default ProfileWidget