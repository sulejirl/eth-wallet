export const checkLocalStorageForWallet = () => {
  const wallets = localStorage.getItem('wallets')
  if(wallets && typeof(wallets) !== null && wallets.length > 0 ){
    return true
  } else {
    localStorage.setItem('wallets', []);
    return false;
  }
}

