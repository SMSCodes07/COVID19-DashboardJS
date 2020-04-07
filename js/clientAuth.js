// Funcion para iniciar la sesion de un usuario
async function loginUser() {
    //Extrayendo datos del formulario
    const userEmail = document.getElementById('userEmail').value;
    const userPassword = document.getElementById('userPassword').value;
    //Extrayendo datos del formulario
    // Iniciando la sesion del usuario
    await firebase.auth().signInWithEmailAndPassword(userEmail, userPassword)
    // Iniciando la sesion del usuario
    // En caso de un login exitoso, se ejecutara este codigo
    .then(() => {
        // Extrayendo displayName
        const displayName = firebase.auth().currentUser.displayName;
        // Extrayendo displayName
        // Redireccionando al usuario
        alert('Bienvenid@ ' + displayName);
        location.href="../../components/adminDashboard.html"; 
        // Redireccionando al usuario
    })
    // En caso de un login exitoso, se ejecutara este codigo
    // En caso de un error, se ejecutara el siguente bloque de codigo
    .catch((error) => {
        const errorCodes = error.code;
        switch (errorCodes) {
            case 'auth/invalid-email':
              alert('La direccón de correo introducida es invalida');
              break;
            case 'auth/user-disabled':
              alert('Estimado usuario, la cuenta vinculada a la dirección de correo introducida ha sido inhabilitada');
              break;
            case 'auth/user-not-found':
              alert('No existe cuenta alguna vinculada a la dirección de correo introducida');
              break;
            case 'auth/wrong-password':
              alert('Contraseña incorrecta');
              break;
          }
    });
    // En caso de un error, se ejecutara el siguente bloque de codigo
}
// Funcion para iniciar la sesion de un usuario
// Funcion para recueprar la contraseña del usuario
function sendPasswordLink() {
    const emailToRecover = prompt('Introduzca la dirección de correo electrónico vinculada a su cuenta, y enviaremos un enlace de recuperación');
    firebase.auth().sendPasswordResetEmail(emailToRecover);
}
// Funcion para recueprar la contraseña del usuario