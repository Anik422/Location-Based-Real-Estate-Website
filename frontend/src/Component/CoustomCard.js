import React, { useState } from 'react'
import { Button, Typography } from '@mui/material';

function CoustomCard() {
    const [btnColor, setBtnColor] = useState("error");
    return (
        <div>
            <div style={{ width: "100%", padding: "15px", border: "2px solid black" }}>
                <Typography variant='h4'>This is titel</Typography>
                <Typography variant='body1'>
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                </Typography>
                <Button onClick={() => setBtnColor("success")} color={btnColor} variant="contained">Contained</Button>
            </div>
        </div >
    )
}

export default CoustomCard