import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    width: 15vw;
    height:20vh;
    margin:6vh auto;
    box-shadow: 0 0 3px gray;
    border-radius:10px;
    text-align:center;
`

function Widget(props) {
  return (
    <Container>
      {props.children}
    </Container>
  )
}

export default Widget