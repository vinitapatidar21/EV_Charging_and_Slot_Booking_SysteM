const express = require('express');
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config({ path: '../.env' });
}
  
const mongoose = require('mongoose');
const Charger = require('./models/EV_charge.js');
const { OAuth2Client } = require('google-auth-library');
const User = require('./models/User.js');
const generateToken = require('./utils/token.js');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.REACT_APP_MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken:mapBoxToken});
const UserBooks = require('./models/UserBooks.js');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/Electric' ;
const app = express();
// console.log(dbUrl);
var cors = require('cors');
add.use(cors());
// app.use(cors({origin: 'https://findevcharge.netlify.app'}));

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'))
  .catch(err => {
      console.log(err);
  })

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
app.use(express.json());

// test connection
app.get('/api/',(req,res)=>{
    res.send('api connected');
});

// user login / register 
app.post('/api/auth/google', async (req, res) => {
    
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });
    console.log(ticket.getPayload());
    const { name, email } = ticket.getPayload();
    const founduser = await User.findOne({email:email});
    // console.log("founduser is ",founduser);
    if(founduser !== null){
        res.status(201);
        res.json(founduser);
    }else{
        const user = new User({
            email:email,
            username:name,
            bookings:[]
        })
        await user.save(function(err,result){
            if (err)console.log(err);
            else console.log(result)
        });
        res.status(201);
        res.json(user);
    }
});
  

// get the station routes.

// station login
app.post('/api/station/login',async(req,res)=>{
    const {email,password} = req.body;
    const foundstation = await Charger.findOne({email:email});
    // console.log('wohoo it is :', foundstation);

    if(foundstation && (await foundstation.matchPassword(password))){
        const token = generateToken(foundstation._id);
        res.cookie('jwt', token, {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: false,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
        });
        res.status(201);
        res.json({
            _id:foundstation._id,
            username:foundstation.username,
            location:foundstation.location,
            email:foundstation.email,
            slots:foundstation.slots,
            maxSlots:foundstation.maxSlots,
            geometry:foundstation.geometry,
            state:foundstation.state,
            phone:foundstation.phone,
            type:foundstation.type,
            token:token        
        });
    }else{
        res.status(404);
        throw new Error('Station does not exist');
    }
});

// station register 
app.post('/api/register/', async(req,res)=>{

        console.log('req body is : ', req.body);
        const {username,location,email,maxslots,state,password,type,phone} = req.body;
        const geoData = await geocoder.forwardGeocode({
            query:location,
            limit:1
        }).send();
        // console.log('geodata is : ', geoData.body.features[0].geometry);

        const foundstation = await Charger.findOne({email:email});

        if(foundstation){
            res.status(400);
            throw new Error('User Email already Exists');
        }
        const station = await new Charger({
            username,
            location,
            email,
            maxSlots: maxslots,
            slots:0,
            state,
            password,
            type,
            geometry:geoData.body.features[0].geometry,
            phone
        })
        
        if(station){
            // add saving scene here;
            await station.save();
            res.status(201).json({
                _id:station._id,
                username:station.username,
                location:station.location,
                email:station.email,
                maxSlots:station.maxSlots,
                slots:0,
                state:station.state,
                geometry:station.geometry,
                type:station.type,
                phone:station.phone,
                token:generateToken(station._id)
            });
        }else{
            res.status(404);
            throw new Error('Invalid station');
        }
});

// get all stations
app.get('/api/getstations/',async(req,res)=> {
    const dd = await Charger.find({});
    res.status(201).json(dd);
})

