import React from "react"
import Button from '@mui/material/Button'
import {List, ListItem, Paper} from "@mui/material"
import Image from "next/image"
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'

import logo from '../public/logo.png'
import Link from "next/link"

const paperStyles = {
    width: 80,
    height: '100vh',
    position: 'fixed',
    borderRadius: 0
}

const roundedNShadows = {
    boxShadow: '0px 0px 4px -1px rgba(0, 0, 0, 0.25)',
    borderRadius: '50%'
}

const ButtonStyles = {
    minWidth: '50px',
    width: '50px',
    height: '50px',
    background: 'white',
    ...roundedNShadows
}

const iconsColor = {
    color: '#19A0D8'
}

export default function Menu() {

    return (
        <Paper sx={paperStyles}>
            <List>
                <ListItem sx={{ marginBottom: '100px' }}>
                    <Image src={logo} alt='logo' width={50} height={50} style={roundedNShadows}/>
                </ListItem>
                <ListItem>
                    <Link href='/'>
                        <Button sx={ButtonStyles}>
                            <HomeIcon sx={iconsColor}/>
                        </Button>
                    </Link>
                </ListItem>
                <ListItem>
                    <Link href='/new'>
                        <Button sx={ButtonStyles}>
                            <AddIcon sx={iconsColor}/>
                        </Button>
                    </Link>
                </ListItem>
            </List>
        </Paper>
    )
}
