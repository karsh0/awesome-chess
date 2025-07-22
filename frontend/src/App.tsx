import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { Game } from './components/Game'

function App() {

  return (
   <BrowserRouter>
      <Routes>
          <Route path='/' element={<Game/>}/>
      </Routes>
   </BrowserRouter>
  )
}

export default App
