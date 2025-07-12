/**
 * Portfolio Navigation and Scroll Management
 * Handles active link highlighting based on scroll position
 */

document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll("nav.sidebar a");
  const sections = document.querySelectorAll("main.content section");

  /**
   * Updates the active navigation link based on current scroll position
   */
  function updateActiveLink() {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 70;
      if (scrollPos >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + current
      );
      link.toggleAttribute(
        "aria-current",
        link.getAttribute("href") === "#" + current
      );
    });
  }

  // Event listeners for scroll and navigation
  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("load", updateActiveLink);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(updateActiveLink, 300);
    });
  });

  // Initialize on page load
  updateActiveLink();
});
