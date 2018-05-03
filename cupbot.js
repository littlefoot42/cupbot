// TODO: Add multiple website links for fish
// TODO: Add Fish Eyes
// TODO: Add Hookset data to fishList
// TODO: Change the horrific if > continue crap in fishToPrint
// TODO: Add pretty image of the fishy


const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
const fishdb = require("./fishList.json");
const fs = require("fs");

const infoToPrint = ["name", "bait", "folklore", "hookset", "weather", "predator", "during", "location"];
// What you want printed when you ask for !fish X

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {

  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const fishName = message.content.slice(config.prefix.length + command.length).trim();

  switch (command) {
  	case "fish" : 
  		fishInfo(fishName, message.channel);
  		break;
  	case "next" : 
  		nextWindow(fishName, message.channel);
  		break;
  }
});


function fishInfo(fishRequested, channel){
	// Find the fishy requested and return info
	// TODO: make the output less ugly (embed/print in columns/whatever)
	var found = false;

	for(var i=0; i<fishdb.length; i++){
		if(fishdb[i].name.toLowerCase() === fishRequested.toLowerCase()){
			printFish(fishdb[i], channel);
			found = true;
		}
	}

	if(!found){
		channel.send("Fish not found: " + fishRequested);
		return;
	}

	return;
}

function printFish(fishToPrint, channel){

  var fishFields = [];

  for (var key in fishToPrint) {
    if(infoToPrint.indexOf(key) != -1){
      if(key == 'predator'){
        // Get predator(s) number and name
        predatorList = [];
        for(var key2 in fishToPrint.predator){
          predatorList.push(fishToPrint.predator[key2].predatorAmount + " " + fishToPrint.predator[key2].name);
        }

        fishFields.push({"name": "Predator:", "value": predatorList.join(', '), "inline": true});
        continue;
      }

      if(key == 'during'){
        var windowAsString = fishToPrint.during.start.toString() + " to " + fishToPrint.during.end.toString();
        fishFields.push({"name": "Time:", "value": windowAsString, "inline": true});
        continue;
      }

      if(Array.isArray(fishToPrint[key])){
        fishFields.push({"name": key.charAt(0).toUpperCase() + key.slice(1), "value": fishToPrint[key].join(', '), "inline": true});
      }else{
        fishFields.push({"name" : key.charAt(0).toUpperCase() + key.slice(1), "value": fishToPrint[key], "inline" : true});
      }
    }
  }

	channel.send({embed: {
   		color: 3447003,
   		author: {
    		name: client.user.username,
      		icon_url: client.user.avatarURL
    	},

    	title: "GarlandDB Link",
      url: "https://www.garlandtools.org/db/#item/" + fishToPrint.id,
      thumbnail: {
      "url": "https://www.garlandtools.org/db/icons/item/" + fishToPrint.icon + ".png"
      }, 
    	description: "If the info here is wrong, feel free to yell at Lyra until it's fixed.",

      fields: fishFields,
    	timestamp: new Date(),
 	}
	});
}


function nextWindow(fishRequested, channel){
	// Returns the next window available for the fishy
	channel.send(fishRequested + ": Next window is at some point in the future. Maybe.");
}

client.login(config.token);