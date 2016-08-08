//get candidate information from api .results
var voteApp = {};
String.prototype.commafy = function () {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
};

Number.prototype.commafy = function () {
    return String(this).commafy();
};

voteApp.getCandidates = function(pageNum){
	return $.ajax({
		url: 'http://realtime.influenceexplorer.com/api/candidates/',
		dataType: 'json',
		method: 'GET',
		data: {
			apikey: '2aacaac3c0a04e87b39e5e727ac70b8d',
			// filter out candidates who is running in 2016, as in 'term_class: 3'
			term_class: 3,
			office: 'S',
			page: pageNum
		}
	});
};

var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
var nytKey = "a3cea551794c48929dc2a4abd0086be1";

// voteApp.candidates.map(function())
voteApp.getArticlesD = function(queryD) {
	$.ajax({
		url: nytUrl,
		method: 'GET',
		dataType: 'json',
		data: {
			"api-key": nytKey,
			q: `${queryD}`,
			sort: "newest"
		}
	}).then(function(resultsD) {
		console.log(resultsD);
		// console.log('get articles D: ', resultsD);
		var articleD = resultsD.response.docs.filter(function(article) {
			return	article.subsection_name === 'Politics' ||
					article.news_desk === 'National' ||
					article.news_desk === 'Politics';
		});	
		voteApp.printArticle(articleD, '.infoLeft');

		console.log(articleD);
	});
};

voteApp.printArticle = function(article, box) {
	if (article.length) {
		var headline = article[0].headline.main;
		var link = article[0].web_url;
		$(box).append(`<img class="nytimes" src=images/nytimes.png alt="new york times logo"><a href=${link}>${headline}</a>`)
	} else {
		console.log('not pizza');
		$(box).append(`<img class="nytimes" src=images/nytimes.png alt="new york times logo"><p>Sadly the New York Times does not have information about this person at the moment :(</p>`)
	}
};

voteApp.getArticlesR = function(queryR) {
	$.ajax({
		url: nytUrl,
		method: 'GET',
		dataType: 'json',
		data: {
			'api-key': nytKey,
			q: `${queryR}`,
			sort: 'newest'
		}
	}).then(function(resultsR) {
		var articleR = resultsR.response.docs.filter(function(article) {
			return article.subsection_name === 'Politics' ||
				   article.news_desk === 'National' ||
				   article.type_of_material === 'News' ||

				   article.news_desk === 'Politics';
		});
		voteApp.printArticle(articleR, '.infoRight');

		console.log("articleR", articleR)
	});
};

