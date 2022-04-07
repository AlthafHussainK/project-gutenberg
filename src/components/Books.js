import axios from 'axios'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GenreContext } from '../context/GenreContext'
import './Books.css'

export default function ListPage() {
  // stores the results from api call
  const [books, setBooks] = useState([])
  // stores the user search input
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [pageNumber, setPageNumber] = useState(1)
  // check for the last item
  const [hasMore, setHasMore] = useState(false)
  const { genre } = useContext(GenreContext)

  // previous data fetched from api set to empty as user search
  useEffect(() => {
    setBooks([])
  }, [searchInput])
  
  // this useEffect is called when there is in a change in search input field, ie. if user type in search, api is called. 
  // If the next page is requested by the infinite scroll function below, api is called
  useEffect(() => {
    setLoading(true)
    let url = `http://skunkworks.ignitesol.com:8000/books/?mime_type=image%2F&page=${pageNumber}&topic=${genre}&search=${searchInput}`
    // to implement -> cancelToken alternative - abortController
    axios.get(url)
      .then((res) => {
        const { results } = res.data
        // stores previous data and newly fetched data
        setBooks(prevBooks => {
          return [...prevBooks, ...results]
        })
        // check for boundary
        setHasMore(res.data.count - pageNumber*32 > 0)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
    })   
  }, [searchInput, pageNumber])

  // Infinte scroll functionality
  const observer = useRef()
  // We get the reference to the last book element, as the user scroll to the bottom
  // we check with Intersection Observer API whether the element is rendered or not
  // if it's rendered then the page number is incremented
  // the above useEffect looks for the change in pageNumber, so api is called
  // if the user scroll down again the above method is repeated until there is no more results
  const lastBookRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  // Function to handle search. The page number is set to 1
  function handleSearch(e) {
    setSearchInput(e.target.value)
    setPageNumber(1)
  }

  return (
    <div className='main-container'>
      {/* Header section */}
      <div className='title-section'>
        <Link to="/">
          <img src='../../Assets/Back.svg' />
        </Link>
        <h1>{genre ? genre : 'All'}</h1>
      </div>

      {/* Seachbox */}
      <div className='searchbar'>
        <img src='../../Assets/Search.svg' /> 
        <input placeholder='Search' type='text' onChange={handleSearch} />
      </div>
      
      <div className='books-container'>
        {loading && <h4 style={{color: '#A0A0A0'}}>Loading...</h4> }
        {
          books.map((item, index) => {
            {/* 
              checking whether the book is last one or not. if true, we set the reference element to it
              code repeatations are there which needs some improvements (TODO)
            */}
            if (books.length === index + 1) {
              return (
                <div className='book-box' key={item.id} ref={lastBookRef} >
                  <a href={item.formats['text/html']} >
                    <img src={item.formats['image/jpeg']} className='book-cover'/>
                  </a>
                  <p className='book-title'>{item.title}</p>   
                  {/* 
                    api returns the Author name as lastname, firstname format. Here we reverse it
                   */}
                  {
                    item.authors.map((e,index) => {
                      let fullName = ''
                      if (e.name.includes(',')){
                        const [last, first] = e.name.split(',')
                        fullName = first + ' ' + last
                      } else {
                        fullName = e.name
                      }
                      return <p key={index} className='book-author'> {fullName}</p>
                    })
                  }
              </div>
              ) 
            } else {
              return (
                <div className='book-box' key={item.id} >
                    {/* 
                      If the user taps on any book, user is forwarded to the readable format of the book
                      the link is selected in order of priority -> HTML, PDF, TXT 
                     */}
                    <img src={item.formats['image/jpeg']} className='book-cover' 
                      onClick={() => {
                        if (item.formats['text/html; charset=utf-8']){
                          window.location.href = `${item.formats['text/html; charset=utf-8']}`
                        } else if (item.formats['application/pdf']) {
                          window.location.href = `${item.formats['application/pdf']}`
                        } else if (item.formats['text/plain; charset=utf-8']) {
                          window.location.href = `${item.formats['text/plain; charset=utf-8']}`
                        } else {
                          alert('No viewable version available')
                        }
                      }}/>
                  
                  <p className='book-title'>{item.title}</p>   
                  {
                    item.authors.map((e,index) => {
                      let fullName = ''
                      if (e.name.includes(',')){
                        const [last, first] = e.name.split(',')
                        fullName = first + ' ' + last
                      } else {
                        fullName = e.name
                      }
                      return <p key={index} className='book-author'> {fullName}</p>
                    })
                  }
                </div> 
              )
            }
          })     
        }
      </div>
    </div>
  )
}