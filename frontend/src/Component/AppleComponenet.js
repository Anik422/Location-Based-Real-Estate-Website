import React, { useState } from 'react'

function AppleComponenet() {

    const [numberOfApple, setNumberOfApples] = useState(1);
    function AppleDisplay(numberOfApple) {
        if (numberOfApple === 0 || numberOfApple === 1) {
            return `John has ${numberOfApple} apple`;
        } else if (numberOfApple > 1) {
            return `John has ${numberOfApple} apples`;
        } else {
            return `John Owes us ${Math.abs(numberOfApple)} apples`;
        }
    }

    function IncreaseApple() {
        setNumberOfApples(currentValue => currentValue + 1);
    }
    function decreaseApple() {
        setNumberOfApples(currentValue => currentValue - 1);
    }
    return (
        <>
            <div>
                <h1>{AppleDisplay(numberOfApple)}</h1>
            </div>
            <button onClick={IncreaseApple} className='add-btn'>Increase</button>
            <button style={{display: numberOfApple <=0 ? 'none' : '' }} onClick={decreaseApple} className='decrease-btn'>Decrease</button>
            { numberOfApple > 10 ? <h1>John is more apples</h1> : ""}
        </>
    )
}

export default AppleComponenet