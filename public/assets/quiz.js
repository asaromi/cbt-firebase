const db_soal = firebase.database().ref("dummy-soal");
const db_jawaban = firebase.database().ref("collect-result");
const store = firebase.storage().ref();

store.child('images/1(1).png').getDownloadURL().then(function(url) {
	$('#surveyResult').find('img').attr('src', url);
});

var lastKey = 0;

db_jawaban.orderByKey().limitToLast(1).once("child_added", function(snapshot) {
    lastKey = parseInt(snapshot.key);
    console.log("Get lastKey = "+lastKey);
});

var question;

db_soal.orderByKey().on('value', function(shot){
	question = questionsArray(shot);

	if(question.length != 0){
		console.log(question);

		Survey
		    .StylesManager
		    .applyTheme("modern");

		var json = {
		    title: "Soal Tryout",
		    questionsOnPageMode: "questionPerPage",
		    questionsOrder: "random",
		    showPreviewBeforeComplete: "showAllQuestions",
		    showProgressBar: "bottom",
		    showTimerPanel: "top",
		    maxTimeToFinish: 60*60,
		    firstPageIsStarted: true,
		    startSurveyText: "Mulai Kerjakan",
		    pages: [
		        {
		            elements: [
		                {
		                    type: "html",
		                    html: "Anda memiliki waktu 1 jam untuk mengerjakan {questionCount} pertanyaan.<br/>Klik <b>'Mulai Kerjakan'</b> jika Anda sudah siap untuk mengerjakan Soal."
		                }
		            ]
		        }, {
					questions: question
				},
		    ],
		    completedHtml: "<h4>Dari <b>{questionCount}</b> Pertanyaan, <b>{correctedAnswers}</b> diantaranya berhasil Anda jawab dengan Benar</h4>"
		};

		window.survey = new Survey.Model(json);

		survey
		    .onComplete
		    .add(function (result) {
		        console.log(result.data);
		        console.log(survey.getCorrectedAnswerCount());
		        console.log(survey.getInCorrectedAnswerCount());
		        db_jawaban.child(String(lastKey+1)).set({
		            email : firebase.auth().currentUser.email,
		            name : firebase.auth().currentUser.displayName,
		            benar : survey.getCorrectedAnswerCount(),
		            jawaban : result.data,
		        }).then(function (){ console.log("Jawaban sudah direkam") })
		    });

		var converter = new showdown.Converter();
		survey
		    .onTextMarkdown
		    .add(function (survey, options) {
		        //convert the mardown text to html
		        var str = converter.makeHtml(options.text);
		        //remove root paragraphs <p></p>
		        str = str.substring(3);
		        str = str.substring(0, str.length - 4);
		        //set html
		        options.html = str;
		    });

		$("#surveyContainer").Survey({model: survey});
		$('#preloader').attr('hidden', true);
	}
});

function questionsArray(snapshot) {
	var returnArr = [];

	snapshot.forEach(function(childShot){
		var item = childShot.val();
		if(!item["type"])
			item["type"] = "radiogroup";

		if(item["imageTitle"]){
			store.child(item["image"]).getDownloadURL().then(function(url) {
				console.log(item["title"]);
				delete item["image"];
				item["isRequired"] = true;
				item["hasOther"] = true;
			});
		} 
		item["choicesOrder"] = "random";
		delete item["imageTitle"];
		delete item["chooseImage"];
		returnArr.push(item);
		
	});

	return returnArr;
}