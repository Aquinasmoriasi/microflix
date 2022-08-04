/* eslint-disable consistent-return */
// import { postComment, Comment } from './comments.js';

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
  const comments = await fetch(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/9YE3WJxp5XfKqI5kUFRZ/comments?item_id=${id}`);
  try {
    const response = await data.json();
    const commentsResponse = await comments.json();
    response.comments = commentsResponse;
    return response;
  } catch (error) {
    return error;
  }
};

const displayMovies = async () => {
  const response = await fetchdata();
  for (let movies = 160; movies <= 180; movies += 1) {
    const card = document.createElement('div');
    card.classList.add('card');
    const movie = response[movies];
    card.id = `${movie.id}`;
    card.innerHTML += `
            <p><span>${movie.name}</span><i class="bi bi-heart-fill"></i></p>
            <button class= "open-comments" >comments</button>
  `;
    card.style.backgroundImage = `url(${movie.image.medium})`;
    div.append(card);
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
  <h3></h3>
  <ul class="comments"></ul>
  <form action="#" id = "form${response.id}">
  <input type="text" placeholder="Your name">
  <textarea name="comments"  class = "add-comment" placeholder="Comment"></textarea>
  <button type="submit" class = "submit">Comment</button>
  </form>
  `;
  body.append(popup);
  const image = document.querySelector('.movie');
  image.style.backgroundImage = `url(${response.image.original})`;
};

const displayComments = async () => {
  await displayMovies();
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
        const pop = document.querySelector('.popup');
        const main = document.querySelector('main');
        pop.style.display = 'none';
        main.style.filter = 'blur(0)';
        window.location.reload();
      });
    });

    // close.forEach((c) => {
    //   const pop = document.querySelector('.popup');
    //   c.addEventListener('click', async (e) => {
    //     const main = document.querySelector('main');
    //     const result = await popupDetails(e.target.parentNode.id);
    //     displayPopup(result);
    //     pop.style.display = 'none';
    //     main.style.filter = 'blur(0)';
    //     window.location.reload();
    //   });
    // });
  });
};

// const closeComments = async () => {

// };

// const close = document.querySelectorAll('.close');

// close.forEach((c) => {
//   const pop = document.querySelector('.popup');
//   c.addEventListener('click', () => {
//     const main = document.querySelector('main');
//     pop.style.display = 'none';
//     main.style.filter = 'blur(0)';
//     window.location.reload();
//   });
// });

// const savedComments = document.querySelector('.comments');
// const comHeader = document.querySelector('.popup h3');
// response.comments.forEach((r) => {
//   if (r.comments === undefined) {
//     comHeader.textContent = `Comments(${r.comments.length})`;
//     savedComments.innerHTML += `<li>${r.creation_date} ${r.username}: ${r.comment}</li>`;
//   } else {
//     comHeader.textContent = 'Comments(0)';
//     savedComments.innerHTML += `<li>${r.creation_date} ${r.username}: ${r.comment}</li>`;
//   }
// });

// const forms = document.querySelectorAll('form');
// forms.forEach((form) => {
//   form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const username = document.querySelector('form input').value;
//     const newComment = document.querySelector('form textarea').value;
//     let { id } = form;
//     id = id.replace(/form/, '');
//     const comment = new Comment(id, username, newComment);
//     postComment(comment);
//     form.reset();
//   });
// });

export {
  displayComments, popupDetails, displayMovies,
};
