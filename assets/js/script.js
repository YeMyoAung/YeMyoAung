/**
 * Portfolio Navigation and Scroll Management
 * Handles active link highlighting and floating menu functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  const sidebarLinks = document.querySelectorAll("nav.sidebar a");
  const mobileNavLinks = document.querySelectorAll("nav.mobile-nav a");
  const floatingMenuButtons = document.querySelectorAll(".menu-item-button");
  const allNavLinks = [...sidebarLinks, ...mobileNavLinks];
  const sections = document.querySelectorAll("main.content section");
  
  // Floating menu elements
  const floatingMenu = document.getElementById('floatingMenu');
  const fabButton = document.getElementById('fabButton');
  const backdrop = document.querySelector('.floating-menu-backdrop');

  /**
   * Updates the active navigation link based on current scroll position
   */
  function updateActiveLink() {
    const mainContent = document.querySelector('main.content');
    const isMobile = window.innerWidth <= 768;
    
    let scrollPos;
    if (isMobile || !mainContent || mainContent.scrollHeight <= mainContent.clientHeight) {
      // Mobile or no scrollable content - use window scroll
      scrollPos = window.scrollY || document.documentElement.scrollTop;
    } else {
      // Desktop with scrollable main content
      scrollPos = mainContent.scrollTop;
    }
    
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (scrollPos >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    // Update desktop navigation
    allNavLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === "#" + current;
      link.classList.toggle("active", isActive);
      
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // Update floating menu buttons
    floatingMenuButtons.forEach((button) => {
      const target = button.getAttribute("data-target");
      button.classList.toggle("active", target === "#" + current);
    });
  }

  /**
   * Toggle floating menu open/close
   */
  function toggleFloatingMenu(e) {
    e.stopPropagation();
    floatingMenu.classList.toggle('active');
    fabButton.classList.toggle('active');
  }

  /**
   * Close floating menu
   */
  function closeFloatingMenu() {
    floatingMenu.classList.remove('active');
    fabButton.classList.remove('active');
  }

  /**
   * Smooth scroll to section - works for both mobile and desktop
   */
  function scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;
    
    const mainContent = document.querySelector('main.content');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile || !mainContent || mainContent.scrollHeight <= mainContent.clientHeight) {
      // Mobile or no scrollable content - use window scroll
      const offsetTop = targetSection.offsetTop - 20;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    } else {
      // Desktop with scrollable main content
      const offsetTop = targetSection.offsetTop - 20;
      mainContent.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  // Event listeners for floating menu
  if (fabButton) {
    fabButton.addEventListener('click', toggleFloatingMenu);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeFloatingMenu);
  }

  // Event listeners for floating menu items
  floatingMenuButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = button.getAttribute('data-target');
      if (targetId) {
        scrollToSection(targetId);
        closeFloatingMenu();
        setTimeout(updateActiveLink, 300);
      }
    });
  });

  // Event listeners for scroll and navigation
  const mainContent = document.querySelector('main.content');
  if (mainContent) {
    mainContent.addEventListener("scroll", updateActiveLink);
  }
  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("load", updateActiveLink);
  window.addEventListener("resize", updateActiveLink);

  // Desktop navigation event listeners
  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId.startsWith("#")) {
        e.preventDefault();
        scrollToSection(targetId);
      }
      setTimeout(updateActiveLink, 300);
    });
  });

  // Close floating menu when clicking outside
  document.addEventListener('click', (e) => {
    if (floatingMenu && !floatingMenu.contains(e.target)) {
      closeFloatingMenu();
    }
  });

  // Close floating menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeFloatingMenu();
    }
  });

  // Initialize on page load
  updateActiveLink();
});
