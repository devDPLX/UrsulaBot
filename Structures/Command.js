var Discordie = require('discordie');

module.exports = class Command extends Discordie {
    constructor (DiscordieClient,CommandData) {
        super ({});
        
        for (var i in CommandData) {
            this[i] = CommandData[i];
        }

    }
}