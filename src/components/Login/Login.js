import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import styled from 'styled-components'
import AccountHandler from '../../handlers/AccountHandler'
import Loader from '../../modals/Loader';
import Modal from '../../modals/Modal';

const Container = styled.div`
    width:fit-content;
    height:fit-content;
    padding: 20px;
    box-shadow: 0 0 3px #777;
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
const A = styled.a`
    text-align:center;
    display:block;
    margin:1vh 0;
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
    const [openFailureModal, setOpenFailureModal] = useState(false)

    const account_handler = new AccountHandler()

    const login = (data) => {
        setWaitingForResponseModal(true)
        account_handler.logToService(data).then(res => {
            setWaitingForResponseModal(false)
            setCookie('loginData', res, {SameSite: 'none'})
            navigate('/dashboard')
        }).catch(err => {
            setWaitingForResponseModal(false)
            setOpenFailureModal(true)
        })
    }

    return (
        <>
            <Container>
                <form onSubmit={handleSubmit(login)}>
                    <InputField>
                        <Input type="text" placeholder='Email' {...register('user')}/>
                    </InputField>
                    
                    <InputField>
                        <Input type="password" placeholder='Password' {...register('password')}/>
                    </InputField>
                    
                    <SubmitBtn type="submit" value="Sign in"/>
                    <A href="/recoverPassword">Forgot your password</A>
                    <A href='/register'>Create a new account</A>
                </form>
            </Container>
            {waitingForResponseModal && 
                <Loader/>
            }
            {openFailureModal && 
                <Modal>
                    <div>User not found</div>
                    <button onClick={() => {
                        setOpenFailureModal(false)
                    }}>OK</button>
                </Modal>
            }
        </>
    )
}

export default Login