const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready =false; /* when total images loaded reach determined level will be assigned true */
let picsLoaded = 0; 
let totalImages = 0;
let photosArray=[];
let isInitialLoad = true;

// unsplash API with initial count to speed up first load
const initialCount = 8;
const apiKey="";
let apiUrl=`https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;


// function to Updata the apiUrl with the new count and pass the count 
    function updateApiUrlWithNewCount(picCount){
    apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${picCount}`;
}

// Check if allimages were loaded / part of the display fotos =>
    function imageLoaded() {
    picsLoaded++;
    if (picsLoaded === totalImages){
        ready = true;
        loader.hidden = true; 
    }
}

    // helper function to set attributeson DOM Elements
        function setAttributes(element, attributes){
        for (const key in attributes){
        element.setAttribute(key,attributes[key]);
     }
    }

// Create ELements for links & fotos, Add to DOM
function displayPhotos(){
  picsLoaded = 0;
    totalImages = photosArray.length;
    console.log('total images',totalImages);

    // Run function for each object in the photosArray
    photosArray.forEach((photo) => {

    // create <a> to link to unsplash
    const item = document.createElement('a');
   
        setAttributes(item, {
        href: photo.links.html,
        target:'_blank',
        })
    // Previously before the setAttribute function we wrote the above like this
        // item.setAttribute('href',photo.links.html);
        // item.setAttribute('target', '_blank');  to start it in a new tab

    // Create <img> for photo
    const img = document.createElement('img');
        setAttributes(img, {
        src: photo.urls.regular,
        alt: photo.alt_description,
        title: photo.alt_description,
    });
    // Previously before the setAttribute function we wrote the above like this
        // img.setAttribute('src',photo.urls.regular);
        // img.setAttribute('alt',photo.alt_description);
        // img.setAttribute('title',photo.alt_description);


    // Event Listener, check when each is finished loading
    img.addEventListener('load', imageLoaded);

    // put<img> inside <a>,then put both inside image container
    item.appendChild(img);
    imageContainer.appendChild(item);

});
}

// get photos from Unsplash API
async function getPhotos() {
     try{
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    if(isInitialLoad){
        updateApiUrlWithNewCount(30);
        // isInitialLoad = false;
    }

    }catch(error){
        // Catch Error Here
         // console.log(error)
    }
}

// check to see if scrolling near bottom of page, Load more photos
window.addEventListener('scroll',() => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight-500 && ready){
       ready = false;
        getPhotos();
    }
});



// on load
getPhotos();