import loader from './img/loader.gif'
import axios from 'axios'
import './App.css'
import {useEffect, useRef, useState} from "react";
import Repo from "./Repo";

const languages = ['javascript', 'python', 'go', 'java', 'php']

function App() {
  const [repos, setRepos] = useState([])
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading] = useState(true)
  const [observerSwitcher, setObserverSwitcher] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  
  const pageEnd = useRef()
  const prevLanguage = useRef('javascript')
  
  useEffect(() => {
    if (observerSwitcher) {
      const observer = new IntersectionObserver(
          entries => {
            if (entries[0].isIntersecting) {
              setLoading(true)
              setPageNumber(prevPage => prevPage + 1)
            }
          },
          {threshold: 0.5}
      )
      observer.observe(pageEnd.current)
    }
  }, [observerSwitcher]);
  
  useEffect(() => {
    if (language !== prevLanguage.current) {
      setLoading(true)
      setRepos([])
      setPageNumber(1)
    }
    axios({
      method: 'GET',
      url: 'https://api.github.com/search/repositories',
      params: {q: `language:${language}`, sort: 'stars', order: 'desc', page: pageNumber}
    })
        .then(res => {
          setRepos([...repos, ...res.data.items])
          setLoading(false)
          setObserverSwitcher(true)
          prevLanguage.current = language
        })
        .catch(err => console.log(err))
  }, [pageNumber, language]);
  
  
  const selectHandler = (e) => {
    setLanguage(e.target.value)
  }
  console.log('Page', pageNumber)
  console.log('language', language)
  
  return (
      <div>
        <header>
          <h1>The highest-rated {language} repos</h1>
          <div className="input-wrapper">
            <div>
              <label htmlFor="language">Choose language</label>
              <select name="language" id="language"
                      onChange={selectHandler}>
                {
                  languages.map(el => <option value={el}>{el}</option>)
                }
              </select>
            </div>
          
          </div>
          <table className="table-head" id='head'>
            <tbody>
            <tr className="repo">
              <td className="repo__avatar">Avatar</td>
              <td className="repo__name">Name</td>
              <td className="repo__link">URL</td>
              <td className="repo__owner">Owner</td>
              <td className="repo__forks">Forks</td>
              <td className="repo__issues">Open Issues</td>
            </tr>
            </tbody>
          </table>
        </header>
        
        <div className='table-body'>
          <table>
            <tbody>
            {
              repos.map(el => <Repo key={el.id} repo={el}/>)
            }
            </tbody>
          </table>
          <div className='count' ref={pageEnd}>Number downloaded repos {repos.length}</div>
          
          {
            loading && <div className="loader">
              <img src={loader} alt="loader"/>
            </div>
          }
        </div>
      </div>
  )
}

export default App;