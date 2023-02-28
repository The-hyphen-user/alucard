# discord bot that responds with openai's chatgpt responses


##
thing you will need to make this work


a discord bot (free and easy to make one)<br>
sign up for an open ai api key cost very very little per use<br>
a place to host the code<br>
## instructions to use:

**git clone the repo**<br>
$git clone https://github.com/The-hyphen-user/alucard.git

**make a .env file with** <br>
BOT_TOKEN for your discord bot token <br>
GUILD_ID for the discord server you would like it to work in <br>
OPENAI_API_KEY for your api key from openai

**build the docker container**
$docker build -t <container-name> .

**run the docker container**
$docker run <container-name>

