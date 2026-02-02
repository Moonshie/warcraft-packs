randomBackgrounds(currentSet);

const track = document.querySelector('.pack-track');

track.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
    }
}, { passive: false });

document.querySelectorAll("hover-tilt").forEach(pack => {
    pack.style.touchAction = "pan-x";
});

menuOpen = true;