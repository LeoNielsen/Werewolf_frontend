import { useRef, useState } from 'react'
import { useEffect } from 'react'
import facade from '../../apiFacade';


function Village({ host, data, current, setCurrent, votePage, displayCharacter }) {

    const Ref = useRef(null);
    const [timer, setTimer] = useState('00:50');
    const [timerColor, setTimerColor] = useState('white');
    const [timerHasStopped, setTimerHasStopped] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [show, setShow] = useState(false);


    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    }

    useEffect(() => {
        setTimeout(() => {
            setShow(true);
        }, 1000);
    }, [])


    useEffect(() => {
        const intervalId = setInterval(() => {
        if(data.gameid != undefined) {

            console.log(data.gameid);
            facade.getCurrentRound(data.gameid).then(data => {
                setCurrent(data)
            });
        }
        },500)
        return () => clearInterval(intervalId);
    },[])


    const start = (e) => {
        let { total, minutes, seconds } = getTimeRemaining(e);
        if (isPaused) {
            setTimer("00:00");
            return;
        } else {
            if (total >= 0) {
                setTimer(
                    (minutes > 9 ? minutes : '0' + minutes) + ":" +
                    (seconds > 9 ? seconds : '0' + seconds)
                )
                if (minutes == 0 && seconds < 31) {
                    setTimerColor("red");

                    if (seconds == 0) {
                        setTimerHasStopped(true);
                    }
                }
            }
        }
    }

    const clear = (e) => {
        //change time here
        setTimer("00:50");
        if (Ref.current) clearInterval(Ref.current);

        const id = setInterval(() => {
            start(e);
        }, 1000)
        Ref.current = id;
    }

    const getDeadTime = () => {
        let deadline = new Date();
        //change time here
        deadline.setSeconds(deadline.getSeconds() + 50)
        return deadline;
    }

    function stop() {
        clearInterval(Ref.current)
        setTimerHasStopped(true);
        votePage();
    }

    useEffect(() => {
        console.log("stopTimer");
        if (timerHasStopped) {
            if (host) {
                votePage()
            }
        }
    }, [timerHasStopped, setTimerHasStopped])


    useEffect(() => {
        console.log("one timer 2");
        clear(getDeadTime());
    }, []);

    const onClickReset = () => {
        setTimerColor("white")
        clear(getDeadTime());
    }

    return (
        <>
            <div className='game-layout'>
                {/* Round/village page */}
                <div className='header'>
                    <div className='left'></div>
                    <div className='center'></div>
                    <div className='right'><h1 className='day-count'>DAY {current.day}</h1></div>
                </div>

                <div className='round-section'>
                    <div className='headline'>
                        <h1 className='title'>{current.isDay ? "Day" : "Night"}</h1>
                        <h1 className='timer' style={{ color: timerColor }}>{timer}</h1>
                        <p className='description'>Discuss who you think are a werewolf!</p>
                    </div>

                </div>
                <div className='footer'>
                    <div className='left'><button className='character-btn' onClick={displayCharacter}><i className="fa fa-user-circle"></i></button></div>
                    <div className='center'>
                        {
                             show && host && <button className='btn-green' onClick={stop}>Stop now</button>
                        }
                    </div>
                    <div className='right'></div>
                </div>
            </div>
        </>
    );
}

export default Village;