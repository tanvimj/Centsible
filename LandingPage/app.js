document.addEventListener('DOMContentLoaded', () => {
  // Button: Start Saving
  const startSavingButton = document.getElementById('start-saving-button');
  if (startSavingButton) {
    startSavingButton.addEventListener('click', () => {
      console.log("Redirecting to login/signup...");
      window.location.href = "../LoginSignup/index.html"; // adjust path if needed
    });
  }

  // Nav item: About
  const aboutButton = document.getElementById('aboutbtn');
  if (aboutButton) {
    aboutButton.addEventListener('click', () => {
      console.log("Redirecting to About page...");
      window.location.href = "../AboutPage/index.html"; // adjust path if needed
    });
  }

  // Hamburger Menu
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
      navbar.classList.toggle('show');
    });
  }
});
