const API = "https://hp-api.onrender.com/api";
const div = document.querySelector('.cards');
let currentpage = 1;
let itemsPage = 20;
// console.log(div);

async function getData(endpoint){
    try {
        let startIndex = (currentpage - 1) * itemsPage;
        let endIndex = startIndex + itemsPage;
        let res = await fetch(`${API}/${endpoint}`,{
            method : "GET"
        });
        let data = await res.json();
        data.slice(startIndex, endIndex).map((e,i) => {
            createTableData(e, i+1);
        });
        // return d;
    } catch (error) {
        console.log(error);
    }
}
function getRole(data){
    let role ;
    if(data?.hogwartsStudent != false || data?.hogwartsStaff != false){
        if(data.hogwartsStudent){
            role = "Hogwarts Student";
        }
        else{
            role = "Hogwarts Staff";
        }
    }
    else{
        role = "No data";
    }  
    return role;
}

function isAlive(data){
    return data.alive == true ? "True" : "False"
}

function createTableData(ele,i){
    document.querySelector('.table-body').innerHTML += `
        <tr>
            <th scope="row">${i}</th>
            <td>${ele?.name}</td>
            <td>${ele.house != "" ? ele.house : "No Data" }</td>
            <td>${getRole(ele)}</td>
            <td>${isAlive(ele)}</td>
            <td>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="20" 
                fill="#0d6efd" class="bi bi-eye-fill eye-btn" viewBox="0 0 16 16" onclick="createCarousel('${ele.image}','${ele.name}','${ele.house}')">
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
    openCardInCenter();
}
function openCardInCenter() {
    document.querySelector('.overlay').style.display = 'flex';
    document.querySelector('.overlay').style.position = 'fixed';

}

function closeCard() {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.overlay').style.position = 'none';
    // location.reload();
}
getData('characters');