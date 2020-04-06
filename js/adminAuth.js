// Funcion para regirar a un nuevo usuario
async function createAdminUser() {
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
        await firebase.database().ref('covid19Platform/users/adminUsers/' + userID + '/').set({
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
            location.href="./adminLogin.html";
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
// Funcion para regirar a un nuevo usuario
