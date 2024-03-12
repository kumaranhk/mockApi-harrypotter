const API = "https://hp-api.onrender.com/api";
let currentpage = 1;
let itemsPage = 20;

async function getData(endpoint){
    try {
        let res = await fetch(`${API}/${endpoint}`,{
            method : "GET"
        });
        openloading('block');
        let data = await res.json();
        openloading('none');
        return data;
    } catch (error) {
        console.log(error);
        toasterMessage("Something went wrong","danger");
    }
}

function openloading(val){
    document.querySelector('.loading').style.display = val;
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

function createTableData(ele){
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
            <div class="card" style="width: 15rem;">
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
    document.querySelector(".table-outline").style.pointerEvents = "none";

}

function closeCard() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.overlay').style.position = 'none';
    document.querySelector(".table-outline").style.pointerEvents = "auto";

}

async function search(){
    try {
        document.querySelector('.table-body').innerHTML = "";
        document.querySelector('.nav').innerHTML = "";
        openloading('block');
        let data = await getData('characters');
        if (document.querySelector('.search').value != ""){
            let d = data.filter(e => e.name.toLowerCase() === document.querySelector('.search').value.toLowerCase());
            d.length != 0 ? d.map((e,i) => {
                createTableData(e, i+1)
            }) 
            : document.querySelector('.table-body').innerHTML += `
            <tr>
                <td colspan="6">No data</td>
            </tr>
            `;
            openloading('none');
        }
        else feedData();
    } catch (error) {
        console.log(error);
        toasterMessage('Something went wrong');
    }
    
}
async function feedData(){
    document.querySelector('.table-body').innerHTML = "";
    let startIndex = (currentpage - 1) * itemsPage;
    let endIndex = startIndex + itemsPage;
    try{
    openloading('block');
    let data = await getData('characters');
    data.slice(startIndex, endIndex).map((e) => {
            createTableData(e);
        });
    data.length > itemsPage ? addPagination() : console.log(data.length);
    document.querySelector('.current-page').innerHTML = currentpage;
    openloading('none');
    }
    catch (error){
        console.log(error);
        toasterMessage("Something went wrong","danger");
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
let logoutBuuton = document.querySelector('.logout');
// logout.addEventListener('click', logoutPopup());

function createLogoutPopup(){
    let body = document.querySelector('.logout-popup');
    let popupDiv = document.createElement("div");
    // console.log(body);
    popupDiv.className = "popup";
    popupDiv.id = "popup";

    // Add the popup content
    popupDiv.innerHTML = `
        <div class="popup-content">
            <h4 class="text-center">Are you sure, you want to logout?</h4> 
            <button class="btn btn-primary popup-btn" onclick=logout()>Yes</button>
            <button class="btn btn-primary popup-btn" onclick="closePopup()">No</button>
        </div>
    `;

    // Append the popup div to the body
    document.body.appendChild(popupDiv);

    // Show the popup
    openPopup();
}

function toasterMessage(message,bg) {
    let toaster = document.querySelector('.toaster');
    let toast = document.createElement('div');
    toast.classList.add('toast', 'align-items-center', `text-bg-${bg}`, 'border-0');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    toaster.appendChild(toast);

    let bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

function openPopup() {
    document.querySelector(".popup").style.display = "block";
    document.querySelector(".table-outline").style.pointerEvents = "none";
    document.querySelector(".main").style.pointerEvents = "none";
    // document.querySelector('.overlay').style.display = 'flex';
}

function closePopup() {
    document.querySelector(".popup").style.display = "none";
    document.querySelector(".table-outline").style.pointerEvents = "auto";
    document.querySelector(".main").style.pointerEvents = "auto";
    // document.querySelector('.overlay').style.display = 'none';
}

function logout(){
    openloading('block');
    setTimeout(() =>  {
        window.location.href = '../../index.html'
    },2000);
    setTimeout(() =>  {
        toasterMessage('Successfully logged out','primary');
    },1500);
    setTimeout(() =>  {
        openloading('none');
    },2000);
}