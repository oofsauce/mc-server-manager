const dom_serverLog = document.getElementById("serverLog");

const socket = io();

var logLines = [];
const pluginRegex = /\[\w+\] /;

var serverState = {};

socket.on("new log", (lines) => {
    logLines = lines;
    let newHTML = "";
    // lines = lines.slice(lines.length-10, lines.length-1);
    lines.forEach(line => {
        line = line.trim();
        if(!line) return;
        let seperatorPos = line.indexOf(':', 10);
        let metaData = line.substr(1,seperatorPos-2).split("] [");
        let fromandtype = metaData[1].split("/");
        let msg = line.substr(seperatorPos+1, line.length - seperatorPos);

        

        newHTML += `<li ${fromandtype[1] == 'ERROR' ? 'class="error"' : ''}>`;

        newHTML += `<span class="date">`;
        newHTML += metaData[0];
        newHTML += `</span>`;

        newHTML += `<span class="from" title="${fromandtype[0]}">`;
        newHTML += fromandtype[0];
        newHTML += `</span>`;

        newHTML += `<span class="type ${fromandtype[1].toLowerCase()}">`;
        newHTML += fromandtype[1];
        newHTML += `</span>`;

        let pluginMatch = pluginRegex.exec(msg);
        if(pluginMatch) {
            msg = msg.slice(pluginMatch[0].length);
            newHTML += `<span class="plugin">`;
            newHTML += pluginMatch[0];
            newHTML += `</span>`;
        }

        newHTML += `<span class="msg">`;
        newHTML += msg;
        newHTML += `</span>`;
        
        newHTML += "</li>";
    });
    dom_serverLog.innerHTML = newHTML;
    dom_serverLog.scrollTo(0,dom_serverLog.scrollHeight+10);
});

socket.on("cmd received", () => {
    dom_cmdInput.value = "";
})

socket.on("server info", data => {
    serverState = data;
})


const dom_cmdInput = document.getElementById("cmd-input");
dom_cmdInput.onkeypress = (e) => {
    console.log(e.which);
    if(e.which == 13) {
        socket.emit("send cmd", dom_cmdInput.value);
    }
}


// PLAYER CONTROL

const dom_players = document.getElementById("players");

const dom_kick    = document.getElementById("kick");
const dom_ban     = document.getElementById( "ban");
const dom_op      = document.getElementById( "op" );
const dom_deop    = document.getElementById("deop");

dom_kick.onclick = () => {
    if(!dom_players.value.trim()) return;
    socket.emit("send cmd", "kick " + dom_players.value);
}

dom_ban.onclick = () => {
    if(!dom_players.value.trim()) return;
    socket.emit("send cmd", "ban "  + dom_players.value);
}

dom_op.onclick = () => {
    if(!dom_players.value.trim()) return;
    socket.emit("send cmd", "op "   + dom_players.value);
}

dom_deop.onclick = () => {
    if(!dom_players.value.trim()) return;
    socket.emit("send cmd", "deop " + dom_players.value);
}


// TICK UPDATE

const dom_serverStat = document.getElementById('server-status');
const dom_plCount    = document.getElementById('player-count');
const dom_uptime     = document.getElementById('uptime');

const tick = () => {
    dom_uptime.innerText = parseTime(Math.round((Date.now() - serverState.startTime)/1000));
}

setInterval(tick, 1000);
