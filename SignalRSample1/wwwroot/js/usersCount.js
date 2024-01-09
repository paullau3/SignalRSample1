let timerInterval;
let timerValue = 0;

const timerInput = document.getElementById('timerInput');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const timerDisplay = document.getElementById('timerDisplay');
const timerValueElement = document.getElementById('timerValue');
const btnClearList = document.getElementById('clearList');
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
btnClearList.addEventListener('click', clearList);
function startTimer() {
    // Clear existing interval if any
    clearInterval(timerInterval);

    // Get the timer duration from the input
    const duration = parseInt(timerInput.value, 10);

    // Start the timer interval
    timerInterval = setInterval(function () {
       
        timerValue += 1;
        timerValueElement.textContent = timerValue;
        if (timerValue === duration) {
            doCall();
            timerValue = 0;
            timerValueElement.textContent = timerValue;
        }
    }, 1000);

    // Disable input and start button during the timer
    timerInput.disabled = true;
    startButton.disabled = true;
    stopButton.disabled = false;
}

function doCall() {
    const connectionId = connectionUserCount.connectionId;
    const name = document.getElementById("name").value;
    connectionUserCount.invoke("Test", `${name} - ${connectionId}`).catch(function (err) {
        console.error(err.toString());
    });
 }
function clearList() {
let ui = document.getElementById('messagesList');
    ui.innerHTML = "";
}
function stopTimer() {
    // Clear the interval and reset the timer value
    clearInterval(timerInterval);
    timerValue = 0;
    timerValueElement.textContent = timerValue;

    // Enable input and start button
    timerInput.disabled = false;
    startButton.disabled = false;
    stopButton.disabled = true;
}
//create connection
var connected = false;
var connectionUserCount = new signalR.HubConnectionBuilder().withUrl("/hubs/userCount").build();
//var connectionUserCount = new signalR.HubConnectionBuilder()
//    //.configureLogging(signalR.LogLevel.Information)
//    .withAutomaticReconnect()
//    .withUrl("/hubs/userCount", signalR.HttpTransportType.WebSockets).build();
//connect to methods that hub invokes aka receive notifications from hub

connectionUserCount.on("updateTotalViews", (value) => {

    var newSpan = document.getElementById("totalViewsCounter");
    newSpan.innerHTML = value.toString();

});
connectionUserCount.on("MessageRecevied", (msg) => {
    

    let ui = document.getElementById('messagesList');
    let li = document.createElement("li");
    li.innerHTML = msg;
    ui.appendChild(li);


});
connectionUserCount.on("updateTotalUsers", (value) => {

    var newSpan = document.getElementById("totalUsersCounter");
    newSpan.innerHTML = value.toString();

});

connectionUserCount.on('Test', () => {
    console.log('Sending Test signalR routine');
});
//invoke hub methods
function newWindowLoadedOnClient() {
    connectionUserCount.send("NewWindowLoaded");
}
//start connection
function fulfilled() {
    console.log('success');
    connected = true;
    newWindowLoadedOnClient();
}
//setInterval(() => {
    
//    const connectionId = connectionUserCount.connectionId;
//    const  name  = document.getElementById("name").value;
//    connectionUserCount.invoke("Test",  `${name} - ${connectionId}`).catch(function (err) {
//        console.error(err.toString());
//    });
//}, 10000); // 10 seconds
function rejected() {
    console.log('failed');
}
connectionUserCount.start().then(fulfilled, rejected);

