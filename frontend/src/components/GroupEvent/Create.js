import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

const Container = styled.div`
    width:30vw;
    height:14vh;
    margin:10vh auto;
    border-radius:10px;
    box-shadow:0 0 3px gray;
    align-items:center;
`
const Input = styled.input`
    width:80%;
    height:4vh;
    border-radius:10px;
    border:none;
    box-shadow:0 0 3px gray;
    margin:2vh 3vw;
`
const SubmitButton = styled.input`
    width: 50%;
    height:4vh;
    margin:1vh 8vw;
    cursor:pointer;
`

function Create() {

  const {state} = useLocation()
  const navigate = useNavigate()
  const {register, handleSubmit} = useForm()

  const addItem = (data) => {
    console.log(data)
  }

  return (
    <Container>
        <form onSubmit={handleSubmit(addItem)}>
            <Input placeholder="Name" {...register('name')}/>
            <SubmitButton type="submit">
                Add
            </SubmitButton>
        </form>
    </Container>
  )
}

export default Create