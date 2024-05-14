// PUNTATORI GENERALI E URL
//----------------------------------
//Riferimenti andpoint prodotti
const URL_PRODUCTS_ENDPOINT = "https://striveschool-api.herokuapp.com/api/product/";
const KEY_PRODUCTS_ENDPOINT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNlNGI1OTcyYjNlYTAwMTU3MWZkNDQiLCJpYXQiOjE3MTUzNTg1NTMsImV4cCI6MTcxNjU2ODE1M30.vdzkWNpeUpxw5g9HITvnlbowagVxXxU6c1sAW-4IiAk"
const workStation = document.querySelector("body main div.row.row-cols-lg-8");
const jsonProducts = [];//contenitore copia jason della chiamata generale dei prodotti
var productsFavourite = [];//futuro array di oggetti
var totalTrolley = [];//futuro array di prezzi
//FINE DATI GENERALI...............
//funzione richiesta fetchGET..................................................
async function requestFetchGet(URL_FETCH, KEY_FETCH) {//la funzione fetchGET prende come parametri URL e KEY
    try {
        const response = await fetch(`${URL_FETCH}`,{
            headers: {
            "Authorization": `${KEY_FETCH}`
             }
            });
        if (!response.ok) {//se la risposta del server ha problemi
            throw new Error("Errore di rete: " + response.statusText);//butto giù l'errore
        }      
        const data = await response.json();//converto la risp in JSON
        console.log("Dati ricevuti: ", data);//me la vedo in log
        return data;//la ritorno 
    } catch (error) {
        console.error("Errore:", error);
        return [];
    }
}
///////////////////////////////////////////////////////////////////////////
//funzione rendeiring Dom...................................................
function renderingDom(dataArray, punct) {
    dataArray.forEach(prodotto => {
        punct.innerHTML +=
            `
            <div class="card card_custum position-relative" style="width: 15rem; height: 28rem">
                <a href="/dettagli.html?id=${prodotto._id}">
                <img style="height: 18rem;" src="${prodotto.imageUrl}" class="card-img-top" alt="${prodotto.name}">
                </a>
                <a href="#" class="btn btn-primary add_carrello">Aggiungi al carrello</a>
                <a href="#" class="btn btn-primary preferiti"><i class="bi bi-heart-fill"></i></a>
                <div class="card-body">
                    <h5 class="card-title">${prodotto.name}</h5>
                    <p class="card-text">Prezzo:${prodotto.price}€</p>
                </div>
            </div>
        `;
    });
     // Ricollega gli event listener
}



