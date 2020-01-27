import React,{useState,useEffect} from 'react';
import TextField from '../../components/Input';
import {useDispatch, useSelector} from 'react-redux'
import {ethers} from 'ethers';
import {SEARCH_TERM_CHANGED,} from './constants'
import Button from "../../components/Button";
import { checkLocalStorageForWallet} from '../../utils/functions'
import CardBoard from '../../components/CardBoard';

//Force Update Function
const useForceUpdate =() => {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => ++value); // update the state to force render
}
export const Wallet = () => {
  const [wallet,setWallet] = useState(JSON.parse(localStorage.getItem('wallets')));
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [senderWallet, setSenderWallet] = useState('');
  const [txStatus,setTxStatus] = useState('');
  const [txhash,setTxHash] = useState('');


  const infuraProvider = new ethers.providers.InfuraProvider('rinkeby');
  const forceUpdate = useForceUpdate();
  const dispatch = useDispatch()
  let walletName = useSelector(state => state.Wallet.walletName);
  const wallets =  JSON.parse(localStorage.getItem('wallets'))
  const handleInputChange = (value) => {
    dispatch({type: SEARCH_TERM_CHANGED, data: value})
  }

  useEffect(()=>{
    getWalletsBalances();
    setInterval(() => {
      getWalletsBalances();
    }, 10000);
  },[wallet])
const handleWalletCreate = () => {
    const randWallet = ethers.Wallet.createRandom()
    let walletWithProvider = new ethers.Wallet(randWallet.signingKey.privateKey,infuraProvider)
    let wallet = {
      walletName,
      wallet:walletWithProvider,
    };

    if(!checkLocalStorageForWallet()){
      let walletArray = [];
      walletArray.push(wallet);
      localStorage.setItem('wallets',JSON.stringify(walletArray));
      setWallet(walletArray)
    } else {
      wallets.push(wallet);
      localStorage.setItem('wallets',JSON.stringify(wallets));
      setWallet(wallets)
    }
}
const getWalletsBalances = () => {
  if(wallet){
    let tempWallets = wallet;
    for(let i = 0; i <tempWallets.length; i++){
      infuraProvider.getBalance(tempWallets[i].wallet.signingKey.address).then(balance => {
        tempWallets[i].balance = ethers.utils.formatEther(balance);
        forceUpdate();
      })

    }
  }
}
const checkTxStatus = (hash) => {
  let defaultProvider = ethers.getDefaultProvider('rinkeby');
  let interval = setInterval(() => {
    defaultProvider.getTransaction(hash).then(tx =>{
      if(tx.blockHash){
        clearInterval(interval);
        setTxStatus('Transaction Completed');
        getWalletsBalances();
      }
    })
  }, 2000);


}
const handleTx = () => {
  let defaultProvider = ethers.getDefaultProvider('rinkeby');
  let tx = {
    to,
    value: ethers.utils.parseEther(amount)
  };
  let newWallet = new ethers.Wallet(senderWallet.signingKey.privateKey, defaultProvider);
  setTxStatus('Sending Transaction');
  newWallet.sendTransaction(tx).then(tx=>{
    setTxStatus('Pending Transaction')
    setTxHash(tx.hash);
    checkTxStatus(tx.hash)
  });
}
  return (
    <React.Fragment>
      <h1>Wallet App</h1>
      <TextField name='searchTerm' label={'Wallet Name'} variant={'outlined'}onChange={(e) => handleInputChange(e.target.value)}/>
      <Button disabled={walletName.length===0}background={'#1CA'} textcolor={'white'} onClick={handleWalletCreate}> Create a Wallet</Button>
      {wallet && wallet.map(item => {
        return(
          <div style={{display:'flex',justifyContent:'space-between',width:'40%'}} key={item.wallet.signingKey.address}>
            <CardBoard>
              <h5>
                {item.walletName}
              </h5>
              <div style={{display:"flex"}}>
                <h5>Balance:</h5>
                <h5>{item.balance}</h5>
              </div>
              <div>
                <Button background={'#149'} textcolor={'white'} onClick={()=>{setFrom(item.walletName); setSenderWallet(item.wallet); setTxHash(); setTxStatus('');}}> From</Button>
                <Button background={'#941'} textcolor={'white'} onClick={()=>{setTo(item.wallet.signingKey.address)}}> To</Button>
              </div>
              </CardBoard>
          </div>
        )
      })}
      <h1>Send Ether</h1>
      <h3>SENDER: {from ? from : '(Choose From List Above By Clicking From)'} </h3>
      {txhash && (
        <h3>Tx Hash => {txhash}</h3>
      )}
      {txStatus && (
        <h3>{txStatus} </h3>
      )}
      <TextField value={to}name='searchTerm' label={'To'} variant={'outlined'}onChange={(e) => setTo(e.target.value)}/>
      <TextField value={amount}name='searchTerm' label={'Amount'} variant={'outlined'}onChange={(e) => setAmount(e.target.value)}/>
      <Button disabled={!from || !to || !amount || amount <= 0 || (txStatus !== 'Transaction Completed' && txStatus !== '')}background={'#1CA'} textcolor={'white'} onClick={handleTx}>Send Tx</Button>
    </React.Fragment>
  );
}

