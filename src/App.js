import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import './App.css'
import MovieRow from './components/movieRow';
import FeaturedMovie from './components/featuredMovie';
import Header from './components/header';
import featuredMovie from './components/featuredMovie';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() =>{
    const loadAll = async () => {
      //Pegando lista total
      let list = await Tmdb.fetHomeList()
      setMovieList(list);

      // pegando o featured
      let originals = list.filter(i=>i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * (originals[0].item.results.length - 1));
      let chosen =originals[0].item.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

      setFeaturedData(chosenInfo)
    }
    loadAll();
  },[]);

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 10){
        setBlackHeader(true);
      }
      else{
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  },[]);
  
  return (
    <div className="page">
      <Header black={blackHeader}/>
      {featuredData &&
        <FeaturedMovie item={featuredData}/>
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.item}/>
        ))}
      </section>

      <footer>
        Feito com <span role="img" aria-label="coração">❤️ pelo <b>RicardoLPTZ</b><br/>
        Direitos de imagem para Netflix<br/>
        Dados pegos do site Themoviedb.org
        </span>
      </footer>

      {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://i.ibb.co/VwbxQ32/logo-Netflix.gif" alt="Carregando"/>
      </div>
      }
    </div>
  )
}