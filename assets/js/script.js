/**
 * Portfolio Navigation, Scroll Management, and Analytics
 * Handles active link highlighting, floating menu functionality, and event tracking
 */

// Firebase Analytics Event Tracking Functions with Content Blocker Protection
function trackEvent(eventName, parameters = {}) {
  if (window.analyticsEnabled && typeof window.logAnalyticsEvent === 'function' && window.firebaseAnalytics) {
    try {
      window.logAnalyticsEvent(window.firebaseAnalytics, eventName, parameters);
      console.log('📊 Analytics Event:', eventName, parameters);
    } catch (error) {
      console.warn('⚠️ Analytics event failed:', error);
    }
  } else {
    // Fallback: Log events locally for debugging (respects user privacy)
    console.log('📊 Event (Analytics Disabled):', eventName, parameters);
  }
}

function trackResumeDownload() {
  trackEvent('resume_download', {
    event_category: 'engagement',
    event_label: 'resume_pdf',
    value: 1
  });
  
  // Additional non-tracking action: You could trigger other behaviors here
  console.log('🎯 Resume download initiated');
}

function trackProjectClick(projectName, projectUrl) {
  trackEvent('project_click', {
    event_category: 'engagement',
    event_label: projectName,
    external_url: projectUrl,
    value: 1
  });
  
  console.log('🔗 Project link clicked:', projectName);
}

function trackSocialClick(platform, url) {
  trackEvent('social_click', {
    event_category: 'engagement',
    event_label: platform,
    external_url: url,
    value: 1
  });
  
  console.log('📱 Social link clicked:', platform);
}

function trackSectionView(sectionName) {
  trackEvent('section_view', {
    event_category: 'navigation',
    event_label: sectionName,
    value: 1
  });
}

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
        // Track section view for analytics
        trackSectionView(current);
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

  // Analytics Event Listeners
  setupAnalyticsTracking();
});

/**
 * Set up Google Analytics event tracking for portfolio interactions
 */
function setupAnalyticsTracking() {
  // Track resume download
  const resumeLink = document.querySelector('.btn-download');
  if (resumeLink) {
    resumeLink.addEventListener('click', function() {
      trackResumeDownload();
    });
  }

  // Track project links
  const projectLinks = document.querySelectorAll('.project-links a');
  projectLinks.forEach(link => {
    link.addEventListener('click', function() {
      const projectCard = this.closest('.project-card');
      const projectName = projectCard?.querySelector('h4')?.textContent || 'Unknown Project';
      const projectUrl = this.href;
      trackProjectClick(projectName, projectUrl);
    });
  });

  // Track social media clicks
  const socialLinks = document.querySelectorAll('#contact a[href*="linkedin"], #contact a[href*="github"]');
  socialLinks.forEach(link => {
    link.addEventListener('click', function() {
      const url = this.href;
      let platform = 'unknown';
      if (url.includes('linkedin')) platform = 'linkedin';
      else if (url.includes('github')) platform = 'github';
      
      trackSocialClick(platform, url);
    });
  });

  // Track email clicks
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('email_click', {
        event_category: 'engagement',
        event_label: 'contact_email',
        value: 1
      });
    });
  });

  // Track phone clicks
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('phone_click', {
        event_category: 'engagement',
        event_label: 'contact_phone',
        value: 1
      });
    });
  });

  // Track scroll depth (25%, 50%, 75%, 100%)
  let scrollDepthTracked = new Set();
  
  function trackScrollDepth() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    
    [25, 50, 75, 100].forEach(threshold => {
      if (scrollPercent >= threshold && !scrollDepthTracked.has(threshold)) {
        scrollDepthTracked.add(threshold);
        trackEvent('scroll_depth', {
          event_category: 'engagement',
          event_label: `${threshold}%`,
          value: threshold
        });
      }
    });
  }

  // Throttled scroll tracking
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScrollDepth, 250);
  });
}

// CDN Performance Tracking
function trackCDNPerformance() {
  if (typeof performance !== 'undefined' && performance.getEntriesByType) {
    const resources = performance.getEntriesByType('resource');
    const cdnResources = resources.filter(resource => 
      resource.name.includes('cdn.jsdelivr.net') || 
      resource.name.includes('res.cloudinary.com')
    );
    
    cdnResources.forEach(resource => {
      const loadTime = resource.responseEnd - resource.startTime;
      const resourceType = resource.name.includes('.css') ? 'css' : 
                          resource.name.includes('.js') ? 'javascript' : 
                          resource.name.includes('.jpg') || resource.name.includes('.png') ? 'image' : 'other';
      
      trackEvent('cdn_performance', {
        event_category: 'performance',
        event_label: resourceType,
        value: Math.round(loadTime),
        custom_parameter_1: resource.name.includes('cdn.jsdelivr.net') ? 'jsdelivr' : 'cloudinary'
      });
    });
    
    // Track overall page load performance
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      trackEvent('page_load_performance', {
        event_category: 'performance',
        event_label: 'full_page_load',
        value: Math.round(navigation.loadEventEnd - navigation.startTime),
        custom_parameter_1: 'cdn_enabled'
      });
    }
  }
}

// Track Core Web Vitals with CDN attribution
function trackCoreWebVitals() {
  // Track Largest Contentful Paint (LCP)
  if (typeof PerformanceObserver !== 'undefined') {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        trackEvent('core_web_vitals', {
          event_category: 'performance',
          event_label: 'lcp',
          value: Math.round(lastEntry.startTime),
          custom_parameter_1: 'cdn_optimized'
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.log('LCP tracking not supported');
    }
  }
}

// Track CDN performance after page load
window.addEventListener('load', function() {
  setTimeout(() => {
    trackCDNPerformance();
    trackCoreWebVitals();
  }, 1000);
});
