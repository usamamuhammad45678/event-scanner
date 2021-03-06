import { Button, IconButton, Input, LinearProgress, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import {useForm} from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { db, firebaseApp, storage } from '../../firebase';
import { toast } from 'react-toastify';
// import '../Components/toast.css';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePost.scss'



toast.configure();
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
        marginTop: theme.spacing(1),
    },
    submit: {
        backgroundColor: "#3f51b5",
        // color: 'white',
        margin: theme.spacing(3, 0, 2), 
        
        '&:hover': {
            backgroundColor: "blue",
            color: 'white',
            fontWeight: "bold"
        }
    },
}));



export default function CreatePost(props) {
    const classes= useStyles();
    const isAdmin= props.isAdmin
    const {register,handleSubmit, errors, reset} = useForm();
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState("");
    // const [name, setName] = useState("");
    // const [description, setDescription] = useState("");
    // const [country , setCountry] = useState("");
    // const [city, setCity] = useState("");
    // const [location, setLocation] = useState("");
    // const [eventType, setEventType] = useState("");
    // const [linkToEvent, setLinkToEvent] = useState("");
    // const [uploader, setUploader] = useState("");
    
    const handleHomeRoute=()=>{
        window.location.assign("/");
    }
    const onSubmit = data => {
        data.userEmail= props.user.email;
        const dateL= (new Date(data.monthAndYear));
        var mm=(dateL.getMonth());
        mm=mm+1;
        var yyyy=(dateL.getFullYear());
        data.monthAndYear=`${mm}/${yyyy}`
        console.log(data.userEmail)
        const refID = db.collection("posters").doc().id;
        const ref = db.collection('posters').doc(refID);  
        var URL;
        if(file && progress==100){
            storage.ref("images").child(file.name).getDownloadURL().then(url => {
                URL=url;      

             }).then(()=>{
                 ref.set({
                     userEmail: data.userEmail,
                     imageUrl: URL,
                     name: data.name,
                     country: data.country,
                     city: data.city,
                     location: data.location,
                     monthAndYear: data.monthAndYear,
                     eventType: data.eventType,
                     description: data.description,
                     linkToEvent: data.linkToEvent,
                     uploader: data.uploader,
                     approved:isAdmin?true: false,
                 })
             }).then(()=>{
                 ref.update({
                     imageUrl: URL
                 })
                 // clearEditProfile();
             })

             toast.success('🚀 Successfully added the data to the database ', {
                position: "bottom-center",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
                document.getElementById("input").value = "";
                setFile("");
                setProgress(0)
                reset();
                
        }
      else{
        toast.warning("please upload an image or let it finish uploading");
      }
       
       
    };
   
    const selectFileHandler = (event) => {
         
        if (event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    
    }
   
    const uploadFileHandler = () => {
        if(file && (progress==100)){
            toast.error("File already uploaded", {
                position:"bottom-center"
            })
            return
        }
        if (file) {
            const uploadTask = storage.ref(`images/${file.name}`).put(file);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                    console.log(progress)
                },
                error => {
                    console.log(error);
                },
               
            )
        }
    }

    return (
        <div  className={classes.paper}>
            <Button  style={{backgroundColor:"#ffcc00",color:"black", fontWeight:"bold"}} onClick={handleHomeRoute}>Home</Button>
            <h1 style={{backgroundColor:"black",color:"#ffcc00", fontWeight:"bold", padding:"10px"}}>Create Poster</h1>
            <h3 style={{backgroundColor:"black",color:"white", fontWeight:"bold", padding:"5px"}}>Upload Poster Picture</h3>
              <div>
              <input type="file" className="input" id="input"  onChange={selectFileHandler}/> <br/>
               <LinearProgress color="primary" variant="determinate" value={progress} />
               <Button style={{backgroundColor:"black",color:"#ffcc00", fontWeight:"bold", padding:"10px"}} className="btn"  onClick={uploadFileHandler} >Upload</Button>
              </div>
           <form autoComplete="off" className="go-right" onSubmit={handleSubmit(onSubmit)} >
        
  {/*  */}
  <div>
           <input style={{marginTop:"10px"}} placeholder="Name"  type="text"  name="name"  ref={register({required: true, maxLength: 25})}/>
           {errors.name && <p style={{color:"red"}}>You can enter max 25 characters</p> }
    <label >Name</label>
  </div>
  {/*  */}
  <div>
    <input style={{marginTop:"10px"}} placeholder="Country" name="country" type="text" ref={register({required: true, maxLength: 40})}/>
    {errors.name && <p style={{color:"red"}}>You can enter max 40 characters</p> }
    <label>Country</label>
  </div>
  {/*  */}
  <div>
    <input style={{marginTop:"10px"}} placeholder="City" name="city" type="text" ref={register({required: true, maxLength: 40})}/>
    {errors.name && <p style={{color:"red"}}>You can enter max 40 characters</p> }
    <label>City</label>
  </div>
  {/*  */}
  <div>
    <input style={{marginTop:"10px"}} placeholder="Location" name="location" type="text" ref={register({required: true, maxLength: 40})}/>
    {errors.name && <p style={{color:"red"}}>You can enter max 40 characters</p> }
    <label>Location</label>
  </div>
  {/*  */}
  <div>
    <input className="selectDate" style={{marginTop:"10px"}}  name="monthAndYear" type="month" ref={register({required: true})}/>
    {/* <label>Month & Year</label> */}
  </div>
  {/*  */}
  <div>
    <input style={{marginTop:"10px"}} placeholder="Event Type" name="eventType" type="text" ref={register({required: true, maxLength: 20})}/>
    {errors.name && <p style={{color:"red"}}>You can enter max 20 characters</p> }
    <label>Event Type</label>
  </div>
  {/*  */}
  <div>
    <input style={{marginTop:"10px"}} placeholder="Description" name="description" type="text" ref={register({required: true, maxLength: 200})}/>
    {errors.name && <p style={{color:"red"}}>You can enter max 200 characters</p> }
    <label>Description</label>
  </div>
  {/*  */}
  <div>
    <input style={{marginTop:"10px"}} placeholder="Link To Event" name="linkToEvent" type="text" ref={register({required: true, maxLength:500})}/>
    {errors.name && <p style={{color:"red"}}>You can enter max 500 characters</p> }
    <label>Link To Event</label>
  </div>
  {/*  */}
  <div>
    <input style={{marginTop:"10px"}} placeholder="Uploader" name="uploader" type="text" ref={register({required: true, maxLength:30})}/>
    {errors.name && <p style={{color:"red"}}>You can enter max 30 characters</p> }
    <label>Uploader</label>
  </div>
  {/*  */}
   
  
           {/* {errors.password && <p>{errors.password.message}</p>} */}
           <IconButton>
           <input style={{backgroundColor:"#f06d06"}} className={classes.submit} type="submit" value="Add Poster" />

           </IconButton>           </form>
        </div>
    )
}
 