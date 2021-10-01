import loader from './img/loader.gif'
import axios from 'axios'
import './App.css'
import {useEffect, useReducer, useRef} from "react";
import Repo from "./Repo";

const languages = ['javascript', 'python', 'go', 'java', 'php']

const initialState = {
    pageNumber: 1,
    loading: true,
    observerSwitcher: false,
    repos: [],
    language: 'javascript',
};

function reducer(state, action) {
    switch (action.type) {
        case 'increment page':
            return {...state, pageNumber: state.pageNumber + 1, loading: true}
        
        case 'add repos':
            return {...state, repos: [...state.repos, ...action.payload], loading: false, observerSwitcher: true}
        
        case 'new language':
            return {...initialState, language: action.payload}
        
        default:
            throw new Error("Don't understand action")
    }
}

function App() {
    
    const [state, dispatch] = useReducer(reducer, initialState);
    const pageEnd = useRef()
    
    useEffect(() => {
        console.log('первый useEffect')
        axios({
            method: 'GET',
            url: 'https://api.github.com/search/repositories',
            params: {
                q: `language:${state.language}`,
                sort: 'stars',
                order: 'desc',
                page: state.pageNumber,
                per_page: '30'
            }
        })
            .then(res => {
                dispatch({type: 'add repos', payload: res.data.items})
                
            })
            .catch(err => console.log(err))
    }, [state.pageNumber, state.language]);
    
    useEffect(() => {
        console.log('второй useEffect')
        if (state.observerSwitcher) {
            console.log('Наблюдатель включен')
           
            const observer = new IntersectionObserver(
                entries => {
                    if (entries[0].isIntersecting) {
                        dispatch({type: 'increment page'})
                    }
                },
                {threshold: 0.5}
            )
            observer.observe(pageEnd.current)
        }
    }, [state.observerSwitcher])
    
    
    const selectHandler = (e) => {
        dispatch({type: 'new language', payload: e.target.value})
    }
    console.log('Page', state.pageNumber)
    console.log('language', state.language)
    
    return (
        <div>
            <header>
                <h1>The highest-rated {state.language} repos</h1>
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
                        state.repos.map(el => <Repo key={el.id} repo={el}/>)
                    }
                    </tbody>
                </table>
                   <div className='count' ref={pageEnd}>Number downloaded repos {state.repos.length}</div>
                
                {
                    state.loading && <div className="loader">
                        <img src={loader} alt="loader"/>
                    </div>
                }
            </div>
        </div>
    )
}

export default App;