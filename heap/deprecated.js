//Finalize all opened cards in an export
function countAll() {
    let total = [];
    document.querySelector(".full-out").innerHTML = '';
    Object.keys(openItems).forEach(e => {
        total = total.concat(renderedItems[e]['cardContents']);
    });
    counted = countCards(total);
    sorted = sortCards(counted);
    sorted.forEach(element => {
        document.querySelector(".full-out").innerHTML += `${element[1]['count']} ${element[1]['name']} <br>`
    })
}