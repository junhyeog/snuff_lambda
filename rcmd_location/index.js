const builder = require('openbuilder-node');
const { restaurantModel, makeConn } = require('./rest');

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

var isConnected = false;

exports.handler = async (event) => {
	/// 1. Read Data
	console.log(`[-] event: ${JSON.stringify(event)}`);
	const body = JSON.parse(event.body);
	console.log(`[-] body: ${JSON.stringify(body)}`);
	const req = new builder.SkillPayload(body);
	console.log(`[-] req: ${JSON.stringify(req)}`);
	const region = req.action.params.region || '';
	const foodtype = req.action.params.foodtype || '';
	console.log(`[-] region: ${region}`);
	console.log(`[-] foodtype: ${foodtype}`);

	/// 2. Transaction
	// read data from DB
	console.log(`[-] isConnected: ${isConnected}`);
	if (isConnected === false) {
		await makeConn;
		isConnected = true;
	}
	console.log(`[-] isConnected after makeConn: ${isConnected}`);
	const _candidates = await restaurantModel.aggregate([
		{ $match: { locate: region, foodtype: foodtype } },
		{ $sample: { size: 10 } }
	]);
	console.log(_candidates);

	/// 3. build Result
	const ans = new builder.SkillResponse();
	ans.template.addOutput(
		new builder.Output.CarouselOutput('basicCard')
	);
	const carousel = ans.template.outputs[0];
	if (!(carousel instanceof builder.Output.CarouselOutput)) {
		return {
			statusCode: 500,
			body: "Server instance creation error"
		};
	}

	if (_candidates.length === 0) {
		const card = new builder.Card.BasicCard({
			title: "일치하는 식당이 없어요!",
			desc: `${region} - ${foodtype}에 일치하는 식당이 없어요, 다른 지역이나 메뉴로 찾아볼까요?`,
			thumbnail: ''
		});
		card.addBlockBtn({ label: "지역/종류별 찾기", messageText: "지역/종류별 찾기", blockId: "605dc0136e3f6e02418418f0" });
		carousel.addCarouselCell(card);
	}
	else {
		const candidates = shuffle(_candidates);
		for (var item of candidates) {
			const card = new builder.Card.BasicCard({
				title: item.name,
				desc: '',
				thumbnail: "https://m.rmbrme.antemrdm.com/img/antemrdm.jpg"
			});
			card.fixed = true;
			card.addLinkBtn({ label: "리뷰 보기", link: "https://m.rmbrme.antemrdm.com/img/antemrdm.jpg" });
			carousel.addCarouselCell(card);
		}
		ans.template.addQuickReply(new builder.QuickReply.BlockQuickReply('지역/종류별 찾기', '지역/종류별 찾기', '605dc0136e3f6e02418418f0'));
	}

	return {
		"isBase64Encoded": false,
		"statusCode": 200,
		"body": JSON.stringify(ans.json()),
		"headers": {
			"Content-Type": "application/json"
		}
	}
	/*
	return {
		"isBase64Encoded": false,
		"statusCode": 200,
		"body": "hihi",
		"headers": {
			"Content-Type": "application/json"
		}
	}
	*/
};
