import React, { Component } from 'react';
import "./ListOfArticles.css";
import { Link } from "react-router-dom";
const chunkArrayByGroupSize = (arr, groupSize) =>{
  let rArr = []
  for (let i = 0; i < arr.length; i += groupSize) {
    rArr.push(arr.slice(i, i + groupSize));
  }
  return rArr
}
var articles = [
  {
    coverPic:'https://bit.ly/2sgzd7r',
    title:"R8 test",
    firstSent:'Today we are going to introduce R8...',
    contentURL:'https://laniakea2018.wordpress.com/'
  },
  {
    coverPic:'https://bit.ly/2L6ptnA',
    title:"AMG",
    firstSent:'Introducing AMG...',
    contentURL:'https://laniakea2018.wordpress.com/'
  },
];

export default class ListOfArticles extends Component {
  render(){
    let articleList = this.props.posts.map((item) =>
      <ArticleCard item={item} key={item.postId} />
    );
    articleList = chunkArrayByGroupSize(articleList, 4);
    articleList = articleList.map((item, index) =>
      <div class={"carousel-item " + ((index === 0) ? "active" : "")}>
        <div className="row">
          {item}
        </div>
      </div>
    );
    return(
      <footer className="fixed-bottom">
        <div id="carouselExampleControls" class="carousel slide list-of-articles col-12 " data-ride="carousel">
          <div class="carousel-inner col-10">
            {articleList}
          </div>
          <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>
        </div>
      </footer>
      
    );
  }
}
const ArticleCard = props =>(
    <div className="card ">
        <div className="card-body">
          <h5 className="card-title">{props.item.title}</h5>
          <p class="card-text">{props.item.content}</p>
          <Link class="btn btn-secondary" to={"/blogs/" + props.item.author + "/" + props.item.postId} >View details »</Link>
        </div>
    </div>
);