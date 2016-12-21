"use strict";

var voteApp = {};
var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
var nytKey = "a3cea551794c48929dc2a4abd0086be1";

//**** COMMAFY FUNCTION TO DISPLAY STR NUM W/ COMMAS
String.prototype.commafy = function () {
	return this.replace(/(^|[^\w.])(\d{4,})/g, function ($0, $1, $2) {
		return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
	});
};

//**** COMMAFY FUCNTION TO DISPLAY INT NUM W/ COMMAS
Number.prototype.commafy = function () {
	return String(undefined).commafy();
};

//**** AJAX CALL TO GET CANDIDATE INFO
voteApp.getCandidates = function (pageNum) {
	return $.ajax({
		url: 'http://realtime.influenceexplorer.com/api/candidates/',
		dataType: 'json',
		method: 'GET',
		data: {
			apikey: '2aacaac3c0a04e87b39e5e727ac70b8d',
			term_class: 3,
			office: 'S',
			page: pageNum
		}
	});
};

//**** AJAX CALL TO GET ARTICLE INFO
voteApp.getArticles = function (query, card) {
	$.ajax({
		url: nytUrl,
		method: 'GET',
		dataType: 'json',
		data: {
			'api-key': nytKey,
			q: "" + query,
			sort: 'newest'
		}
	}).then(function (results) {
		//****FILERING ARTICLE INFO
		var article = results.response.docs.filter(function (item) {
			return item.subsection_name === 'Politics' || item.news_desk === 'National' || item.type_of_material === 'News' || item.news_desk === 'Politics';
		});
		voteApp.printArticle(article, card);
	});
};

//**** IF HAVE ARTICLE, PRINT ARTICLE INFO
//**** ELSE SEND PRINT NO ARICLE MESSAGE ON SCREEN
voteApp.printArticle = function (article, card) {
	if (article.length) {
		var headline = article[0].headline.main;
		var link = article[0].web_url;
		var nytTemplate = $('#nytTemplate').html();
		var template = Handlebars.compile(nytTemplate);
		var finalArticle = {
			headline: headline,
			link: link
		};

		var articleTemplate = template(finalArticle);
		$(card).append(articleTemplate);
	} else {
		var nytTemplateAlt = $('#nytTemplateAlt').html();
		var nytTempAlt = Handlebars.compile(nytTemplateAlt);
		var message = {
			message: "Sadly the New York Times does not have information about this person at the moment :("
		};
		var articleTempAlt = nytTempAlt(message);
		$(card).append(articleTempAlt);
	}
};

