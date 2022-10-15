import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Header from '../../elements/Header/Header'

const Container = styled.div`
  width:fit-content;
  height:fit-content;
  margin:3vh auto;
`
const Group = styled.div`
  float:left;
  margin:2vw;
  width:40vw;
  height:70vh;
  border-radius:10px;
  box-shadow:0 0 3px #000080;
`
const Button = styled.button`
  border:none;
  border-radius:10px;
  margin:auto;
  padding:1vh 1vw;
  cursor:pointer;
`

function Wallet() {
  return (
    <>
      <Header/>
      <Container>
        <Group>
          <Button>
            Sell
          </Button>
        </Group>

        <Group>
          <Button>
            Sell
          </Button>
        </Group>
      </Container>
    </>
  )
}

export default Wallet