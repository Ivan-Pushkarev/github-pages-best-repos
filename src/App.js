import loader from './img/loader.gif'
import axios from 'axios'
import './App.css'
import {useEffect, useReducer, useRef, useState} from "react";
import Repo from "./Repo";

const languages = ['javascript', 'python', 'go', 'java', 'php']

const initialState = {
    pageNumber: 1,
    loading: true,
    repos: [],
    language: 'javascript',
    observerOn: false
};

function reducer(state, action) {
    switch (action.type) {
        case 'increment page':
            return {...state, pageNumber: state.pageNumber + 1, loading: true}
        
        case 'add repos':
            return {...state, repos: [...state.repos, ...action.payload], loading: false, observerOn: true}
        
        case 'new language':
            return {...initialState, language: action.payload}
        
        default:
            throw new Error("Don't understand action")
    }
}

function App() {
    const [element, setElement] = useState(null)
    const [state, dispatch] = useReducer(reducer, initialState);
    const observer = useRef(
        new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    console.log('page increment')
                    dispatch({type: 'increment page'})
                }
            },
            {threshold: 1}
        )
    );
    
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
            }
        })
            .then(res => {
                dispatch({type: 'add repos', payload: res.data.items})
            })
            .catch(err => console.log(err))
    }, [state.pageNumber, state.language]);
    
    useEffect(() => {
        const currentElement = element;
        const currentObserver = observer.current;
        console.log('Current element', currentElement)
        if (currentElement && state.observerOn ) {
            currentObserver.observe(currentElement);
        }
        return () => {
            if (currentElement) {
                console.log('unobserve')
                currentObserver.unobserve(currentElement);
            }
        };
    }, [element]);
    
    const selectHandler = (e) => {
        setElement(null)
        dispatch({type: 'new language', payload: e.target.value})
    }
    console.log('Page', state.pageNumber)
    console.log('language', state.language)
    console.log('element', element)
    
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
                        state.repos.map(el => <div ref={setElement} key={el.id}>
                            <Repo ref={setElement} repo={el}/>
                        </div>)
                    }
                    </tbody>
                </table>
                <div className='count'>Number downloaded repos {state.repos.length}</div>
                
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