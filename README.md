# discord bot that responds with openai's chatgpt responses


## thing you will need to make this work <br>
a discord bot (free)<br>
sign up for an open ai api key cost very very little per use<br>
a place to host the code that has docker installed<br>
## instructions to use:

**Create a discord bot**
using the developer portal at discord https://discord.com/developers/applications <br>
create a discord bot and create a TOKEN (Under the Bot section)<br>
create a url using the scopes **bot** and **applications.commands** and the bot permissions **administrator** (might work with less permission i havent tried)<br>
add the bot to the discord server using the url(must have admin access)

**git clone the repo**<br>
$git clone https://github.com/The-hyphen-user/alucard.git

**make a .env file with** <br>
BOT_TOKEN for your discord bot token <br>
GUILD_ID for the discord server you would like it to work in <br>
OPENAI_API_KEY for your api key from openai


**build the docker container**
$docker build -t <container-name> .

**run the docker container**
$docker run <container-name><br>
container name can be whatever you want it to be


if you would like custome responses edit the index.js file on lines 44 and 57<br>
the interaction reply on line 44 will be overwritten with the line on 57