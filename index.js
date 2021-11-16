let mychart={};

document.getElementById("icon2").addEventListener('click',accesstextfield);
function accesstextfield(e){
  if(document.getElementById("city").value){
    weatherbycity(document.getElementById("city").value);
    mychart.destroy();
    showchart(document.getElementById("city").value);
    updateweath();
  }
  else{
    console.log("data not");
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
getcity(position.coords.longitude,position.coords.latitude);
}

function getcity(long,lati){
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
   let data=JSON.parse(this.response);
  let city=data.features[1].place_name.split(",")[0];
  weatherbycity(city); 
    }
  xhttp.open("GET", "https://api.tiles.mapbox.com/v4/geocode/mapbox.places/"+long+","+lati+".json?access_token=pk.eyJ1IjoidWpqYXdhbC0yMSIsImEiOiJja3cxbDFrZGExbjAwMnZxaXJscm9wZ2dpIn0.iwN3NQIP9hjHFhTvz9SevA", true);
  xhttp.send();
}

function weatherbycity(cityinfo){
  const xhttp1 = new XMLHttpRequest();
  xhttp1.onload = function() {
   let data=JSON.parse(this.response);
   let a=document.getElementById("weathmesg");
   let info=data.weather[0].main;
   if(info == "Clear"){
     a.innerHTML="<span><i id='clear' class='fas fa-sun fa-1x'></i> "+info+"</span>";
   }
   else if(info=="Clouds"){
    a.innerHTML="<span><i id='cloud' class='fas fa-cloud fa-1x'></i> "+info+"</span>";
   }
   else {
    a.innerHTML="<span><i id='rain' class='fas fa-cloud-rain fa-1x'></i> "+info+"</span>";
   }
   document.getElementById("tem").textContent=data.main.temp+" "+"C";
   let sunr=new Date(data.sys.sunrise*1000).toString().split(" ");
   let suns=new Date(data.sys.sunset*1000).toString().split(" ");
   document.getElementById("ic").innerHTML=
   "<li class='smicon'><i class='fas fa-sun'> "+sunr[4]+" "+"Am</i></li> <li class='smicon'><i class='far fa-sun'> "+ suns[4] +" Pm</i> </li><li class='smicon'><i class='fas fa-wind'> "+data.wind.speed +" </i></li><li class='smicon'><i class='fas fa-tint'> "+data.main.humidity+" </i></li><li class='smicon'><i class='fas fa-stopwatch'> "+data.main.pressure+" </i></li>";
  document.getElementById("icon3").textContent=data.name+","+data.sys.country;
  showchart(cityinfo);
  updateweath(cityinfo);
    }
  xhttp1.open("GET", "https://api.openweathermap.org/data/2.5/weather?q="+cityinfo+"&units=metric&appid=ce4e145868b3298aaa1b227dd2306420", true);
  xhttp1.send();
}

getLocation();

function showchart(city){
  let arr=[];
  let arr1=[];
  function hourlyforecast(){
    return new Promise((res,rej)=>{
      const xhttp = new XMLHttpRequest();
      xhttp.onload = function() {
       let data=JSON.parse(this.response);
       for(let i=0;i<10;i++){
        let datee=new Date(data.list[i].dt*1000).toString().split(" ");
        arr[i]=datee[4];
        arr1[i]=data.list[i].main.temp;
       }
       let dt={a1:[...arr],a2:[...arr1]};
       res(dt);
        }
      xhttp.open("GET", "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid=ce4e145868b3298aaa1b227dd2306420", true);
      xhttp.send();
    })
  } 
  hourlyforecast().then((ar)=>{
    const chrt=document.getElementById("mychart").getContext('2d');
  mychart=new Chart(chrt,{
    type:"line",
    data:{
      labels:[...ar.a1],
      bordercolor:"red",
      datasets:[
        {
          data:[...ar.a2],
          backgroundColor:'black',
          borderColor:'green',
          color:'red',
          label:"Hourly/Temp",
          borderwidth:10
        }]
    },
    options:{
      responsive:false,
    animation:{
      duration:2000,
      easing:"easeInoutBounce"
    }
    },
  })
  function erase(){
    mychart.destroy();
  }
  });
  }
function updateweath(city){
function dailyweather(){
  return new Promise((res,rej)=>{
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
     let data=JSON.parse(this.response);
    res(data);
      }
    xhttp.open("GET", "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&appid=ce4e145868b3298aaa1b227dd2306420", true);
    xhttp.send();
  })
}
dailyweather().then((res)=>{
  let k=parseInt( new Date( res.list[0].dt*1000).toString().split(" ")[2]);
  let l=parseInt( new Date( res.list[0].dt*1000).toString().split(" ")[2]);
  let y=1;
  let q=1;
  for(let i=0;i<35;i++){
  if(k==parseInt(new Date( res.list[i].dt*1000).toString().split(" ")[2])){
    let dtt="cd"+y;
    let id="weatstatus"+q;
    // console.log(id);
    let weainfo=res.list[i].weather[0].main;
  let dtt1=new Date( res.list[i].dt*1000).toString().split(" ")[0];
   document.getElementById(dtt).innerHTML="<p>"+dtt1+"</p><h2> "+res.list[i].main.temp_min+" - "+res.list[i].main.temp_max+" <h2><span id='weatstatus"+q+"'></span><h1>"+res.list[i].weather[0].main+"</h1>";
    if(weainfo=="Clear"){
       document.getElementById(id).innerHTML="<i id='clear' class='fas fa-sun fa-3x'></i>";
    }
    else if(weainfo=="Clouds"){
      document.getElementById(id).innerHTML="<i id='cloud' class='fas fa-cloud fa-3x'></i>";
    }
    else{
      document.getElementById(id).innerHTML="<i id='rain' class='fas fa-cloud-rain fa-3x'></i> ";
    }
    ++k;++y;++q;
  }
  }
}
);
}
