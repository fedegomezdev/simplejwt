const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/simplejwt', {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
    .then(db => console.log('database is connected'))
