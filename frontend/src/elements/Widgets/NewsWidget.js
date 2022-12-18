import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    width: 15vw;
    height:40vh;
    margin:8vh auto;
    box-shadow: 0 0 3px gray;
    border-radius:10px;
    overflow:hidden;
`
const Header = styled.div`
  width:100%;
  height:7px;
  padding:2px 0;
  text-align:center;
  font-size:0.8em;
`

function NewsWidget(props) {
  return (
    <Container>
      <Header>News</Header>
      {props.children}
    </Container>
  )
}

export default NewsWidget