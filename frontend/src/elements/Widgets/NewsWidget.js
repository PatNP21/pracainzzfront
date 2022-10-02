import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    width: 15vw;
    height:30vh;
    margin:2vh auto;
    box-shadow: 0 0 3px gray;
    border-radius:10px;
`

function NewsWidget() {
  return (
    <Container>NewsWidget</Container>
  )
}

export default NewsWidget