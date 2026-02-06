// randomBackgrounds(currentSet);

track.addEventListener('wheel', (e) => {
    let element = document.elementFromPoint(e.clientX, e.clientY);
    
    // Check the element and its parents for vertical overflow
    while (element && element !== document.body) {
        const style = window.getComputedStyle(element);
        const overflowY = style.overflowY;
        
        if ((overflowY === 'auto' || overflowY === 'scroll') && 
            element.scrollHeight > element.clientHeight) {
            return; // Allow default vertical scroll behavior
        }
        element = element.parentElement;
    }
    
    // Otherwise, do horizontal scrolling
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
    }
}, { passive: false });

document.querySelectorAll("hover-tilt").forEach(pack => {
    pack.style.touchAction = "pan-x";
});

