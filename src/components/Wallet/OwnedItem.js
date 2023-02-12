import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    margin: 1vh auto;
    width: 80%;
    height: 8vh;
    border-radius: 10px;
    box-shadow:0 0 3px #000080;
`

function OwnedItem(props) {
  return (
    <Container>
        {props.children}
    </Container>
  )
}

export default OwnedItem