// get all available & current bookings for user
app.post('/api/user/bookings',async(req,res)=>{

    const {email,username} = req.body;
    const user = await User.findOne({email:email});
    // console.log('user is : ',user);

    if(user){

            let cs = await Charger.find({});
            // let us = await UserBooks.find({});
            // console.log('chargers is : ',cs);
            let avail = [];
            let non_avail = [];
            if(user.bookings.length === 0){
                for(var i=0;i<cs.length;i++){
                    if(cs[i].slots < cs[i].maxSlots){
                        if(avail)avail.push(cs[i]);
                        else avail = [cs[i]];
                    }
                }
            }else {
               
                for(var i=0;i<user.bookings.length;i++){
                    var z = user.bookings[i];
                    
                    var book = await UserBooks.findOne({_id:z._id});             
                    var st = await Charger.findOne({_id:book.station_id});
                    
                    if(non_avail)non_avail = [...non_avail,st];
                    else non_avail = [st];
                }

                for(var i=0;i<cs.length;i++){
                    console.log('station is : ',cs[i], ' includes status : ',non_avail.includes(cs[i]) );
                    var inc = false;
                    for(var j=0;j<non_avail.length;j++){
                        if(non_avail[j].email === cs[i].email){
                            inc = true;
                        }
                    }
                    if(inc === false && cs[i].slots < cs[i].maxSlots){
                        if(avail.length === 0)avail = [cs[i]];
                        else avail.push(cs[i]);
                    }
                }

            }
            
            res.status(201).json({
                available:[...avail],
                not_available: [...non_avail]
            });
        }else{
            res.status(404);
            throw new error('User not logged in');
        }
})

// create a booking for a user
app.post('/api/user/update/',async(req,res) => {
    const {email,id_extract} = req.body;
    const user = await User.findOne({email:email});
    const station = await Charger.findOne({_id:id_extract});
    // console.log('user is :', user);
    // console.log('station is :', station);

    if(user){
        let new_entry = new UserBooks({
            station_id:id_extract,
            Accept:false,
            Decline:false
        });
        
        if(user.bookings)user.bookings.push(new_entry);
        else user.bookings = [new_entry];

        // console.log('slots are:',station.slots);
        if(station.slots){
            if(station.slots<station.maxSlots){
                station.slots = station.slots + 1;
            }
        }else{
            station.slots = 1;
        }
        
        await station.save();
        await new_entry.save();
        const nuser = await user.save();
        nuser === user; // 

        res.status(201).json({
            userif:user
        });
    }else{
        res.status(404);
        throw new error('unable to update');
    }
})

// get notifications of a particular user
app.post('/api/users/getbookings',async(req,res)=>{
    
    const {email} = req.body;
    const user = await User.findOne({email:email});
    // console.log('user is : ',user);

    if(user){
        let to_send = [];
        for(var i=0;i<user.bookings.length;i++){
            var z = user.bookings[i];
            var book = await UserBooks.findOne({_id:z._id});             
            // console.log('booking is : ',book);
            var st = await Charger.findOne({_id:book.station_id});
            // console.log('station is : ',st);
    
            if(to_send)to_send = [...to_send,st];
            else to_send = [st];
        }
    
        res.status(201).json({
            bookings:to_send
        });
    }else{
        res.status(404);
        throw new error('User not logged in');
    }
    
})

// accept/decline (confirmation) a booking
app.post('/api/users/bookingsupdate',async(req,res) => {
    const {email,id_extract} = req.body;
    const user = await User.findOne({email:email});
    const station = await Charger.findOne({_id:id_extract});
    // console.log('user is :', user);
    // console.log('station is :', station);

    if(user){
        if(station.slots>0){
            station.slots = station.slots - 1;
        }

        let to_delete;
        for(var i=0;i<user.bookings.length;i++){
            var z = user.bookings[i];
            var book = await UserBooks.findOne({_id:z._id}); 
            console.log('booking is : ',book);
            const r = await book.station_id.equals(station._id);
            console.log('result is : ',r );
            if(r){
                to_delete = book;
            }
        }

        // console.log('id to delete is : ',to_delete);
        await User.findByIdAndUpdate(user._id, { $pull: { bookings: to_delete._id } });
        // user.bookings =  await user.bookings.filter(b => !(to_delete._id.equals(b._id)) );
        await UserBooks.deleteOne({_id:to_delete._id});

        await station.save();
        await user.save()
       
        res.status(201).json({
            userif:user
        });

    }else{
        res.status(404);
        throw new error('unable to update');
    }

})

const port = 3000;
app.listen(port,()=>{
    console.log(`server connected on port ${port}`);
})
