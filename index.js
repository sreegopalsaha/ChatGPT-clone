const chatSection = document.querySelector(".chat-section");
const chatContainer = document.querySelector(".chat-container");

const heroSection = document.querySelector(".hero");
const boxSection = document.querySelector(".box-section");
const sendIcon = document.querySelector(".send-icon");
const loadIcon = document.querySelector(".loading-icon");
const history_container = document.querySelector(".history");
let isNewChat = 0;

const apiKey = 'ENTER YOUR OPENAI KEY HERE'; //Replace this with your openAI key

const apiUrl = 'https://api.openai.com/v1/chat/completions';
const database = `always try to answer within 100 charecter.`; // You can add your data here that you wanted to know to the AI.
const Historybase = `Generate a short summary within 20 characters that summarizes the input.
                    \nExamples of user inputs and their corresponding expected responses:\n
                    \n Input: "Where should I go for a trip?"
                    Response: "Tour Guide"
                    \nInput: "Write me a Twitter thread for a meme."
                    Response: "Write a Twitter Thread"
                    \nInput: "Tell me how TDM works."
                    Response: "TDM Workings"`;

  // _________________________________________________
  //		Insert History from Local Storage start here
  //_________________________________________________   

    let HistoryArray = JSON.parse(localStorage.getItem('history'))  || [];
    HistoryArray.forEach(element => {
        newHis = document.createElement("div");
        newHis.innerHTML = element;
        history_container.append(newHis);
    });
  
// _________________________________________________
//		New chat Btn start here
//_________________________________________________

const newchat1 = document.querySelector(".newBtn1");
const newchat2 = document.querySelector(".newBtn2");

newchat1.addEventListener("click", ()=>{
    window.location.reload();
})
newchat2.addEventListener("click", ()=>{
    window.location.reload();
})
// _________________________________________________
//		Reuseble Code start here
//_________________________________________________
// Functions to Hide Section

const funcHide = (ele)=>{
    ele.classList.add("hide");
}

const funcUnHide = (ele)=>{
    ele.classList.remove("hide");
}


// _________________________________________________
//		Sidebar start here
//_________________________________________________
const sidebar = document.querySelector('.sidebar');
const closeBtn = document.querySelector(".side-close");
const openBtn = document.querySelector(".side-open");
const to_be_shipt =document.querySelector(".to-be-shipt");
const navBar = document.querySelector(".nav");
const logo_container =document.querySelector(".logo-container");


const shiftEle = (ele, percent) =>{
    ele.style.transform = `translateX(${percent}%)`;
}

// Events of this Section

openBtn.addEventListener('click', ()=>{
    shiftEle(sidebar,0);
    shiftEle(to_be_shipt,10);
    navBar.style.paddingLeft = "23rem"
    funcHide(openBtn);
    funcUnHide(closeBtn);

})

closeBtn.addEventListener('click', ()=>{
    shiftEle(sidebar,-100);
    shiftEle(to_be_shipt,0);
    navBar.style.paddingLeft = "0rem"
    funcHide(closeBtn);
    funcUnHide(openBtn);


})

// _________________________________________________
//		Sidebar for mobile
//_________________________________________________
const menuBtn = document.querySelector(".mobile-menu");
const menuCloseBtn = document.querySelector(".menu-close");

menuBtn.addEventListener("click", ()=>{
    shiftEle(sidebar,0);
    // funcHide(menuBtn);
    funcUnHide(menuCloseBtn);
})

menuCloseBtn.addEventListener("click", ()=>{
    shiftEle(sidebar,-100);
    funcUnHide(menuBtn);
    funcHide(menuCloseBtn);
})
// _________________________________________________
//		Append to Chat start here
//_________________________________________________
    const AppendAsAI = (response)=>{
    const aiRep = document.createElement("div");
    // console.log(aiRep);
    aiRep.classList.add("reply");
    aiRep.innerHTML = `<img src="chatgpt-logo.png" alt="" class="ai-icon user-icon">
    <p class="reply-data">ChatGPT</p>
    <p class="reply-text">${response}</p>`;
    chatContainer.append(aiRep);
    }

    const AppendAsUser =(input)=>{
        const userRep = document.createElement("div");
        userRep.classList.add("reply");
        userRep.innerHTML = `<i class="fa-solid fa-user user-icon"></i>
        <p class="reply-data">You</p>
        <p class="reply-text">${input}</p>`
        chatContainer.append(userRep);
    }


// _________________________________________________
//		get ai response func
//_________________________________________________
const getAiResponse = async (userValue, base)=>{
    try{
     const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            'model': 'gpt-3.5-turbo',
            'messages': [
                {
                    'role': 'system',
                    'content':base
                },
                { 'role': 'user', 'content': userValue }
            ],
            'max_tokens': 100,
        }),
    })
    const data = await res.json();
    return data.choices[0].message.content;
    
    }
    catch{
        return "Error! Check your network connection";
    }

}

// _________________________________________________
//		Hanlde send btn click
//_________________________________________________

hideOtherSection = ()=>{
    heroSection.style.display = "none";
    boxSection.style.display = "none";
    chatSection.style.display= "flex";
}


const handleSendBtn = async ()=>{
    const userInput = document.querySelector(".inputBox");
    const userValue = userInput.value;
    userInput.value = ""; //Cleares the input box
    // hide the hero section and the box section
    if(!isNewChat){
        hideOtherSection();
    }
    AppendAsUser(userValue);
    // Hide the Icon untill we get a Reply
    funcHide(sendIcon);
    funcUnHide(loadIcon);

    const aiResponse = await getAiResponse(userValue.trim(), database);
    if(aiResponse!='Error'){
        AppendAsAI(aiResponse);
    }
    else{
        AppendAsAI("Error");
    }

    funcUnHide(sendIcon);
    funcHide(loadIcon);

    if(!isNewChat){
        appendToHistory(userValue);
    }

    isNewChat = 1;
} 

// _________________________________________________
// 		History Func start here
// _________________________________________________

appendToHistory = async (input) => {
    const aiResponse = await getAiResponse(input.trim(), Historybase);
    if (aiResponse != 'Error') {
        newHis = document.createElement("div");
        newHis.innerHTML = aiResponse;
        history_container.append(newHis);
        HistoryArray.push(aiResponse);
        localStorage.setItem('history',JSON.stringify(HistoryArray));
    }
    else {
        newHis = document.createElement("div");
        newHis.innerHTML = "New Chat!";
        history_container.append(newHis);
        HistoryArray.push("New Chat!");
        localStorage.setItem('history',JSON.stringify(HistoryArray));
    }

}
    
sendIcon.addEventListener("click",handleSendBtn);
