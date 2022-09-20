const server = io.connect();

const render = mens => {
    let elemId = document.getElementById('messages');
    let html = mens.chat.map(elem => {
        return (`<li>
                   <strong class="text-primary">${elem.email}</strong>
                   <em class="text-danger">${elem.hora}: </em>
                   <i class="text-success">${elem.msg}</i></li>`)
    }).join(" ");
    elemId.innerHTML = html;
}

const addMessage = event =>{
    const mensajeChat = {
        email : document.getElementById('email').value,
        hora: new Date().toLocaleTimeString(),
        msg: document.getElementById('msg').value
    };
    server.emit('mensaje-nuevo', mensajeChat, cb => {
        console.log(mensajeChat)
    })
    
    return false    
}

server.on('mensaje-server', mensaje => {
    render(mensaje)
    console.log('mensaje-servidor: ', mensaje);
});
