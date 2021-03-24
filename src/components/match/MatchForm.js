import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from 'react-router-dom'
import { MatchContext } from "./MatchProvider";
import "./Match.css"

export const MatchForm = () => {
    const { getMatches, getMatchById, addMatches, editMatch } = useContext(MatchContext)
    const [user] = useState({ name: "" })
    const history = useHistory()
    const { matchId } = useParams()

    const [isLoading, setIsLoading] = useState(true)

    const [match, setMatch] = useState({
        userId: parseInt(sessionStorage.getItem("app_user_id")),
        opponentsName: "",
        userWin: false,
        timeStamp: ""
    })

    const handleControlledInputChange = (event) => {
        const newMatch = { ...match }
        newMatch[event.target.id] = event.target.value
        newMatch.timeStamp = Date.now()
        setMatch(newMatch)
    }

    const handleSaveMatch = () => {
        if (match.opponentsName === "") {
            window.alert("Please enter your opponent's name")
        } else {
            setIsLoading(true)
            if (matchId) {
                editMatch({
                    userId: match.userId,
                    opponentsName: match.opponentsName,
                    userWin: false,
                    timeStamp: match.timeStamp,
                    id: match.id
                })
                    .then(() => history.push("/scorecards"))
            } else {
                addMatches(match)
                    // userId: parseInt(sessionStorage.getItem("app_user_id")),
                    // opponentsName: "",
                    // userWin: false,
                    // timeStamp: ""

                    .then((matchId) => history.push(`/matches/${matchId.id}/throws/create`))
            }
        }
    }

    useEffect(() => {
        getMatches().then(() => {
            if (matchId) {
                getMatchById(matchId)
                    .then(match => {
                        setMatch(match)
                        setIsLoading(false)
                    })
            } else {
                setIsLoading(false)
            }
        })
    }, [])

    return (
        <form className="matchForm">
            <h2>Start Match</h2>
            <fieldset>
                <div>Welcome, {user.name}</div>
                <div className="form-group">
                    <label htmlFor="opponentsName">Enter your challenger's name</label>
                    <input type="text" id="opponentsName" required className="form-control" placeholder="Opponent's Name" onChange={handleControlledInputChange} value={match.opponentsName} />
                </div>
                <button className="btn btn-primary"
                    disabled={isLoading}
                    onClick={event => {
                        event.preventDefault()
                        handleSaveMatch()
                    }}>
                    Let's throw some axes!
            </button>
            </fieldset>
        </form>
    )
}