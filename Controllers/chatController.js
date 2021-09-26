const express = require('express');
const Message = require('../Models/Message')
const route = express.Router();

var lodash = require('lodash');

const { encode } = require('../node_modules/hex-encode-decode/index')
   
//show messages list
const getMessages = (req,res,next)  => {
	const sender = req.body.sender;
	const receiver = req.body.receiver;

	Message.updateMany({ sender: sender,receiver: receiver,seen: "false" },{ seen: "true" })
	.then(() => {

		Message.find({ $or:[ {'sender':sender,'receiver':receiver},{'sender':receiver,'receiver':sender} ]})

		.then(messages  => {
		  res.json(messages)
		})
		.catch(error  =>{
		  res.json({
			message: "an error occured when displaying messages"
		  })
		})

	})
	.catch(error => {
		console.log(error)
		res.json({message: "an error occured when updating messages"})
	})


}



const updateUnseenMessages = (req,res,next) => {
	const sender = req.body.sender;
	const receiver = req.body.receiver;
	
	Message.updateMany({ sender: sender,receiver: receiver,seen: "false" },{ seen: "true" })
	.then(() => {
		//messages seen successfully
		res.json({message: "seen success"})
	})
	.catch(error => {
		console.log(error)
		res.json({message: "an error occured when updating messages"})
	})
}

//add product
const addMessage = (req,res,next) => {

	const hexSender = encode(req.body.sender);
	const hexReceiver = encode(req.body.receiver);
	
	const discussionId = parseInt(hexSender)+parseInt(hexReceiver);

	//console.log("discussionId :",discussionId.toString());

	let message = new Message({
		sender: req.body.sender,
		receiver: req.body.receiver,
		type: req.body.type,
		message: req.body.message,
		discussionId: discussionId.toString(),
		seen:"false"
	})

	message.save()
	.then(response => {
		res.json({
			message:"message Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding message"
		})
	})
}

const generateDiscussionId = (req,res,next) => {
	const hexSender = encode(req.body.sender);
	const hexReceiver = encode(req.body.receiver);
	
	const discussionId = parseInt(hexSender)+parseInt(hexReceiver);

	res.json({
		discussionId:discussionId.toString()
	});
}

function groupBy(array,connectedUser) {
	return array.reduce((acc, obj) => {

		var property = obj["receiver"];
		if(obj["receiver"]["_id"]==connectedUser.toString()){
			property = obj["sender"];
		}

		acc[property["_id"]] = acc[property["_id"]] || [];
		acc[property["_id"]].push(obj);
		return acc;
	}, {});
};

const getConversations = (req,res,next) => {

	const connectedUser = req.body.sender;

	Message.find({ $or:[ {'sender':connectedUser},{'receiver':connectedUser} ]})
	.populate('receiver')
	.populate('sender')
	.sort({ createdAt: -1 })
	.then(conversations  => {
		const grouped = groupBy(conversations,connectedUser)
		res.json(grouped);
	})
	.catch(error  =>{
		console.log(error);
		res.json({
			message: "an error occured when displaying conversations"
		})
	})





	
}




route.post('/getMessages', getMessages); //sender(friend),receiver(connectedUser)
route.post('/addMessage', addMessage);//sender,receiver,type,message
route.post('/getConversations', getConversations); 
route.post('/generateDiscussionId',generateDiscussionId)//sender(connectedUser),receiver(friend)

route.post('/updateUnseenMessages', updateUnseenMessages) //sender(friend),receiver(connected)
module.exports = route;
