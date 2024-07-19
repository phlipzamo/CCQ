// Firebase UI Auth

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    // Other config options...
});  





const auth = firebase.auth();

const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const signOutButton = document.getElementById('signOutButton');

const provider = new firebase.auth.GoogleAuthProvider();

// loginButton.onclick = () => auth.signInWithRedirect(provider);
// registerButton.onclick = () => auth.signInWithPopup(provider);

signOutButton.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        // signed in
        window.location.href = "https://cosmiccodequest.org/home.html";
    } else {
        // not signed in
        window.location.href = "https://cosmiccodequest.org/index.html";
    }
});