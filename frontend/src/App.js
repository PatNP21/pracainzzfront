import logo from './logo.svg';
import {BrowserRouter as Router, Routes, Route, useParams} from 'react-router-dom'
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Chat from './components/Chat/Chat';
import Crypto from './components/Crypto/Crypto';
import Dashboard from './components/Dashboard/Dashboard';
import News from './components/News/News';
import Profile from './components/Profile/Profile';
import RecoverPassword from './components/RecoverPassword/RecoverPassword';
import NewPassword from './components/RecoverPassword/NewPassword';
import Stock from './components/Stock/Stock';
import ChatList from './components/Chat/ChatList';
import Wallet from './components/Wallet/Wallet';
import { FinnhubProvider } from 'react-finnhub'
import StockCryptoHandler from './handlers/StockCryptoHandler'
import ExtendedNewsInfo from './components/News/ExtendedNewsInfo';
import Payment from './components/Payment/Payment';
import ExtendedOwnedItem from './components/Wallet/ExtendedOwnedItem';

function App() {
  const operateHandler = new StockCryptoHandler()
  const {userID} = useParams()

  return (
    <FinnhubProvider client={operateHandler.client_stock}>
      <Router>
        <Routes>
          <Route path="" element={<Login/>} />
          <Route path="login/:sth" element={<Login/>} />
          <Route path="register" element={<Register/>} />
          <Route path="payment" element={<Payment/>}/>
          <Route path="chatList" element={<ChatList/>}/>
          <Route path="chat" element={<Chat/>}>
            <Route path=":userID" element={<Chat/>}/>
          </Route>
          <Route path="crypto" element={<Crypto/>} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="newsList" element={<News/>} />
          <Route path="news/:id" element={<ExtendedNewsInfo/>}/>
          <Route path="profile" element={<Profile/>}>
            <Route path=":userID" element={<Profile/>}/>
          </Route>
          <Route path="stock" element={<Stock/>} />
          <Route path="recoverPassword" element={<RecoverPassword/>} />
          <Route path="newPassword/:sth/:userID" element={<NewPassword/>} />
          <Route path="myWallet/:userID" element={<Wallet/>}/>
          <Route path="item" element={<ExtendedOwnedItem/>}/>
        </Routes>
      </Router>
    </FinnhubProvider>
  );
}

export default App;
