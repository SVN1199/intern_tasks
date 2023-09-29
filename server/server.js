const express = require('express')
const path = require('path')
const app = express()
const dotenv = require('dotenv').config();
const config = require('./config/db')
const userRouter = require('./route/userRoutes')
const profileRouter = require('./route/profileRoute')
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.use('/api/profile', profileRouter)
app.use('/api/users', userRouter)

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  
    app.get('*', (req, res) =>
      res.sendFile(
        path.resolve(__dirname, '../', 'client', 'build', 'index.html')
      )
    );
  } else {
    app.get('/', (req, res) => res.send('Please set to production'));
  }

app.listen(port, ()=>{
    console.log(`Server Running on ${port}`)
})