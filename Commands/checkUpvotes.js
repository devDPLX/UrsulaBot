const Command = require('../Structures/Command.js');
const Utility = require('../Utility.js');

module.exports = class CheckUpvotesCommand extends Command {
    constructor (Client) {
        super(Client, {
            Name: "CheckUpvotes",
            Command: "upvotes",
            Description: "Checks the upvotes of the user given (yourself if a user isnt given)",
            NSFW: false,
        })
    }
    
    run (Message,Args) {
        const Author = Message.author;
        const Channel = Message.channel;
        // Establish profile
        var Profile = null;
        if (Args.length > 0) {
            var GivenNickname = Args[0];
            Profile = Utility.getProfileFromNickname(GivenNickname);
            if (!Profile) {
                Profile = null;
            }
        } else {
            Profile = Utility.getProfile(Author.id);
            if (!Profile) {
                Profile = Utility.createProfile(Author.id);
            }
        }
        // Display upvotes
        if (Profile) {
            Channel.sendMessage(Profile.Nickname + ' currently has ' + Profile.Upvotes + ' upvotes');
        } else {
            if (Args.length > 0) {
                Channel.sendMessage(Args[0] + ' doesn\'t have a profile, which means they have 0 upvotes');
            } else {
                Channel.sendMessage('That user doesn\'t exist or something');
            }
        }
    }
}