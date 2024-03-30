const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")
const userContainer=document.querySelector(".weather-container")
const grantAccess=document.querySelector(".grant-location-container")
const searchForm=document.querySelector("[data-serachForm")
const loadingScreen=document.querySelector(".loading-container")
const userInfoContainer=document.querySelector(".user-weather-info")
const error=document.querySelector(".error")

let oldTab=userTab;
const API_KEY="46da06fe58366473edee4a97f7f1aa3b"
oldTab.classList.add("current-tab")

getfromSessionStorage()

function switchTab(newTab){
  searchInput.value=""
  error.classList.remove("active")
  if(oldTab != newTab){
    oldTab.classList.remove("current-tab")
    oldTab=newTab
    oldTab.classList.add("current-tab")
  
    if(!searchForm.classList.contains("active")){
      userInfoContainer.classList.remove("active")
      grantAccess.classList.remove("active")
      searchForm.classList.add("active")
    }
    else{
      searchForm.classList.remove("active")
      userInfoContainer.classList.remove("active")
      getfromSessionStorage();
    }
}}

function getfromSessionStorage(){
  const localCordinates=sessionStorage.getItem("user-cordinates")
  console.log(localCordinates)
  if(!localCordinates){
    grantAccess.classList.add("active")
  }
  else{
    const cordinates=JSON.parse(localCordinates)
    fetchUserWeatherInfo(cordinates);
  }
}

async function fetchUserWeatherInfo(cordinates){
    const {lat , long}=cordinates
    grantAccess.classList.remove("active")
    loadingScreen.classList.add("active")

    try{
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
      );
    const  data = await response.json();
    console.log(response)  
        if(!response.ok){
          throw new error("Netwrok Response Was Not OK")
        }
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    }
    catch(err){
      loadingScreen.classList.remove("active")
      error.classList.add("active")
    }
}

function renderWeatherInfo(data){
    const cityName=document.querySelector("[data-cityName]")
    const countryIcon=document.querySelector("[data-countryIcon]")
    const desc=document.querySelector("[data-weatherIcon]")
    const weatherICon=document.querySelector("[data-weatherIcon]")
    const temp=document.querySelector("[data-temp]")
    const windSpeed=document.querySelector("[data-windSpeed]")
    const humidity=document.querySelector("[data-humidity]")
    const clouds=document.querySelector("[data-cloudiness]")

    cityName.innerText=data?.name
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText=data?.weather?.[0]?.description
    weatherICon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText=`${data?.main?.temp}°C`
    windSpeed.innerText=`${data?.wind?.speed}m/s`
    humidity.innerText=`${data?.main?.humidity}%`
    clouds.innerText=`${data?.clouds?.all}%`    
  }

userTab.addEventListener("click", (obj)=>{
  switchTab(userTab)
})

searchTab.addEventListener("click", (obj)=>{
  switchTab(searchTab)
})

function getGeoLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition)
  }
  else{

  }
}
function showPosition(position){
  const userCordinates={
    lat:position.coords.latitude,
    long:position.coords.longitude
  }
  sessionStorage.setItem("user-cordinates",JSON.stringify(userCordinates))
  fetchUserWeatherInfo(userCordinates)
}

const grantAccessbtn=document.querySelector("[data-grantAccess]")

grantAccessbtn.addEventListener("click",(obj)=>{
  getGeoLocation()
})


let searchInput=document.querySelector("[data-searchInput]")

searchForm.addEventListener("submit",(obj)=>{
  error.classList.remove("active")
  obj.preventDefault()
  let cityName=searchInput.value
  if(searchInput===""){
    return
  }
  else{
    fetchSearchWeatherInfo(cityName)
  }
})

async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active")
  userInfoContainer.classList.remove("active")
  grantAccess.classList.remove("active")
  
  try{
    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)   
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data=await response.json();
    loadingScreen.classList.remove("active")
    userInfoContainer.classList.add ("active")
    renderWeatherInfo(data)

  }
  catch(e){
    console.log("uo")
    loadingScreen.classList.remove("active")
    error.classList.add("active")
  }
}   
