document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const feedback = document.getElementById('feedback');
    feedback.textContent = 'Merci pour votre message ! Nous vous contacterons rapidement.';
    
    this.reset();
  });
  