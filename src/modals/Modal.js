import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width:fit-content;
  height:fit-content;
  z-index:2;
  position:fixed;
  top: 40%;
  left: 40%;
  padding:5vh 5vw;
  box-shadow: 0 0 5px #000080;
  border-radius:10px;
  perspective:300px;
  background-color:#fff;
`

function Modal({children}) {
  return (
    <Container>{children}</Container>
  )
}

export default Modal