//////////////////////////////////////////////////////////////////////////
// funzione per convertire num da stringa.....
function estrainumbersDaStringa(str) {  
    const numbers = str.match(/\d+(\.\d+)?/g);//per trovare numbers interi e decimali
    return numbers ? numbers.map(Number) : [];//numbers effettivi o stringa vuota
}
//////////////////////////////////////////////////////////////////////////
// funzione per attivare effetto quando punto card.....
function startHover(event) {
    //titolo
    const title = event.currentTarget.querySelector('.card-title');
    if (title) {
        title.classList.add('hoverClass');
    }
    //bottone aggiungi al carrello
    const favor = event.currentTarget.querySelector('.preferiti');
    if (favor) {
        favor.classList.add('hoverClass');
    }
    //bottone aggiungi al carrello
    const addToShops = event.currentTarget.querySelector('.add_carrello');
    if (addToShops) {
        addToShops.classList.add('hoverClass');
    }
}
//////////////////////////////////////////////////////////////////////////
// Funzione per finire effetto quando esco dalla card....
function stopHover(event) {
    const title = event.currentTarget.querySelector('.card-title');
    // console.log(title);
    if (title) {
        title.classList.remove('hoverClass');
    }
    //rimuovi bottone aggiungi al carrello
    const favor = event.currentTarget.querySelector('.preferiti');
    if (favor) {
        favor.classList.remove('hoverClass');
    }
    //rimuovi bottone aggiungi al carrello
    const addToShops = event.currentTarget.querySelector('.add_carrello');
    if (addToShops) {
        addToShops.classList.remove('hoverClass');
    }
}
//////////////////////////////////////////////////////////////////////////
// Funzione per funzionalità aggiungi a preferiti e contatore....
function addFavour(addressPunct) {
    const punct = addressPunct;
    punct.classList.add("d-none");//1)nascondo la carta
    productsFavourite.push(punct);//2)pusho nella variabile globale i preferiti
    const punctCounterFavour = document.getElementById("contatore_articoli_preferiti");//punta a <SPAN> con 0
    const dropdownFavour = document.getElementById("dropdown_preferiti")//punta a <UL>
    punctCounterFavour.textContent = `${productsFavourite.length}`;//imposto il numero di preferiti come lunghe
    addToDropdownFavour(dropdownFavour, productsFavourite[productsFavourite.length-1]);//passo ul e oggetto dom carta ultima di arraay salvato
    // console.log(productsFavourite[productsFavourite.length-1]);
}
//////////////////////////////////////////////////////////////////////////
// Funzione per funzionalità aggiungi al carrello e contatore....
function addToTrolley(punctCard) {
    const price = estrainumbersDaStringa(punctCard.lastElementChild.lastElementChild.textContent);//prendo il prezzo del item
    totalTrolley.push( parseFloat(price));
    const dropdownFavour = document.getElementById("dropdown_carrello")//punta a <UL>
    const name = punctCard.querySelector("div h5").textContent;//titolo 
    let totalCost = totalTrolley.reduce((accumulator, currentValor)=> accumulator + currentValor );
    // div=>div(last)=>p(last)
    const punctTrolley = document.getElementById("contatore_articoli_carrello");//punto il contatore di articoli
    punctTrolley.textContent = `${totalTrolley.length}`;
    const textTotal = punctTrolley.parentElement.parentElement.lastChild;//puntatole costo totale
    textTotal.textContent = `${totalCost.toFixed(2)}€`;
    addToDropdownTrolley(dropdownFavour, name, textTotal);
    //  console.log(price);
}
//////////////////////////////////////////////////////////////////////////
// Funzione di RESET TOTALE.........
 function pulisci() {
    // Resetta i carrelli e i preferiti
    totalTrolley = [];
    productsFavourite = [];

    // Pulisce il DOM
    workStation.innerHTML = '';

    // ritampo tutto
    renderingDom(jsonProducts, workStation);

    // Resetta i contatori
    document.getElementById("contatore_articoli_carrello").textContent = "0";
    document.getElementById("contatore_articoli_carrello").parentElement.parentElement.lastChild.textContent = "0,00€";
    document.getElementById("contatore_articoli_preferiti").textContent = "0";
    document.getElementById("dropdown_carrello").innerHTML = "";
    const dropdownFavour = document.getElementById("dropdown_preferiti");//punta a <UL>
    dropdownFavour.innerHTML = "";
    // RIcollega i listener
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', startHover);
        card.addEventListener('mouseleave', stopHover);
        card.childNodes[5].addEventListener('click', function(event) {
            event.preventDefault();//perchè mi tornava in cima al click
            addFavour(card.childNodes[5].parentElement);
        });
        card.childNodes[3].addEventListener('click', function(event) {
            event.preventDefault();//perchè mi tornava in cima al click
            addToTrolley(card.childNodes[3].parentElement);
        });
    });
}
//////////////////////////////////////////////////////////////////////////
// Funzione di ricerca lettera x lettera.........
function search( string ) {
     // Pulisce il DOM
     workStation.innerHTML = '';
     jsonProducts.forEach(item => {
        if( item.title.toLowerCase().includes( string.toLowerCase() ) ){
            workStation.innerHTML += 
            `
                <div class="card card_custum position-relative" style="width: 15rem; height: 28rem">
                    <img style="height: 18rem;" src="${item.imageUrl}" class="card-img-top" alt="${item.title}">
                    <a href="#" class="btn btn-primary add_carrello">Aggiungi al carrello</a>
                    <a href="#" class="btn btn-primary preferiti"><i class="bi bi-heart-fill"></i></a>
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">Prezzo:${item.price}€</p>
                    </div>
                </div>
            `;
            // RIcollega i listener
                const cards = document.querySelectorAll('.card');
                cards.forEach(card => {
                    card.addEventListener('mouseenter', startHover);
                    card.addEventListener('mouseleave', stopHover);
                    card.childNodes[5].addEventListener('click', function(event) {
                        event.preventDefault();//perchè mi tornava in cima al click
                        addFavour(card.childNodes[5].parentElement);
                    });
                    card.childNodes[3].addEventListener('click', function(event) {
                        event.preventDefault();//perchè mi tornava in cima al click
                        addToTrolley(card.childNodes[3].parentElement);
                    });
                });
        } 
     });
     
}
//////////////////////////////////////////////////////////////////////////
// Funzione per aggiungere al dropdown dei preferiti.........
function addToDropdownFavour(dropUl, item) {//li ho messi in costanti perchè mi sembrava più pulito
    const src = item.querySelector("img").getAttribute('src');
    const alt = item.querySelector("div h5").textContent;
    const title = alt;

    const listItem = document.createElement("li");//creo un <li>
    listItem.classList.add("d-flex", "flex-nowrap");
    listItem.innerHTML = `
        <img src="${src}" alt="${alt}">
        <span>${title}</span>
        <i class="bi bi-trash3-fill drop_i"></i>
    `;//ci inserisco il codice che ho creato al click sul cuore

    dropUl.appendChild(listItem);//lo inserisco nel dom

    const deleteButton = listItem.querySelector(".drop_i");//punto il bottone delete
    deleteButton.addEventListener("click", function () {
        const indexToDelete = Array.from(dropUl.children).indexOf(listItem);//converto l'HTMLCollection in arrey e
        // mi prendo l'indice (con indexOf) dell'elemento che voglio inveare a delete item per l'eliminazione
        deleteItem(listItem, indexToDelete, 1);
    });
}
//////////////////////////////////////////////////////////////////////////
// Funzione per aggiungere al dropdown del carrello.........
function addToDropdownTrolley(dropUl, itemName, textTotal) {
    let indexPrice = totalTrolley.length - 1;

    const listItem = document.createElement("li");
    listItem.classList.add("d-flex", "flex-nowrap");
    listItem.innerHTML = `
        <i class="bi bi-trash3-fill drop_i"></i>
        <span>${itemName}</span>
        <span>${totalTrolley[indexPrice]}€</span>
    `;

    dropUl.appendChild(listItem);

    const deleteButton = listItem.querySelector(".drop_i");
    deleteButton.addEventListener("click", function () {
        const indexToDelete = Array.from(dropUl.children).indexOf(listItem);
        deleteItem(listItem, indexToDelete, 2);
        const punctTrolley = document.getElementById("contatore_articoli_carrello");
        punctTrolley.textContent = `${totalTrolley.length}`;
        let price = totalTrolley.length > 0 ? totalTrolley.reduce((accumulator, currentValor) => accumulator + currentValor) : 0;
        textTotal.textContent = `${price.toFixed(2)}€`;
    });
}
//////////////////////////////////////////////////////////////////////////
// Funzione per eliminare dal carrello articolo singolo nel dropdown.........
function deleteItem(addressToDelete, indexToDelete, flag) {//il flag indica la funzione
    addressToDelete.remove(); // Rimuove l'elemento visivo dal DOM
    if (flag === 1) {
        productsFavourite.splice(indexToDelete, 1); // Rimuove l'elemento dentro l'array dei preferiti
        const punctCounterFavour = document.getElementById("contatore_articoli_preferiti");
        punctCounterFavour.textContent = `${productsFavourite.length}`;
    } else if (flag === 2) {
        totalTrolley.splice(indexToDelete, 1); // Rimuove l'elemento dall'array del carrello
        const punctTrolley = document.getElementById("contatore_articoli_carrello");
        punctTrolley.textContent = `${totalTrolley.length}`;
    }
}
//........................................................................................................................................................
//--------PASSAGGI ESECUZIONE PROGAMMA --------//
document.addEventListener("DOMContentLoaded", async function() {
    try {
            const data = await requestFetchGet(URL_PRODUCTS_ENDPOINT, KEY_PRODUCTS_ENDPOINT);
            jsonProducts.push(...data);
            await renderingDom(jsonProducts, workStation);
            const cards = document.querySelectorAll('.card');
            await cards.forEach(card => {
                card.addEventListener('mouseenter', startHover);
                card.addEventListener('mouseleave', stopHover);
                card.childNodes[5].addEventListener('click', function(event){//BOTTONE PREFERITI
                    event.preventDefault();//perchè mi tornava in cima al click
                    addFavour(card.childNodes[5].parentElement)//se non la mettevo dentro una funzione anonima(function(event)) non funzionava
                })//aggiungo l'ascoltatore al bottone e nella funzione come parametro l'indirizzo del padre (cioè la carta)
                card.childNodes[3].addEventListener('click', function(event){//BOTTONE AGGIUNGI AL CARRELLO
                    event.preventDefault();//perchè mi tornava in cima al click
                    addToTrolley(card.childNodes[3].parentElement);
                })
            });
            //puntatore e funzione a icona pulisci..............
            const punctClean = document.getElementById("pulisci");
            punctClean.addEventListener("click", function(){
                pulisci();//chiamata
            })
            /////////////////////////////////////////////////////
            //puntatore e funzione a barra di ricerca..............
            const punctSearchBar = document.getElementById("barra_ricerca");
            punctSearchBar.addEventListener("input", function(){
                const string = punctSearchBar.value;
                search(string);//chiamata
            })
    } 
    catch (error) {
        console.error("Errore:", error);
    } 
    
});


const navbarHeight = document.querySelector('#nav_mother').offsetHeight;//offsetHeight è l'altezza della navbar
const navbar = document.querySelector('#nav_mother');

function handleScroll() {
    if (window.scrollY > navbarHeight) {//quando lo scroll e maggiore dell'altezza della navbar
        navbar.classList.add('position-fixed'); 
        navbar.style.minHeight = "0rem";
        navbar.style.maxHeight = "5rem";
        navbar.style.backgroundColor = "white";
        navbar.style.borderBottom = "1px solid #DEE2E6";
    } else {
        navbar.classList.remove('position-fixed'); // Rimuovi la classe quando scrollY è inferiore all'altezza della navbar
        navbar.style.minHeight = "10rem";
        navbar.style.maxHeight = "10rem";
        navbar.style.borderBottom = "0px ";
    }
}

// Ascolta l'evento di scorrimento
window.addEventListener('scroll', handleScroll);//evento collegato alla finestra(window)e all'evento dello scroll