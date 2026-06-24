const firebaseConfig = {
    apiKey: "AIzaSyAU9bi9gFsTe2WJQc4-nmTKRpUwSOwfP08",
    authDomain: "thedevelopersgraveyard.firebaseapp.com",
    projectId: "thedevelopersgraveyard",
    storageBucket: "thedevelopersgraveyard.firebasestorage.app",
    messagingSenderId: "935441819507",
    appId: "1:935441819507:web:a0fd26b76f25fd1c3d4706"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


window.onload = pageReady;

function pageReady() {

    // ------------------------------------CONTAINER REFERENCES --------------------------------------------
    var homePage = document.getElementById("homePageContainer");
    var inputPage = document.getElementById("inputContainer");
    var loadingPage = document.getElementById("loadingContainer");
    var resultPage = document.getElementById("resultContainer");
    var historyPage = document.getElementById("historyContainer");
    var aboutPage = document.getElementById("aboutContainer");
    var howToPage = document.getElementById("howToContainer");

    // --------------------------------------------REPORTS LIST REFERENCE------------------------------------
    var reportsContainer = document.getElementById("reportsList");

    //-----------------------------------------NAVIGATION REFERENCE---------------------------------------
    var homeButton = document.getElementById("homeNav");
    var aboutButton = document.getElementById("aboutNav");
    var howButton = document.getElementById("howNav");
    var reportsButton = document.getElementById("reportsNav");

    // ---------------------------------------BUTTONS REFERENCES-----------------------------------------------
    var enterGraveyard = document.getElementById("graveyardBtn");

    // ---------------------------------------INPUT-FORM REFERENCE-----------------------------------------------
    var survivalForm = document.getElementById("survivalForm");

    // ---------------------------------------SLIDERS INPUT-FORM REFERENCEs---------------------------------------
    var sleepInput = document.getElementById("sleep");
    var caffeineInput = document.getElementById("caffeine");
    var bugsInput = document.getElementById("bugs");
    var prInput = document.getElementById("pr");
    var debugInput = document.getElementById("debug");
    var slackInput = document.getElementById("slack");
    var restartInput = document.getElementById("restart");
    var machineInput = document.getElementById("machineToggle");
    var regretInput = document.getElementById("regretToggle");

    //--------------------------------------SLIDERS VALUE REFERENCEs--------------------------------
    var sleepSpan = document.getElementById("sleepVal");
    var caffeineSpan = document.getElementById("caffeineVal");
    var bugsSpan = document.getElementById("bugsVal");
    var prSpan = document.getElementById("prVal");
    var debugSpan = document.getElementById("debugVal");
    var slackSpan = document.getElementById("slackVal");
    var restartSpan = document.getElementById("restartVal");


    // --------------------------------REFERENCES FOR RESULT PAGE------------------------
    var burnoutOutput = document.getElementById("burnoutLevel");
    var physicalScoreOutput = document.getElementById("physicalScore");
    var workloadScoreOutput = document.getElementById("workloadScore");
    var emotionalScoreOutput = document.getElementById("emotionalScore");


    // ---------------------------------REFERENCES FOR OUTPUT MESSAGES------------------
    var diagnosisOutput = document.getElementById("diagnosis");
    var suggestionOutput = document.getElementById("suggestion");

    //--------------------------------EVENT LISTENERS FOR NAVIGATION-----------------------
    homeButton.addEventListener("click", function (event) {
        event.preventDefault();
        showPage(homePage);
        setActiveNav(homeButton);
    });
    aboutButton.addEventListener("click", function (event) {
        event.preventDefault();
        showPage(aboutPage);
        setActiveNav(aboutButton);
    });
    howButton.addEventListener("click", function (event) {
        event.preventDefault();
        showPage(howToPage);
        setActiveNav(howButton);
    });

    reportsButton.addEventListener("click", function (event) {
        event.preventDefault();
        // Grab reports from database
        loadReports();
        showPage(historyPage);
        setActiveNav(reportsButton);
    });

    // -----------------------------VARIABLE TO SAVE REPORT IN DATABASE --------------------
    var currentDiagnosis = "";
    var currentSuggestion = "";
    var burnoutLevel = "";
    var physicalScore = 0;
    var workloadScore = 0;
    var emotionalScore = 0;


    // SLIDER VALUE UPDATE FUNCTION
    function sliderValueUpdate(slider, output) {
        // This is to output the value of a slider to the span in html
        output.innerHTML = slider.value;

        //Adding Event Listener so that it update every time the slider is moved to make it feel realtime.
        slider.addEventListener("input", function () {
            output.innerHTML = slider.value;
        });
    }

    sliderValueUpdate(sleepInput, sleepSpan);
    sliderValueUpdate(caffeineInput, caffeineSpan);
    sliderValueUpdate(bugsInput, bugsSpan);
    sliderValueUpdate(prInput, prSpan);
    sliderValueUpdate(debugInput, debugSpan);
    sliderValueUpdate(slackInput, slackSpan);
    sliderValueUpdate(restartInput, restartSpan);

    machineInput.classList.add("off");
    regretInput.classList.add("off");

    var resultData = {};

    // ------------------------------TOGGLE BUTTONS------------------------
    var machineStatus = false;
    var regretStatus = false;

    machineInput.addEventListener("click", function () {
        machineStatus = !machineStatus;

        console.log(machineStatus);

        if (machineStatus === true) {
            machineInput.innerHTML = "ON";
            machineInput.classList.add("active");
            machineInput.classList.remove("off");
        } else {
            machineInput.innerHTML = "OFF";
            machineInput.classList.add("off");
            machineInput.classList.remove("active");
        }
    });

    regretInput.addEventListener("click", function () {
        regretStatus = !regretStatus;

        console.log(regretStatus);

        if (regretStatus === true) {
            regretInput.innerHTML = "ON";
            regretInput.classList.add("active");
            regretInput.classList.remove("off");
        } else {
            regretInput.innerHTML = "OFF";
            regretInput.classList.add("off");
            regretInput.classList.remove("active");
        }
    });

    // Hide all function
    function hideAll() {
        homePage.classList.add("hidden");
        inputPage.classList.add("hidden");
        loadingPage.classList.add("hidden");
        resultPage.classList.add("hidden");
        historyPage.classList.add("hidden");
        aboutPage.classList.add("hidden");
        howToPage.classList.add("hidden");
    }

    // Show Page function
    function showPage(page) {
        hideAll();
        page.classList.remove("hidden");
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }



    // -----------------------------------------------------------HOME PAGE LOGIC---------------------------------------------------------

    // Show home page only at start
    showPage(homePage);

    // Assigning Event Listener to Graveyard Button
    enterGraveyard.addEventListener("click", function () {

        // We want to show the input page when user clicks on this button
        showPage(inputPage);

    });


    // -----------------------------------------------------------INPUT PAGE LOGIC ------------------------------------------------------

    // Submit button for survival form 
    survivalForm.addEventListener("submit", function (event) {

        //DO NOT LET PAGE RELOAD AS I AM USING ONE PAGE FOR EVERYTHING IN THIS APPLICATION
        event.preventDefault();


        survivalForm.querySelector("button").disabled = true;

        console.log(sleepInput.value);
        console.log(caffeineInput.value);
        console.log(bugsInput.value);
        console.log(prInput.value);
        console.log(debugInput.value);
        console.log(slackInput.value);
        console.log(restartInput.value);
        console.log(machineStatus);
        console.log(regretStatus);

        var developerData = {
            sleep: sleepInput.value,
            caffeine: caffeineInput.value,
            bugs: bugsInput.value,
            pr: prInput.value,
            debug: debugInput.value,
            slack: slackInput.value,
            restart: restartInput.value,
            machine: machineStatus,
            regret: regretStatus
        }

        console.log(developerData);

        var sleep = Number(sleepInput.value);
        var caffeine = Number(caffeineInput.value);
        var bugs = Number(bugsInput.value);
        var pr = Number(prInput.value);
        var debug = Number(debugInput.value);
        var slack = Number(slackInput.value);
        var restart = Number(restartInput.value);

        // -------------------CONVERTING TOGGLE BUTTONS INTO VALUES ---------------------------
        var machineScore;
        var regretScore;

        if (machineStatus === true) {
            machineScore = 10;
        } else {
            machineScore = 0;
        }

        if (regretStatus === true) {
            regretScore = 10;
        } else {
            regretScore = 0;
        }

        var badSleep = 10 - sleep;
        var badCaffeine = caffeine;
        var badBugs = bugs;
        var badPR = pr;
        var badDebug = debug;
        var badSlack = slack;
        var badRestart = restart;
        var badMachine = machineScore;
        var badRegret = regretScore;

        console.log("sleep: ", sleep);
        console.log("badSleep: ", badSleep);
        console.log("badCaffeine: ", badCaffeine);
        console.log("badBugs: ", badBugs);
        console.log("badPR: ", badPR);
        console.log("badDebug: ", badDebug);
        console.log("badSlack: ", badSlack);
        console.log("badRestart: ", badRestart);
        console.log("badMachine: ", badMachine);
        console.log("badRegret: ", badRegret);

        // --------------------CREATING BURNOUT SCORE----------------------
        var burnoutScore = 0;

        burnoutScore = badSleep + badCaffeine + badBugs + badPR + badDebug + badSlack + badRestart + badMachine + badRegret;

        console.log("burnoutScore: ", burnoutScore);

        if (burnoutScore <= 25) {
            burnoutLevel = "SAFE";
        }
        else if (burnoutScore <= 50) {
            burnoutLevel = "WARNING";
        }
        else if (burnoutScore <= 75) {
            burnoutLevel = "BURNOUT";
        }
        else {
            burnoutLevel = "CRITICAL";
        }



        physicalScore = badSleep + badCaffeine;
        workloadScore = badBugs + badPR + badDebug + badSlack;
        emotionalScore = badRestart + badMachine + badRegret;


        resultData.burnoutLevel = burnoutLevel;
        resultData.physicalScore = physicalScore;
        resultData.workloadScore = workloadScore;
        resultData.emotionalScore = emotionalScore;


        console.log("LEVEL:", burnoutLevel);

        showPage(loadingPage);

        playLoadingAnimation(function () {

            getDiagnosis(burnoutLevel, function (message) {

                currentDiagnosis = message;

                diagnosisOutput.innerHTML = message;

                getSuggestion(burnoutLevel, function (suggestion) {

                    currentSuggestion = suggestion;

                    suggestionOutput.innerHTML = suggestion;

                    showPage(resultPage);

                    // SAVE REPORT TO DATABASE
                    saveReportToDatabase();

                    survivalForm.querySelector("button").disabled = false;
                });



                // --------------------------------------------------OUTPUTTING DATA IN REPORT----------------------------------------

                burnoutOutput.innerHTML = resultData.burnoutLevel;
                physicalScoreOutput.innerHTML = resultData.physicalScore;
                workloadScoreOutput.innerHTML = resultData.workloadScore;
                emotionalScoreOutput.innerHTML = resultData.emotionalScore;

            });

        });


    });


    // --------------------------------------------------------LOADING PAGE--------------------------------------------------



    function playLoadingAnimation(callback) {

        var logs = document.getElementById("loadingContainer");

        logs.innerHTML = "";

        var loadingMessages = [
            "Initializing kernel: Developer_Graveyard.exe",
            "Loading burnout prediction model...",
            "Mounting StackOverflow dependency database...",
            "Scanning Git commit trauma history...",
            "Analyzing caffeine bloodstream levels...",
            "Detecting emotional instability...",
            "Warning: Senior developer unresponsive",
            "Compiling survival probability matrix...",
            "Finalizing autopsy report..."
        ];

        var i = 0;

        var interval = setInterval(function () {

            if (i < loadingMessages.length) {

                var line = document.createElement("div");
                line.className = "loadingDialogue";
                line.textContent = "> " + loadingMessages[i];

                logs.appendChild(line);

                i++;

            } else {

                clearInterval(interval);

                setTimeout(function () {

                    callback();

                }, 900);
            }

        }, 600);
    }

    // ------------------------------------GET MESSAGES FROM FIREBASE-----------------------------

    function getDiagnosis(level, callback) {
        const docRef = db.collection("messages").doc(level);

        docRef.get().then(function (doc) {
            if (!doc.exists) {
                callback("No message found.");
                return;
            }

            const data = doc.data();
            const messages = data.lines;

            const randomIndex = Math.floor(Math.random() * messages.length);

            const randomMessage = messages[randomIndex];

            callback(randomMessage);
        });
    }

    // -------------------------------------- FETCH REFERENCE FORM DATABASE --------------------------

    function getSuggestion(level, callback) {

        const docRef = db.collection("suggestions").doc(level);

        docRef.get().then(function (doc) {
            if (!doc.exists) {
                callback("No suggestions found.");
                return;
            }

            const data = doc.data();
            const suggestions = data.lines;

            const randomIndex = Math.floor(Math.random() * suggestions.length);

            const randomSuggestion = suggestions[randomIndex];

            callback(randomSuggestion);
        });
    }

    // ------------------------------SAVE REPORT TO DATABASE ------------------------------

    function saveReportToDatabase() {
        db.collection("reports").add({
            burnoutLevel: burnoutLevel,
            diagnosis: currentDiagnosis,
            suggestion: currentSuggestion,
            physicalScore: physicalScore,
            workloadScore: workloadScore,
            emotionalScore: emotionalScore,
            timestamp: new Date()
        }).then(function (docRef) {
            console.log("Report saved with ID:", docRef.id);
        }).catch(function (error) {
            console.error("Error saving report:", error);
        });
    }


    // ------------------------------FETCH 10 REPORTS FROM DATABASE ------------------------------
    function loadReports() {
        reportsContainer.innerHTML = "";

        db.collection("reports").orderBy("timestamp", "desc").limit(10).get().then(function (snapshot) {

            if (snapshot.empty) {
                var emptyMsg = document.createElement("p");
                emptyMsg.textContent = "No reports found yet. Run a diagnostic first.";
                emptyMsg.style.color = "#888";
                emptyMsg.style.textAlign = "center";

                reportsContainer.appendChild(emptyMsg);
                return;
            }
            //snapshot is list of reports
            snapshot.forEach(function (doc) {

                // Getting actual data from firebase doc
                var data = doc.data();

                //Creating a box for each report
                var reportBox = document.createElement("div");
                reportBox.classList.add("reportBox");

                var time = "";
                if (data.timestamp && data.timestamp.toDate) {

                    time = data.timestamp.toDate().toLocaleString();

                } else {

                    time = "No time available";

                }

                //put data inside the box
                reportBox.innerHTML =
                    "<h3>" + data.burnoutLevel + "</h3>" +
                    "<p>Time: " + time + "</p>" +
                    "<p>Physical Score: " + data.physicalScore + "</p>" +
                    "<p>Workload Score: " + data.workloadScore + "</p>" +
                    "<p>Emotional Score: " + data.emotionalScore + "</p>" +
                    "<p class=\"diagnosisReports\">Diagnosis: <q>" + data.diagnosis + "</q></p>" +
                    "<p class=\"suggestionReports\">Suggestion: <q>" + data.suggestion + "</q></p>";

                // add box to page
                reportsContainer.appendChild(reportBox);
            });

        }).catch(function (error) {
            console.log("Error loading reports: ", error);
        });
    }

    function setActiveNav(activeButton) {
        homeButton.classList.remove("navActive");
        aboutButton.classList.remove("navActive");
        howButton.classList.remove("navActive");
        reportsButton.classList.remove("navActive");

        activeButton.classList.add("navActive");
    }













}