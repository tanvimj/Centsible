document.addEventListener('DOMContentLoaded', () => {
  const startSavingButton = document.getElementById('start-saving-button');
  if (startSavingButton) {
    startSavingButton.addEventListener('click', () => {
      console.log("Redirecting to login/signup...");
      window.location.href = "../LoginSignup/index.html"; 
    });
  }

  const aboutButton = document.getElementById('aboutbtn');
  if (aboutButton) {
    aboutButton.addEventListener('click', () => {
      console.log("Redirecting to About page...");
      window.location.href = "../AboutPage/index.html"; 
    });
  }

  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
      navbar.classList.toggle('show');
    });
  }
});
