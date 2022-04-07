import './App.css';
import List from './components/List';
import Books from './components/Books';
import { Route, Routes } from 'react-router-dom';
import { GenreContext } from './context/GenreContext';
import { useState } from 'react';

function App() {
  const [genre, setGenre] = useState('')

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={  
           <GenreContext.Provider value={{ genre, setGenre }}> 
             <List />
          </GenreContext.Provider> 
        }/>
        <Route path="/books" element={
          <GenreContext.Provider value={{ genre, setGenre }}>
             <Books />
          </GenreContext.Provider>
        } />
      </Routes>
    </div>
  );
}

export default App;

// As per the latest react-router-dom (6.3.0), the component is passed as element
// A context is created at context/GenreContext.js and the values are passed throgh context providers