# discord bot that responds with openai's chatgpt responses

also able to scheduel api look ups to present info in chat channels  
currently set to epic free games weekly promotions  
has built in logging with winston  


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
EPIC_GAMES_CHANNEL_ID for the channel you would like promotions sent to  


**build the docker container**
$docker build -t <container-name> .

**run the docker container**
$docker run <container-name><br>
container name can be whatever you want it to be
once set up you will have access to the /chatGPT and /image commands in any channel

Example of a free game promotion notification  
![payday](https://github.com/The-hyphen-user/alucard/assets/61300812/0baa6086-3e47-4712-9d07-9eaa590abb81)

Example of chat gpt response  
Initial request someone submits  
![chatGPT initial](https://github.com/The-hyphen-user/alucard/assets/61300812/f06d4aea-2eac-4ee6-9a4a-73d9b6798bca)  
imediate response  
![Imediate response](https://github.com/The-hyphen-user/alucard/assets/61300812/34335b86-1ea9-4187-8c34-278fb99870d1)  
Full response a few seconds later that replaces the imediate response  
![full answer](https://github.com/The-hyphen-user/alucard/assets/61300812/637a344f-d7bb-4ffc-9e7a-d1124e65ab44)  

  
Example of the dall-e image creation from OpenAI  
![plant image dalle](https://github.com/The-hyphen-user/alucard/assets/61300812/24c58c3b-36f5-43aa-b0a9-df440c461e87)
