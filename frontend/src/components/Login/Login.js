import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import styled from 'styled-components'
import AccountHandler from '../../handlers/AccountHandler'
import LoadingModal from '../../modals/LoadingModal';
import Modal from 'react-modal'

const Container = styled.div`
    width:fit-content;
    height:fit-content;
    padding: 20px;
    box-shadow: 2px 2px 2px #777;
    border-radius:10px;
    margin: 20vh auto;
`
const InputField = styled.div`
    width:fit-content;
    height:fit-content;
    margin: 1vh 0;
    border:1px solid #999;
    border-radius:10px;
`
const Input = styled.input`
    display:block;
    width: 18vw;
    height: 4vh;
    border:none;
    border-radius:10px;
`
const SubmitBtn = styled.input`
    display:block;
    width: 18vw;
    height: 4vh;
    border:none;
    border-radius:10px;
    cursor:pointer;
`

function Login() {

    const {register, handleSubmit} = useForm()

    const navigate = useNavigate()
    const [cookies, setCookie] = useCookies()
    const [waitingForResponseModal, setWaitingForResponseModal] = useState(false)

    const account_handler = new AccountHandler()

    const onSubmit = (data) => {
        console.log(data)
        setWaitingForResponseModal(true)
        account_handler.logToService(data).then(res => {
            setWaitingForResponseModal(false)
            console.log(res)
            setCookie('loginData', res.data.user)
            navigate('/dashboard')
        }).catch(err => {
            setWaitingForResponseModal(false)
            console.log(err)
            alert('User not found')
        })
    }

    return (
        <>
            <Container>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField>
                        <Input type="text" placeholder='Email or username' {...register('user')}/>
                    </InputField>
                    
                    <InputField>
                        <Input type="password" placeholder='Password' {...register('password')}/>
                    </InputField>
                    
                    <SubmitBtn type="submit" value="Sign in"/>
                </form>
            </Container>
            {waitingForResponseModal && 
                <Modal>
                </Modal>
            }
        </>
    )
}

export default Login