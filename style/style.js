let circle = document.getElementById('circle');

var icon = document.getElementById('icon');
let navlinks= document.getElementById('navlinks');
var ham = document.getElementById('ham');
var w = document.documentElement.clientWidth || window.innerWidth;
var wi = window.outerWidth;

const onMouseMove = (e) =>{
    circle.style.left = e.pageX + 'px';
    circle.style.top = e.pageY + 'px';
  
  }
  document.addEventListener('mousemove', onMouseMove);

icon.onclick=function(){
  document.body.classList.toggle('dark-theme')
  if(document.body.classList.contains('dark-theme')) {
    icon.src='images/sun.png'
    
  } 
  else{
    icon.src='images/moon.png'
  }
}

ham.onclick=function(){
  document.body.classList.toggle('ham')
  if(document.body.classList.contains('ham')) {
    ham.src='images/x.png'
    navlinks.style.display='block'
  } 
  else{
    ham.src='images/hammenu.png'
    navlinks.style.display='none'
  }
}

function splitScroll(){
  console.log('splitscroll')
  if( wi > 861){ 
  const controller = new ScrollMagic.Controller();
   
  new ScrollMagic.Scene({
    duration: '415%',
    triggerElement:'.project-overview',
    triggerHook:0
  })
  .setPin('.project-overview')
  
  .addTo(controller);
}
}
splitScroll();
document.addEventListener('resize',splitScroll );

var balls = document.getElementsByClassName("ball");
document.onmousemove = function(){
  var x = event.clientX * 100 / window.innerWidth + "%";
  var y = event.clientY * 100 / window.innerHeight + "%";
 
  for(var i=0;i<2;i++){
    balls[i].style.left = x;
    balls[i].style.top = y;
    balls[i].style.transform = "translate(-"+x+",-"+y+")";
  }
}

function sendmail(){
  console.log('email send')
  Email.send({
    SecureToken :"556aacbc-2e0c-4e53-8bc0-05cc03447555",
   
    To : 'nelsonfai21@yahoo.com',
    From : document.getElementById('email').value,
    Subject :'New contact form entry -'+ document.getElementById('subject').value,
    Body : document.getElementById('message').value,
}).then(
  message => alert(message)
);

}