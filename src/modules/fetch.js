/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
import { postComment, Comment, commentCounter } from './comments.js';
import displayAllMovies from './movies.js';

const div = document.querySelector('.cards');
const fetchdata = async () => {
  const data = await fetch('https://api.tvmaze.com/shows');
  try {
    const response = await data.json();
    return response;
  } catch (error) {
    return error;
  }
};

const popupDetails = async (id) => {
  const data = await fetch(`https://api.tvmaze.com/shows/${id}`);
  const comments = await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pRSMj4Sa1SZFpBHfoj5I/comments?item_id=${id}`);
  try {
    const response = await data.json();
    const commentsResponse = await comments.json();
    response.comments = commentsResponse;
    return response;
  } catch (error) {
    return error;
  }
};

const displayPopup = (response) => {
  const body = document.querySelector('body');
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = `
  <span class="close">&times;</span>
  <div class="movie"></div>
  <h2>${response.name}</h2>
  <p class = "rating"><span>Imbd rating : ${response.rating.average}</span><span>Average Length: ${response.averageRuntime}min</span></p>
  <p class = "info"><span>Genre(s) : ${response.genres}</span><span>Premiered: ${response.premiered}</span></p>
  <h3>Comments (<span>0</span>)</h3>
  <ul class="comments"></ul>
  <h4>Add a comment</h4>
  <form action="#" id = "form${response.id}">
  <input type="text" placeholder="Your name">
  <textarea name="comments"  class = "add-comment" placeholder="Comment"></textarea>
  <button type="submit" class = "submit">Comment</button>
  </form>
  `;
  body.append(popup);
  const image = document.querySelector('.movie');
  image.style.backgroundImage = `url(${response.image.original})`;

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.querySelector('form input').value.trim();
    const newComment = document.querySelector('form textarea').value.trim();
    let { id } = form;
    id = id.replace(/form/, '');
    const comment = new Comment(id, username, newComment);

    if (username && newComment) {
      postComment(comment);
      const date = Date().split(' ').splice(1, 3).join(' ')
        .split(' ')
        .reverse();
      const month = ('JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(date.slice(2).join('')) / 3 + 1);
      const comHeader = document.querySelector('.popup h3 span');
      const savedComments = document.querySelector('.comments');
      comHeader.textContent = commentCounter(parseInt(comHeader.textContent, 10));
      savedComments.innerHTML += `<li>${date[0].concat(`-0${month}-${date[1]}`)} ${comment.username}: ${comment.comment}</li>`;
    }
    form.reset();
  });
};

const displayMovies = async () => {
  const response = await fetchdata();
  for (let movies = 0; movies <= 35; movies += 1) {
    const card = document.createElement('div');
    card.classList.add('card');
    const movie = response[movies];
    card.id = `${movie.id}`;
    card.innerHTML += `
            <p><span>${movie.name}</span><span class="likespan"><i class="bi bi-heart-fill"></i><i id="likes${movie.id}" class="likes"></i><span/></p>
            <button class= "open-comments" >comments</button>
  `;
    card.style.backgroundImage = `url(${movie.image.original})`;
    div.append(card);
    fetchLikes(movie.id);
  }

  const container = document.querySelector('.cards');
  const allMovies = document.getElementById('all');
  displayAllMovies(allMovies.textContent = `All movies (${container.childNodes.length})`);

  displayAllMovies();
  const displayComments = () => {
    const comments = document.querySelectorAll('.open-comments');
    comments.forEach((comment) => {
      comment.addEventListener('click', async (e) => {
        const main = document.querySelector('main');
        main.style.filter = 'blur(6px)';
        const result = await popupDetails(e.target.parentNode.id);
        displayPopup(result);
        window.scroll({ top: 0, left: 0 });

        const close = document.querySelector('.close');
        close.addEventListener('click', () => {
          const main = document.querySelector('main');
          const body = document.querySelector('body');
          body.removeChild(body.lastChild);
          main.style.filter = 'blur(0)';
        });

        const savedComments = document.querySelector('.comments');
        const comHeader = document.querySelector('.popup h3 span');
        result.comments.forEach((r) => {
          comHeader.textContent = parseInt(comHeader.textContent, 10) + 1;
          savedComments.innerHTML += `<li>${r.creation_date} ${r.username}: ${r.comment}</li>`;
        });
      });
    });
  };
  displayComments();

  const likebtn = document.querySelectorAll('.bi-heart-fill');
  likebtn.forEach((btn) => {
    const likeid = (btn.parentNode.parentNode.parentNode.id);
    btn.addEventListener('click', (e) => {
      btn.classList.add('bi-heartbreak-fill');
      const initiallikes = +e.target.nextSibling.textContent;
      let count = initiallikes;
      count += 1;
      e.target.nextSibling.textContent = count;
      postlikes(likeid);
    });
  });
};
const postlikes = async (btnid) => {
  const posts = await fetch('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pRSMj4Sa1SZFpBHfoj5I/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item_id: btnid,
    }),
  });
  const response = await posts.json();
  return response;
};

const fetchLikes = async (id) => {
  const likesData = await fetch('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pRSMj4Sa1SZFpBHfoj5I/likes');
  const response = await likesData.json();
  const liketext = document.getElementById(`${id}`);
  const res = response.find((r) => +r.item_id === id);
  liketext.childNodes[1].childNodes[1].childNodes[1].textContent = res.likes;
  return res.likes;
};

export {
  popupDetails, displayMovies, fetchLikes,
};
