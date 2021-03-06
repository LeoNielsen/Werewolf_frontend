import React, {useState, useEffect} from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import "../styles/Join.css"

const Join = ({ loggedIn}) => {
  loggedIn = true
  let navigate = useNavigate();

  const [error, setError] = useState("")
  const [data, setData] = useState({ name:"", room:"", role:"" })

  const handleChange = e => {
      setData({
          ...data, 
          [e.target.name]: e.target.value
      })
  }

  const validation = () => {
      if(!data.name){ 
          setError("Please enter your name.")
          return false
      }
      if(!data.room){ 
          setError("Please select room.")
          return false
      } 
      setError("")
      return true
  }

  const handleSubmit = e => {
      e.preventDefault()
      const isValid = validation()
      if(isValid){
          navigate(`/chat/${data.room}`, { state: data });
      }
  }

  return (
      <div>
          {loggedIn?
          <form className='form-box center-text' onSubmit={handleSubmit}>
              <div>
                  <h2>Join game</h2>
              </div>
              <div >
                  <input type="name" className='joinInput' name="name" placeholder="Enter name" onChange={handleChange} />
              </div>
              <select name="role" aria-label="Default select example" onChange={handleChange}>
                      <option value="">Select Role</option>
                      <option value="werewolf">Werewolf</option>
                      <option value="villager">Villager</option>
                  </select>
              <div>
              <input type="name" className='joinInput' name="room" placeholder="Enter pin" onChange={handleChange} />
              
              </div>
              <button className='button' type="submit">Submit</button>
              {error ? <small>{error}</small> : "" }
          </form>
          :
          <div>
            <h3>Please Login</h3>
     <NavLink to="/login">Login</NavLink>
          </div>
}
      </div>
  )
}

export default Join