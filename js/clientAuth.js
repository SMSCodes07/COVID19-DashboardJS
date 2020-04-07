// Funcion para registrar a un nuevo usuario
async function createUser() {
    //Extrayendo datos del formulario
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userPassword = document.getElementById('userPassword').value;
    const userDescription = document.getElementById('userDescription').value;
    //Extrayendo datos del formulario
    // Creando usuario en el sistema
    await firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
    // Creando usuario en el sistema
    // En caso de un registro exitoso se ejecutara este bloque de codigo
    .then(async () => {
        // Actualizando objeto del usuario
        firebase.auth().onAuthStateChanged((userData) => {
            userData.updateProfile({
                displayName: userName,
            });
        });
        // Actualizando objeto del usuario
        // Extrayendo el userID
        const userID = firebase.auth().currentUser.uid;
        // Extrayendo el userID
        // Extrayendo datos de la fecha
        const dateInfo = new Date();
        const regDate = (dateInfo.getDate() + '/' + (dateInfo.getMonth() + 1) + '/' + dateInfo.getFullYear());
        // Extrayendo datos de la fecha
        await firebase.database().ref('covid19Platform/users/users/' + userID + '/').set({
            userName: userName,
            userEmail: userEmail,
            userID: userID,
            userDescription: userDescription,
            userRegisterDate: regDate,
        })
        // Avisando al usuario
        .then(() => {
            firebase.auth().currentUser.sendEmailVerification();
            alert('Usuario creado exitosamente');
            location.href="./register.html";
        });
        // Avisando al usuario
    })
    // En caso de un registro exitoso se ejecutara este bloque de codigo
    // En caso de problemas durante el registro, se ejecutara este bloque de codigo
    .catch((error) => {
        const errorCodes = error.code;
        switch(errorCodes) {
            case 'auth/invalid-email':
              alert('Dirección de correo invalida')
              break;
            case 'auth/email-already-in-use':
              alert('La direccion de correo especificada esta vinculada a otra cuenta');
              break;
            case 'auth/operation-not-allowed':
              alert('La operacion de registro ha sido deshabilitada')
              break;
            case 'auth/weak-password':
              alert('Contraseña débil')
              break;
        }
    });
    // En caso de problemas durante el registro, se ejecutara este bloque de codigo
}
// Funcion para registrar a un nuevo usuario
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