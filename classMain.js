import { Utility } from "./classUtility.js";
const classUtility = new Utility();

export class Main {
    constructor({platformSelector, selectSelector, prefixSelector, mobileSelector, messageSelector, btnsParent}){
        this.selectPlatform = document.querySelector(platformSelector);
        this.selectPrefix = document.querySelector(selectSelector);
        this.inputPrefix = document.querySelector(prefixSelector);
        this.inputMobile = document.querySelector(mobileSelector);
        this.inputMessage = document.querySelector(messageSelector);
        this.btnWrap = document.querySelector(btnsParent);
        this.platformArr = {
            "WhatsApp":{
                "baseURL" : "https://wa.me/",
                "textParam" : "?text=",
            },
            "Telegram": {
                "baseURL" : "https://t.me/+",
                "textParam" : "?text=",
            }, 
            "Viber": {
                "baseURL" : "https://viber://chat/?number=+",
                "textParam" : "&draft=$",
            }, 
            "Signal": {
                "baseURL" : "https://signal.me/#p/+",
                "textParam" : "",
            }
            
        };
    }

    initMain(){
        this.populatePlatforms();
        this.populateCountries();
        this.updateSelect();
        this.btnWrap.addEventListener("click", (event)=> {
            let error = false;
            if (this.selectPlatform.value === "0") {
                classUtility.showToast("Platform needed to proceed");
                error = true;                
            }
            if (this.selectPrefix.value === "0" && this.inputPrefix.value === "") {
                classUtility.showToast("Prefix needed to proceed");
                error = true;
            } 
            if (this.inputMobile.value === "" || !this.inputMobile.value.match(/^[1-9]\d{1,14}$/)) {
                classUtility.showToast("Mobile Number needed to proceed");
                error = true;            
            }
            if(!error) this.btnEvents({event:event});
        });
    }

    // events for all btns in btn wrap
    btnEvents({event}) {
        let fullNum = this.getValidNum();
        let selectedPlatform = this.selectPlatform.value;
        // let whatsappUrl = `https://wa.me/${fullNum}`;
        // let telegramUrl = `https://t.me/+${fullNum}?text=<draft_text>`;
        // let viberUrl = `https://viber://chat/?number=+${fullNum}&draft=$hello`;
        // let signalUrl = `https://signal.me/#p/+${fullNum}`
        for (let [key, value] of Object.entries(this.platformArr)) {
            if (key.toLowerCase() === selectedPlatform) {
                let platformURL = `${value.baseURL}${fullNum}`;                     
                let messageURL =  `${platformURL}${value.textParam}`;           
                let customMSGURL = `${messageURL}${encodeURIComponent(this.inputMessage.value)}`;
                this.eventConditions({event:event, platformURL:platformURL, textParam:value.textParam, msgEncodedURL:messageURL, customMSGURL: customMSGURL, fullNumber: fullNum});
            }
        }

    }

    eventConditions({event, platformURL, textParam, msgEncodedURL, customMSGURL, fullNumber}){
        switch (event.target.getAttribute("id")) {
            case "sendMSG":
                if (textParam !== "") {
                    (this.inputMessage.value === "") ? classUtility.showToast("Message needed to proceed") : window.open(customMSGURL, '_blank');
                } else {
                    classUtility.showToast("Platform doesn't support Text");
                }
                break;
            case "sendHi":
                if (textParam !== "") {
                    let hiMsgUrl = `${msgEncodedURL}${encodeURIComponent("Hi")}`;
                    window.open(hiMsgUrl, '_blank');
                } else {
                    classUtility.showToast("Platform doesn't support Text");
                }
                break;
            case "makeCall":
                let Call = 'tel:' + fullNumber;
                window.open(Call,'_blank');  
                break;
            case "makeMessage":
                let Msg = 'sms:' + fullNumber;
                window.open(Msg,'_blank');
                break;
            case "copyLink":
                let copyMessage;
                if (this.btnWrap.parentElement.querySelector(".copy-msg")) {
                copyMessage = this.btnWrap.parentElement.querySelector(".copy-msg");
                } else {
                copyMessage = document.createElement("p");
                copyMessage.classList.add("copy-msg");
                this.btnWrap.parentElement.appendChild(copyMessage);
                }

                if (navigator.clipboard) {
                navigator.clipboard
                    .writeText(platformURL)
                    .then(() => {
                    copyMessage.textContent = `Link copied: ${platformURL}`;
                    })
                    .catch((err) => {
                    console.error("Error copying link: ", err);
                    copyMessage.textContent = "Failed to copy link.";
                    });
                } else {
                // Fallback for unsupported browsers
                const textArea = document.createElement("textarea");
                textArea.value = platformURL;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand("copy");
                    copyMessage.textContent = `Link copied: ${platformURL}`;
                } catch (err) {
                    console.error("Error copying link: ", err);
                    copyMessage.textContent = "Failed to copy link.";
                }
                document.body.removeChild(textArea);
                }
                break;               
            default:
                break;
        }
    }

    // helper method that modifies then returns valid prefix + num value
    getValidNum(){
        let prefixValue;
        let mobileValue = this.inputMobile.value;
        let rawValue = (this.inputPrefix.value !== "") ? this.inputPrefix.value
        : (this.selectPrefix.value !== "0") ? this.selectPrefix.value
        : "91";
        prefixValue = (rawValue.includes("+")) ? rawValue.replace("+", "") : rawValue;
        if(isNaN(prefixValue) || isNaN(mobileValue)) return
        return `${prefixValue}${mobileValue}`;
    }

    // populates the select element with option values
    populatePlatforms(){
        Object.keys(this.platformArr).forEach(platform => {
            let optionElm = document.createElement("option");
            optionElm.setAttribute("value", platform.toLowerCase());
            optionElm.textContent =`${platform}`
            this.selectPlatform.appendChild(optionElm);
        })
    }

    // populates the select element with option values
    async populateCountries(){
        let data = await classUtility.fetchAPI("https://restcountries.com/v3.1/all?fields=name,cca2,idd");
        data.sort((a, b) => a.name.common.localeCompare(b.name.common))
        data.forEach(obj => {
            let optionElm = document.createElement("option");
            optionElm.setAttribute("data-countrycode", obj.cca2);
            optionElm.setAttribute("value", this.getEntry (obj.idd));
            optionElm.textContent =`${obj.name.common}`
            this.selectPrefix.appendChild(optionElm);
        });
    }

    // helper method used is populate options to get value
    getEntry(obj) {
        let string;
        let num;
        for ( let [key, value] of Object.entries(obj)) {
            // this can be avoided all together its only + symbol
            if (typeof(value) === "string") string = value;
            if (typeof(value) === "object") num = value.join("");
            if (string !== undefined && num !== undefined) {
                //console.log(`${string}${num}`)
                return `${string}${num}`
            } 
        }
    }   

    // automatically update select after geolocation is enabled
    updateSelect() {
        classUtility.getLocation()
        .then(async (locationObject) => {
            // automatically shows current location based on navigator.geolocation
            let countryCode = await classUtility.getCountry(locationObject.coords.latitude, locationObject.coords.longitude);
            if (countryCode !== undefined) {
                Array.from(this.selectPrefix.querySelectorAll("option")).forEach(elem => elem.removeAttribute("selected", ""));
                Array.from(this.selectPrefix.querySelectorAll("option")).find((elm) => {
                    if (elm.getAttribute("data-countrycode").toLowerCase() === countryCode.toLowerCase()) {
                        elm.setAttribute("selected", "");
                    }
                });                
            }
        })
        .catch(err => console.log(err))
    }
}