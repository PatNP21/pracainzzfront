import React from 'react'
import styled from 'styled-components'
import avatar from './../../avatar.png'

const Container = styled.div`
    width:15vw;
    height:10vh;
    border-radius: 10px;
    box-shadow: 0 0 4px #000080;
    font-family: 'Raleway', sans-serif;
    justify-content:center;
    align-items:center;
`
const UserFirstName = styled.div`
  height:fit-content;
  width:fit-content;
  font-size:1.8rem;
  margin:2vh auto;
  justify-content:center;
  align-items:center;
`

function ProfileWidget(props) {
  return (
    <Container>
        <UserFirstName>{props.firstname}</UserFirstName>
    </Container>
  )
}

export default ProfileWidget