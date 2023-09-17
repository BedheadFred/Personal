document.addEventListener('DOMContentLoaded', function() {

    // mosaic config
    const columns = 10;
    const shatterSpeed = 1;

    // elements
    const stage = document.getElementById("stage");
    const curtain = document.getElementById('curtain');
    const profilePageElements = [
        document.getElementById('about-content'),
        document.getElementById('projects-button'),
    ]
    const reverseTrigger = document.getElementById("reverse-shatter");

    // state
    let isMosaicBroken = false;

    function removeTiles() {
        const elements = document.getElementsByClassName('piece');
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    function initializeTiles(colCount) {
        const pieceWidth = window.innerWidth / colCount;
        const pieceHeight = pieceWidth;
        const rowCount = (window.innerHeight / pieceWidth) + 1;
        const numTiles = colCount * rowCount;

        for (let i = numTiles - 1; i >= 0; i--) {
            const piece = document.createElement('div');
            piece.className = 'piece';
            piece.style.width = pieceWidth + 'px';
            piece.style.height = pieceHeight + 'px';
            document.querySelector('#stage > .mosaic').appendChild(piece);
        }
    }

    function shatter() {
        // scale and fade out the text
        gsap.to(document.querySelector("#stage > .content"), shatterSpeed / 10, {
            scale: 0,
            opacity: 0
        });

        // shatter pieces
        document.querySelectorAll('.piece').forEach(function(piece) {
            gsap.to(piece, shatterSpeed, {
                ...getRandomPositioning(),
                scale: 0,
                opacity: 0,
            });
        });

        // remove stage
        setTimeout(function() {
            removeTiles();
            stage.style.display = 'none';
        }, shatterSpeed * 800);

        // bring profile content into view
        setTimeout(function() {
            profilePageElements.forEach((e) => {
                e.classList.add('in-view');
            })
        }, 250);
    }

    function reverseShatter() {
        // ensure parent wrapper is fully visible
        stage.style.display = 'block';
        // create the pieces of the mosaic
        initializeTiles(columns);
        document.querySelectorAll('.piece').forEach(function(piece) {
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
    }

    function addShatterListener() {
        function shatterHandler() {
            if (!isMosaicBroken) {
                isMosaicBroken = true;
                shatter();
            }
        }

        const events = ["click", "touchmove", "touchend", "wheel", "DOMMouseScroll", "contextmenu"];

        events.forEach(eventType => {
            stage.addEventListener(eventType, (event) => {
                event.preventDefault(); // don't open the context menu if right-clicked
                shatterHandler();
            });
        });
    }
    
    function addReverseShatterListener() {
        function reverseShatterHandler() {
            if (isMosaicBroken) {
                // Set text to normal size (don't want it to scale up from 0)
                gsap.set(document.querySelector("#stage > .content"), { scale: 1 });
                reverseShatter();

                setTimeout(() => {
                    gsap.to(document.querySelector("#stage > .content"), shatterSpeed / 2, { opacity: 1 });
                    isMosaicBroken = false;
                }, shatterSpeed * 1000);
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

    initializeTiles(columns);
    addResizeListener();
    addShatterListener();
    addReverseShatterListener();
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