// in order to get the names in regular human name format, break up the name by comma and turn it into an array, then reverse the array.
voteApp.init = function() {
	var call1 = voteApp.getCandidates(1);
	var call2 = voteApp.getCandidates(2);
	var call3 = voteApp.getCandidates(3);
	var call4 = voteApp.getCandidates(4);
	var call5 = voteApp.getCandidates(5);

	$.when(call1,call2,call3,call4,call5)
		.done(function(data1,data2,data3,data4,data5) {
// here we are calling the api five times in order to get all the information we need
			var newArray = data1[0].results.concat(data2[0].results,data3[0].results,data4[0].results, data5[0].results)

			for (i = 0; i < newArray.length; i++) {
				if (newArray[i].not_seeking_reelection !== true){

					var name = newArray[i].name.split(', ').reverse().join(' ').toLowerCase();
					// console.log(spliced)

					$('ul').append(`<li class="item item${i}" value="${i}">${name}</li>`);
				};//if

			};//for

			var dems = newArray.filter(function(newArray){
				return newArray.party === "D"
			});//var dems
			var leonardClark = dems[2].name;
			var rep = newArray.filter(function(newArray) {
				return newArray.party === "R"
			});//var Reps

			for (i = 0; i < rep.length; i++) {
				if (rep[i].state === "ND") {
					console.log(rep[i].name)
				} else {
					console.log("damn it")
				}
			}
// the first function starts. when the names are clicked on, their corresponding information shows up in the box nex to it.
			$('.item').on('click', function(){
				$('.peepName').empty();	
				$('.peepState').empty();	
				$('.peepMoney').empty();	
				$('.peepParty').empty();
				var candidateObj = newArray[$(this).attr('value')];
				var candidateName = candidateObj.name.split(',').reverse().join(' ').toLowerCase();
				var candidateMoney = candidateObj.total_contributions.commafy();
				var candidateState = candidateObj.state;

				$('.peepName').append(`<h3 class="peopleName">${candidateName}</h3>`);

				$('.peepState').append(`<span class="type">state:</span> <h3 class="peopleState">${newArray[$(this).attr('value')].state}</h3>`);
				$('.peepMoney').append(`<span class="type">Money Raised:</span><h3 class="peopleMoney"> $${candidateMoney}</h3>`);
// here is an if/else statement to check on the candidate's party affiliation. if they are a democrat, show  a donkey. if they are a republican, show an elephant. if independent, show ... something?
					if(newArray[$(this).attr('value')].party === "D") 
					{
						$('.peepParty').append(`<img src="images/donkey.png" alt="democrat donkey logo">`);
						$('.peepName').css("color", "#002868");
					} else if (newArray[$(this).attr('value')].party === "R") 
					{
						$('.peepParty').append(`<img src="images/elephant.svg" alt="republican elephant logo">`);
						$('.peepName').css("color", "#BF0A30");
					} 
					else {
						$('.peepParty').append(`<img src="images/independent.png" alt="letter I cut out from american flag">`);
						$('.peepName').css("color", "gray");
					}
				// };
			});//'.item' onClick
		
// the first function ends here and now the second function starts only when the form is submitted

			$('form').on('submit', function(e){
				e.preventDefault();
				$('.infoLeft').empty();
				$('.infoRight').empty();
				var userPeepD = dems.filter(function(dems){
					return dems.state === $('select').val();
				});

				var userPeepR = rep.filter(function(rep){
					return rep.state === $('select').val();
				});

				// filter out the top contenders of each state as that's the information we want

				var userPeepNewD = userPeepD.sort(function(a,b) {
					if (parseFloat(a.total_contributions) > parseFloat(b.total_contributions)) {
				    return -1;
				  }
				  if (parseFloat(a.total_contributions) < parseFloat(b.total_contributions)) {
				    return 1;
				  }
				  return 0;
				});

				var userPeepNewR = userPeepR.sort(function(a,b) {
					if (parseFloat(a.total_contributions) > parseFloat(b.total_contributions)) {
				    return -1;
				  }
				  if (parseFloat(a.total_contributions) < parseFloat(b.total_contributions)) {
				    return 1;
				  }
				  return 0;
				});

				//each array contains information about candidates, we are looking for 'party', 'state', 'office'(S),'name','total_contributions'
				// pass on the users search result to the nyt app
				// debugger;
				if (userPeepNewR[0].state === "FL"){
					var fillNameR = userPeepNewR[1].name.split(", ").reverse().join(" ");
					var queryR = fullNameR;
					var articleItemR = voteApp.getArticlesR(queryR);
					var moneyR = userPeepNewR[1].total_contributions.toLocaleString().commafy();
					$('.infoRight').append(`<h3>${fullNameR}</h3>`)
					$('.infoRight').append(`<span class="type">money raised</span>`);
					$('.infoRight').append(`<h3>$${moneyR}</h3>`);
				} else if (userPeepNewR.length) {
					var nameR = userPeepNewR[0].name.split(", ").reverse().join(" ");
					var nameArrayR = nameR.split(" ");
					var fullNameR = nameArrayR[0] + " " + nameArrayR[nameArrayR.length - 1];
					var queryR = fullNameR;
					var articleItemR = voteApp.getArticlesR(queryR);
					var moneyR = userPeepNewR[0].total_contributions.toLocaleString().commafy();
					$('.infoRight').append(`<h3>${fullNameR}</h3>`)
					$('.infoRight').append(`<span class="type">money raised</span>`);
					$('.infoRight').append(`<h3>$${moneyR}</h3>`);
				} else {
					$('.infoRight').append(`<h3>Looks like the republican running in your state hasn't filed with the FEC yet :( </h3>`)
				};


				if (userPeepNewD.length) {
					var nameD = userPeepNewD[0].name.split(", ").reverse().join(" ");
					var nameArrayD = nameD.split(" ");
					var fullNameD = nameArrayD[0] + " " + nameArrayD[nameArrayD.length - 1];
					console.log(fullNameD, fullNameR);

					var queryD = fullNameD;

					var articleItemD = voteApp.getArticlesD(queryD);

					var moneyD = userPeepNewD[0].total_contributions.commafy();
					$('.infoLeft').append(`<h3>${fullNameD}</h3>`);
					$('.infoLeft').append(`<span class="type">money raised</span>`);
					$('.infoLeft').append(`<h3>$${moneyD}</h3>`);
				} else {
					$('.infoLeft').append(`<h3>Looks like the democrat running in your state hasn't filed with the FEC yet :( </h3>`)
				};
			});
		});//.done 
};

$(function() {
	voteApp.init();
});