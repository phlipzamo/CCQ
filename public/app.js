// Firebase UI Auth

// var ui = new firebaseui.auth.AuthUI(firebase.auth());

// var uiConfig = {
//     callbacks: {
//       signInSuccessWithAuthResult: function(authResult, redirectUrl) {
//         // User successfully signed in.
//         // Return type determines whether we continue the redirect automatically
//         // or whether we leave that to developer to handle.
//         return true;
//       },
//       uiShown: function() {
//         // The widget is rendered.
//         // Hide the loader.
//         document.getElementById('loader').style.display = 'none';
//       }
//     },
//     // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
//     signInFlow: 'popup',
//     signInSuccessUrl: 'https://www.cosmiccodequest.org/home.html',
//     signInOptions: [
//       // Leave the lines as is for the providers you want to offer your users.
//       firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//       firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     ],
//     // Terms of service url.
//     tosUrl: '<your-tos-url>',
//     // Privacy policy url.
//     privacyPolicyUrl: '<your-privacy-policy-url>'
//   };
  
// ui.start('#firebaseui-auth-container', uiConfig);  



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
        // window.location.href = "https://cosmiccodequest.org/home.html";
    } else {
        // not signed in
        // window.location.href = "https://cosmiccodequest.org/index.html";
    }
});