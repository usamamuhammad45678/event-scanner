import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Poster from '../../Components/Poster/Poster';
import { db, firebaseApp } from '../../firebase';
import logo from '../../Assets/img/esLogo.png';
import './Home.css'

export default function Home(props) {
    const {user}= props;
    const[posters, setPosters]= useState([]);
    const[dropDownDetails, setDropDownDetails]= useState([]);
   const[selectedGenre, setSelectedGenre]=useState("");
   const [selectedCity, setSelectedCity] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedMonthAndYear, setSelectedMonthAndYear ] = useState("");
    const [isAdmin, setIsAdmin]=useState("")
    const[selectedCountry, setSelectedCountry]=useState("")
    const [selectedName, setSelectedName]=useState("")
    var  genres=[];
    var cities=[];
    var locations=[];
    var countries=[];
    var monthAndYears=[];
    var names=[];
  

    const handleLoginRoute=(url)=>{
        window.location.href=url ;
    }
    const handleLogout= ()=>{
        firebaseApp.auth().signOut();
        
    }
   
    const handleCreatePostRoute=()=>{
       window.location.assign("/createpost")
    }
    const handleApprovePostRoute=()=>{
        window.location.assign("/approvepost")
    }
   const selectGenre=()=>{
    const GENRE= document.getElementById("genre").value
    setSelectedGenre(GENRE);
    console.log(GENRE)
     
   }
   const selectCity=()=>{
    const CITY= document.getElementById("city").value
    setSelectedCity(CITY);
    console.log(CITY)
     
   }
   const selectMonth=()=>{
    const MONTH= document.getElementById("month").value
    setSelectedMonthAndYear(MONTH);
    console.log(MONTH)
     
   }
   const selectLocation=()=>{
    const LOCATION= document.getElementById("location").value
    setSelectedLocation(LOCATION);
    console.log(LOCATION)
     
   }
   const selectName=()=>{
    const NAME= document.getElementById("name").value
    setSelectedName(NAME);
    console.log(NAME)
     
   }
   const selectCountry=()=>{
    const COUNTRY= document.getElementById("country").value
    setSelectedCountry(COUNTRY);
    console.log(COUNTRY)
     
   }

   const resetFilters=()=>{
       setSelectedGenre("")
       setSelectedLocation("")
       setSelectedMonthAndYear("")
       setSelectedCity("")
       setSelectedCountry("")
       setSelectedName("")
        document.getElementById("genre").value=""
        document.getElementById("location").value=""
        document.getElementById("month").value=""
        document.getElementById("city").value=""
        document.getElementById("country").value=""
        document.getElementById("name").value=""
   }
   //check admin
   useEffect(()=>{
        // cKbxaFUTg1KcAkgCXExa
        console.log("admin sec")
        var docRef = db.collection("Admins").doc("cKbxaFUTg1KcAkgCXExa");
        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
               const adminsArray= doc.data().adminsArray;
               adminsArray.map((admin)=>{
                  if(user.email==admin){
                      setIsAdmin(true)
                  }
               })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
   },[isAdmin, posters])

   //Getting Posters
    useEffect(()=>{
        
        const unsubscribe = db.collection('posters').onSnapshot((snapshot)=>
               {
                   if(!snapshot){
                       return;
                   }
              setPosters(snapshot.docs.map(doc =>                              
                  ({
                      id: doc.id,        //the unique 'auto' ids
                      data: doc.data(),  //the data inside the doc(coll>doc>data)
                  })
                  ))
               } );
            //    console.log(posters[0].data.name);
           
               return () => {      //when comp cleansup/unmount(cleansup is better), (always) detach this real time listener after it's done using it(best def)
                   unsubscribe();  //this is for optimization
               }
             
          }, []); 
     //Getting drop downs

     useEffect(()=>{
      const unsubscribe= db.collection("posters").onSnapshot((snapshot)=>{
          if(!snapshot.empty){
            setDropDownDetails(
                snapshot.docs.map(doc=>
                    ({
                        genre: doc.data().eventType,
                        location: doc.data().location,
                        city: doc.data().city,
                        monthAndYear: doc.data().monthAndYear,
                        name: doc.data().name,
                        country: doc.data().country,
                        approved: doc.data().approved
    
    
                    })
                    )
            );
          }
          
      });

      return () => {       
      unsubscribe();   
  }
     },[])


    return (
        <div className="home">
            <div className="title">
               <div style={{marginTop:"5vh"}}>
                   {
                       user && <span style={{color:"white", marginTop:"5vh", paddingTop:"20px"}} >
                           Logged in as: {user.email} <br/>
                       </span> 
                   }
               {
                   !user && <Button onClick={()=>{handleLoginRoute("/login")}}>
                   <h4 style={{color:"yellow", backgroundColor:"black", padding:"5px", borderRadius:"50px"}}>Login / Create Account</h4>
               </Button>
               }
                {
                    user && <Button onClick={handleLogout}>
                    <h4 style={{color:"white", backgroundColor:"red", padding:"5px", borderRadius:"50px"}}>Log Out</h4>
                </Button>
                }
                 {
                    user && <Button onClick={handleCreatePostRoute}>
                    <div>
                    <h4 style={{color:"yellow", backgroundColor:"black", padding:"5px"}}>Create Post</h4>
                    </div>
                </Button>
                }
                 {
                   (user && isAdmin) && <Button onClick={handleApprovePostRoute}>
                    <h4 style={{color:"black", backgroundColor:"yellow", padding:"5px"}}>Approve Post</h4>
                </Button>
                }
               </div>
              <img src={logo} height="100px" width="300px" alt="logo"/> <br/>
              <h1 style={{display: "inline-block", color:"white", borderBottom: "1px solid black", }}>
              EventsScanner! Searching for an event made simple!
              </h1>
              <div style={{display:"flex", flexWrap:"wrap"}} className="dropDowns">
               
  
                <select onChange={selectGenre} style={{padding:"5px", margin:"10px"}} name="genre" id="genre">
                <option value=""  selected>eventType</option>
                {
                      dropDownDetails.map((dropDowns)=>{
                        var repeat= false;
                         
                        
                          if(genres.includes(dropDowns.genre)){
                            
                            repeat=true
                          }
                          else{
                            genres.push(dropDowns.genre)
                            repeat=false
                          }

                        
                        if(dropDowns.approved==true && !repeat){
                          
                         
                            return <option value={dropDowns.genre} >{dropDowns.genre}</option>
                          
                        }
                      })
                  }
                </select>

                <select onChange={selectCity} style={{padding:"5px", margin:"10px"}} name="city" id="city">
                <option value="" selected>City</option>
                  {
                      dropDownDetails.map((dropDowns)=>{
                        var repeat= false;
                         
                        
                        if(cities.includes(dropDowns.city)){
                          
                          repeat=true
                        }
                        else{
                          cities.push(dropDowns.city)
                          repeat=false
                        }

                      
                      if(dropDowns.approved==true && !repeat){
                        
                        
                          return <option value={dropDowns.city} >{dropDowns.city}</option>
                        }
                      })
                  }
                </select>

                <select onChange={selectLocation} style={{padding:"5px", margin:"10px"}} name="location" id="location">
                <option value="" selected>Location</option>
                {
                      dropDownDetails.map((dropDowns)=>{
                        var repeat= false;
                         
                        
                        if(locations.includes(dropDowns.location)){
                          
                          repeat=true
                        }
                        else{
                          locations.push(dropDowns.location)
                          repeat=false
                        }

                      
                      if(dropDowns.approved==true && !repeat){
                        
                        
                          return <option value={dropDowns.location} >{dropDowns.location}</option>
                        }
                      })
                  }
                </select>

                <select onChange={selectMonth} style={{padding:"5px", margin:"10px"}} name="month" id="month">
                <option value="" selected>Month</option>
                {
                      dropDownDetails.map((dropDowns)=>{
                        var repeat= false;
                         
                        
                        if(monthAndYears.includes(dropDowns.monthAndYear)){
                          
                          repeat=true
                        }
                        else{
                          monthAndYears.push(dropDowns.monthAndYear)
                          repeat=false
                        }

                      
                      if(dropDowns.approved==true && !repeat){
                        
                        
                          return <option value={dropDowns.monthAndYear} >{dropDowns.monthAndYear}</option>
                        }
                      })
                  }
                </select>
                {/* Name */}
                <select onChange={selectName} style={{padding:"5px", margin:"10px"}} name="name" id="name">
                <option value="" selected>Name</option>
                {
                      dropDownDetails.map((dropDowns)=>{
                        var repeat= false;
                         
                        
                        if(names.includes(dropDowns.name)){
                          
                          repeat=true
                        }
                        else{
                          names.push(dropDowns.name)
                          repeat=false
                        }

                      
                      if(dropDowns.approved==true && !repeat){
                        
                          
                            return <option value={dropDowns.name} >{dropDowns.name}</option>
                          }
                         
                      })
                  }
                </select>
                {/* Country */}
                <select onChange={selectCountry} style={{padding:"5px", margin:"10px"}} name="country" id="country">
                <option value="" selected>Country</option>
                {
                      dropDownDetails.map((dropDowns)=>{
                        var repeat= false;
                         
                        
                        if(countries.includes(dropDowns.country)){
                          
                          repeat=true
                        }
                        else{
                          countries.push(dropDowns.country)
                          repeat=false
                        }

                      
                      if(dropDowns.approved==true && !repeat){
                        
                        
                          return <option value={dropDowns.country} >{dropDowns.country}</option>
                        }
                      })
                  }
                </select>
              </div>

              {/* <div style={{marginTop:"10px"}} className="preDefined">
                  <span style={{marginRight:"10px", color:"white", fontWeight:"bolder"}}>Choose from predefined: </span>
                  <span style={{margin:"5px", color:"white"}}>Events in Dublin</span>
                  <span style={{margin:"5px", color:"white"}}>Only Concerts</span>
                  <span style={{margin:"5px", color:"white"}}>Concerts in 3 Area</span>
              </div> */}


              
            </div>
            <Button onClick={resetFilters}>Reset</Button>
            <div className="container">
               {
                   posters.map((poster)=>{
                       if(((selectedGenre? selectedGenre==poster.data.eventType : true) && ( selectedCity ? selectedCity==poster.data.city : true)
                        && (selectedLocation ? selectedLocation==poster.data.location: true)
                        && ( selectedName ? selectedName==poster.data.name: true)
                        && (selectedCountry ? selectedCountry==poster.data.country: true)
                        && (selectedMonthAndYear ? selectedMonthAndYear==poster.data.monthAndYear : true)
                        ) && poster.data.approved==true){
                           console.log(`selected genre is ${selectedGenre}`)
                        return <Poster city={poster.data.city} 
                        location={poster.data.location}
                        monthAndYear={poster.data.monthAndYear}
                        genre={poster.data.eventType}
                        imageUrl= {poster.data.imageUrl}
                        name={poster.data.name}
                        description={poster.data.description}
                        linkToEvent={poster.data.linkToEvent}
                        uploader={poster.data.uploader}
                        userEmail={poster.data.userEmail}
                        />
                       }
                      
                       else if((!selectedGenre && !selectCity && !selectCountry && !selectLocation && !selectMonth  && !selectName
                                ) && poster.data.approved==true){
                                    console.log("No filter is selected")
                                        return <Poster city={poster.data.city} 
                                        location={poster.data.location}
                                        monthAndYear={poster.data.monthAndYear}
                                        genre={poster.data.eventType}
                                        imageUrl= {poster.data.imageUrl}
                                        name={poster.data.name}
                                        description={poster.data.description}
                                        linkToEvent={poster.data.linkToEvent}
                                        uploader={poster.data.uploader}
                                        userEmail={poster.data.userEmail}
                                        />
                    }

                    //    else if(!selectedGenre && poster.data.approved==true){
                    //        console.log("selected genre not selected")
                    //     return <Poster city={poster.data.city} 
                    //     location={poster.data.location}
                    //     monthAndYear={poster.data.monthAndYear}
                    //     genre={poster.data.eventType}
                    //     imageUrl= {poster.data.imageUrl}
                    //     name={poster.data.name}
                    //     />
                    //    }
                  
                      
                   })
               }
            </div>
            
        </div>
    )
}
 