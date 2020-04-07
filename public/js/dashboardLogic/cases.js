//Desplegando funcion
window.onload = getSession(); getCountries(); getCases();
//Desplegando funcion
// Funcion para crear elementos en el DOM
function createDOMElements(itemToCreate) {
    const elementToCreate = document.createElement(itemToCreate);
    return elementToCreate;
}
// Funcion para crear elementos en el DOM
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
// Funcion para obtener los paises
async function getCountries() {
    await firebase.database().ref('covid19Platform/platformBasicData/countries/').once('value').then((returnedData) => {
        const countriesList = Object.values(returnedData.val());
        // Creando referencia a los elementos del DOM
        const countrySelector = document.getElementById('patientCountry');
        // Creando referencia a los elementos del DOM
        for (let index = 0; index < countriesList.length; index++) {
            const specificCountry = countriesList[index];
            // Creando opciones para el select de los paises
            const countryOption = createDOMElements('option');
            countryOption.setAttribute('value', specificCountry.countrySystemCode);
            countryOption.innerHTML = specificCountry.countryName;
            // Creando opciones para el select de los paises
            countrySelector.appendChild(countryOption);
        }
    })
}
// Funcion para obtener los paises
// Funcion para obtener las ciudades de un pais especifico
async function getCities() {
    // Creando referencia a los elementos del DOM
    const countryCode = document.getElementById('patientCountry').value;
    // Creando referencia a los elementos del DOM
    // Consumiendo datos desde la base de datos
    await firebase.database().ref('covid19Platform/platformBasicData/countries/' + countryCode + '/countryStates/').once('value').then((returnedData) => {
        // Creando referencia a los elementos del DOM
        const citySelector = document.getElementById('patientCity');
        // Creando referencia a los elementos del DOM
        const provincesList = Object.values(returnedData.val());
        for (let index = 0; index < provincesList.length; index++) {
            const specificProvince = provincesList[index];
            // Creando opciones para el select de los paises
            const cityOption = createDOMElements('option');
            cityOption.setAttribute('value', specificProvince);
            cityOption.innerHTML = specificProvince;
            // Creando opciones para el select de los paises
            citySelector.appendChild(cityOption);
        }
    })
    await firebase.database().ref('covid19Platform/platformBasicData/countries/' + countryCode + '/').once('value').then((returnedData) => {
        localStorage.setItem('countryName', JSON.stringify(returnedData.val().countryName));
    });
    // Consumiendo datos desde la base de datos
    // Ejecutando funcion de validacion de datos
    if (countryCode == '1586114730204' ) {
        idValidation();
    } else {

    }
    // Ejecutando funcion de validacion de datos
}
// Funcion para obtener las ciudades de un pais especifico
// Funcion para ejecutar la validacion de la cedula en caso de ser dominicano
function idValidation() {
    // Creando referencia a un elemento del DOM
    let patientID = document.getElementById('patientID');
    // Creando referencia a un elemento del DOM
    // Creando escucha de eventos
    patientID.addEventListener("keydown", (DOMData) => {
        const idLength = Array.from(DOMData.target.value);
        if (idLength.length == 10 ) {
            setTimeout(async () => {
                const idCode = DOMData.target.value;
                const urlAPIAccess = "http://173.249.49.169:88/api/test/consulta/" + idCode;
                const idResponse = await fetch(urlAPIAccess);
                const finalData = await idResponse.json();
                // Indicando la validacion
                patientID.setAttribute('class', 'form-control is-valid');
                localStorage.setItem('userIdResponse', JSON.stringify(finalData));                
                // Indicando la validacion
            }, 500);
        }
    });
    // Creando escucha de eventos
}
// Funcion para ejecutar la validacion de la cedula en caso de ser dominicano
// Funcion para crear registro del caso en la base de datos
async function createCase() {
    // Extrayendo datos del localStorage
    const idDataObject = JSON.parse(localStorage.getItem('userIdResponse'));
    const countryName = JSON.parse(localStorage.getItem('countryName'));
    // Extrayendo datos del localStorage
    // Extrayendo datos del formulario
    const patientName = document.getElementById('patientName').value;
    const patientLastname = document.getElementById('patientLastname').value;
    const patientCity = document.getElementById('patientCity').value;
    const caseDate = document.getElementById('caseDate').value;
    const patientID = document.getElementById('patientID').value;
    const bonrDate = document.getElementById('bornDate').value;
    const caseLatitude = document.getElementById('caseLatitude').value;
    const caseLongitude = document.getElementById('caseLongitude').value;
    // Extrayendo datos del formulario
    let casePicture;
    let bornDate;
    let userElectoralID;
    let userCityx;
    // Extrayendo codigo para el caso
    const caseCode = Date.now();
    // Extrayendo codigo para el caso
    if (countryName == 'República Dominicana') {
        casePicture = idDataObject.Foto;
        bornDate = idDataObject.FechaNacimiento;
        userElectoralID = idDataObject.Cedula;
        userCityx = patientCity;
    } else {
        casePicture = '../../src/img/noProfile.png';
        bornDate = bonrDate;
        userElectoralID = patientID;
        userCityx = 'eso'
    }
    // Creando registro en la base de datos
    await firebase.database().ref('covid19Platform/cases/' + caseCode + '/').set({
        caseName: patientName,
        caseLastname: patientLastname,
        caseCountry: countryName,
        caseCity: userCityx ,
        caseDate: caseDate,
        caseLatitude: caseLatitude,
        caseLongitude: caseLongitude,
        caseCode: caseCode,
        casePatieneBornDate: bornDate,
        caseProfilePicture: casePicture,
        casePatientID: userElectoralID,
    })
    // Creando registro en la base de datos
    // Avisando al administrador
    .then(() => {
        const telegramMessage = 'Esperamos que todos esten bien, hemos agregado un nuevo caso, y a continuación les dejaremos saber las informaciones de lugar. Ocurrio en ' + patientCity + ', ' + countryName + ', el dia ' + caseDate + '. Por favor les rogamos mantener los niveles de higiene y distanciamiento social.'; 
        const telegramAPI = 'https://api.telegram.org/bot930913450:AAE58mHoYiMTP2wskmbzqg5-O2yKRqejVDg/sendMessage?chat_id=-320609397&text=' + telegramMessage;
        // Accediendo al DOM
        var listOfCols = document.getElementById("listOfCols");
        // Accediendo al DOM
        // Creando elementos en el DOM
        const telegramLink = createDOMElements('a');
        telegramLink.setAttribute('href', telegramAPI);
        telegramLink.setAttribute('target', 'blank');
        telegramLink.setAttribute('class', 'specialHidden');
        telegramLink.setAttribute('id', 'telegramAPI');
        listOfCols.appendChild(telegramLink);
        // Creando elementos en el DOM
        setTimeout(() => {
            alert('Caso creado exitosamente');
            document.getElementById('telegramAPI').click();
            location.reload();
        }, 750);
    });
    // Avisando al administrador
}
// Funcion para crear registro del caso en la base de datos
// Funcion para listar los casos agregados
async function getCases() {
    // Consumiendo datos desde la base de datos
    await firebase.database().ref('covid19Platform/cases/').once('value').then((returnedData) => {
        let casesList = [];
        casesList = Object.values(returnedData.val());
        // Accediendo al DOM
        var listOfCols = document.getElementById("listOfCols");
        // Accediendo al DOM
        for (let index = 0; index < casesList.length; index++) {
            const element = casesList[index];
            // Creando elementos en el DOM
            // Creando columnas
            var appColumn = createDOMElements("div");
            appColumn.setAttribute("class", "col-10 col-sm-9 col-md-6 col-lg-5 col-xl-3");
            // Creando columnas
            // Creando tarjetas
            var appCard = createDOMElements("div");
            appCard.setAttribute("class", "card mb-4 shadow-sm");
            // Creando tarjetas
            // Creando imagenes
            var appImage = createDOMElements("img");
            appImage.setAttribute("class", "cardImage");
            appImage.setAttribute("src", element.caseProfilePicture);
            // Creando imagenes
            // Creando un cuerpo de tarjeta
            var appCardBody = createDOMElements("div");
            appCardBody.setAttribute("class", "card-body");
            // Creando un cuerpo de tarjeta
            // Creando titulo para la tarjeta
            var appCardTitle = createDOMElements("h6");
            appCardTitle.setAttribute("class", "card-title");
            appCardTitle.innerText = element.caseName + ' ' + element.caseLastname;
            // Creando titulo para la tarjeta
            // Creando listado de informaciones
            var pTag1 = createDOMElements("p");
            pTag1.setAttribute("class", "p-0 m-0");
            pTag1.innerText = 'Cédula: ' + element.casePatientID;
            var pTag2 = createDOMElements("p");
            pTag2.setAttribute("class", "p-0 m-0");
            pTag2.innerText = 'País: ' + element.caseCountry;
            var pTag3 = createDOMElements("p");
            pTag3.setAttribute("class", "p-0 m-0");
            pTag3.innerText = 'Ciudad: ' + element.caseCity;
            // Creando listado de informaciones
            // Creando contenedor para los botones
            var buttonContainer = createDOMElements("div");
            buttonContainer.setAttribute("class", "d-flex justify-content-between align-items-center mt-3");
            // Creando contenedor para los botones
            // Creando grupo para los botones
            var buttonGroup = createDOMElements("div");
            buttonGroup.setAttribute("class", "btn-group");
            // Creando grupo para los botones
            // Creando los botones
            var cardButton2 = createDOMElements("button");
            cardButton2.innerText = "Eliminar";
            cardButton2.setAttribute("class", "btn btn-sm btn-outline-secondary");
            cardButton2.setAttribute("onclick", "deleteCase("+ element.caseCode +")");
            // Creando los botones
            // Creando fecha de registro
            var registerDate = createDOMElements("small");
            registerDate.setAttribute("class", "text-muted");
            registerDate.innerText = element.caseDate;
            // Creando fecha de registro
            // Creando los appendChilds
            appCard.appendChild(appImage);
            appCard.appendChild(appCardBody);
            appCardBody.appendChild(appCardTitle);
            appCardBody.appendChild(pTag2);
            appCardBody.appendChild(pTag3);
            appCardBody.appendChild(pTag1);
            appCardBody.appendChild(buttonContainer);
            buttonContainer.appendChild(buttonGroup);
            buttonGroup.appendChild(cardButton2);
            buttonContainer.appendChild(registerDate);
            appColumn.appendChild(appCard);
            listOfCols.appendChild(appColumn)
            // Creando los appendChilds
            // Creando elementos en el DOM
        }
    });
    // Consumiendo datos desde la base de datos

}
// Funcion para listar los casos agregados
// Funcion para eliminar casos
async function deleteCase(caseCode) {
    console.log(caseCode)
    await firebase.database().ref('covid19Platform/cases/' + caseCode + '/').remove()
    // Notificando al usuario
    .then(() => {
        alert('Caso eliminado exitosamente');
        window.location.reload();
    });
    // Notificando al usuario
}
// Funcion para eliminar casos