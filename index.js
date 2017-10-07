// Setting up the client
const Discordie = require('discordie');
var Client = new Discordie();

// Requiring libraries
const CommandClass = require('./Structures/Command.js');
const fs = require('fs');
const path = require('path');
const ClientConfig = require('./config.json');
const Prefix = ClientConfig.CommandPrefix || '?';

// Logging on
Client.connect({token:ClientConfig.ClientToken});

// Set up
var CommandsFolder = fs.readdirSync('./Commands');
var StructuresFolder = fs.readdirSync('./Structures');
var Utility = require('./Utility.js');

var CommandList = {};

function createCommandList() {
    if (CommandsFolder.length > 0) {
        for (var i in CommandsFolder) {
            const Library = require('./Commands/' + CommandsFolder[i]);
            if (Library) {
                CommandList[i] = Library;
            } else {
                console.error('Nothing was returned from the command ' + CommandsFolder[i]);
            }
        }
    } else {
        console.error('No commands found in Commands folder');
    }
}

function updoot(e,Amount) {
    if (e.emoji.name == ClientConfig.UpvoteEmoji && e.message != null) {
        const Message = e.message;
        const Author = Message.author;
        const Upvoter = e.user;
        if (Upvoter == Author) { return false; };
        // Establish profile
        var Profile = Utility.getProfile(Author.id);
        if (!Utility.profileExists(Author.id)) {
            Profile = Utility.createProfile(Author);
        }
        // 
        Utility.updateProfile(Author.id,'Upvotes',Profile.Upvotes + Amount);
    }
}

// Event Emitters
Client.Dispatcher.on("GATEWAY_READY", e => {
    console.log("// DANbot is online.");
})

Client.Dispatcher.on("MESSAGE_CREATE", e => {
    const Message = e.message;
    const Channel = Message.channel;
    const Author = Message.author;
    const Content = Message.content;
    //
    if (Content.substr(0,1) == Prefix) {
        const Data = Utility.parseMessage(Content);
        for (var i in CommandList) {
            var Command = CommandList[i];
            Command = new Command(Client);
            if (Command.Command == Data[0]) {
                Data.splice(0,1);
                Command.run(e.message,Data);
                return;
            }
            delete Command;
        }
        if (Data[0] == 'help') {
            var HelpCommand = Data[1];
            var HelpOutput = 'Sorry, I couldn\'t find that command. Use **' + Prefix + 'help** for a list of commands.';
            if (!HelpCommand) { HelpOutput = ''; }
            for (var i in CommandList) {
                var Command = CommandList[i];
                Command = new Command(Client);
                if (HelpCommand && Command.Command == HelpCommand) {
                    HelpOutput = 
                    '**Command: **' + Command.Command + '\n' +
                    '**Description: **' + Command.Description + '\n' + 
                    '**Usage: **' + Prefix + Command.Usage + '\n' +
                    '**NSFW: **' + Command.NSFW;
                } else if (!HelpCommand) {
                    HelpOutput += '**' + Command.Command + ': **' + Command.Description + '\n';
                }
            }
            Channel.sendMessage(HelpOutput);
        }
    }
})

Client.Dispatcher.on("MESSAGE_REACTION_ADD", e => {
    updoot(e,1);
})

Client.Dispatcher.on("MESSAGE_REACTION_REMOVE", e => {
    updoot(e,-1);
})

createCommandList();