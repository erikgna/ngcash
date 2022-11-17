import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { decodeToken } from 'react-jwt'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AuthContextCmpnt } from './context/Auth'
import { IDecodedToken } from './interface/auth'

import { Auth } from "./pages/Auth/Auth"
import { Error } from './pages/Error/Error'
import { Home } from "./pages/Home/Home"

function App() {
  const [cookies, setCookies, removeCookie] = useCookies(['jwt-token'])

  useEffect(() => {
    const decodedToken: IDecodedToken | null = decodeToken(cookies['jwt-token'])
    const nowTimestamp = parseInt((Date.now() / 1000).toString())
    if (decodedToken === null || nowTimestamp > decodedToken.exp) {
      removeCookie('jwt-token')
    }
  }, [cookies])

  return (
    <BrowserRouter>
      <AuthContextCmpnt>
        <main>
          <Routes>
            <Route path='/' element={cookies['jwt-token'] ? <Home /> : <Navigate to='/authentication' />} />
            <Route path='/authentication' element={cookies['jwt-token'] ? <Navigate to='/' /> : <Auth />} />
            <Route path='*' element={<Error />} />
          </Routes>
        </main>
      </AuthContextCmpnt>
    </BrowserRouter>
  )
}

export default App
