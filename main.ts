let direçãoAtual = 0
//        (N=0, L=1, S=2, O=3) VIRARDIREITA = +1, VIRARESQUERDA = -1
let speed = 25
let andarReto = true
irRemote.connectInfrared(DigitalPin.P11)
let valoresIRs = turtleBit.LineTracking()
serial.redirect(SerialPin.USB_TX, SerialPin.P13, BaudRate.BaudRate115200)
serial.setRxBufferSize(72)
function andando() {
    let valoresIRs: number;
    let andarReto = true
    while (andarReto) {
        valoresIRs = turtleBit.LineTracking()
        if (valoresIRs != 0) {
            basic.showLeds(`
                . # # # .
                # . # . #
                # # . # #
                # . # . #
                . # # # .
                `)
            basic.pause(50)
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `)
            basic.pause(950)
            turtleBit.state(MotorState.stop)
            basic.clearScreen()
            andarReto = false
            serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function on_data_received() {
                let leituraImagem: string;
                
                leituraImagem = serial.readString()
                serial.writeString(leituraImagem)
                if (leituraImagem.indexOf("VIRARESQUERDA") >= 0) {
                    direçãoAtual = direçãoAtual - 1
                    if (direçãoAtual <= -1) {
                        direçãoAtual = 3
                    }
                    
                    turtleBit.run(DIR.Run_back, speed)
                    basic.pause(350)
                    turtleBit.run(DIR.Turn_Left, speed)
                    basic.pause(1900)
                    turtleBit.run(DIR.Run_forward, speed)
                    basic.pause(350)
                    turtleBit.state(MotorState.stop)
                } else if (leituraImagem.indexOf("VIRARDIREITA") >= 0) {
                    direçãoAtual += 1
                    if (direçãoAtual >= 4) {
                        direçãoAtual = 0
                    }
                    
                    turtleBit.run(DIR.Run_back, speed)
                    basic.pause(350)
                    turtleBit.run(DIR.Turn_Right, speed)
                    basic.pause(2000)
                    turtleBit.run(DIR.Run_forward, speed)
                    basic.pause(350)
                    turtleBit.state(MotorState.stop)
                } else if (leituraImagem.indexOf("ANDARNORTE") >= 0 && direçãoAtual == 0) {
                    andando()
                } else if (leituraImagem.indexOf("ANDARLESTE") >= 0 && direçãoAtual == 1) {
                    andando()
                } else if (leituraImagem.indexOf("ANDARSUL") >= 0 && direçãoAtual == 2) {
                    andando()
                } else if (leituraImagem.indexOf("ANDAROESTE") >= 0 && direçãoAtual == 3) {
                    andando()
                } else {
                    basic.showIcon(IconNames.Angry)
                }
                
            })
        } else {
            valoresIRs = turtleBit.LineTracking()
            turtleBit.run(DIR.Run_forward, speed)
        }
        
    }
}

andando()
