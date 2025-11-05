import { Main } from "./classMain.js";

document.addEventListener("DOMContentLoaded", ()=> {
    renderHeader(document.querySelector("#header"));
    setHeaderHeight(header)
    renderSection(document.querySelector("#root"));
    const classMain = new Main({platformSelector:"#platformSelect", selectSelector:"#prefixSelect", prefixSelector:"#prefixInput", mobileSelector:"#mobileNumber", messageSelector:"#customMSG", btnsParent:".buttons" });
    classMain.initMain();
})

function setHeaderHeight(header) {
  let headerHeight = header.getBoundingClientRect().height;
  const root = document.documentElement;
  root.style.setProperty("--header-height", `${headerHeight + 20}px`);
  console.log(headerHeight);
}

function renderHeader(header){
    header.innerHTML =
    `
    <div>
     <h1> Chat-Bridge </h1>
    </div>
    `
}

function renderSection(container) {
    container.innerHTML =
    `
    <div class="main-container">
        <div class="min-sec">
            <label>Select Platform</label>
            <select name="platform" id="platformSelect">
                <option value="0" selected>Select Platform</option>
            </select>
        </div>
        <div class="min-sec">
            <label>Select Country</label>
            <select name="countryCode" id="prefixSelect">
                <option data-countrycode="default" value="0" selected>Select Country</option>
            </select>
        </div>
        <div class="min-sec">
            <label for="prefixInput">Custom Prefix</label>
            <input id="prefixInput" type="number" maxlength="5">
        </div>
        <div class="min-sec">
            <label for="mobileNumber">Mobile Number</label>
            <input id="mobileNumber" type="number">
        </div>
        <div class="buttons">
            <div class="btns-grp">
                <textarea id="customMSG"></textarea>
            </div>            
            <div class="btns-grp">
                <a class="btn" id="sendMSG">Custom Message</a>
                <a class="btn" id="sendHi">With Hi</a>
            </div>
            <div class="btns-grp">
                <a class="btn" id="makeCall">Call </a>
                <a class="btn" id="makeMessage">Message </a>
            </div>
            <div class="btns-grp">
                <a class="btn" id="copyLink">Copy Link </a>
            </div>
        </div>
    </div>
    `
}