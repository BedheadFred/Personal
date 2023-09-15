document.addEventListener('DOMContentLoaded', function () {

  // elements
  const curtain = document.getElementById('curtain');
  const stageHeading = document.getElementById('stageContentHeading');
  const stageSubheading = document.getElementById('stageContentSubheading');
  const projectsButton = document.getElementById('projects-button');
  const goBackButton = document.getElementById('go-back-button');
  const projects = {
    portal: {
      openTrigger: document.getElementById('partner-portal-open'),
      modal: document.getElementById('partner-portal-modal'),
      closeTrigger: document.getElementById('partner-portal-close'),
    },
    estatePlanning: {
      openTrigger: document.getElementById('estate-planning-open'),
      modal: document.getElementById('estate-planning-modal'),
      closeTrigger: document.getElementById('estate-planning-close'),
    },
    logisticalOptimization: {
      openTrigger: document.getElementById('logistical-optimization-open'),
      modal: document.getElementById('logistical-optimization-modal'),
      closeTrigger: document.getElementById('logistical-optimization-close'),
    },
    critter: {
      openTrigger: document.getElementById('critter-open'),
      modal: document.getElementById('critter-modal'),
      closeTrigger: document.getElementById('critter-close'),
    }
  }
  const figures = document.querySelectorAll('figure');

  function initializeStageContent() {
    // ensure curtain is hidden — only necessary during resizing to prevent visual artifacts.
    curtain.style.display = 'none';
    stageHeading.classList.add("in-view");
    stageSubheading.classList.add("in-view");
  }

  function initializePagepiling() {
    // Note to self: pagepiling is a custom plugin on the jquery prototype object, therefore getElementById wouldn't work (gotta stick to jquery)
    $('#pagepiling').pagepiling({
      direction: 'vertical',
      animateAnchor: false,
      scrollingSpeed: 600,
      easing: 'swing',
      keyboardScrolling: false,
    });
  }

  function createPageListeners() {
    projectsButton.addEventListener('click', function () {
      $.fn.pagepiling.moveSectionDown();
    });

    goBackButton.addEventListener('click', function () {
      $.fn.pagepiling.moveSectionUp();
    });
  }

  function createProjectListeners() {
    const openModalAndDisableScrolling = (e) => {
      e.modal.showModal();
      e.modal.scrollTop = 0;
      e.modal.classList.add("opened");
    };
    const closeModalAndEnableScrolling = (e) => {
      e.modal.classList.remove('opened');
      setTimeout(() => e.modal.close(), 250);
    };

    Object.keys(projects).forEach((key) => {
      if (projects[key].modal && projects[key].openTrigger && projects[key].closeTrigger) {
        projects[key].openTrigger.addEventListener('click', () => {
          openModalAndDisableScrolling(projects[key]);

          projects[key].modal.getElementsByClassName('container')[0].classList.add('in-view');
        });
        projects[key].closeTrigger.addEventListener('click', () => {
          closeModalAndEnableScrolling(projects[key]);
        });
        projects[key].modal.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') {
            closeModalAndEnableScrolling(projects[key]);
          }
        });
      }
    });

    figures.forEach((figure) => {
      figure.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });
    });
  }

  initializeStageContent();
  initializePagepiling();
  createPageListeners();
  createProjectListeners();

  // force user to use buttons to navigate between pages
  $.fn.pagepiling.setAllowScrolling(false);
});

