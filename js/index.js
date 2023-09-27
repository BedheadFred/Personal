document.addEventListener('DOMContentLoaded', function () {

  // mosaic config
  const columns = 10;
  const shatterSpeed = 1;

  // triggers
  const stage = document.getElementById("stage");
  const curtain = document.getElementById('curtain');
  const profilePageElements = [
    document.getElementById('about-content'),
    document.getElementById('projects-button'),
  ]
  const reverseTrigger = document.getElementById("reverse-shatter");

  // elements
  const stageHeading = document.getElementById('stageContentHeading');
  const stageSubheading = document.getElementById('stageContentSubheading');
  const stageContent = [stageHeading, stageSubheading];
  const profilePage = document.getElementById('main');
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

  // state
  // initialize as true so it can't be broken before the content shows up
  let isMosaicBroken = true;

  // functions
  function removeTiles() {
    const elements = document.getElementsByClassName('piece');
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  function initializeTiles(colCount) {
    const pieceLength = window.innerWidth / colCount;
    const rowCount = (window.innerHeight / pieceLength) + 1;
    const numTiles = colCount * rowCount;

    for (let i = numTiles - 1; i >= 0; i--) {
      const piece = document.createElement('div');
      piece.className = 'piece';
      piece.style.width = pieceLength + 'px';
      piece.style.height = pieceLength + 'px';
      document.querySelector('#stage > .mosaic').appendChild(piece);
    }
  }

  function shatter() {
    if (!isMosaicBroken) {
      isMosaicBroken = true;
      // scale and fade out the text
      stageContent.forEach((e) => {
        gsap.to(e, shatterSpeed / 10, {
          scale: 0,
          opacity: 0
        })
      });

      // shatter pieces
      document.querySelectorAll('.piece').forEach(function (piece) {
        gsap.to(piece, shatterSpeed, {
          ...getRandomPositioning(),
          scale: 0,
          opacity: 0,
        });
      });

      // remove stage
      setTimeout(function () {
        removeTiles();
        stage.style.display = 'none';
      }, shatterSpeed * 800);

      // bring profile content into view
      setTimeout(function () {
        profilePageElements.forEach((e) => {
          e.classList.add('in-view');
        })
      }, 250);
    }
  }

  function reverseShatter() {
    // create the pieces of the mosaic
    initializeTiles(columns);
    document.querySelectorAll('.piece').forEach(function (piece) {
      // hide pieces and put them in random positioning
      gsap.set(piece, {
        ...getRandomPositioning(),
        scale: 0,
        opacity: 0
      });
      // show pieces and animate them into the unbroken positions
      gsap.to(piece, shatterSpeed, {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 1,
        opacity: 1
      });
    });

    setTimeout(() => {
      isMosaicBroken = false;
    }, 1500);
  }

  function addShatterListener() {
    const events = ["click", "touchmove", "touchend", "wheel", "DOMMouseScroll", "contextmenu"];

    events.forEach(eventType => {
      stage.addEventListener(eventType, (event) => {
        event.preventDefault(); // don't open the context menu if right-clicked
        shatter();
      });
    });
  }

  function addReverseShatterListener() {
    function reverseShatterHandler() {
      if (isMosaicBroken) {
        // ensure parent wrapper is fully visible
        stage.style.display = 'block';

        // Set text to normal size (don't want it to scale up from 0)
        stageContent.forEach( (e) => {
          gsap.set(e, {
            scale: 1,
          })
        });

        reverseShatter();

        setTimeout(() => {
          stageContent.forEach( (e) => {
            gsap.to(e, shatterSpeed / 2, {
              opacity: 1,
            })
          });
        }, 300);
      }
    }

    reverseTrigger.addEventListener("click", reverseShatterHandler);
  }

  function addResizeListener() {
    let resizeTimer;
    window.addEventListener('resize', function () {
      if (!isMosaicBroken) {
        // Bring the curtain back so there's a solid screen as the pieces get recalculated
        curtain.style.display = 'block';

        // debounce and permit recalculation only after resizing has stopped for at least 250ms
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          // Temporarily set broken to true so the mosaic cannot be shattered until rebuilt
          isMosaicBroken = true;
          // Re-create tiles after resizing has stopped
          removeTiles();
          initializeTiles(columns);
          // Remove curtain so tiles are visible
          curtain.style.display = 'none';
          // Set to unbroken so mosaic can be broken again
          isMosaicBroken = false;
        }, 250);
      }
    });
  }

  function initializeStageContent() {
    // failsafe: ensure curtain is hidden — only necessary during resizing to prevent visual artifacts.
    curtain.style.display = 'none';

    setTimeout(() => {
      stageHeading.classList.add("in-view");
    }, 250);
    setTimeout(() => {
      stageSubheading.classList.add("in-view");
    }, 800);
    setTimeout(() => {
      isMosaicBroken = false;
    }, 1500);
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
      profilePage.scrollTop = 0;
      $.fn.pagepiling.moveSectionUp();
    });
  }

  function createProjectListeners() {
    const openModal = (e) => {
      e.modal.showModal();
      e.modal.scrollTop = 0;
      e.modal.classList.add("opened");
    };
    const closeModal = (e) => {
      e.modal.classList.remove('opened');
      setTimeout(() => e.modal.close(), 250);
    };

    Object.keys(projects).forEach((key) => {
      if (projects[key].modal && projects[key].openTrigger && projects[key].closeTrigger) {
        projects[key].openTrigger.addEventListener('click', () => {
          openModal(projects[key]);
          projects[key].modal.getElementsByClassName('container')[0].classList.add('in-view');
        });
        projects[key].openTrigger.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            openModal(projects[key]);
            projects[key].modal.getElementsByClassName('container')[0].classList.add('in-view');
          }
        });
        projects[key].closeTrigger.addEventListener('click', () => {
          closeModal(projects[key]);
        });
        projects[key].modal.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') {
            closeModal(projects[key]);
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

  initializeTiles(columns);
  addResizeListener();
  initializePagepiling();
  createPageListeners();
  createProjectListeners();
  addShatterListener();
  addReverseShatterListener();
  initializeStageContent();

  // force user to use buttons to navigate between pages
  $.fn.pagepiling.setAllowScrolling(false);
});

// utils
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomPositioning() {
  return {
    x: getRandomNumber(-250, 250),
    y: getRandomNumber(-250, 250),
    z: getRandomNumber(-250, 250),
    rotationX: getRandomNumber(-720, 720),
    rotationY: getRandomNumber(-720, 720),
    rotationZ: getRandomNumber(-720, 720),
  }
}

