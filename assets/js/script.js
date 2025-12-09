const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  revealObserver.observe(element);
});

// Background orbs mouse interaction
const hero = document.querySelector(".hero");
const orbs = document.querySelectorAll(".orb");

if (orbs.length) {
  document.addEventListener("pointermove", (event) => {
    const motionX = (event.clientX / window.innerWidth - 0.5) * 30;
    const motionY = (event.clientY / window.innerHeight - 0.5) * 30;
    orbs.forEach((orb, index) => {
      const intensity = index === 0 ? 1 : -1;
      orb.style.transform = `translate(${motionX * intensity}px, ${motionY * intensity}px)`;
    });
  });
}

const chatbotForm = document.getElementById("chatbotForm");
const chatbotInput = document.getElementById("chatbotInput");
const chatbotMessages = document.getElementById("chatbotMessages");

const scriptedReplies = [
  {
    keywords: ["luxe", "commerce", "boutique"],
    reply:
      "Maison kjbrown Commerce Suite propose des drops interactifs avec paiement express, data client en temps réel et concierge WhatsApp.",
  },
  {
    keywords: ["python", "bot", "ia"],
    reply:
      "Je développe des chatbots Python/FastAPI branchés sur le cerveau de ChatGPT via LangChain et mémoire vectorielle.",
  },
  {
    keywords: ["contact", "whatsapp", "linkedin"],
    reply:
      "Tu peux me joindre sur WhatsApp (+237 693 904 197), LinkedIn ou par mail kaldjobbaptiste03@gmail.com.",
  },
  {
    keywords: ["salut", "hello", "hi", "coucou", "yo"],
    reply: "Salut je suis le chatbot de kjbrown ! Comment puis-je t'aider aujourd'hui ?",
  },
  {
    keywords: ["que ","fais tu ?"],
    reply: "je te parle du portefolio réaliser par kjbrown et de ses compétences.",
  },
  {
    keywords: ["c'est qui ","kaldjob","jean", "baptiste","kjbrown"],
    reply: "C'est un developpeur fullstack avec quelques competence en intelligence Artificielle mais specialisé en cybersécurité, toujours disposé a apprendre, collaboré et partager ces connaissances.",
  },
];

const defaultReply =
  "Je suis le chatbot de kaldjob jean baptiste que voulez vous savoir ?";

const createMessage = (text, type = "bot") => {
  const bubble = document.createElement("div");
  bubble.className = `message ${type}`;
  bubble.textContent = text;
  return bubble;
};

const appendMessage = (text, type) => {
  chatbotMessages.appendChild(createMessage(text, type));
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
};

const resolveReply = (input) => {
  const normalized = input.toLowerCase();
  const scripted = scriptedReplies.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );
  return scripted ? scripted.reply : defaultReply;
};

if (chatbotForm) {
  chatbotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = chatbotInput.value.trim();
    if (!value) return;
    appendMessage(value, "user");
    chatbotInput.value = "";
    setTimeout(() => {
      appendMessage(resolveReply(value), "bot");
    }, 400);
  });
}

window.synapseChatbot = {
  async connect(prompt) {
    const apiKey = window.__OPENAI_KEY__;
    if (!apiKey) {
      console.warn(
        "Définis window.__OPENAI_KEY__ côté serveur pour sécuriser ta clé.",
      );
      return defaultReply;
    }

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: prompt,
        }),
      });

      const data = await response.json();
      return data?.output?.[0]?.content?.[0]?.text ?? defaultReply;
    } catch (error) {
      console.error("Erreur API", error);
      return "Le chatbot est prêt mais la connexion API est sécurisée côté serveur.";
    }
  },
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Page is ready
    initializeModals();
  });
} else {
  // DOM is already ready
  initializeModals();
}

