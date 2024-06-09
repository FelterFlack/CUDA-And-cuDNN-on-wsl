const socket = new WebSocket("ws://localhost:6060");

var term = new window.Terminal({
    cursorBlink: true
});
term.open(document.getElementById('terminal'));

function fitTerminal() {
    const terminalContainer = document.getElementById('terminal');
    const cols = Math.floor(terminalContainer.clientWidth / term._core._renderService.dimensions.actualCellWidth);
    const rows = Math.floor(terminalContainer.clientHeight / term._core._renderService.dimensions.actualCellHeight);
    term.resize(cols, rows);
}

function init() {
    if (term._initialized) {
        return;
    }

    term._initialized = true;

    term.prompt2 = () => {
        term.write('\r\n$ ');
    };
    term.prompt2(); // Corrected the function call

    term.onKey(key => {
        runCommand(term, key.key);
    });
    var ENVname
    var Version
    var DistroName
    window.onclick = e => {
        const target = e.target; // Corrected the syntax error
        if (target.tagName === 'P') {
            let command = target.getAttribute('data-tooltip');
            if (command) {
                if (command.includes('<DistroName>')) {
                    if (DistroName) {
                        command = command.replace('<DistroName>', DistroName);
                    }else{
                        DistroName = prompt("Distro ismini Giriniz", "Ubuntu");
                    }
                    if (DistroName) {
                        command = command.replace('<DistroName>', path);
                    } else {
                        NotificationDiv = document.getElementById("Notification");
                        if (isElementInViewport(NotificationDiv) == false)  {
                            NotificationDiv.scrollIntoView({ behavior: 'smooth' });
                        }
                        NotificationDiv.innerHTML = '<div class="danger shake"><i class="fa fa-exclamation-triangle rotate"></i>&nbsp; &nbsp;<span>Distor Girilmedi</span></div>';
                        setTimeout(() => {
                            NotificationDiv.innerHTML = '';
                        }, 2000);
                        return; // If no path is provided, do nothing
                    }
                }
                if (command.includes('wsl --install --no-distribution')) {
                    alert("İşlemden Sonra Lütfen Bilgisayarınızı Yeniden Başlatın"); 
                }
                if (command.includes('<ENV>')) {
                    if (ENVname) {
                        command = command.replace('<ENV>', ENVname);
                    }else{
                        ENVname = prompt("ENV ismini Giriniz", "");
                    }
                    if (ENVname) {
                        command = command.replace('<ENV>', ENVname);
                    } else {
                        NotificationDiv = document.getElementById("Notification");
                        if (isElementInViewport(NotificationDiv) == false)  {
                            NotificationDiv.scrollIntoView({ behavior: 'smooth' });
                        }
                        NotificationDiv.innerHTML = '<div class="danger shake"><i class="fa fa-exclamation-triangle rotate"></i>&nbsp; &nbsp;<span>ENV İsmi Girilmedi</span></div>';
                        setTimeout(() => {
                            NotificationDiv.innerHTML = '';
                        }, 2000);
                        return; // If no ENVname is provided, do nothing
                    }
                }

                if (command.includes('<VERSION>')) {
                    if (Version) {
                        command = command.replace('<VERSION>', Version);
                    }else{
                        Version = prompt("Python Versiyonu Giriniz 	3.9 3.10 3.11 3.12 Arasından!", "3.12");
                    }
                    if (Version) {
                        command = command.replace('<VERSION>', Version);
                    } else {
                        NotificationDiv = document.getElementById("Notification");
                        if (isElementInViewport(NotificationDiv) == false)  {
                            NotificationDiv.scrollIntoView({ behavior: 'smooth' });
                        }
                        NotificationDiv.innerHTML = '<div class="danger shake"><i class="fa fa-exclamation-triangle rotate"></i>&nbsp; &nbsp;<span>Pyrhon Versiyonu Girilmedi</span></div>';
                        setTimeout(() => {
                            NotificationDiv.innerHTML = '';
                        }, 2000);
                        return; // If no Version is provided, do nothing
                    }
                }
                runCommand(term, command);
                runCommand(term, '\r\n'); // Ensure the command runs
            } else {
                console.log("no data-tooltip attribute found");
            }
        }
    }


    function isElementInViewport (el) {
    
        var rect = el.getBoundingClientRect();
    
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
        );
    }

    window.oncontextmenu = e => {
        e.preventDefault();
        const target = e.target; // Corrected the syntax error
        console.log(target.tagName);
        if (target.tagName === 'P') {
            let command = target.getAttribute('data-tooltip');
            navigator.clipboard.writeText(command);
            NotificationDiv = document.getElementById("Notification");
            if (isElementInViewport(NotificationDiv) == false)  {
                NotificationDiv.scrollIntoView({ behavior: 'smooth' });
            }            NotificationDiv.innerHTML = '<div class="center"><div class="check"><i class="far fa-check-circle color"></i> &nbsp; &nbsp;<span>Komut Başarıyla Kopyalandı</span></div>';
            setTimeout(() => {
                NotificationDiv.innerHTML = '';
            }, 2000);
        }
    }
    setTimeout(() => {
        runCommand(term, 'clear');
        runCommand(term, '\r\n');
    }, 1000);

    // Pencere yeniden boyutlandırıldığında terminali yeniden boyutlandır
    window.addEventListener('resize', fitTerminal);
    fitTerminal(); // İlk yüklemede terminali uygun boyuta getir
}

socket.onmessage = (event) => {
    term.write(event.data);
}

function runCommand(term, command) {
    socket.send(command);
}

init();
