import  { PropsWithChildren, useContext } from 'react'
import { AuthContext } from './AuhContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: PropsWithChildren) {
    const { user, theater, userChecked, isLoading } = useContext(AuthContext)
    console.log({ userChecked, user, theater})
    
        // const isNotNullOrUndefined = (user !== null) && (user !== undefined)
        // console.log('isNotNullOrUndefined :>> ', isNotNullOrUndefined);
          return userChecked ?
        (
            (user || theater) ? (
                <>
                    {children}
                </>
            ) : (
                <Navigate to={'/'} />
            )) : <h1>Loading...</h1>;  
    }



