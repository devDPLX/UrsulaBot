const Command = require('../Structures/Command.js');
const Utility = require('../Utility.js');
//
const Snekfetch = require('snekfetch');
//
var URLTemplate = 'https://owapi.net/api/v3/u/'

module.exports = class CheckOWRank extends Command {
    constructor (Client) {
        super(Client, {
            Name: "CheckOWRank",
            Command: "owrank",
            Description: "Checks the rank of the user given (by BattleTag)",
            Usage: "owrank <battletag>",
            NSFW: false,
        })
    }
    
    run (Message,Args) {
        const Author = Message.author;
        const Channel = Message.channel;
        const BattleTag = Args[0];
        // 
        if (!BattleTag) {
            Channel.sendMessage('I need a BattleTag to search.');
            return false;
        }
        Snekfetch.get(URLTemplate + BattleTag + '/stats').then(Data => {
            Data = JSON.parse(Data.text);
            //
            const OverallStats = Data.us.stats.competitive.overall_stats;
            var Embed = [
                {'name': 'Level','value': ((OverallStats.prestige * 100) + OverallStats.level).toString()},
                {'name': 'Competitive Rank','value': (OverallStats.comprank).toString()},
                {'name': 'Win Rate','value': (OverallStats.win_rate).toString()},
            ]
            var Avatar = OverallStats.avatar;
            var UTCDate = new Date();
            //
            Channel.sendMessage('',false, {
                //color: 'f99e1a',
                title: BattleTag + '\'s Overwatch Stats',
                fields: Embed,
                footer: {"text":'Brought to you by a faggot'},
                url: "http://google.com",
                timestamp: UTCDate,
                thumbnail: {"url":Avatar},

            })
        });
    }
}