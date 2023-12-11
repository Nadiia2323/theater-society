import  { useContext } from 'react'
import { AuthContext } from './AuhContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
    const { user,userChecked } = useContext(AuthContext)
    
    return userChecked ?
        (
            user ? (
                <>
                    {children}
                </>
            ) : (
                <Navigate to={'/'} />
            )) : null;
  }

