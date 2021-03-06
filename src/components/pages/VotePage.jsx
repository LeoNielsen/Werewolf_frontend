
import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import "../../styles/App.css"
import facade from '../../apiFacade'
import gameController from '../../gameController'



function VotePage({ host, current, voteResultPage, displayCharacter, playerToken }) {

    const [choosenPlayer, setChoosenPlayer] = useState("");
    const [players, setPlayers] = useState([]);
    // const [playerToken, setPlayerToken] = useState({});
    /* const [currentRound, setCurrentRound] = useState({}); */


    // MUST HAVE:sends location to the next page
    const location = useLocation()
    const [data, setData] = useState({})
    const Ref = useRef(null);
    const [timer, setTimer] = useState('00:10');
    const [timerColor, setTimerColor] = useState("white");
    const [timerHasStopped, setTimerHasStopped] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [show, setShow] = useState(false);
    /*  const [allMessages, setMessages] = useState([])
     const [msg, setMsg] = useState("")
     const [loading, setLoading] = useState(false)
     const [socket, setSocket] = useState(io) */

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


    const start = (e) => {
        let { total, minutes, seconds } = getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ":" +
                (seconds > 9 ? seconds : '0' + seconds)
            )

            if (minutes == 0 && seconds < 11) {
                setTimerColor("red");
                if (minutes == 0 && seconds == 0) {
                    setTimerHasStopped(true);
                }
            }
        }
    }

    const clear = (e) => {
        if (!timerHasStopped) {
            //change time here
            setTimer('00:10');
            if (Ref.current) clearInterval(Ref.current);

            const id = setInterval(() => {
                start(e);
            }, 1000)
            Ref.current = id;
        }
    }

    const getDeadTime = () => {
        let deadline = new Date();

        //change time here
        deadline.setSeconds(deadline.getSeconds() + 10)
        return deadline;
    }

    useEffect(() => {
        console.log("one timer 3");
        clear(getDeadTime());
    }, []);

    const onClickReset = () => {
        clear(getDeadTime());
    }

    function stop() {
        clearInterval(Ref.current)
        setTimerHasStopped(true);
        voteResultPage();
    }



    useEffect(() => {
        console.log("alive Players");
        setData(location.state)

        if (data.gameid != undefined) {
            if (players.length == 0) {
                facade.getAlivePlayers(data.gameid).then(data => setPlayers(data))
            }

        }
        if (facade.getToken() == undefined) {
            navigate("/login");
        }

    }, [data])

    useEffect(() => {
        console.log("hasVoted");
        if (!hasVoted) {
            setActiveBtn();
        }
    })

    useEffect(() => {
        console.log("stop timer 2");
        if (timerHasStopped) {
            if (host) {
                voteResultPage()
            }
        }
    }, [timerHasStopped, setTimerHasStopped])

    function vote() {
        gameController.vote(data.gameid, playerToken.id, choosenPlayer);
        setHasVoted(true);
        console.log("has voted!")
    }

    function setActiveBtn() {
        var headerdiv = document.getElementById("playerlist");
        // all html elements which have a classname named "vote"
        var btns = headerdiv.getElementsByClassName("vote");

        for (var i = 0; i < btns.length; i++) {
            // every vote has an img called profile-img which we are making an listner to
            btns[i].getElementsByClassName("profile-img")[0].addEventListener("click", function (e) {

                var current = document.getElementsByClassName("active");
                if (current[0] != undefined) {
                    // are adding to the current img style, so we still can see its active
                    current[0].className = current[0].className.replace(" active", "");
                }
                this.className += " active";
                // the selected player's index (div id) are saved with usestate
                setChoosenPlayer(e.target.id);
            });
        }
    }

    return (
        <>


            {
                hasVoted ?
                    <>
                        <div className='game-layout'>
                            <div className='header'>
                                <div className='left'><h1 style={{ color: timerColor }}>Time left: {timer}</h1></div>
                                <div className='center'></div>
                                <div className='right'><h1>DAY {current.day}</h1></div>
                            </div>
                            <div className='round-section'>
                                {/* <h1 className='title'>{current.isDay ? "Day" : "Night"}</h1>
                                 */}<h1 className='title' style={{ textAlign: "center" }}>Your voted has been recieved</h1>
                                <p className='description' style={{ paddingTop: "10px" }}>Please wait for the vote result</p>
                            </div>
                            <div className='footer'>
                                <div className='left'><button className='character-btn' onClick={displayCharacter}><i className="fa fa-user-circle"></i></button></div>
                                <div className='center'></div>
                                <div className='right'></div>
                            </div>
                        </div>

                    </>
                    :
                    <>
                        {/* Vote */}
                        <div className='vote-section'>
                            <div className='header'>
                                <div className='left'><h1 style={{ color: timerColor }}>Time left: {timer}</h1></div>
                                <div className='center'></div>
                                <div className='right'><h1>DAY {current.day}</h1></div>
                            </div>

                            <div className="banner">
                                {(current.isDay) ?
                                    /* Day voting - all*/
                                    <>
                                        <h1>Vote</h1>
                                        <p>Choose the player you want to vote for</p>
                                    </>
                                    :

                                    (playerToken.characterName == "werewolf" ?
                                        /* Night voting - werewolf */
                                        <>
                                            <h1 style={{color: "#ff0f13", textAlign: "center", maxWidth: "600px", fontSize: "50px"}}>Werewolf, you are hungry!</h1>
                                            <p>Choose the player you want to kill and eat</p>
                                        </>
                                        :
                                        /* Night voting - villagers and hunters */
                                        <>
                                            <h1 style={{textAlign: "center", maxWidth: "600px", fontSize: "50px"}}>The village are asleep</h1>
                                            <p></p>
                                        </>)


                                }

                                {/* <h1>Vote</h1>
                                <p>Choose the player you want to vote for</p> */}
                            </div>
                            <div className='joined-players-section'>
                                <div className='joined-players-scroll'>
                                    <div className='list-grid' id="playerlist">
                                        {
                                            (playerToken.characterName == "werewolf" && (!current.isDay)) ?
                                                (players.map((player) => {
                                                    if (player.characterName != "werewolf") {
                                                        // if (index == 0) {
                                                        //     {
                                                        //         if (choosenPlayer == "") {
                                                        //             setChoosenPlayer(player.id);
                                                        //         }
                                                        //     }
                                                        //     return <div key={player.id}>
                                                        //         <div className='vote'>
                                                        //             <img id={player.id} className="profile-img active" /> {/* REMEMBER! set active on one player, or else the active vote will not show  */}
                                                        //             <h3 style={{ color: 'white' }}>{player.username}</h3>
                                                        //         </div>
                                                        //     </div>
                                                        // }

                                                        return <div key={player.id}>
                                                            <div className='vote'>
                                                                <img id={player.id} className="profile-img" /> {/* REMEMBER! set active on one player, or else the active vote will not show  */}
                                                                <h3 style={{ color: 'white' }}>{player.username}</h3>
                                                            </div>
                                                        </div>
                                                    }
                                                })
                                                ) : ((current.isDay) ?

                                                    players.map((player) => {
                                                        // if (index == 0) {
                                                        //     {
                                                        //         if (choosenPlayer == "") {
                                                        //             setChoosenPlayer(player.id);
                                                        //         }
                                                        //     }
                                                        //     return <div key={player.id}>
                                                        //         <div className='vote'>
                                                        //             <img id={player.id} className="profile-img active" /> {/* REMEMBER! set active on one player, or else the active vote will not show  */}
                                                        //             <h3 style={{ color: 'white' }}>{player.username}</h3>
                                                        //         </div>
                                                        //     </div>
                                                        // }
                                                        return <div key={player.id}>
                                                            <div className='vote'>
                                                                <img id={player.id} className="profile-img" /> {/* REMEMBER! set active on one player, or else the active vote will not show  */}
                                                                <h3 style={{ color: 'white' }}>{player.username}</h3>
                                                            </div>
                                                        </div>
                                                    }
                                                    ) : (
                                                        players.map((player) => {
                                                            return <div key={player.id}>
                                                                <div >
                                                                    <img id={player.id} className="profile-img" /> {/* REMEMBER! set active on one player, or else the active vote will not show  */}
                                                                    <h3 style={{ color: 'white' }}>{player.username}</h3>
                                                                </div>
                                                            </div>
                                                        })
                                                    )
                                                )
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className='footer'>
                                <div className='left'><button className='character-btn' onClick={displayCharacter}><i className="fa fa-user-circle"></i></button></div>
                                <div className='center'>
                                    {
                                        show && host && <button className='btn-green' onClick={stop}>Stop now</button>
                                    }
                                    {
                                        // if it is day or night
                                        current.isDay ?
                                            (
                                                // if player is alive
                                                playerToken.isAlive && <button className='btn-green' onClick={vote}>Vote</button>
                                            ) : (
                                                // checks if player is alive and is a werewolf
                                                playerToken.isAlive && (playerToken.characterName == "werewolf") && <button className='kill-btn' onClick={vote}>Kill player</button>
                                            )
                                    }
                                </div>
                                <div className='right'></div>
                            </div>
                        </div>
                    </>
            }


        </>
    );
}

export default VotePage;