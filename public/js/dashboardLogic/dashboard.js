//Desplegando funcion
window.onload = getSession();
//Desplegando funcion
// Funcion para resguardar la sesion
function getSession() {
    firebase.auth().onAuthStateChanged((userData) => {
        if (userData) {

        } else {
            alert('Debes estar logueado para acceder a esta parte del sistema');
            location.href="../authentication/provider/adminLogin.html";
        }
    });
}
// Funcion para resguardar la sesion
// Funcion para cerrar la sesion del usuario
async function logOut() {
    await firebase.auth().signOut().then(() => {
        alert('Hasta la próxima');
        location.href="../authentication/provider/adminLogin.html";
    }).catch((error) => {
        alert('Ha ocurrido un error durante el cierre de sesión');
    });
}
// Funcion para cerrar la sesion del usuario
// Funciones para navegar entre las paginas del dashboard

// Funciones para navegar entre las paginas del dashboard