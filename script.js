const USERAPI = "https://65e33f6388c4088649f58883.mockapi.io/user";
const popupLink = document.querySelector('.signup');
const forgotPassword = document.querySelector('.forgot-password');
let clickedOption;

async function getUser(){
    try {
        let res = await fetch(USERAPI,{
            method : "GET",
        });
        return await res.json();
    } 
    catch (error) {
        console.log("Error",error);
        toasterMessage("Something went wrong","danger");
        return null;
    }
}

async function createUser(payload){
    try {
        let res = await fetch(USERAPI,{
            method : "POST",
            body : JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            }
        });
        return res.status
    } catch (error) {
        toasterMessage("Something went wrong","danger");
        console.log(error);
    }
}

async function editUser(payload,id){
    try {
        let res = await fetch(`${USERAPI}/${id}`,{
            method : "PUT",
            body : JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            }
        });
        return res.status;
    } catch (error) {
        toasterMessage("Something went wrong","danger");
        console.log(error);
    }
}

async function validateUser(userEmail,userPassword){
    try {
        let data = await getUser();
        data.some((e) => e.email === userEmail && e.password === userPassword) ? 
        toasterMessage("Logged in successfully",'primary') : 
        toasterMessage("Invalid userId or password","danger");
        changePage('./main/main.html');
    } catch (error) {
        console.log(error);
        toasterMessage("Something went wrong","danger");
    }
}

function createPopup (title){
    let popupDiv = document.createElement("div");
    popupDiv.className = "popup";
    popupDiv.id = "popup";

    // Add the popup content
    popupDiv.innerHTML = `
        <div class="popup-content">
            <span class="close" onclick="closePopup()">&times;</span>
            <h4>${title}</h4> 
            <div class="form-floating mb-3">
                <input type="email" class="form-control popup-email" id="floatingemail" placeholder="hermoini@hogwards.com">
                <label for="floatingInput">Email address</label>
            </div>
            <div class="form-floating">
              <input type="password" class="form-control popup-password" id="floatingPassword" placeholder="Password">
              <label for="floatingPassword" class="label-password">Password</label>
            </div>
            <button class="btn btn-primary popup-btn" onclick=submit()>${title}</button>
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
    document.querySelector(".overlay").style.display = "block";
}

function closePopup() {
    document.querySelector(".popup").style.display = "none";
    location.reload();
}

popupLink.addEventListener('click', (e) => {
    createPopup("Create User");
    clickedOption = createUser;
    e.preventDefault();
});
forgotPassword.addEventListener('click', (e) => {
    createPopup("Reset password");
    document.querySelector('.label-password').innerHTML = 'New Password';
    clickedOption = editUser;
    e.preventDefault();
});

async function submit(){
    let payload = {
        email : document.querySelector('.popup-email')?.value,
        password : document.querySelector('.popup-password')?.value
    };
    if (clickedOption === createUser){
        try {
            let data = await getUser();
            data.some((e) => e.email === payload.email) ? toasterMessage("Email already exists","danger") : 
            await createUser(payload) === 201 ? toasterMessage("New User Created",'primary') : toasterMessage("Something Went wrong",'danger');
            closePopup();
        }catch (error){
            toasterMessage("Something went wrong","danger");
            console.log(error);
        }
    }
    else{
        try {
            let data = await getUser();
            let id;
            data.some((e) => e.email === payload.email ? id = e.id : id = 0) ? 
            await editUser(payload,id) === 200 ? toasterMessage("Password changed successfully",'primary')
            : toasterMessage("Something Went wrong",'danger') 
            : toasterMessage("Email not yet registered","danger");
            closePopup();
            
        }catch (error){
            toasterMessage("Something went wrong","danger");
            console.log(error);
        }
    }
}

document.querySelector('.logIn').addEventListener('submit',(e) => {
    e.preventDefault();
    const email = e.target.querySelector('.email')?.value;
    const password = e.target.querySelector('.password')?.value;
    validateUser(email, password);
});

function changePage(pageurl){
    window.location.href = pageurl;
}