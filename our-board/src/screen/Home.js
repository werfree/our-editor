import React,{useState} from 'react';
import { Redirect } from "react-router-dom";

import Logo from './style/icons/logo.png'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import axios from "axios"
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import "./style/Home.css"
import { API_URL } from '../utils/apiUrl';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Our Board
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));



export default function Home() {
  const classes = useStyles();

const [boardCode, setBoardCode] = useState("")
const [name, setName] = useState("")
const [isLoading, setIsLoading] = useState(false)
const [isError, setIsError] = useState({
    error:false,
    message:"Sayantan"
})

const [redirect, setRedirect] = useState({
  isRedirect:false,
  url:"",
  props:{}
})

const changeCodeHandler = (event)=>{
    setBoardCode(event.target.value)
    setIsError({...isError, error:false})
}

const redirectToEditor = (boardId)=>{
    
    setRedirect({
      isRedirect:true,
      url:`/editor/${boardId}?name=${name}`,
      props:{}
    })
    console.log("b",boardId);
}

const nameHandler = (event)=>{
  setName(event.target.value)
  setIsError({
    ...name,
    error:false,
  })
}
const onSubmitHandler = async(event)=>{
    event.preventDefault();
    if(!name){
      setIsError({
        error:true,
        message:"Name is required"
      })
      return
    }
    setIsError({...isError, error:false})
    setIsLoading(true)
    if(!boardCode){
        
        axios.get(`${API_URL}generateEditorId`)
            .then(res=>{
                setIsLoading(false)
                redirectToEditor(res.data.boardId);
            }).catch((e)=>{
                setIsLoading(false)
                setIsError({error:true,message:e.message})
            })
    }
    else{
        axios.get(`${API_URL}validEditor/${boardCode}`)
        .then(res=>{
            setIsLoading(false)
            if(res.data.valid){
            redirectToEditor(boardCode);
            }
            else{
                setIsLoading(false)
                setIsError({error:true,message:"Editor Code not valid"}) 
            }
        }).catch((e)=>{
            setIsLoading(false)
            setIsError({error:true,message:e.message})
        })
    }
}

  if(redirect.isRedirect){
    return (
      <Redirect push to={redirect.url}/>
    )
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
          <img src={Logo} className="logo" alt="S"/>
        <Typography component="h1" variant="h5">
          Our Board
        </Typography>
        {isLoading && (<CircularProgress disabled={isLoading} color="secondary" />)}
        {isError.error && (<Alert severity="error">{isError.message}</Alert>)}
        <form className={classes.form} noValidate>
          <Grid  justifyContent="center"
  alignItems="center" container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                onChange={nameHandler}
                autoFocus
              />
            </Grid>
         
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="code"
                label="Enter Code"
                name="code"
                onChange={changeCodeHandler}
              />
            </Grid>
            <Grid item xs={12}>
            <Button fullWidth variant="outlined" color="primary" disabled={isLoading}  onClick={onSubmitHandler}>
                {boardCode?"Join Board":"Create Board"}
            </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}