const Command = require('../Structures/Command.js');
const Utility = require('../Utility.js');
//
const Snekfetch = require('snekfetch');
const ParseString = require("xml2js").parseString;
//
var URLTemplate = 'https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=1'
var SearchLimit = 200000;

var SendMessages = [
    'I can\'t belive I\'m posting this...',
    'Oh, you\'re into... THAT...',
    '>:(',
    'I\'m not a slave, you know...',
    'Wow, there really IS porn for everything!',
    'Gonna jack off to this one, aren\'t ya.',
    'I\'m so embarrased to be your bot...'
]

module.exports = class R34SearchCommand extends Command {
    constructor (Client) {
        super(Client, {
            Name: "R34Search",
            Command: "r34",
            Description: "Searches r34 with a given tag",
            Usage: "r34 <tag(s)>",
            NSFW: true,
        })
    }
    
    run (Message,Args) {
        const Author = Message.author;
        const Channel = Message.channel;
        // 
        if (Args.length == 0) {
            Channel.sendMessage('I need some tags to search with idiot.');
            return false;
        } else {
            var URL = URLTemplate + '&tags=';
            for (var i in Args) {
                URL += Args[i];
                if (i < Args.length - 1) {
                    URL += '+';
                }
            }
            // get result count
            console.log(URL);
            Snekfetch.get(URL).then(Data => {
                if (Data.status >= 400) {
                    return null;
                }
                ParseString(Data.text, function(Error, Result) {
                    var PostCount = Result.posts['$'].count;
                    if (PostCount == null) {
                        Channel.sendMessage('There was an error looking for the post count... Sorry...');
                    } else {
                        if (PostCount > 0) {
                            if (PostCount > SearchLimit) { PostCount = SearchLimit };
                            var RandomID = Math.floor(Math.random() * PostCount);
                            URL = URL += '&pid=' + RandomID;
                            //
                            Snekfetch.get(URL).then(Data => {
                                if (Data.status >= 400) {
                                    Channel.sendMessage('There was a 404 error... Even I can\'t fix this...');
                                    return false;
                                } else {
                                    ParseString(Data.text,function(Error,Result) {
                                        if (!Result.posts) {
                                            Channel.sendMessage('There weren\'t any results?! But isn\'t that the point of Rule34?!');
                                            return false;
                                        }
                                        var URL = Result.posts.post[0]["$"].file_url;
                                        if (!URL || URL == '') {
                                            Channel.sendMessage('There wasn\'t a result for the image? How could this be?');
                                            return false;
                                        }
                                        // Finally sending the message
                                        var SendMessage = SendMessages[Math.floor(Math.random() * SendMessages.length)];
                                        Channel.sendMessage(SendMessage + '\n' + 'https:' + URL);
                                    })
                                }
                            });
                        } else {
                            Channel.sendMessage('There weren\'t any results?! But isn\'t that the point of Rule34?!');
                        }
                    }
                })
            });
        }
    }
}