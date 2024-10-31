import React, { useState, useContext } from "react";
import axios from 'axios'
import { UserContext } from "../UserContext";
import Box from '@mui/material/Box';
import SideDrawer from "../components/miscellaneous/SideDrawer"
import MyChats from "../components/MyChats"
import ChatBox from "../components/ChatBox"
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
  table: {
    minWidth: 450,
  },
  chatSection: {
    width: '83vw',
  },
  headBG: {
      backgroundColor: '#FFF7E7'
  },
  borderRight500: {
      width: '20%',
      borderRight: '1px solid #e0e0e0',
      backgroundColor: '#4B297'
  },
  messageArea: {
    height: '80vh',
    overflowY: 'auto'
  }
});

const ChatPage = () => {
  const classes = useStyles();
  const {user} = useContext(UserContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  // console.log("user::")
  // console.log(user)
  return (
    //d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px"
    <>

    <div style={{ padding: "60px"}} />
    <div className="container3" style={{paddingLeft:"30px"}}>
      <div style={{paddingLeft:"75px"}} >{user && <SideDrawer />}</div>
      <Box sx={{paddingLeft:9.5}}>

      <Grid container component={Paper} className={classes.chatSection}>
      <Grid className={classes.borderRight500}>
        {user && <MyChats fetchAgain={fetchAgain}/>}
        </Grid>
        {user && ( <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/> )}
      </Grid>
      </Box>
    </div>
    </>
  )
}

export default ChatPage