//**** FIVE AJAX CALLS TO RETURN COMPLETE DATASET
voteApp.init = function () {
	var call1 = voteApp.getCandidates(1);
	var call2 = voteApp.getCandidates(2);
	var call3 = voteApp.getCandidates(3);
	var call4 = voteApp.getCandidates(4);
	var call5 = voteApp.getCandidates(5);

	$.when(call1, call2, call3, call4, call5).done(function (data1, data2, data3, data4, data5) {
		//**** PUSHES ALL FIVE RESULTS TO ONE ARRAY
		var newArray = data1[0].results.concat(data2[0].results, data3[0].results, data4[0].results, data5[0].results);
		//**** SORTING NAMES TO FIRST + LAST AND UPPERCASE
		newArray.forEach(function (person) {
			return person.name = person.name.split(', ').reverse().join(' ').toLowerCase();
		});
		//****sorting array based on the name's value
		newArray.sort(function (a, b) {
			var nameA = a.name.toUpperCase(); // ignore upper and lowercase
			var nameB = b.name.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			//**** names must be equal
			return 0;
		});

		//**** APPENDING NAME ON SCROLLABLE LIST
		//**** AND COLOR CODE <li> BASED ON PARTY AFFILIATION
		newArray.forEach(function (person, i) {
			$('ul').append("<li class=\"item item" + i + "\" value=\"" + i + "\"><i class=\"fa fa-star\" aria-hidden=\"true\"></i>   " + person.name + "</li>");
			if (person.party === 'D') {
				$("li.item" + i).css('color', '#002868');
			} else if (person.party === 'R') {
				$("li.item" + i).css('color', '#BF0A30');
			} else {
				$("li.item" + i).css('color', '#808080');
			};
		});

		//**** SET DATA ATTRIBUTE TO <li> CONTENT AND LOWERCASE
		$('ul li').each(function () {
			$(this).attr('data-search-term', $(this).text().toLowerCase());
		});
		//**** NOTE : use a FILTER to filter out entries from an array
		$('input.searchBox').on('keyup', function () {
			var searchTerm = $(this).val().toLowerCase();
			$('ul li').each(function () {
				if ($(this).filter('[data-search-term *=   ' + searchTerm + ']').length > 0 || searchTerm.length < 1) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
		});

		//**** <li> ON CLICK, APPEND INFO TO RIGHT BOX
		$('.item').on('click', function () {
			$('.peepBox').empty();
			$(this).addClass('selected');
			$(this).siblings().removeClass('selected');
			//**** VALUE ATTRIBUTION EQUALS TO ITEMS INDEX
			//**** USE [] SELECTOR TO SELECT CANDIDATE IN THE
			//**** NEW ARRAY DEFINED ABOVE
			var candidateObj = newArray[$(this).attr('value')];
			var candidate = {
				name: candidateObj.name.split(',').reverse().join(' ').toLowerCase(),
				money: candidateObj.total_contributions.commafy(),
				state: candidateObj.state
			};

			//**** HANDLEBARS TEMPLATING
			var peepSource = $('#peepBoxTemp').html();
			var compiledPeepTemplate = Handlebars.compile(peepSource);
			var person = {
				peepName: candidate.name,
				peepState: candidate.state,
				peepMoney: candidate.money
			};
			var peepTemplate = compiledPeepTemplate(person);
			$('#peepBox').append(peepTemplate);

			//**** IF STATEMENT CHECKS ON CANDIDATE PARTY TO SHOW ICONS ACCORDINGLY
			if (candidateObj.party === 'D') {
				$('.peepParty').append("<img src=\"images/donkey.png\" alt=\"democrat donkey logo\">");
				$('.peepBox h3').css("color", "#002868");
			} else if (candidateObj.party === "R") {
				$('.peepParty').append("<img src=\"images/elephant.svg\" alt=\"republican elephant logo\">");
				$('.peepBox h3').css("color", "#BF0A30");
			} else {
				$('.peepParty').append("<img src=\"images/independent.png\" alt=\"letter I cut out from american flag\">");
				$('.peepBox h3').css("color", "gray");
			}
		}); //$('.item').onClick

		$('form').on('submit', function (e) {
			e.preventDefault();
			$('.infoLeft').empty();
			$('.infoRight').empty();

			//**** FILTER ORIGINAL ARRAY OF ITEMS BY PARTY AFFILIATION
			//**** STORES NEW INFO IN NEW ARRAY
			var dems = newArray.filter(function (newArray) {
				return newArray.party === "D";
			}); //var dems
			var rep = newArray.filter(function (newArray) {
				return newArray.party === "R";
			}); //var Reps

			//**** FILTER ARRAY DEFINED ABOVE BY USER'S STATE SELECTION
			var userPeepD = dems.filter(function (dems) {
				return dems.state === $('select').val();
			});
			var userPeepR = rep.filter(function (rep) {
				return rep.state === $('select').val();
			});
			//**** SORT OUT TWO FILERED ARRAY BY VALUE OF 'total_contributions'
			var sortPeeps = function sortPeeps(a, b) {
				if (parseFloat(a.total_contributions) > parseFloat(b.total_contributions)) {
					return -1;
				}
				if (parseFloat(a.total_contributions) < parseFloat(b.total_contributions)) {
					return 1;
				}
				return 0;
			};
			var userPeepNewD = userPeepD.sort(sortPeeps);
			var userPeepNewR = userPeepR.sort(sortPeeps);

			//**** POPULATE INFOMATION ON TO TWO CARDS
			var makeCard = function makeCard(object, card) {
				//**** FURTHER CLEANING UP NAMES
				//**** USE COMMAFY TO AD COMMAS TO TOTAL CONTRIBUTION NUMBER
				var fullName = object.name.split(", ").reverse().join(" ").split(' ');
				fullName = fullName[0] + " " + fullName[fullName.length - 1];
				var money = object.total_contributions.toLocaleString().commafy();
				var articleItem = voteApp.getArticles(fullName, card);
				//**** HANDLEBARS JS TEMPLATING
				var userPeepSource = $('#userPeepTemp').html();
				var template = Handlebars.compile(userPeepSource);
				var userPeep = {
					userPeepName: fullName,
					userPeepMoney: money
				};
				var userPeepTemplate = template(userPeep);
				$(card).append(userPeepTemplate);
			};
			//**** INFORMATION EXISTS ABOUT CANDIDATES, APPEND INFORMATION
			//**** ELSE, SEND MESSAGE TO USER
			if (userPeepNewR.length) {
				makeCard(userPeepNewR[0], ".infoRight");
			} else {
				$('.infoRight').append("<h3>Looks like the republican running in your state hasn't filed with the FEC yet :( </h3>");
			};
			if (userPeepNewD.length) {
				makeCard(userPeepNewD[0], ".infoLeft");
			} else {
				$('.infoLeft').append("<h3>Looks like the democrat running in your state hasn't filed with the FEC yet :( </h3>");
			};
		}); //form on sumbit
	}); //.done
	// .when
};
$(function () {
	voteApp.init();
});
