direçãoAtual = 0    #       (N=0, L=1, S=2, O=3) VIRARDIREITA = +1, VIRARESQUERDA = -1
speed = 25
andarReto = True

irRemote.connect_infrared(DigitalPin.P11)
valoresIRs = turtleBit.line_tracking()

serial.redirect(SerialPin.USB_TX, SerialPin.P13, BaudRate.BAUD_RATE115200)
serial.set_rx_buffer_size(72)

def andando():
    andarReto = True
    while andarReto:
        valoresIRs = turtleBit.line_tracking()
        if valoresIRs != 0:
            basic.show_leds("""
                . # # # .
                # . # . #
                # # . # #
                # . # . #
                . # # # .
                """)
            basic.pause(50)
            basic.show_leds("""
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                """)
            basic.pause(950)
            turtleBit.state(MotorState.STOP)
            basic.clear_screen()
            andarReto = False
            serial.on_data_received(serial.delimiters(Delimiters.NEW_LINE), on_data_received)
        else:
            valoresIRs = turtleBit.line_tracking()
            turtleBit.run(DIR.RUN_FORWARD, speed)

def on_data_received():
    global direçãoAtual
    leituraImagem = serial.read_string()
    serial.write_string(leituraImagem)
    if "VIRARESQUERDA" in leituraImagem:
        direçãoAtual = direçãoAtual - 1
        if direçãoAtual <= -1:
            direçãoAtual = 3
        turtleBit.run(DIR.RUN_BACK, speed)
        basic.pause(350)
        turtleBit.run(DIR.TURN_LEFT, speed)
        basic.pause(1900)
        turtleBit.run(DIR.RUN_FORWARD, speed)
        basic.pause(350)
        turtleBit.state(MotorState.STOP)
        
    elif "VIRARDIREITA" in leituraImagem:
        direçãoAtual += 1
        if direçãoAtual >= 4:
            direçãoAtual = 0
        turtleBit.run(DIR.RUN_BACK, speed)
        basic.pause(350)
        turtleBit.run(DIR.TURN_RIGHT, speed)
        basic.pause(2000)
        turtleBit.run(DIR.RUN_FORWARD, speed)
        basic.pause(350)
        turtleBit.state(MotorState.STOP)
        
    elif "ANDARNORTE" in leituraImagem and direçãoAtual == 0:
        andando()

    elif "ANDARLESTE" in leituraImagem and direçãoAtual == 1:
        andando()

    elif "ANDARSUL" in leituraImagem and direçãoAtual == 2:
        andando()

    elif "ANDAROESTE" in leituraImagem and direçãoAtual == 3:
        andando()

    else:
        basic.show_icon(IconNames.ANGRY)

andando()
