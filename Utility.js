//
const fs = require('fs');
//
var UserData = JSON.parse(fs.readFileSync('./UserData.json','utf8'));

function profileExists(userID) {
    for (var i in UserData) {
        if (i == userID) { return true; }
    }
    return false;
}

function getProfile(userID) {
    for (var i in UserData) {
        if (i == userID) {
            return UserData[i];
        }
    }
    return null;
}

module.exports = {
    parseMessage(Message) {
        var Command = Message.split(' ');
        Command[0] = Command[0].substr(1, Command[0].length);
        return Command;
    },
    // User Data [ Profiles ]
    createProfile(User,GivenNickname) {
        if (!User) { console.error('User not given to createProfile') };
        if (!GivenNickname) {
            GivenNickname = User.username;
        }
        if (!profileExists(User.id)) {
            var NewProfile = {
                Name: User.username,
                Discriminator: User.discriminator,
                Nickname: GivenNickname,
                Upvotes: 0,
            }
            UserData[User.id] = NewProfile;
            fs.writeFileSync('./UserData.json',JSON.stringify(UserData),'utf8');
            return NewProfile;
        }
        return null;
    },
    updateProfile(userID,Key,Value) {
        if (!profileExists(userID)) { console.error('That profile doesnt exist'); return false; };
        var Profile = getProfile(userID);
        if (Profile[Key] != null) {
            Profile[Key] = Value;
        }
        console.log(Profile[Key]);
        UserData[userID] = Profile;
        fs.writeFileSync('./UserData.json',JSON.stringify(UserData),'utf8');
        return Profile;
    },
    // User Data [ Nicknames ]
    isNicknameAvailable(Nickname) {
        for (var i in UserData) {
            if (UserData[i].Nickname == Nickname) {
                return false;
            }
        }
        return true;
    },
    getProfileFromNickname(Nickname) {
        for (var i in UserData) {
            if (UserData[i].Nickname == Nickname) {
                return UserData[i];
            }
        }
        return null;
    },

    profileExists: profileExists,
    getProfile: getProfile,
}