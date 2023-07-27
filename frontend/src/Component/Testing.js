import React, {useEffect, useState} from 'react'

function Testing() {
    const [count, setCount] = useState(1);
    // useEffect(() => {
    //     console.log("This is our use effect")
    // }, [])
    useEffect(() => {
        console.log(`This current count is : ${count}`)
    }, [count])

    function IncreaseCount(){
        setCount(current => current + 1);
    }
    function DecreaseCount(){
        setCount(current => current - 1);
    }
  return (
    <div>
        <h1>This current count is : {count} </h1>
        <br />
        <button onClick={IncreaseCount}>Increase</button>
        <br />
        <button onClick={DecreaseCount}>Decrease</button>
    </div>
  )
}

export default Testing