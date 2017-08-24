const Command = require('../Structures/Command.js');

module.exports = class TestCommand extends Command {
    constructor (Client) {
        super(Client,{
            Name: 'testcommand',
            Command: 'test',
            Description: 'Just a test command',
            NSFW: false,
        })
    }

    run(Message,Args) {
        Message.channel.sendMessage('works! :D');
    }
}