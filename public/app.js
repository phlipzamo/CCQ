const auth = firebase.auth();

const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const signOutButton = document.getElementById('signOutButton');


signOutButton.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        // window.location.href = "https://cosmiccodequest.org/home.html";
    } else {
        // not signed in
        // window.location.href = "https://cosmiccodequest.org/index.html";
    }
});