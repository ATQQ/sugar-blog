export default {
    init() {
//         <script charset="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></script>
// <script>LA.init({id: "Jgmg5avjAUvoyePS",ck: "Jgmg5avjAUvoyePS"})</script>
        const tj = document.querySelector('#51tj');
        const script1 = document.createElement('script');
        script1.setAttribute('charset', 'UTF-8');
        script1.setAttribute('id', 'LA_COLLECT');
        script1.setAttribute('src', '//sdk.51.la/js-sdk-pro.min.js');
        tj.appendChild(script1);
        const script2 = document.createElement('script');
        script2.innerHTML = `LA.init({id: "Jgmg5avjAUvoyePS",ck: "Jgmg5avjAUvoyePS"})`;
        tj.appendChild(script2);
    }
}