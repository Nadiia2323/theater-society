import  { useContext } from 'react'
import { AuthContext } from './AuhContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
    const { user,userChecked, isLoading } = useContext(AuthContext)
    
        const isNotNullOrUndefined = (user !== null) && (user !== undefined)
        console.log('isNotNullOrUndefined :>> ', isNotNullOrUndefined);
          return userChecked ?
        (
            isNotNullOrUndefined ? (
                <>
                    {children}
                </>
            ) : (
                <Navigate to={'/'} />
            )) : null;  
    }



