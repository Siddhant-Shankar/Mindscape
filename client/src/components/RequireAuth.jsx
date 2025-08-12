import { useContext, useEffect } from 'react'; //Use context is where we store JWT token and user info, Use effect runs a function whenever something in usecontext changes
import { useNavigate } from 'react-router-dom'; //From react-router-dom, lets us redirect programmatically.
import { AuthContext } from '../contexts/AuthContext'; //Our global auth state (stores token after login).


export default function RequireAuth({ children }) { //RequireAuth is a wrapper component 
  const { token } = useContext(AuthContext); //token is pulled from context and if there is no token, then the user is not logged in 
  const nav = useNavigate(); //function for redirecting

  useEffect(() => { //runs after the component renders
    if (!token) nav('/login'); //if token is empty we immeditaely return to /login
  }, [token, nav]);

  return children; //If the user does have a token, it just renders whatever is inside 
}