
const getToken = () => {
  const token = localStorage.getItem('token');
  return token
}
const isUserLoggedIn = () => {
  const token = getToken()
  return token ? true 
  : false;
  }


  export {getToken,isUserLoggedIn}