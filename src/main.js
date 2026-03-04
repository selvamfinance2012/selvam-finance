document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '919600937580';

  // Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');

  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      nav.classList.toggle('active');
    });
  }

  const sendWhatsAppLead = (data, source) => {
    const lines = [
      'New Selvam Finance Lead',
      `Source: ${source}`,
      '',
      data.name ? `Name: ${data.name}` : '',
      data.phone ? `Phone: ${data.phone}` : '',
      data.city ? `City: ${data.city}` : '',
      data.loanType ? `Loan Type: ${data.loanType}` : '',
      data.turnover ? `Monthly Turnover: ₹${data.turnover}` : '',
      data.message ? `Message: ${data.message}` : ''
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    window.open(url, '_blank');
  };

  // Lead Form Submission (Home page)
  const loanForm = document.getElementById('loanForm');
  if (loanForm) {
    loanForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(loanForm);
      const data = Object.fromEntries(formData.entries());

      sendWhatsAppLead(data, 'Homepage Loan Form');
      alert('Thank you, ' + data.name + '! We have opened WhatsApp to share your details with our team.');
      loanForm.reset();
    });
  }

  // Contact Page Form
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      sendWhatsAppLead(data, 'Contact Page');
      contactForm.classList.add('hidden');
      formSuccess.classList.remove('hidden');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Chatbot Logic
  const chatbot = document.getElementById('chatbot');
  const chatTrigger = document.getElementById('chatTrigger');
  const closeChat = document.getElementById('closeChat');
  const chatInput = document.getElementById('chatInput');
  const sendChat = document.getElementById('sendChat');
  const chatBody = document.getElementById('chatBody');

  let chatStep = 0;
  let userData = {
    loanType: '',
    city: '',
    phone: ''
  };

  const steps = [
    { field: 'loanType', question: 'Which city are you from?' },
    { field: 'city', question: 'Please enter your phone number.' },
    { field: 'phone', question: 'Thank you! Our loan advisor will contact you shortly.' }
  ];

  const addMessage = (text, isBot = true) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const toggleChat = () => {
    chatbot.style.display = chatbot.style.display === 'flex' ? 'none' : 'flex';
  };

  if (chatTrigger) chatTrigger.addEventListener('click', toggleChat);
  if (closeChat) closeChat.addEventListener('click', toggleChat);

  const handleChat = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, false);
    chatInput.value = '';

    if (chatStep < steps.length) {
      userData[steps[chatStep].field] = text;

      if (chatStep === steps.length - 1) {
        addMessage(steps[chatStep].question);
        chatInput.disabled = true;
        sendChat.disabled = true;

        sendWhatsAppLead(
          {
            name: 'Chatbot Lead',
            loanType: userData.loanType,
            city: userData.city,
            phone: userData.phone
          },
          'Website Chatbot'
        );
      } else {
        setTimeout(() => {
          addMessage(steps[chatStep].question);
          chatStep++;
        }, 500);
      }
    }
  };

  if (sendChat) sendChat.addEventListener('click', handleChat);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleChat();
    });
  }

  // FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      item.classList.toggle('active');
      
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
    });
  });
});
