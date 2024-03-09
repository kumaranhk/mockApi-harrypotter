const API = "https://hp-api.onrender.com/api";
let currentpage = 1;
let itemsPage = 20;

async function getData(endpoint){
    try {
        let res = await fetch(`${API}/${endpoint}`,{
            method : "GET"
        });
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}
function getRole(data){
    let role ;
    if(data?.hogwartsStudent != false || data?.hogwartsStaff != false){
        data.hogwartsStudent ? role = "Hogwarts Student" : role = "Hogwarts Staff";
    }
    else{
        role = "No data";
    }  
    return role;
}

function isAlive(data){
    return data.alive == true ? "Alive" : "No";
}

function createTableData(ele,i){
    document.querySelector('.table-body').innerHTML += `
        <tr>
            <td>${ele?.name}</td>
            <td>${ele?.house != "" ? ele?.house : "No Data" }</td>
            <td>${getRole(ele)}</td>
            <td>${isAlive(ele)}</td>
            <td>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" 
                fill="#0d6efd" class="bi bi-eye-fill eye-btn" viewBox="0 0 16 16" onclick="createCarousel('${ele?.image}','${ele?.name}','${ele?.house}')">
                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                </svg>
            <td>
        </tr>
    `;
}

function createCarousel(imageUrl,name,house) {
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.innerHTML = '';
    carouselContainer.innerHTML += `
        <div class="col">
            <div class="card" style="width: 10rem;">
                <img src="${imageUrl}" class="card-img-top" alt="Image">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">${house}</p>
                </div>
                <button class="btn btn-primary popup-btn" onclick="closeCard()">Close</button>
            </div>
        </div>
    `;
    openCard();
}

function addPagination(){
    document.querySelector('.nav').innerHTML = "";
    document.querySelector('.nav').innerHTML += `
      <ul class="pagination">
          <li class="page-item">
              <a class="page-link bg-primary text-light previousPage" href="#" aria-label="Previous" onclick="prevButton()">
                  <span aria-hidden="true">&laquo;</span>
              </a>
          </li>
          <li class="page-item"><a class="page-link current-page" href="#"></a></li>
          <li class="page-item">
              <a class="page-link bg-primary text-light nextPage" href="#" aria-label="Next" onclick="nextButton()">
                  <span aria-hidden="true">&raquo;</span>
              </a>
          </li>
      </ul>
    `;
}

function openCard() {
    document.querySelector('.overlay').style.display = 'flex';
    document.querySelector('.overlay').style.position = 'fixed';

}

function closeCard() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.overlay').style.position = 'none';
}

async function search(){
    document.querySelector('.table-body').innerHTML = "";
    document.querySelector('.nav').innerHTML = "";
    let data = await getData('characters');
    let d = data.filter(e => e.name.toLowerCase() === document.querySelector('.search').value.toLowerCase());
    d.length != 0 ? d.map((e,i) => {
        createTableData(e, i+1)
    }) 
    : document.querySelector('.table-body').innerHTML += `
    <tr>
        <td colspan="6">No data</td>
    </tr>
`;
}
async function feedData(){
    document.querySelector('.table-body').innerHTML = "";
    let startIndex = (currentpage - 1) * itemsPage;
    let endIndex = startIndex + itemsPage;
    let data = await getData('characters');
    data.slice(startIndex, endIndex).map((e) => {
            createTableData(e);
        });
    data.length > itemsPage ? addPagination() : console.log(data.length);
    document.querySelector('.current-page').innerHTML = currentpage;
    if(currentpage == 1){
        document.querySelector('.previousPage').style.backgroundColor = 'grey';
        document.querySelector('.previousPage').style.disabled = true;
    }    
}
window.addEventListener('load', feedData());

function prevButton() {
    if (currentpage > 1) {
      currentpage--;
        feedData();
    }
  }
  
function nextButton() {
    currentpage++;
    feedData();
}