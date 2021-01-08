const express = require('express');
const path = require('path');
const app = express();
const socketIO = require('socket.io');


//Configuracion
app.set('port' ,process.env.PORT || 3000);
//Archivos Estáticos 
app.use(express.static(path.join(__dirname,'public')));

//Iniciar Servidor
const server = app.listen(app.get('port'),()=>
{
    console.log('Servidor escuchando en el puerto',app.get('port'));
})

let jugadores = [];
let turno = 0;
let turnoActual = 0;
function SiguienteTurno()
{
    turno = turnoActual++ % jugadores.length;
}
//Web Sockets
const io = socketIO(server);
io.on('connection',(socket)=>
{
    console.log('Nueva conexión:' , socket.id);
    jugadores.push(socket);

    socket.on('juego:posiciones',(posiciones)=>
    {
        socket.broadcast.emit('juego:posiciones',posiciones);
    })
    
    socket.on('juego:tiro',(coordenada)=>
    {
                socket.broadcast.emit('juego:tiro',coordenada);
    })
    socket.on('disconnect', function(){
        console.log('Jugador desconectado');
        jugadores.splice(jugadores.indexOf(socket),1);
        turno--;

      });
});