// Initialize modal functionality
function initializeModals() {
  // Add click event listeners to all showcase links
  const showcaseLinks = document.querySelectorAll('[onclick^="openShowcase"]');
  showcaseLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const id = this.getAttribute('onclick').match(/\d+/)[0];
      openShowcase(parseInt(id));
    });
  });
  
  // Add click event listeners to close buttons
  const closeButtons = document.querySelectorAll('.close-showcase');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const id = this.getAttribute('onclick').match(/\d+/)[0];
      closeShowcase(parseInt(id));
    });
  });
  
  // Close modal when clicking outside
  const modals = document.querySelectorAll('.showcase-modal');
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        const id = this.id.replace('showcase', '');
        closeShowcase(parseInt(id));
      }
    });
  });
}

// Showcase modal functions
function openShowcase(id) {
  console.log('Opening showcase:', id);
  const modal = document.getElementById('showcase' + id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize animated background for showcase 2
    if (id === 2) {
      initShowcase2Background();
    }
    
    // Prevent background scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
  } else {
    console.error('Modal not found for ID:', id);
  }
}

function closeShowcase(id) {
  console.log('Closing showcase:', id);
  const modal = document.getElementById('showcase' + id);
  if (modal) {
    modal.classList.remove('active');
    
    // Restore background scrolling
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    
    // Clean up animated background for showcase 2
    if (id === 2) {
      stopShowcase2Background();
    }
  } else {
    console.error('Modal not found for ID:', id);
  }
}

// Animated background for Showcase 2
let showcase2AnimationFrame = null;
let showcase2Particles = [];
let showcase2Mouse = { x: 0, y: 0 };

function initShowcase2Background() {
  const canvas = document.getElementById('bgCanvas2');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Create particles
  showcase2Particles = [];
  const particleCount = 80;
  
  for (let i = 0; i < particleCount; i++) {
    showcase2Particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: i % 2 === 0 ? 'rgba(30, 60, 114, 0.6)' : 'rgba(42, 82, 152, 0.6)'
    });
  }
  
  // Mouse move listener for showcase 2
  const modal = document.getElementById('showcase2');
  const mouseHandler = (e) => {
    const rect = canvas.getBoundingClientRect();
    showcase2Mouse.x = e.clientX - rect.left;
    showcase2Mouse.y = e.clientY - rect.top;
  };
  modal.addEventListener('mousemove', mouseHandler);
  modal.setAttribute('data-mouse-handler', 'true');
  
  // Window resize handler
  const resizeHandler = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeHandler);
  canvas.setAttribute('data-resize-handler', 'true');
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    gradient.addColorStop(1, 'rgba(30, 60, 114, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw and update particles
    showcase2Particles.forEach((particle, index) => {
      // Mouse influence
      const dx = showcase2Mouse.x - particle.x;
      const dy = showcase2Mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 150;
      
      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        particle.x -= (dx / distance) * force * 2;
        particle.y -= (dy / distance) * force * 2;
      }
      
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      // Connect nearby particles
      for (let j = index + 1; j < showcase2Particles.length; j++) {
        const other = showcase2Particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(42, 82, 152, ${0.3 * (1 - distance / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    });
    
    // Draw mouse glow
    if (showcase2Mouse.x && showcase2Mouse.y) {
      const glowGradient = ctx.createRadialGradient(
        showcase2Mouse.x, showcase2Mouse.y, 0,
        showcase2Mouse.x, showcase2Mouse.y, 100
      );
      glowGradient.addColorStop(0, 'rgba(42, 82, 152, 0.4)');
      glowGradient.addColorStop(1, 'rgba(42, 82, 152, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    showcase2AnimationFrame = requestAnimationFrame(animate);
  }
  
  animate();
}

function stopShowcase2Background() {
  if (showcase2AnimationFrame) {
    cancelAnimationFrame(showcase2AnimationFrame);
    showcase2AnimationFrame = null;
  }
  showcase2Particles = [];
  showcase2Mouse = { x: 0, y: 0 };
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target.classList.contains('showcase-modal')) {
    event.target.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}
