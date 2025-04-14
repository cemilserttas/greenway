document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector('.icon');
  
      answer.classList.toggle('show');
      icon.classList.toggle('rotate');
    });
  });