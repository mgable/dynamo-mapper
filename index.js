(function(){
	"use strict";

	// var aws = require('aws-sdk');
	// aws.config.loadFromPath('./config.json');
	// var dynamodb = new aws.DynamoDB();
	var dynamodbMapper = require('dynamodb-mapper');

// build your map 
var myMap = {
	myStringHashKey: { type: 'S', hashKey: true },
	myDateRangeKey: { type: 'D', rangeKey: true },
	myString: { type: 'S' },
	myDate: { type: 'D' },
	myNumber: { type: 'N' },
	myMap: { 
		type: 'M', 
		map: {
			myMapString: { type: 'S' },
			myMapDate: { type: 'D' },
			/* ... */
		},
	},
	myJsonAsString: { type: 'O' },
	myListOfNumbers: {
		type: 'L',
		valueMap: { type: 'N' },
	},
	myListOfMaps: {
		type: 'L',
		valueMap: { 
			type: 'M', 
			map: {
				myMapString: { type: 'S' },
				myMapDate: { type: 'D' },
				/* ... */
			},
		},
	},
	myStringSet: { type: 'SS' },
};

// create your mapper 
// NOTE: you should do it once and reuse it 
var myMapper = new dynamodbMapper.Mapper(myMap);

// create my test data 
var myData = {
	myStringHashKey: 'my-hash-key-goes-here',
	myDateRangeKey: new Date(),
	myString: 'my-string-here',
	myDate: new Date(),
	myNumber: 1234,
	myMap: {
		myMapString: 'my-map-string-here',
		myMapDate: new Date(),
	},
	myJsonAsString: {
		value1: 'first value',
		value2: new Date(),
	},
	myListOfNumbers: [
	1234,
	5678,
	9012,
	],
	myListOfMaps: [
	{
		myMapString: 'my-map-string-here-1',
		myMapDate: new Date(),
	},
	{
		myMapString: 'my-map-string-here-2',
		myMapDate: new Date(),
	},
	],
	myStringSet: [
	'abc',
	'def',
	],
};

// convert javascript object to attribute updates 
var attributeUpdates = myMapper.toAttributeUpdates(myData);

//console.info(JSON.stringify(attributeUpdates, null, 4));

// get the key (hash and range) 
var key = myMapper.toKey(myData);

//console.info(JSON.stringify(key, null, 4));
var data = {"L":[{"M":{"awslogs":{"M":{"data":{"S":"H4sIAAAAAAAAAHWPwQqCQBCGX0Xm7EFtK+smZBEUgXoLCdMhFtKV3akI8d0bLYmibvPPN3wz00CJxmQnTO41whwWQRIctmEcB6sQbFC3CjW3XW8kxpOpP+OC22d1Wml1qZkQGtoMsScxaczKN3plG8zlaHIta5KqWsozoTYw3/djzwhpLwivWFGHGpAFe7DL68JlBUk+l7KSN7tCOEJ4M3/qOI49vMHj+zCKdlFqLaU2ZHV2a4Ct/an0/ivdX8oYc1UVX860fQDQiMdxRQEAAA=="}}}}},{"M":{"invokeid":{"S":"b6b7ae18-34c2-11e7-8ce4-d7e5f4bb3f89"},"functionVersion":{"S":"$LATEST"},"logGroupName":{"S":"/aws/lambda/log-collector-to-dynamo-1"},"functionName":{"S":"log-collector-to-dynamo-1"},"memoryLimitInMB":{"S":"128"},"awsRequestId":{"S":"b6b7ae18-34c2-11e7-8ce4-d7e5f4bb3f89"},"logStreamName":{"S":"2017/05/09/[$LATEST]5906e77c2f63420ca992664721641c64"},"invokedFunctionArn":{"S":"arn:aws:lambda:us-west-1:727578435510:function:log-collector-to-dynamo-1"},"callbackWaitsForEmptyEventLoop":{"BOOL":true}}}]}

var myDataFromAws = myMapper.fromAttributeValues(data);

console.info(myDataFromAws);

// send the updates to dynamodb 
// dynamodb.updateItem({
// 	Key: key,
// 	TableName: 'mydynamodbtablename',
// 	AttributeUpdates: attributeUpdates,
// }, function (updateErr, updateData) {

// 	if (updateErr) {
// 		// do something dramatic because we errored 
// 		throw updateErr;
// 	}
	
// 	// let's fetch our data 
// 	return dynamodb.getItem({
// 		Key: key,
// 		TableName: 'mydynamodbtablename',
// 	}, function (getErr, getData) {
// 		if (getErr) {
// 			// do something dramatic because we errored 
// 			throw getErr;
// 		}
		
// 		// convert the DynamoDB item to Javascript Object 
// 		var myDataFromAws = myMapper.fromAttributeValues(getData.Item);
		
// 		// we now have the data converted from attribute values back in javascript object format 
// 	});
	
// });
})();