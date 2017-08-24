const Command = require('../Structures/Command.js');
const Utility = require('../Utility.js');

module.exports = class SetNicknameClass extends Command {
    constructor (Client) {
        super(Client, {
            Name: 'SetNickname',
            Command: 'nickname',
            Description: 'Sets your nickname',
            NSFW: false,
        })
    }

    run(Message,Args) {
        const Channel = Message.channel;
        const Author = Message.author;
        if (!Args.length > 0) {
            Channel.sendMessage('No nickname was given');
            return false;
        }
        //
        const Nickname = Args[0];
        if (Utility.isNicknameAvailable(Nickname)) {
            var Profile = Utility.getProfile(Author.id);
            if (!Profile) {
                Profile = Utility.createProfile(Author,Nickname);
            } else {
                Utility.updateProfile(Author.id,'Nickname',Nickname);
            }
            Channel.sendMessage('Your nickname has been updated to ' + Nickname);
        } else {
            Channel.sendMessage('That nickname is already taken. Try a different nickname');
        }
    }
}