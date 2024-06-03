//Render del chat
export const messagesController = async (request, response) =>{
    response.render('chat', {
        style: "viewsHandlebars.css"
    })
}