// PUNTATORI GENERALI E URL
//----------------------------------
//-->1)Riferimenti andpoint prodotti
const URL_PRODUCTS_ANDPOINT = "https://striveschool-api.herokuapp.com/api/product/";
const KEY_PRODUCTS_ANDPOINT = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjNlNGI1OTcyYjNlYTAwMTU3MWZkNDQiLCJpYXQiOjE3MTUzNTg1NTMsImV4cCI6MTcxNjU2ODE1M30.vdzkWNpeUpxw5g9HITvnlbowagVxXxU6c1sAW-4IiAk"
const workStation = document.querySelector("body main div.row.row-cols-lg-8");
const jsonProducts = [];//contenitore copia jason della chiamata generale dei prodotti
var libriPreferiti = [];//futuro array di oggetti
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
function renderingDom( dataArray, punct ){
    dataArray.forEach( prodotto => {
        punct.innerHTML += 
        `
            <div class="card card_custum position-relative" style="width: 15rem; height: 28rem">
                <a href="/dettagli.html?id=${prodotto.asin}">
                <img style="height: 18rem;" src="${prodotto.img}" class="card-img-top" alt="${prodotto.title}">
                </a>
                <a href="#" class="btn btn-primary add_carrello">Aggiungi al carrello</a>
                <a href="#" class="btn btn-primary preferiti"><i class="bi bi-heart-fill"></i></a>
                <div class="card-body">
                    <h5 class="card-title">${prodotto.title}</h5>
                    <p class="card-text">Prezzo:${prodotto.price}€</p>
                </div>
            </div>
        `;
    });   
}
//////////////////////////////////////////////////////////////////////////
// funzione per convertire num da stringa.....
function estraiNumeriDaStringa(str) {  
    const numeri = str.match(/\d+(\.\d+)?/g);//per trovare numeri interi e decimali
    return numeri ? numeri.map(Number) : [];//numeri effettivi o stringa vuota
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
    libriPreferiti.push(punct);//2)pusho nella variabile globale i preferiti
    const punctCounterFavour = document.getElementById("contatore_articoli_preferiti");//punta a <SPAN> con 0
    const dropdownFavour = document.getElementById("dropdown_preferiti")//punta a <UL>
    punctCounterFavour.textContent = `${libriPreferiti.length}`;//imposto il numero di preferiti come lunghe
    addToDropdownFavour(dropdownFavour, libriPreferiti[libriPreferiti.length-1]);//passo ul e oggetto dom carta ultima di arraay salvato
     console.log(libriPreferiti[libriPreferiti.length-1]);
}
//////////////////////////////////////////////////////////////////////////
// Funzione per funzionalità aggiungi al carrello e contatore....
function addToTrolley(punctCard) {
    const price = estraiNumeriDaStringa(punctCard.lastElementChild.lastElementChild.textContent);//prendo il prezzo del libro
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
    libriPreferiti = [];

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
     jsonProducts.forEach(libro => {
        if( libro.title.toLowerCase().includes( string.toLowerCase() ) ){
            workStation.innerHTML += 
            `
                <div class="card card_custum position-relative" style="width: 15rem; height: 28rem">
                    <img style="height: 18rem;" src="${libro.img}" class="card-img-top" alt="${libro.title}">
                    <a href="#" class="btn btn-primary add_carrello">Aggiungi al carrello</a>
                    <a href="#" class="btn btn-primary preferiti"><i class="bi bi-heart-fill"></i></a>
                    <div class="card-body">
                        <h5 class="card-title">${libro.title}</h5>
                        <p class="card-text">Prezzo:${libro.price}€</p>
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
function addToDropdownFavour( dropUl, libro ) {

    // console.log(dropUl);
    const src = libro.querySelector("img").getAttribute('src');
    const alt = libro.querySelector("div h5").textContent;
    const title = alt;
    // console.log("oggetto:",libro.querySelector("img").getAttribute('src'));
    dropUl.innerHTML += 
    `
        <li class = "d-flex flex-nowrap">
            <img src="${src}" alt="${alt}">
            <span>${title}</span>
            <i class="bi bi-trash3-fill drop_i"></i>
        </li>  
    `
    let indexFavourItem = libriPreferiti.length - 1;//indice del libro preferito corrente
    const deleteButton = document.querySelectorAll(".drop_i");

    deleteButton.forEach(elemento => {
            elemento.addEventListener("click", function(){
            indexFavourItem = libriPreferiti.length - 1;//indice del libro preferito corrente//indice del prezzo corrente aggiunto nell'array globale
             deleteItem( dropUl.lastElementChild, indexFavourItem, 1);
             const punctCounterFavour = document.getElementById("contatore_articoli_preferiti");//punto il contatore di articoli
             punctCounterFavour.textContent = `${libriPreferiti.length}`;
         })
    });
        //    <div class="card card_custum position-relative d-none" style="width: 15rem; height: 28rem">
        //         <img style="height: 18rem;" src="https://images-na.ssl-images-amazon.com/images/I/91xrEMcvmQL.jpg" class="card-img-top" alt="Pandemic (The Extinction Files, Book 1)">
        //         <a href="#" class="btn btn-primary add_carrello">Aggiungi al carrello</a>
        //         <a href="#" class="btn btn-primary preferiti"><i class="bi bi-heart-fill"></i></a>
        //         <div class="card-body">
        //             <h5 class="card-title">Pandemic (The Extinction Files, Book 1)</h5>
        //             <p class="card-text">Prezzo:7.81€</p>
        //         </div>
        //     </div>



}
//////////////////////////////////////////////////////////////////////////
// Funzione per aggiungere al dropdown del carrello.........
 function addToDropdownTrolley( dropUl, bookName, textTotal ) {
    let indexPrice = totalTrolley.length - 1;//indice del prezzo corrente aggiunto nell'array globale
    // console.log(dropUl);
    // console.log("oggetto:",libro.querySelector("img").getAttribute('src'));
    dropUl.innerHTML += 
    `
        <li class = "d-flex flex-nowrap">
            <i class="bi bi-trash3-fill drop_i"></i>
            <span>${bookName}</span>
            <span>${totalTrolley[indexPrice]}€</span>
        </li>  
    `;
    
    const deleteButton = document.querySelectorAll(".drop_i");
    // console.log("bottone",indexPrice, deleteButton);
    deleteButton.forEach(elemento => {
        elemento.addEventListener("click", function(){
            indexPrice = totalTrolley.length - 1;//indice del prezzo corrente aggiunto nell'array globale
             deleteItem( dropUl.lastElementChild, indexPrice, 2);
            const punctTrolley = document.getElementById("contatore_articoli_carrello");//punto il contatore di articoli
            punctTrolley.textContent = `${totalTrolley.length}`;
            let price;
            if( totalTrolley.length > 0){
              price = totalTrolley.reduce((accumulator, currentValor)=> accumulator + currentValor );
            }else{
              price = 0;
            }   
            //  console.log("price",price);
             textTotal.textContent = `${price.toFixed(2)}€`;
         })
    });
    
    
        //    <div class="card card_custum position-relative d-none" style="width: 15rem; height: 28rem">
        //         <img style="height: 18rem;" src="https://images-na.ssl-images-amazon.com/images/I/91xrEMcvmQL.jpg" class="card-img-top" alt="Pandemic (The Extinction Files, Book 1)">
        //         <a href="#" class="btn btn-primary add_carrello">Aggiungi al carrello</a>
        //         <a href="#" class="btn btn-primary preferiti"><i class="bi bi-heart-fill"></i></a>
        //         <div class="card-body">
        //             <h5 class="card-title">Pandemic (The Extinction Files, Book 1)</h5>
        //             <p class="card-text">Prezzo:7.81€</p>
        //         </div>
        //     </div>



}
//////////////////////////////////////////////////////////////////////////
// Funzione per eliminare dal carrello articolo singolo nel dropdown.........
 function deleteItem( addressToDelete, indexToDelete, flag){
    // 1 === preferiti   //   2 === carrello
    addressToDelete.remove(); // Rimuovi l'elemento dal DOM
    if( flag === 1 ){
        libriPreferiti.splice(indexToDelete, 1); // Rimuovi l'elemento dall'array
    }else if ( flag === 2 ){
        totalTrolley.splice(indexToDelete, 1);// Rimuovi l'elemento dall'array
    }
    
   
}
//........................................................................................................................................................
//--------PASSAGGI ESECUZIONE PROGAMMA --------//
document.addEventListener("DOMContentLoaded", async function() {
    try {
            const data = await requestFetchGet(URL_PRODUCTS_ANDPOINT, KEY_PRODUCTS_ANDPOINT);
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
            console.log(punctClean);
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