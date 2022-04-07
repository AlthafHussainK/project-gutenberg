// The category list page, which is the main page as per the design

import './List.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { GenreContext } from '../context/GenreContext';

export default function List() {
  const { setGenre } = useContext(GenreContext)

  const genreList = ['Fiction', 'Drama', 'Humour', 'Politics', 'Philosophy', 'History', 'Adventure']

  return (
    <div className='container'>
        <div className='header'>
          <h1>Gutenberg Project</h1>
          <p>A social cataloging website that allows you to
              freely search its database of books,
              annotations, and reviews.</p>
        </div>
        
        <div className='genre-list'>

          {
            genreList.map(item => (
              <Link to='/books' onClick={() => setGenre(`${item}`)} key={item}>
                <div className='genre'>
                  <img src={`/Assets/${item}.svg`} className='img-icon'  alt={`icon for ${item}`} />
                  <h3>{item}</h3>
                  <img src='Assets/Next.svg' className='img-icon next-btn'  alt='' />
                </div>
              </Link>
            ))
          }
          
        </div>
      </div>
  )
}

// We store the Genre value to the context once the user click a genre