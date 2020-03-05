const {Client, RichEmbed} = require(`discord.js`);
const client = new Client()
const prefix = `#>`
const SQLite = require('better-sqlite3');
const addressSQL = new SQLite('./address.sqlite');



//
//
client.on(`ready`, () => {
    //
    console.log(`The Bot Is Ready`)
    //

    const sqlTable = addressSQL
		.prepare(
			"SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'address';"
		)
		.get();
	if (!sqlTable['count(*)']) {
		// If the table isn't there, create it and setup the database correctly.
		addressSQL
			.prepare(
				'CREATE TABLE address (name TEXT PRIMARY KEY, address TEXT);'
			)
			.run();
		// Ensure that the "id" row is always unique and indexed.
		addressSQL
			.prepare(
				'CREATE UNIQUE INDEX idx_address_id ON address (name);'
			)
			.run();
            addressSQL.pragma('synchronous = 1');
            addressSQL.pragma('journal_mode = wal');
	}

	// And then we have two prepared statements to get and set the score data.
	bot.getAddressSQL = addressSQL.prepare(
		'SELECT * FROM address WHERE name = ?'
    );
    bot.getRandomAddressSQL = addressSQL.prepare(
        'SELECT * FROM table ORDER BY RANDOM() LIMIT 1;'
    );
	bot.setAddressSQL = addressSQL.prepare(
		'INSERT OR REPLACE INTO address (name, address) VALUES (@name, @address);'
	);
	

});

client.on(`message`, async (message) => {
    //
    //
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(' ');
    const cmd = args.shift().toLowerCase();
    //
    //

    if(cmd === `help`) {
        //
        //
        let helpEmbed = new RichEmbed ()
        .setTitle(`${message.guild.name}'s\nHelp Menu`)
        .setTimeStamp()
        .setAuthor(`${message.guild.name}`)
        .addField(`address, myaddress`);
        message.channel.send(helpEmbed);
        //
        //
    }

    if(cmd === `address`) {
        message.channel.send(getRandomAddressSQL.run())

    

    }
})

bot.login(``)