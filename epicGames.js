import axios from "axios";
import logger from './logger.js'
import dotenv from "dotenv";
dotenv.config();
const epigGamesChannelId = process.env.EPIC_GAMES_CHANNEL_ID;

//send epic games free promotions to epicGamesChannelId
const messageDiscordNewGames = async (client) => {
    logger.info(`${new Date()}, attempting to contact epic games`)
    const response = await axios.get('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions',
        {
            params: { country: 'US', locale: 'en-US' },
            headers: { 'Access-Control-Allow-Origin': '*' }
        })
    const json = response.data;
    json.data.Catalog.searchStore.elements.forEach(e => {
        if (e.title === 'Mystery Game') {
        } else {
            const promotionalOffers = e.promotions.promotionalOffers
            // const upcommingPromotionalOffers = e.promotions.upcomingPromotionalOffers
            //^ are announced but not availible yet
            if (promotionalOffers.length === 0) {
            } else {
                const pageSlug = e.productSlug
                const channel = client.channels.cache.get(epigGamesChannelId)
                const endDate = e.promotions.promotionalOffers[0].promotionalOffers[0].endDate
                const readableDatePST = new Date(endDate).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
                channel.send(`https://www.epicgames.com/store/en-US/p/${pageSlug}`)
                channel.send(`Promotion ending ${readableDatePST}`)
            }
        }
    })
}

export default messageDiscordNewGames;